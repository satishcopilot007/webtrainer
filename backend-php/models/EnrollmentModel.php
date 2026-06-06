<?php
/**
 * Enrollment Model
 * Database operations for course enrollments
 */

class EnrollmentModel {
    protected $conn;
    protected $table = 'enrollments';

    public function __construct($conn) {
        $this->conn = $conn;
    }

    /**
     * Enroll student in course
     */
    public function enroll($studentId, $courseId) {
        // Check if already enrolled
        $query = "SELECT id FROM " . $this->table . " WHERE student_id = ? AND course_id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param('ii', $studentId, $courseId);
        $stmt->execute();
        
        if ($stmt->get_result()->num_rows > 0) {
            $stmt->close();
            return false; // Already enrolled
        }
        $stmt->close();

        // Create enrollment
        $query = "INSERT INTO " . $this->table . " (student_id, course_id, status) VALUES (?, ?, 'active')";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param('ii', $studentId, $courseId);
        
        if ($stmt->execute()) {
            $enrollmentId = $this->conn->insert_id;
            $stmt->close();
            
            // Increment course student count
            $this->conn->query("UPDATE courses SET current_students = current_students + 1 WHERE id = $courseId");
            
            return $enrollmentId;
        }

        $stmt->close();
        return false;
    }

    /**
     * Get enrollment by ID
     */
    public function getById($id) {
        $query = "SELECT * FROM " . $this->table . " WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param('i', $id);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows === 0) {
            $stmt->close();
            return null;
        }

        $enrollment = $result->fetch_assoc();
        $stmt->close();
        return $enrollment;
    }

    /**
     * Update progress
     */
    public function updateProgress($id, $progressPercentage) {
        $query = "UPDATE " . $this->table . " SET progress_percentage = ? WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param('ii', $progressPercentage, $id);
        $result = $stmt->execute();
        $stmt->close();
        return $result;
    }

    /**
     * Mark course as completed
     */
    public function markComplete($id) {
        $query = "UPDATE " . $this->table . " SET status = 'completed', completion_date = CURDATE(), progress_percentage = 100 WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param('i', $id);
        $result = $stmt->execute();
        $stmt->close();
        return $result;
    }

    /**
     * Drop course
     */
    public function drop($id) {
        $enrollment = $this->getById($id);
        if (!$enrollment) return false;

        $query = "UPDATE " . $this->table . " SET status = 'dropped' WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param('i', $id);
        
        if ($stmt->execute()) {
            $stmt->close();
            // Decrement course student count
            $this->conn->query("UPDATE courses SET current_students = GREATEST(0, current_students - 1) WHERE id = " . $enrollment['course_id']);
            return true;
        }

        $stmt->close();
        return false;
    }
}
?>
