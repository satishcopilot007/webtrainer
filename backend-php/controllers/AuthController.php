<?php
/**
 * Auth Controller
 * Handles authentication endpoints
 */

class AuthController extends BaseController {

    /**
     * User Registration
     * POST /api/auth/register
     */
    public function register() {
        if ($this->getMethod() !== 'POST') {
            Response::error('Method not allowed', null, 405);
        }

        $data = $this->getRequestData();
        $errors = [];

        // Validate first_name
        if (empty($data['first_name'])) {
            $errors['first_name'] = 'First name is required';
        } elseif (strlen($data['first_name']) < 2) {
            $errors['first_name'] = 'First name must be at least 2 characters';
        }

        // Validate last_name
        if (empty($data['last_name'])) {
            $errors['last_name'] = 'Last name is required';
        } elseif (strlen($data['last_name']) < 1) {
            $errors['last_name'] = 'Last name is required';
        }

        // Validate email
        if (empty($data['email'])) {
            $errors['email'] = 'Email is required';
        } elseif (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            $errors['email'] = 'Please enter a valid email address';
        }

        // Validate phone
        if (empty($data['phone'])) {
            $errors['phone'] = 'Phone number is required';
        } elseif (strlen($data['phone']) < 10 || strlen($data['phone']) > 15) {
            $errors['phone'] = 'Phone number must be between 10 and 15 characters';
        }

        // Validate password
        if (empty($data['password'])) {
            $errors['password'] = 'Password is required';
        } elseif (strlen($data['password']) < 8) {
            $errors['password'] = 'Password must be at least 8 characters';
        }

        // Validate password confirmation (if provided)
        if (!empty($data['password']) && empty($data['password_confirm'])) {
            $errors['password_confirm'] = 'Please confirm your password';
        } elseif (!empty($data['password']) && !empty($data['password_confirm']) && $data['password'] !== $data['password_confirm']) {
            $errors['password_confirm'] = 'Passwords do not match';
        }

        // Return errors if validation failed
        if (!empty($errors)) {
            Response::error('Validation failed', $errors, 422);
        }

        // Check if user already exists
        $userModel = new UserModel($this->conn);
        if ($userModel->getByEmail($data['email'])) {
            Response::error('Registration failed', ['email' => 'Email already registered'], 422);
        }

        // Create user with combined name
        $fullName = $this->sanitize($data['first_name']) . ' ' . $this->sanitize($data['last_name']);
        
        $userData = [
            'name' => $fullName,
            'email' => $this->sanitize($data['email']),
            'password' => $this->hashPassword($data['password']),
            'phone' => $this->sanitize($data['phone']),
            'role' => 'student', // Default role
            'profile_image' => null,
            'bio' => $data['bio'] ?? ''
        ];

        $userId = $userModel->create($userData);
        if (!$userId) {
            Response::error('Failed to create user', ['server' => 'Unable to create user account'], 500);
        }

        // Generate tokens
        $user = $userModel->getById($userId);
        unset($user['password']); // Remove password from response
        $accessToken = JWT::generateToken(['user_id' => $userId, 'email' => $user['email']]);
        $refreshToken = JWT::generateRefreshToken($userId);

        Response::success([
            'user' => $user,
            'accessToken' => $accessToken,
            'refreshToken' => $refreshToken
        ], 'User registered successfully', 201);
    }

    /**
     * User Login
     * POST /api/auth/login
     */
    public function login() {
        if ($this->getMethod() !== 'POST') {
            Response::error('Method not allowed', null, 405);
        }

        $data = $this->getRequestData();

        // Validate required fields
        $errors = $this->validateRequired($data, ['email', 'password']);
        if (!empty($errors)) {
            Response::error('Validation failed', $errors, 422);
        }

        // Get user by email
        $userModel = new UserModel($this->conn);
        $user = $userModel->getByEmail($data['email']);

        if (!$user || !$this->verifyPassword($data['password'], $user['password'])) {
            Response::error('Invalid email or password', null, 401);
        }

        // Generate tokens
        $accessToken = JWT::generateToken(['user_id' => $user['id'], 'email' => $user['email']]);
        $refreshToken = JWT::generateRefreshToken($user['id']);

        // Remove password from response
        unset($user['password']);

        Response::success([
            'user' => $user,
            'accessToken' => $accessToken,
            'refreshToken' => $refreshToken
        ], 'Login successful');
    }

    /**
     * Refresh Token
     * POST /api/auth/refresh
     */
    public function refreshToken() {
        if ($this->getMethod() !== 'POST') {
            Response::error('Method not allowed', null, 405);
        }

        $data = $this->getRequestData();

        if (empty($data['refreshToken'])) {
            Response::error('Refresh token required', null, 422);
        }

        // Verify refresh token
        $payload = JWT::verifyToken($data['refreshToken']);
        if (!$payload || $payload['type'] !== 'refresh') {
            Response::error('Invalid refresh token', null, 401);
        }

        // Generate new access token
        $accessToken = JWT::generateToken(['user_id' => $payload['user_id']]);

        Response::success([
            'accessToken' => $accessToken
        ], 'Token refreshed successfully');
    }

    /**
     * Get Current User
     * GET /api/auth/me
     */
    public function getCurrentUser() {
        if ($this->getMethod() !== 'GET') {
            Response::error('Method not allowed', null, 405);
        }

        if (!$this->auth->authenticate()) {
            Response::error('Unauthorized', null, 401);
        }

        $user = $this->auth->getUser();
        Response::success($user, 'User retrieved successfully');
    }

    /**
     * Update Profile
     * PUT /api/auth/profile
     */
    public function updateProfile() {
        if ($this->getMethod() !== 'PUT') {
            Response::error('Method not allowed', null, 405);
        }

        if (!$this->auth->authenticate()) {
            Response::error('Unauthorized', null, 401);
        }

        $data = $this->getRequestData();
        $user = $this->auth->getUser();

        $updateData = [];
        if (!empty($data['name'])) $updateData['name'] = $this->sanitize($data['name']);
        if (!empty($data['phone'])) $updateData['phone'] = $this->sanitize($data['phone']);
        if (!empty($data['bio'])) $updateData['bio'] = $this->sanitize($data['bio']);

        if (empty($updateData)) {
            Response::error('No fields to update', null, 422);
        }

        $userModel = new UserModel($this->conn);
        if ($userModel->update($user['id'], $updateData)) {
            $updatedUser = $userModel->getById($user['id']);
            Response::success($updatedUser, 'Profile updated successfully');
        } else {
            Response::error('Failed to update profile', null, 500);
        }
    }

    /**
     * Change Password
     * POST /api/auth/change-password
     */
    public function changePassword() {
        if ($this->getMethod() !== 'POST') {
            Response::error('Method not allowed', null, 405);
        }

        if (!$this->auth->authenticate()) {
            Response::error('Unauthorized', null, 401);
        }

        $data = $this->getRequestData();
        $user = $this->auth->getUser();

        // Validate required fields
        $errors = $this->validateRequired($data, ['oldPassword', 'newPassword']);
        if (!empty($errors)) {
            Response::error('Validation failed', $errors, 422);
        }

        // Verify old password
        $userModel = new UserModel($this->conn);
        $userData = $userModel->getByEmail($user['email']);

        if (!$this->verifyPassword($data['oldPassword'], $userData['password'])) {
            Response::error('Old password is incorrect', null, 401);
        }

        // Update password
        if ($userModel->update($user['id'], ['password' => $this->hashPassword($data['newPassword'])])) {
            Response::success(null, 'Password changed successfully');
        } else {
            Response::error('Failed to change password', null, 500);
        }
    }
}
?>
