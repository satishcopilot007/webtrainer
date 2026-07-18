<?php
/**
 * Base Controller Class
 * Common methods for all controllers
 */

class BaseController {
    protected $conn;
    protected $auth;
    protected $requestData;

    public function __construct($conn) {
        $this->conn = $conn;
        $this->auth = new Auth($conn);
        $contentType = strtolower((string)($_SERVER['CONTENT_TYPE'] ?? ''));
        $this->requestData = strpos($contentType, 'application/json') === 0
            ? (json_decode(file_get_contents('php://input'), true) ?? [])
            : [];
    }

    /**
     * Get request method
     */
    protected function getMethod() {
        return $_SERVER['REQUEST_METHOD'];
    }

    /**
     * Get request data
     */
    protected function getRequestData() {
        return array_merge($_GET, $_POST, $this->requestData);
    }

    /**
     * Validate required fields
     */
    protected function validateRequired($data, $fields) {
        $errors = [];
        foreach ($fields as $field) {
            if (empty($data[$field])) {
                $errors[$field] = ucfirst($field) . ' is required';
            }
        }
        return $errors;
    }

    /**
     * Sanitize string input
     */
    protected function sanitize($input) {
        return htmlspecialchars(trim($input), ENT_QUOTES, 'UTF-8');
    }

    /**
     * Hash password
     */
    protected function hashPassword($password) {
        return password_hash($password, PASSWORD_BCRYPT);
    }

    /**
     * Verify password
     */
    protected function verifyPassword($password, $hash) {
        return password_verify($password, $hash);
    }

    /**
     * Generate slug from string
     */
    protected function generateSlug($string) {
        $string = strtolower(trim($string));
        $string = preg_replace('/[^a-z0-9-]/', '-', $string);
        $string = preg_replace('/-+/', '-', $string);
        return trim($string, '-');
    }
}
?>
