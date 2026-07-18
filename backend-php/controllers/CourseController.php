<?php
/**
 * Course Controller
 * Handles course endpoints
 */

class CourseController extends BaseController {
    private function ensureFreeTutorialColumn() {
        $column = $this->conn->query("SHOW COLUMNS FROM courses LIKE 'is_free_tutorial'");
        if (!$column) throw new RuntimeException('Unable to inspect course storage');
        if ($column->num_rows === 0 && !$this->conn->query(
            "ALTER TABLE courses ADD COLUMN is_free_tutorial TINYINT(1) NOT NULL DEFAULT 0 AFTER total_reviews, ADD KEY idx_free_tutorial (is_free_tutorial, is_active)"
        )) {
            throw new RuntimeException('Unable to update course storage');
        }
    }

    /**
     * Get All Courses
     * GET /api/courses
     */
    public function getAll() {
        if ($this->getMethod() !== 'GET') {
            Response::error('Method not allowed', null, 405);
        }

        $this->ensureFreeTutorialColumn();
        $page = max(1, intval($_GET['page'] ?? 1));
        $pageSize = min(intval($_GET['pageSize'] ?? DEFAULT_PAGE_SIZE), MAX_PAGE_SIZE);
        
        $filters = [
            'search' => $_GET['search'] ?? '',
            'category_id' => intval($_GET['category_id'] ?? 0),
            'category' => $_GET['category'] ?? '',      // Main category slug: corporate/technical/non-technical
            'main_category' => $_GET['main_category'] ?? '',
            'level' => $_GET['level'] ?? '',
            'mode' => $_GET['mode'] ?? '',
            'mentor_id' => intval($_GET['mentor_id'] ?? 0),
            'is_free_tutorial' => $_GET['is_free_tutorial'] ?? null
        ];

        $courseModel = new CourseModel($this->conn);
        $result = $courseModel->getAll($page, $pageSize, $filters);

        Response::paginated($result['data'], $result['total'], $page, $pageSize, 'Courses retrieved successfully');
    }

    /**
     * Get Course by ID or Slug
     * GET /api/courses/:idOrSlug
     */
    public function getById($id) {
        if ($this->getMethod() !== 'GET') {
            Response::error('Method not allowed', null, 405);
        }

        $this->ensureFreeTutorialColumn();
        $courseModel = new CourseModel($this->conn);

        // If numeric, look up by ID; otherwise look up by slug
        if (is_numeric($id)) {
            $course = $courseModel->getById($id);
        } else {
            $course = $courseModel->getBySlug($id);
        }

        if (!$course) {
            Response::error('Course not found', null, 404);
        }

        // Include modules/syllabus
        $course['modules'] = $courseModel->getModulesByCourseId($course['id']);

        Response::success($course, 'Course retrieved successfully');
    }

    /**
     * Get Featured Courses
     * GET /api/courses/featured
     */
    public function getFeatured() {
        if ($this->getMethod() !== 'GET') {
            Response::error('Method not allowed', null, 405);
        }

        $courseModel = new CourseModel($this->conn);
        $courses = $courseModel->getFeatured();

        Response::success($courses, 'Featured courses retrieved successfully');
    }

    /**
     * Get lightweight course options for public forms
     * GET /api/courses/options
     */
    public function getOptions() {
        if ($this->getMethod() !== 'GET') {
            Response::error('Method not allowed', null, 405);
        }

        $result = $this->conn->query(
            'SELECT id, title FROM courses WHERE is_active = 1 ORDER BY title ASC, id ASC'
        );
        if (!$result) {
            throw new RuntimeException('Unable to load course options');
        }

        $courses = [];
        while ($row = $result->fetch_assoc()) {
            $courses[] = ['id' => (int)$row['id'], 'title' => $row['title']];
        }

        Response::success($courses, 'Course options retrieved successfully');
    }

    /**
     * Get All Categories
     * GET /api/categories
     */
    public function getCategories() {
        if ($this->getMethod() !== 'GET') {
            Response::error('Method not allowed', null, 405);
        }

                $query = "SELECT cat.id, cat.name, cat.slug, cat.description,
                                                 COUNT(c.id) AS course_count
                                    FROM categories cat
                                    LEFT JOIN courses c
                                        ON c.category_id = cat.id AND c.is_active = 1
                                    WHERE cat.is_active = 1
                                    GROUP BY cat.id, cat.name, cat.slug, cat.description
                                    ORDER BY cat.id ASC";
        $result = $this->conn->query($query);

        $categories = [];
        while ($row = $result->fetch_assoc()) {
            $categories[] = $row;
        }

        Response::success($categories, 'Categories retrieved successfully');
    }

