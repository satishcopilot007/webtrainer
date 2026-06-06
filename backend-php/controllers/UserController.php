<?php
/**
 * User Controller
 * Handles user-related endpoints
 */

class UserController extends BaseController {

    /**
     * Get all users (admin only)
     * GET /api/users
     */
    public function getAll() {
        if ($this->getMethod() !== 'GET') {
            Response::error('Method not allowed', null, 405);
        }

        if (!$this->auth->authenticate() || !$this->auth->isAdmin()) {
            Response::error('Unauthorized', null, 401);
        }

        $page = max(1, intval($_GET['page'] ?? 1));
        $pageSize = min(intval($_GET['pageSize'] ?? DEFAULT_PAGE_SIZE), MAX_PAGE_SIZE);

        $userModel = new UserModel($this->conn);
        $result = $userModel->getAll($page, $pageSize);

        Response::paginated($result['data'], $result['total'], $page, $pageSize, 'Users retrieved successfully');
    }

    /**
     * Get user by ID
     * GET /api/users/:id
     */
    public function getById($id) {
        if ($this->getMethod() !== 'GET') {
            Response::error('Method not allowed', null, 405);
        }

        $userModel = new UserModel($this->conn);
        $user = $userModel->getById($id);

        if (!$user) {
            Response::error('User not found', null, 404);
        }

        Response::success($user, 'User retrieved successfully');
    }

    /**
     * Promote user to mentor (admin only)
     * POST /api/users/:id/promote-mentor
     */
    public function promoteMentor($id) {
        if ($this->getMethod() !== 'POST') {
            Response::error('Method not allowed', null, 405);
        }

        if (!$this->auth->authenticate() || !$this->auth->isAdmin()) {
            Response::error('Unauthorized', null, 401);
        }

        $userModel = new UserModel($this->conn);
        $user = $userModel->getById($id);

        if (!$user) {
            Response::error('User not found', null, 404);
        }

        if ($userModel->update($id, ['role' => 'mentor'])) {
            $updatedUser = $userModel->getById($id);
            Response::success($updatedUser, 'User promoted to mentor');
        } else {
            Response::error('Failed to promote user', null, 500);
        }
    }

    /**
     * Get user courses (for mentor)
     * GET /api/users/:id/courses
     */
    public function getUserCourses($id) {
        if ($this->getMethod() !== 'GET') {
            Response::error('Method not allowed', null, 405);
        }

        $page = max(1, intval($_GET['page'] ?? 1));
        $pageSize = min(intval($_GET['pageSize'] ?? DEFAULT_PAGE_SIZE), MAX_PAGE_SIZE);

        $courseModel = new CourseModel($this->conn);
        $result = $courseModel->getAll($page, $pageSize, ['mentor_id' => $id]);

        Response::paginated($result['data'], $result['total'], $page, $pageSize, 'User courses retrieved successfully');
    }

    /**
     * Get user enrollments (for student)
     * GET /api/users/:id/enrollments
     */
    public function getUserEnrollments($id) {
        if ($this->getMethod() !== 'GET') {
            Response::error('Method not allowed', null, 405);
        }

        if (!$this->auth->authenticate()) {
            Response::error('Unauthorized', null, 401);
        }

        // Check if user is viewing their own enrollments or is admin
        if ($this->auth->getUser()['id'] != $id && !$this->auth->isAdmin()) {
            Response::error('Forbidden', null, 403);
        }

        $page = max(1, intval($_GET['page'] ?? 1));
        $pageSize = min(intval($_GET['pageSize'] ?? DEFAULT_PAGE_SIZE), MAX_PAGE_SIZE);
        $offset = ($page - 1) * $pageSize;

        $query = "SELECT e.*, c.title as course_title, c.thumbnail
                  FROM enrollments e
                  JOIN courses c ON e.course_id = c.id
                  WHERE e.student_id = ?
                  ORDER BY e.enrollment_date DESC
                  LIMIT ? OFFSET ?";

        $stmt = $this->conn->prepare($query);
        $stmt->bind_param('iii', $id, $pageSize, $offset);
        $stmt->execute();
        $result = $stmt->get_result();

        $enrollments = [];
        while ($row = $result->fetch_assoc()) {
            $enrollments[] = $row;
        }
        $stmt->close();

        // Get total count
        $countQuery = "SELECT COUNT(*) as total FROM enrollments WHERE student_id = ?";
        $countStmt = $this->conn->prepare($countQuery);
        $countStmt->bind_param('i', $id);
        $countStmt->execute();
        $total = $countStmt->get_result()->fetch_assoc()['total'];
        $countStmt->close();

        Response::paginated($enrollments, $total, $page, $pageSize, 'User enrollments retrieved successfully');
    }

    /**
     * Delete user (admin only - soft delete)
     * DELETE /api/users/:id
     */
    public function delete($id) {
        if ($this->getMethod() !== 'DELETE') {
            Response::error('Method not allowed', null, 405);
        }

        if (!$this->auth->authenticate() || !$this->auth->isAdmin()) {
            Response::error('Unauthorized', null, 401);
        }

        $userModel = new UserModel($this->conn);
        $user = $userModel->getById($id);

        if (!$user) {
            Response::error('User not found', null, 404);
        }

        if ($userModel->update($id, ['is_active' => 0])) {
            Response::success(null, 'User deleted successfully');
        } else {
            Response::error('Failed to delete user', null, 500);
        }
    }
}
?>
