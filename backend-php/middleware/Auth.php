<?php
/**
 * Authentication Middleware
 * Handles JWT token verification and user authentication
 */

class Auth {
    private $conn;
    private $user = null;

    public function __construct($conn) {
        $this->conn = $conn;
    }

    /**
     * Authenticate user from JWT token
     */
    public function authenticate() {
        $headers = function_exists('getallheaders') ? getallheaders() : [];
        $token = null;
        $authorization = '';

        foreach ($headers as $name => $value) {
            if (strtolower($name) === 'authorization') {
                $authorization = $value;
                break;
            }
        }
        if ($authorization === '') {
            $authorization = $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '';
        }

        // Extract token from Authorization header
        $matches = [];
        if (preg_match('/^Bearer\s+([^\s]+)$/i', trim($authorization), $matches)) {
            $token = $matches[1];
        }

        if (!$token) {
            http_response_code(401);
            return false;
        }

        // Verify token
        $payload = JWT::verifyToken($token);
        if (!$payload || isset($payload['type'])) {
            http_response_code(401);
            return false;
        }

        // Get user from database
        $query = "SELECT id, email, name, role FROM users WHERE id = ? AND is_active = 1";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param('i', $payload['user_id']);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows === 0) {
            $stmt->close();
            http_response_code(401);
            return false;
        }

        $this->user = $result->fetch_assoc();
        $stmt->close();

        return true;
    }

    /**
     * Get authenticated user
     */
    public function getUser() {
        return $this->user;
    }

    /**
     * Check if user has a specific role
     */
    public function hasRole($role) {
        if (!$this->user) return false;
        return $this->user['role'] === $role;
    }

    /**
     * Check if user is admin
     */
    public function isAdmin() {
        return $this->hasRole('admin');
    }

    /**
     * Check if user is mentor
     */
    public function isMentor() {
        return $this->hasRole('mentor') || $this->hasRole('admin');
    }
}
?>