    /**
     * Get Active Mentors
     * GET /api/mentors
     */
    public function getMentors() {
        if ($this->getMethod() !== 'GET') {
            Response::error('Method not allowed', null, 405);
        }

        $query = "SELECT u.id, u.name, u.profile_image, u.bio,
                         COUNT(c.id) AS course_count
                  FROM users u
                  LEFT JOIN courses c
                    ON c.mentor_id = u.id AND c.is_active = 1
                  WHERE u.role = 'mentor' AND u.is_active = 1
                  GROUP BY u.id, u.name, u.profile_image, u.bio
                  ORDER BY u.created_at DESC, u.id DESC";
        $result = $this->conn->query($query);

        $mentors = [];
        while ($row = $result->fetch_assoc()) {
            $row['course_count'] = intval($row['course_count']);
            $mentors[] = $row;
        }

        Response::success($mentors, 'Mentors retrieved successfully');
    }

    /**
     * Create Course (Admin/Mentor only)
     * POST /api/courses
     */
    public function create() {
        if ($this->getMethod() !== 'POST') {
            Response::error('Method not allowed', null, 405);
        }

        if (!$this->auth->authenticate()) {
            Response::error('Unauthorized', null, 401);
        }

        if (!$this->auth->isMentor()) {
            Response::error('Only mentors can create courses', null, 403);
        }

        $data = $this->getRequestData();

        // Validate required fields
        $errors = $this->validateRequired($data, ['title', 'description', 'category_id', 'price', 'duration_weeks', 'level']);
        if (!empty($errors)) {
            Response::error('Validation failed', $errors, 422);
        }

        // Prepare course data
        $courseData = [
            'title' => $this->sanitize($data['title']),
            'slug' => $this->generateSlug($data['title']),
            'description' => $this->sanitize($data['description']),
            'category_id' => intval($data['category_id']),
            'mentor_id' => $this->auth->getUser()['id'],
            'price' => floatval($data['price']),
            'duration_weeks' => intval($data['duration_weeks']),
            'level' => $this->sanitize($data['level']),
            'max_students' => intval($data['max_students'] ?? 50),
            'thumbnail' => $data['thumbnail'] ?? null
        ];

        $courseModel = new CourseModel($this->conn);
        $courseId = $courseModel->create($courseData);

        if (!$courseId) {
            Response::error('Failed to create course', null, 500);
        }

        $course = $courseModel->getById($courseId);
        Response::success($course, 'Course created successfully', 201);
    }

    /**
     * Update Course
     * PUT /api/courses/:id
     */
    public function update($id) {
        if ($this->getMethod() !== 'PUT') {
            Response::error('Method not allowed', null, 405);
        }

        if (!$this->auth->authenticate()) {
            Response::error('Unauthorized', null, 401);
        }

        $courseModel = new CourseModel($this->conn);
        $course = $courseModel->getById($id);

        if (!$course) {
            Response::error('Course not found', null, 404);
        }

        // Check permission (only course mentor or admin can update)
        if ($course['mentor_id'] !== $this->auth->getUser()['id'] && !$this->auth->isAdmin()) {
            Response::error('Forbidden', null, 403);
        }

        $data = $this->getRequestData();
        $updateData = [];

        // Only allow specific fields to be updated
        $allowedFields = ['title', 'description', 'price', 'duration_weeks', 'level', 'max_students', 'thumbnail'];
        foreach ($allowedFields as $field) {
            if (isset($data[$field])) {
                $updateData[$field] = is_numeric($data[$field]) ? $data[$field] : $this->sanitize($data[$field]);
            }
        }

        if (empty($updateData)) {
            Response::error('No fields to update', null, 422);
        }

        $updateData['id'] = $id;
        if ($courseModel->update($id, $updateData)) {
            $course = $courseModel->getById($id);
            Response::success($course, 'Course updated successfully');
        } else {
            Response::error('Failed to update course', null, 500);
        }
    }

    /**
     * Delete Course
     * DELETE /api/courses/:id
     */
    public function delete($id) {
        if ($this->getMethod() !== 'DELETE') {
            Response::error('Method not allowed', null, 405);
        }

        if (!$this->auth->authenticate()) {
            Response::error('Unauthorized', null, 401);
        }

        $courseModel = new CourseModel($this->conn);
        $course = $courseModel->getById($id);

        if (!$course) {
            Response::error('Course not found', null, 404);
        }

        // Check permission
        if ($course['mentor_id'] !== $this->auth->getUser()['id'] && !$this->auth->isAdmin()) {
            Response::error('Forbidden', null, 403);
        }

        if ($courseModel->delete($id)) {
            Response::success(null, 'Course deleted successfully');
        } else {
            Response::error('Failed to delete course', null, 500);
        }
    }
}
?>
