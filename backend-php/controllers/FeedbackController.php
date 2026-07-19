<?php
/**
 * Public Feedback Controller
 * Accepts website feedback and places it in the administrator review queue.
 */
class FeedbackController extends BaseController {
    private function ensureFeedbackTable() {
        $sql = "CREATE TABLE IF NOT EXISTS admin_feedback (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            role VARCHAR(100) NULL,
            phone VARCHAR(30) NULL,
            course_id INT NULL,
            subject VARCHAR(255) NULL,
            message TEXT NOT NULL,
            rating TINYINT UNSIGNED NULL,
            status ENUM('new', 'reviewed', 'resolved') NOT NULL DEFAULT 'new',
            is_published TINYINT(1) NOT NULL DEFAULT 0,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            KEY idx_admin_feedback_status (status),
            KEY idx_admin_feedback_course (course_id),
            KEY idx_admin_feedback_created (created_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";

        if (!$this->conn->query($sql)) {
            throw new RuntimeException('Unable to initialize feedback storage');
        }

        $roleColumn = $this->conn->query("SHOW COLUMNS FROM admin_feedback LIKE 'role'");
        if (!$roleColumn || ($roleColumn->num_rows === 0 && !$this->conn->query(
            "ALTER TABLE admin_feedback ADD COLUMN role VARCHAR(100) NULL AFTER email"
        ))) {
            throw new RuntimeException('Unable to update feedback storage');
        }
    }

    private function textValue($value, $field, $maxLength, $minLength = 1) {
        if (!is_string($value)) {
            Response::error('Validation failed', [$field => 'A text value is required'], 422);
        }

        $value = trim(preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $value));
        $length = function_exists('mb_strlen') ? mb_strlen($value) : strlen($value);
        if ($length < $minLength || $length > $maxLength) {
            Response::error('Validation failed', [$field => "Must be between {$minLength} and {$maxLength} characters"], 422);
        }
        return $value;
    }

    public function submit() {
        if ($this->getMethod() !== 'POST') {
            Response::error('Method not allowed', null, 405);
        }

        $data = $this->getRequestData();
        if (!is_array($data)) {
            Response::error('A JSON object is required', null, 422);
        }

        // Honeypot field: real users never see or fill this input.
        if (!empty($data['website'])) {
            Response::success(null, 'Feedback received successfully', 201);
        }

        $name = $this->textValue($data['name'] ?? null, 'name', 255, 2);
        $email = strtolower(trim((string)($data['email'] ?? '')));
        if (!filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 255) {
            Response::error('Validation failed', ['email' => 'Enter a valid email address'], 422);
        }
        $role = $this->textValue($data['role'] ?? null, 'role', 100, 2);
        $message = $this->textValue($data['message'] ?? null, 'message', 20000, 10);
        $courseId = filter_var($data['course_id'] ?? null, FILTER_VALIDATE_INT, [
            'options' => ['min_range' => 1],
        ]);
        if ($courseId === false) {
            Response::error('Validation failed', ['course_id' => 'Select a valid course'], 422);
        }

        $courseStmt = $this->conn->prepare('SELECT title FROM courses WHERE id = ? AND is_active = 1 LIMIT 1');
        $courseStmt->bind_param('i', $courseId);
        $courseStmt->execute();
        $course = $courseStmt->get_result()->fetch_assoc();
        $courseStmt->close();
        if (!$course) {
            Response::error('Validation failed', ['course_id' => 'The selected course is unavailable'], 422);
        }

        $rating = filter_var($data['rating'] ?? null, FILTER_VALIDATE_INT, [
            'options' => ['min_range' => 1, 'max_range' => 5],
        ]);
        if ($rating === false) {
            Response::error('Validation failed', ['rating' => 'Select a rating from 1 to 5'], 422);
        }

        $this->ensureFeedbackTable();

        // Prevent accidental double submissions without retaining client IP addresses.
        $duplicateStmt = $this->conn->prepare(
            'SELECT id FROM admin_feedback WHERE email = ? AND message = ? AND created_at >= DATE_SUB(NOW(), INTERVAL 30 SECOND) LIMIT 1'
        );
        $duplicateStmt->bind_param('ss', $email, $message);
        $duplicateStmt->execute();
        $duplicate = $duplicateStmt->get_result()->num_rows > 0;
        $duplicateStmt->close();
        if ($duplicate) {
            Response::error('This feedback was already received. Please wait before submitting it again.', null, 429);
        }

        $phone = '';
        $subject = 'Feedback for ' . $course['title'];
        $status = 'new';
        $isPublished = 0;
        $stmt = $this->conn->prepare(
                  'INSERT INTO admin_feedback (name, email, role, phone, course_id, subject, message, rating, status, is_published, created_at, updated_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())'
        );
              $stmt->bind_param('ssssissisi', $name, $email, $role, $phone, $courseId, $subject, $message, $rating, $status, $isPublished);
        if (!$stmt->execute()) {
            $stmt->close();
            throw new RuntimeException('Unable to save feedback');
        }
        $id = $this->conn->insert_id;
        $stmt->close();

        Response::success(['id' => $id], 'Thank you. Your feedback has been sent for review.', 201);
    }
}
?>