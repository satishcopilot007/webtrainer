<?php
/**
 * Enrollment Controller
 * Handles course enrollment endpoints
 */

class EnrollmentController extends BaseController {

    /**
     * Enroll in course
     * POST /api/enrollments
     */
    public function create() {
        if ($this->getMethod() !== 'POST') {
            Response::error('Method not allowed', null, 405);
        }

        if (!$this->auth->authenticate()) {
            Response::error('Unauthorized', null, 401);
        }

        $data = $this->getRequestData();
        
        if (empty($data['course_id'])) {
            Response::error('Course ID is required', null, 422);
        }

        $studentId = $this->auth->getUser()['id'];
        $courseId = intval($data['course_id']);

        // Verify course exists
        $courseModel = new CourseModel($this->conn);
        $course = $courseModel->getById($courseId);

        if (!$course) {
            Response::error('Course not found', null, 404);
        }

        // Check if course is full
        if ($course['current_students'] >= $course['max_students']) {
            Response::error('Course is full', null, 422);
        }

        // Create enrollment
        $enrollmentModel = new EnrollmentModel($this->conn);
        $enrollmentId = $enrollmentModel->enroll($studentId, $courseId);

        if (!$enrollmentId) {
            Response::error('Already enrolled in this course', null, 422);
        }

        $enrollment = $enrollmentModel->getById($enrollmentId);
        Response::success($enrollment, 'Enrolled in course successfully', 201);
    }

    /**
     * Get enrollment by ID
     * GET /api/enrollments/:id
     */
    public function getById($id) {
        if ($this->getMethod() !== 'GET') {
            Response::error('Method not allowed', null, 405);
        }

        if (!$this->auth->authenticate()) {
            Response::error('Unauthorized', null, 401);
        }

        $enrollmentModel = new EnrollmentModel($this->conn);
        $enrollment = $enrollmentModel->getById($id);

        if (!$enrollment) {
            Response::error('Enrollment not found', null, 404);
        }

        // Check permission
        if ($enrollment['student_id'] !== $this->auth->getUser()['id'] && !$this->auth->isAdmin()) {
            Response::error('Forbidden', null, 403);
        }

        Response::success($enrollment, 'Enrollment retrieved successfully');
    }

    /**
     * Update progress
     * PUT /api/enrollments/:id/progress
     */
    public function updateProgress($id) {
        if ($this->getMethod() !== 'PUT') {
            Response::error('Method not allowed', null, 405);
        }

        if (!$this->auth->authenticate()) {
            Response::error('Unauthorized', null, 401);
        }

        $data = $this->getRequestData();

        if (empty($data['progress'])) {
            Response::error('Progress is required', null, 422);
        }

        $progress = intval($data['progress']);
        if ($progress < 0 || $progress > 100) {
            Response::error('Progress must be between 0 and 100', null, 422);
        }

        $enrollmentModel = new EnrollmentModel($this->conn);
        $enrollment = $enrollmentModel->getById($id);

        if (!$enrollment) {
            Response::error('Enrollment not found', null, 404);
        }

        if ($enrollment['student_id'] !== $this->auth->getUser()['id'] && !$this->auth->isAdmin()) {
            Response::error('Forbidden', null, 403);
        }

        if ($enrollmentModel->updateProgress($id, $progress)) {
            $enrollment = $enrollmentModel->getById($id);
            Response::success($enrollment, 'Progress updated successfully');
        } else {
            Response::error('Failed to update progress', null, 500);
        }
    }

    /**
     * Mark course as completed
     * POST /api/enrollments/:id/complete
     */
    public function markComplete($id) {
        if ($this->getMethod() !== 'POST') {
            Response::error('Method not allowed', null, 405);
        }

        if (!$this->auth->authenticate()) {
            Response::error('Unauthorized', null, 401);
        }

        $enrollmentModel = new EnrollmentModel($this->conn);
        $enrollment = $enrollmentModel->getById($id);

        if (!$enrollment) {
            Response::error('Enrollment not found', null, 404);
        }

        if ($enrollment['student_id'] !== $this->auth->getUser()['id'] && !$this->auth->isAdmin()) {
            Response::error('Forbidden', null, 403);
        }

        if ($enrollmentModel->markComplete($id)) {
            $enrollment = $enrollmentModel->getById($id);
            Response::success($enrollment, 'Course marked as completed');
        } else {
            Response::error('Failed to mark course as completed', null, 500);
        }
    }

    /**
     * Drop course
     * POST /api/enrollments/:id/drop
     */
    public function drop($id) {
        if ($this->getMethod() !== 'POST') {
            Response::error('Method not allowed', null, 405);
        }

        if (!$this->auth->authenticate()) {
            Response::error('Unauthorized', null, 401);
        }

        $enrollmentModel = new EnrollmentModel($this->conn);
        $enrollment = $enrollmentModel->getById($id);

        if (!$enrollment) {
            Response::error('Enrollment not found', null, 404);
        }

        if ($enrollment['student_id'] !== $this->auth->getUser()['id'] && !$this->auth->isAdmin()) {
            Response::error('Forbidden', null, 403);
        }

        if ($enrollmentModel->drop($id)) {
            Response::success(null, 'Course dropped successfully');
        } else {
            Response::error('Failed to drop course', null, 500);
        }
    }
}
?>
