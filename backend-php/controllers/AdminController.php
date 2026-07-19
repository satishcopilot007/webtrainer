<?php
/**
 * Admin Controller
 * Admin-only dashboard and management endpoints.
 */
class AdminController extends BaseController {
    private const MAX_SYLLABUS_MODULES = 100;
    private const MAX_LESSONS_PER_MODULE = 200;

    private function requireAdmin() {
        if (!$this->auth->authenticate()) {
            Response::error('Authentication required', null, 401);
        }

        if (!$this->auth->isAdmin()) {
            Response::error('Administrator access required', null, 403);
        }

        $this->ensureAdminTables();
        return $this->auth->getUser();
    }

    private function ensureAdminTables() {
        $feedbackSql = "CREATE TABLE IF NOT EXISTS admin_feedback (
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

        $auditSql = "CREATE TABLE IF NOT EXISTS admin_audit_logs (
            id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            admin_user_id INT NOT NULL,
            action VARCHAR(64) NOT NULL,
            entity_type VARCHAR(64) NOT NULL,
            entity_id INT NULL,
            details LONGTEXT NULL,
            ip_address VARCHAR(45) NULL,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            KEY idx_admin_audit_admin (admin_user_id),
            KEY idx_admin_audit_entity (entity_type, entity_id),
            KEY idx_admin_audit_created (created_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";

        $foundersSql = "CREATE TABLE IF NOT EXISTS admin_founders (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            role VARCHAR(255) NOT NULL,
            expertise VARCHAR(500) NULL,
            experience VARCHAR(100) NULL,
            location VARCHAR(255) NULL,
            country CHAR(2) NULL,
            photo_url VARCHAR(1000) NULL,
            linkedin_url VARCHAR(1000) NULL,
            bio TEXT NULL,
            quote VARCHAR(1000) NULL,
            sort_order INT NOT NULL DEFAULT 0,
            is_active TINYINT(1) NOT NULL DEFAULT 1,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            KEY idx_founders_active_order (is_active, sort_order)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";

        $blogsSql = "CREATE TABLE IF NOT EXISTS admin_blogs (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            slug VARCHAR(255) NOT NULL UNIQUE,
            excerpt VARCHAR(1000) NOT NULL,
            content LONGTEXT NULL,
            image_url VARCHAR(1000) NULL,
            author VARCHAR(255) NOT NULL,
            category VARCHAR(100) NOT NULL,
            read_time VARCHAR(50) NULL,
            source_platform VARCHAR(30) NOT NULL DEFAULT 'website',
            external_url VARCHAR(1000) NULL,
            reference_url VARCHAR(1000) NULL,
            published_at DATE NOT NULL,
            is_published TINYINT(1) NOT NULL DEFAULT 0,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            KEY idx_blogs_public (is_published, published_at),
            KEY idx_blogs_category (category)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";

        if (!$this->conn->query($feedbackSql) || !$this->conn->query($auditSql) || !$this->conn->query($foundersSql) || !$this->conn->query($blogsSql)) {
            throw new RuntimeException('Unable to initialize admin data tables');
        }

        $feedbackRoleColumn = $this->conn->query("SHOW COLUMNS FROM admin_feedback LIKE 'role'");
        if (!$feedbackRoleColumn || ($feedbackRoleColumn->num_rows === 0 && !$this->conn->query(
            "ALTER TABLE admin_feedback ADD COLUMN role VARCHAR(100) NULL AFTER email"
        ))) {
            throw new RuntimeException('Unable to update feedback data table');
        }

        $freeTutorialColumn = $this->conn->query("SHOW COLUMNS FROM courses LIKE 'is_free_tutorial'");
        if (!$freeTutorialColumn) throw new RuntimeException('Unable to inspect course data table');
        if ($freeTutorialColumn->num_rows === 0 && !$this->conn->query(
            "ALTER TABLE courses ADD COLUMN is_free_tutorial TINYINT(1) NOT NULL DEFAULT 0 AFTER total_reviews, ADD KEY idx_free_tutorial (is_free_tutorial, is_active)"
        )) {
            throw new RuntimeException('Unable to update course data table');
        }

        $categoryTypeColumn = $this->conn->query("SHOW COLUMNS FROM categories LIKE 'course_type'");
        if (!$categoryTypeColumn) throw new RuntimeException('Unable to inspect category data table');
        if ($categoryTypeColumn->num_rows === 0 && !$this->conn->query(
            "ALTER TABLE categories ADD COLUMN course_type ENUM('tech', 'non-tech') NOT NULL DEFAULT 'tech' AFTER slug, ADD KEY idx_course_type (course_type, is_active)"
        )) {
            throw new RuntimeException('Unable to update category data table');
        }

    }

    private function audit($action, $entityType, $entityId = null, $details = null) {
        $admin = $this->auth->getUser();
        $encodedDetails = $details === null
            ? null
            : json_encode($details, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
        $ipAddress = substr($_SERVER['REMOTE_ADDR'] ?? '', 0, 45);
        $stmt = $this->conn->prepare(
            'INSERT INTO admin_audit_logs (admin_user_id, action, entity_type, entity_id, details, ip_address) VALUES (?, ?, ?, ?, ?, ?)'
        );
        $stmt->bind_param('ississ', $admin['id'], $action, $entityType, $entityId, $encodedDetails, $ipAddress);
        $stmt->execute();
        $stmt->close();
    }

    private function pageParams() {
        $page = max(1, (int)($_GET['page'] ?? 1));
        $pageSize = min(MAX_PAGE_SIZE, max(1, (int)($_GET['pageSize'] ?? 20)));
        return [$page, $pageSize, ($page - 1) * $pageSize];
    }

    private function searchTerm() {
        return substr(trim((string)($_GET['search'] ?? '')), 0, 100);
    }

    private function body() {
        if (!is_array($this->requestData)) {
            Response::error('A JSON object is required', null, 422);
        }
        return $this->requestData;
    }

    private function rejectUnknownFields($data, $allowed) {
        $unknown = array_values(array_diff(array_keys($data), $allowed));
        if (!empty($unknown)) {
            Response::error('Unsupported fields supplied', ['fields' => $unknown], 422);
        }
    }

    private function cleanString($value, $maxLength, $required = false) {
        if (!is_string($value) && !is_numeric($value)) {
            if ($required) {
                Response::error('Validation failed', ['value' => 'A text value is required'], 422);
            }
            return null;
        }

        $value = trim((string)$value);
        $value = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $value);
        if ($required && $value === '') {
            Response::error('Validation failed', ['value' => 'This field is required'], 422);
        }
        $length = function_exists('mb_strlen') ? mb_strlen($value) : strlen($value);
        if ($length > $maxLength) {
            Response::error('Validation failed', ['value' => "Must not exceed {$maxLength} characters"], 422);
        }
        return $value;
    }

    private function boolValue($value, $default = false) {
        if ($value === null) return $default ? 1 : 0;
        if (is_bool($value)) return $value ? 1 : 0;
        if ($value === 1 || $value === '1') return 1;
        if ($value === 0 || $value === '0') return 0;
        Response::error('Validation failed', ['is_active' => 'Must be a boolean'], 422);
    }

    private function positiveId($id) {
        $value = filter_var($id, FILTER_VALIDATE_INT, ['options' => ['min_range' => 1]]);
        if (!$value) {
            Response::error('Invalid record identifier', null, 422);
        }
        return (int)$value;
    }

    private function emailValue($value) {
        $email = strtolower(trim((string)$value));
        if (!filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 255) {
            Response::error('Validation failed', ['email' => 'A valid email address is required'], 422);
        }
        return $email;
    }

    private function tableExists($tableName) {
        $stmt = $this->conn->prepare(
            'SELECT 1 FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = ? LIMIT 1'
        );
        $stmt->bind_param('s', $tableName);
        $stmt->execute();
        $exists = $stmt->get_result()->num_rows > 0;
        $stmt->close();
        return $exists;
    }

    private function slugValue($value, $fallback) {
        $slug = $this->generateSlug($value ?: $fallback);
        if ($slug === '' || strlen($slug) > 255) {
            Response::error('Validation failed', ['slug' => 'A valid slug is required'], 422);
        }
        return $slug;
    }

    private function assertUnique($table, $column, $value, $exceptId = null) {
        $allowed = [
            'users.email' => true,
            'categories.slug' => true,
            'courses.slug' => true,
            'admin_blogs.slug' => true,
        ];
        if (!isset($allowed[$table . '.' . $column])) {
            throw new LogicException('Invalid uniqueness check');
        }

        $sql = "SELECT id FROM {$table} WHERE {$column} = ?";
        if ($exceptId !== null) $sql .= ' AND id <> ?';
        $sql .= ' LIMIT 1';
        $stmt = $this->conn->prepare($sql);
        if ($exceptId !== null) {
            $stmt->bind_param('si', $value, $exceptId);
        } else {
            $stmt->bind_param('s', $value);
        }
        $stmt->execute();
        $exists = $stmt->get_result()->num_rows > 0;
        $stmt->close();
        if ($exists) {
            Response::error('A record with this value already exists', [$column => 'Must be unique'], 409);
        }
    }

    private function scalar($sql) {
        $result = $this->conn->query($sql);
        if (!$result) throw new RuntimeException('Dashboard query failed');
        $row = $result->fetch_row();
        return $row ? $row[0] : 0;
    }

    public function overview() {
        $this->requireAdmin();

        $stats = [
            'users' => (int)$this->scalar("SELECT COUNT(*) FROM users WHERE is_active = 1"),
            'tutors' => (int)$this->scalar("SELECT COUNT(*) FROM users WHERE role = 'mentor' AND is_active = 1"),
            'categories' => (int)$this->scalar("SELECT COUNT(*) FROM categories WHERE is_active = 1"),
            'courses' => (int)$this->scalar("SELECT COUNT(*) FROM courses WHERE is_active = 1"),
            'enrollments' => $this->tableExists('enrollments') ? (int)$this->scalar('SELECT COUNT(*) FROM enrollments') : 0,
            'leads' => $this->tableExists('leads') ? (int)$this->scalar('SELECT COUNT(*) FROM leads') : 0,
            'feedback' => (int)$this->scalar('SELECT COUNT(*) FROM admin_feedback'),
            'revenue' => $this->tableExists('payments')
                ? (float)$this->scalar("SELECT COALESCE(SUM(amount), 0) FROM payments WHERE status = 'completed'")
                : 0,
        ];

        $recentEnrollments = [];
        if ($this->tableExists('enrollments')) {
            $result = $this->conn->query(
                "SELECT e.id, e.status, e.enrollment_date, u.name AS student_name, c.title AS course_title
                 FROM enrollments e
                 LEFT JOIN users u ON u.id = e.student_id
                 LEFT JOIN courses c ON c.id = e.course_id
                 ORDER BY e.enrollment_date DESC LIMIT 6"
            );
            while ($result && $row = $result->fetch_assoc()) $recentEnrollments[] = $row;
        }

        $recentFeedback = [];
        $result = $this->conn->query(
            'SELECT id, name, email, subject, rating, status, created_at FROM admin_feedback ORDER BY created_at DESC LIMIT 6'
        );
        while ($result && $row = $result->fetch_assoc()) $recentFeedback[] = $row;

        Response::success([
            'stats' => $stats,
            'recent_enrollments' => $recentEnrollments,
            'recent_feedback' => $recentFeedback,
        ], 'Admin overview retrieved successfully');
    }

    public function getTutors() {
        $this->requireAdmin();
        [$page, $pageSize, $offset] = $this->pageParams();
        $search = $this->searchTerm();
        $status = $_GET['status'] ?? 'all';
        if (!in_array($status, ['all', 'active', 'inactive'], true)) {
            Response::error('Invalid status filter', null, 422);
        }

        $where = "WHERE u.role = 'mentor'";
        $params = [];
        $types = '';
        if ($search !== '') {
            $where .= ' AND (u.name LIKE ? OR u.email LIKE ? OR u.phone LIKE ?)';
            $like = '%' . $search . '%';
            array_push($params, $like, $like, $like);
            $types .= 'sss';
        }
        if ($status !== 'all') {
            $where .= ' AND u.is_active = ?';
            $params[] = $status === 'active' ? 1 : 0;
            $types .= 'i';
        }

        $countStmt = $this->conn->prepare("SELECT COUNT(*) AS total FROM users u {$where}");
        if ($types !== '') $countStmt->bind_param($types, ...$params);
        $countStmt->execute();
        $total = (int)$countStmt->get_result()->fetch_assoc()['total'];
        $countStmt->close();

        $sql = "SELECT u.id, u.name, u.email, u.phone, u.profile_image, u.bio, u.is_active, u.created_at, u.updated_at,
                   (SELECT COUNT(*) FROM courses c WHERE c.mentor_id = u.id) AS course_count,
                   (SELECT COUNT(*) FROM courses c WHERE c.mentor_id = u.id AND c.is_active = 1) AS active_course_count
            FROM users u {$where}
                ORDER BY u.created_at DESC LIMIT ? OFFSET ?";
        $params[] = $pageSize;
        $params[] = $offset;
        $types .= 'ii';
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param($types, ...$params);
        $stmt->execute();
        $rows = [];
        $result = $stmt->get_result();
        while ($row = $result->fetch_assoc()) $rows[] = $row;
        $stmt->close();
        Response::paginated($rows, $total, $page, $pageSize, 'Tutors retrieved successfully');
    }

    public function getTutor($id) {
        $this->requireAdmin();
        $id = $this->positiveId($id);
        $stmt = $this->conn->prepare(
                "SELECT u.id, u.name, u.email, u.phone, u.profile_image, u.bio, u.is_active, u.created_at, u.updated_at,
                    (SELECT COUNT(*) FROM courses c WHERE c.mentor_id = u.id) AS course_count
                 FROM users u WHERE u.id = ? AND u.role = 'mentor'"
        );
        $stmt->bind_param('i', $id);
        $stmt->execute();
        $tutor = $stmt->get_result()->fetch_assoc();
        $stmt->close();
        if (!$tutor) Response::error('Tutor not found', null, 404);
        Response::success($tutor, 'Tutor retrieved successfully');
    }

    public function uploadTutorProfileImage() {
        $this->requireAdmin();

        $contentLength = (int)($_SERVER['CONTENT_LENGTH'] ?? 0);
        if ($contentLength <= 0) {
            Response::error('Select an image to upload', null, 422);
        }
        if ($contentLength > MAX_UPLOAD_SIZE) {
            Response::error('Profile image must not exceed 5 MB', null, 413);
        }

        $imageData = file_get_contents('php://input');
        if ($imageData === false || $imageData === '') {
            Response::error('Unable to read the uploaded image', null, 422);
        }
        if (strlen($imageData) > MAX_UPLOAD_SIZE) {
            Response::error('Profile image must not exceed 5 MB', null, 413);
        }

        $finfo = new finfo(FILEINFO_MIME_TYPE);
        $mimeType = $finfo->buffer($imageData);
        $allowedTypes = [
            'image/jpeg' => 'jpg',
            'image/png' => 'png',
            'image/webp' => 'webp',
        ];
        if (!isset($allowedTypes[$mimeType])) {
            Response::error('Only JPEG, PNG, and WebP images are allowed', null, 422);
        }

        $dimensions = @getimagesizefromstring($imageData);
        if ($dimensions === false || ($dimensions[0] * $dimensions[1]) > 25000000) {
            Response::error('The image is invalid or its dimensions are too large', null, 422);
        }

        $uploadDirectory = UPLOAD_DIR . DIRECTORY_SEPARATOR . 'tutors';
        if (!is_dir($uploadDirectory) && !mkdir($uploadDirectory, 0755, true) && !is_dir($uploadDirectory)) {
            throw new RuntimeException('Unable to initialize profile image storage');
        }

        $fileName = bin2hex(random_bytes(16)) . '.' . $allowedTypes[$mimeType];
        $destination = $uploadDirectory . DIRECTORY_SEPARATOR . $fileName;
        if (file_put_contents($destination, $imageData, LOCK_EX) === false) {
            throw new RuntimeException('Unable to save profile image');
        }
        @chmod($destination, 0644);

        Response::success([
            'url' => '/api/uploads/tutors/' . $fileName,
            'width' => (int)$dimensions[0],
            'height' => (int)$dimensions[1],
        ], 'Profile image uploaded successfully', 201);
    }

    public function createTutor() {
        $this->requireAdmin();
        $data = $this->body();
        $this->rejectUnknownFields($data, ['name', 'email', 'password', 'phone', 'bio', 'profile_image', 'is_active']);

        $name = $this->cleanString($data['name'] ?? '', 255, true);
        $email = $this->emailValue($data['email'] ?? '');
        $password = (string)($data['password'] ?? '');
        if (strlen($password) < 8 || strlen($password) > 128) {
            Response::error('Validation failed', ['password' => 'Password must be 8 to 128 characters'], 422);
        }
        $this->assertUnique('users', 'email', $email);
        $phone = $this->cleanString($data['phone'] ?? '', 30);
        $bio = $this->cleanString($data['bio'] ?? '', 10000);
        $profileImage = $this->cleanString($data['profile_image'] ?? '', 255);
        $isActive = $this->boolValue($data['is_active'] ?? true, true);
        $passwordHash = password_hash($password, PASSWORD_BCRYPT);

        $stmt = $this->conn->prepare(
            "INSERT INTO users (name, email, password, phone, role, profile_image, bio, is_active, created_at, updated_at)
             VALUES (?, ?, ?, ?, 'mentor', ?, ?, ?, NOW(), NOW())"
        );
        $stmt->bind_param('ssssssi', $name, $email, $passwordHash, $phone, $profileImage, $bio, $isActive);
        if (!$stmt->execute()) {
            $stmt->close();
            Response::error('Unable to create tutor', null, 500);
        }
        $id = $this->conn->insert_id;
        $stmt->close();
        $this->audit('create', 'tutor', $id, ['email' => $email]);
        Response::success(['id' => $id], 'Tutor created successfully', 201);
    }

    public function updateTutor($id) {
        $this->requireAdmin();
        $id = $this->positiveId($id);
        $data = $this->body();
        $this->rejectUnknownFields($data, ['name', 'email', 'password', 'phone', 'bio', 'profile_image', 'is_active']);
        if (empty($data)) Response::error('No fields to update', null, 422);

        $existsStmt = $this->conn->prepare("SELECT id FROM users WHERE id = ? AND role = 'mentor'");
        $existsStmt->bind_param('i', $id);
        $existsStmt->execute();
        $exists = $existsStmt->get_result()->num_rows > 0;
        $existsStmt->close();
        if (!$exists) Response::error('Tutor not found', null, 404);

        $updates = [];
        $params = [];
        $types = '';
        $fieldTypes = [
            'name' => ['s', 255], 'phone' => ['s', 30], 'bio' => ['s', 10000], 'profile_image' => ['s', 255],
        ];
        foreach ($fieldTypes as $field => [$type, $max]) {
            if (array_key_exists($field, $data)) {
                $value = $this->cleanString($data[$field] ?? '', $max, $field === 'name');
                $updates[] = "{$field} = ?";
                $params[] = $value;
                $types .= $type;
            }
        }
        if (array_key_exists('email', $data)) {
            $email = $this->emailValue($data['email']);
            $this->assertUnique('users', 'email', $email, $id);
            $updates[] = 'email = ?';
            $params[] = $email;
            $types .= 's';
        }
        if (array_key_exists('password', $data) && $data['password'] !== '') {
            $password = (string)$data['password'];
            if (strlen($password) < 8 || strlen($password) > 128) {
                Response::error('Validation failed', ['password' => 'Password must be 8 to 128 characters'], 422);
            }
            $updates[] = 'password = ?';
            $params[] = password_hash($password, PASSWORD_BCRYPT);
            $types .= 's';
        }
        if (array_key_exists('is_active', $data)) {
            $updates[] = 'is_active = ?';
            $params[] = $this->boolValue($data['is_active']);
            $types .= 'i';
        }
        if (empty($updates)) Response::error('No fields to update', null, 422);
        $params[] = $id;
        $types .= 'i';
        $stmt = $this->conn->prepare('UPDATE users SET ' . implode(', ', $updates) . ', updated_at = NOW() WHERE id = ?');
        $stmt->bind_param($types, ...$params);
        $ok = $stmt->execute();
        $stmt->close();
        if (!$ok) Response::error('Unable to update tutor', null, 500);
        $this->audit('update', 'tutor', $id, ['fields' => array_keys($data)]);
        Response::success(['id' => $id], 'Tutor updated successfully');
    }

    public function deleteTutor($id) {
        $this->requireAdmin();
        $id = $this->positiveId($id);
        $stmt = $this->conn->prepare(
            "SELECT u.id, (SELECT COUNT(*) FROM courses c WHERE c.mentor_id = u.id) AS course_count
             FROM users u WHERE u.id = ? AND u.role = 'mentor'"
        );
        $stmt->bind_param('i', $id);
        $stmt->execute();
        $tutor = $stmt->get_result()->fetch_assoc();
        $stmt->close();
        if (!$tutor) Response::error('Tutor not found', null, 404);

        $stmt = $this->conn->prepare('UPDATE users SET is_active = 0, updated_at = NOW() WHERE id = ?');
        $stmt->bind_param('i', $id);
        $ok = $stmt->execute();
        $stmt->close();
        if (!$ok) Response::error('Unable to deactivate tutor', null, 500);
        $this->audit('deactivate', 'tutor', $id, ['retained_course_count' => (int)$tutor['course_count']]);
        Response::success(['retained_course_count' => (int)$tutor['course_count']], 'Tutor deactivated; assigned courses were retained');
    }

    public function getCategories() {
        $this->requireAdmin();
        [$page, $pageSize, $offset] = $this->pageParams();
        $search = $this->searchTerm();
        $where = '';
        $params = [];
        $types = '';
        if ($search !== '') {
            $where = 'WHERE cat.name LIKE ? OR cat.slug LIKE ? OR cat.description LIKE ?';
            $like = '%' . $search . '%';
            array_push($params, $like, $like, $like);
            $types = 'sss';
        }
        $countStmt = $this->conn->prepare("SELECT COUNT(*) AS total FROM categories cat {$where}");
        if ($types !== '') $countStmt->bind_param($types, ...$params);
        $countStmt->execute();
        $total = (int)$countStmt->get_result()->fetch_assoc()['total'];
        $countStmt->close();

        $sql = "SELECT cat.id, cat.name, cat.slug, cat.course_type, cat.description, cat.image, cat.is_active, cat.created_at, cat.updated_at,
                   (SELECT COUNT(*) FROM courses c WHERE c.category_id = cat.id) AS course_count,
                   (SELECT COUNT(*) FROM courses c WHERE c.category_id = cat.id AND c.is_active = 1) AS active_course_count
            FROM categories cat {$where}
                ORDER BY cat.name ASC LIMIT ? OFFSET ?";
        $params[] = $pageSize;
        $params[] = $offset;
        $types .= 'ii';
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param($types, ...$params);
        $stmt->execute();
        $rows = [];
        $result = $stmt->get_result();
        while ($row = $result->fetch_assoc()) $rows[] = $row;
        $stmt->close();
        Response::paginated($rows, $total, $page, $pageSize, 'Categories retrieved successfully');
    }

    public function createCategory() {
        $this->requireAdmin();
        $data = $this->body();
        $this->rejectUnknownFields($data, ['name', 'slug', 'course_type', 'description', 'image', 'is_active']);
        $name = $this->cleanString($data['name'] ?? '', 255, true);
        $slug = $this->slugValue($data['slug'] ?? '', $name);
        $this->assertUnique('categories', 'slug', $slug);
        $courseType = $this->cleanString($data['course_type'] ?? 'tech', 20, true);
        if (!in_array($courseType, ['tech', 'non-tech'], true)) Response::error('Validation failed', ['course_type' => 'Select technical or non-technical'], 422);
        $description = $this->cleanString($data['description'] ?? '', 5000);
        $image = $this->cleanString($data['image'] ?? '', 255);
        $isActive = $this->boolValue($data['is_active'] ?? true, true);
        $stmt = $this->conn->prepare(
            'INSERT INTO categories (name, slug, course_type, description, image, is_active, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())'
        );
        $stmt->bind_param('sssssi', $name, $slug, $courseType, $description, $image, $isActive);
        if (!$stmt->execute()) Response::error('Unable to create category', null, 500);
        $id = $this->conn->insert_id;
        $stmt->close();
        $this->audit('create', 'category', $id, ['slug' => $slug]);
        Response::success(['id' => $id], 'Category created successfully', 201);
    }

    public function updateCategory($id) {
        $this->requireAdmin();
        $id = $this->positiveId($id);
        $data = $this->body();
        $this->rejectUnknownFields($data, ['name', 'slug', 'course_type', 'description', 'image', 'is_active']);
        if (empty($data)) Response::error('No fields to update', null, 422);
        $check = $this->conn->prepare('SELECT id, name FROM categories WHERE id = ?');
        $check->bind_param('i', $id);
        $check->execute();
        $existing = $check->get_result()->fetch_assoc();
        $check->close();
        if (!$existing) Response::error('Category not found', null, 404);

        $updates = [];
        $params = [];
        $types = '';
        foreach (['name' => 255, 'description' => 5000, 'image' => 255] as $field => $max) {
            if (array_key_exists($field, $data)) {
                $updates[] = "{$field} = ?";
                $params[] = $this->cleanString($data[$field] ?? '', $max, $field === 'name');
                $types .= 's';
            }
        }
        if (array_key_exists('slug', $data)) {
            $slug = $this->slugValue($data['slug'], $data['name'] ?? $existing['name']);
            $this->assertUnique('categories', 'slug', $slug, $id);
            $updates[] = 'slug = ?';
            $params[] = $slug;
            $types .= 's';
        }
        if (array_key_exists('course_type', $data)) {
            $courseType = $this->cleanString($data['course_type'], 20, true);
            if (!in_array($courseType, ['tech', 'non-tech'], true)) Response::error('Validation failed', ['course_type' => 'Select technical or non-technical'], 422);
            $updates[] = 'course_type = ?';
            $params[] = $courseType;
            $types .= 's';
        }
        if (array_key_exists('is_active', $data)) {
            $updates[] = 'is_active = ?';
            $params[] = $this->boolValue($data['is_active']);
            $types .= 'i';
        }
        $params[] = $id;
        $types .= 'i';
        $stmt = $this->conn->prepare('UPDATE categories SET ' . implode(', ', $updates) . ', updated_at = NOW() WHERE id = ?');
        $stmt->bind_param($types, ...$params);
        $ok = $stmt->execute();
        $stmt->close();
        if (!$ok) Response::error('Unable to update category', null, 500);
        $this->audit('update', 'category', $id, ['fields' => array_keys($data)]);
        Response::success(['id' => $id], 'Category updated successfully');
    }

    public function deleteCategory($id) {
        $this->requireAdmin();
        $id = $this->positiveId($id);
        $stmt = $this->conn->prepare(
            'SELECT cat.id, (SELECT COUNT(*) FROM courses c WHERE c.category_id = cat.id) AS course_count FROM categories cat WHERE cat.id = ?'
        );
        $stmt->bind_param('i', $id);
        $stmt->execute();
        $category = $stmt->get_result()->fetch_assoc();
        $stmt->close();
        if (!$category) Response::error('Category not found', null, 404);
        $stmt = $this->conn->prepare('UPDATE categories SET is_active = 0, updated_at = NOW() WHERE id = ?');
        $stmt->bind_param('i', $id);
        $ok = $stmt->execute();
        $stmt->close();
        if (!$ok) Response::error('Unable to deactivate category', null, 500);
        $this->audit('deactivate', 'category', $id, ['retained_course_count' => (int)$category['course_count']]);
        Response::success(['retained_course_count' => (int)$category['course_count']], 'Category deactivated; linked courses were retained');
    }

    private function assertCategory($id) {
        $stmt = $this->conn->prepare('SELECT id FROM categories WHERE id = ? AND is_active = 1');
        $stmt->bind_param('i', $id);
        $stmt->execute();
        $valid = $stmt->get_result()->num_rows > 0;
        $stmt->close();
        if (!$valid) Response::error('Validation failed', ['category_id' => 'Select an active category'], 422);
    }

    private function assertTutor($id) {
        $stmt = $this->conn->prepare("SELECT id FROM users WHERE id = ? AND role = 'mentor' AND is_active = 1");
        $stmt->bind_param('i', $id);
        $stmt->execute();
        $valid = $stmt->get_result()->num_rows > 0;
        $stmt->close();
        if (!$valid) Response::error('Validation failed', ['mentor_id' => 'Select an active tutor'], 422);
    }

    private function coursePayload($data, $existing = null) {
        $allowed = [
            'title', 'slug', 'description', 'category_id', 'mentor_id', 'price', 'duration_weeks', 'level', 'mode',
            'certification', 'batch_options', 'locations', 'max_students', 'thumbnail', 'is_active', 'is_free_tutorial', 'modules'
        ];
        $this->rejectUnknownFields($data, $allowed);
        $creating = $existing === null;
        $value = function ($field, $default = null) use ($data, $existing) {
            if (array_key_exists($field, $data)) return $data[$field];
            if ($existing !== null && array_key_exists($field, $existing)) return $existing[$field];
            return $default;
        };

        $title = $this->cleanString($value('title', ''), 255, true);
        $description = $this->cleanString($value('description', ''), 100000, true);
        $slug = $this->slugValue($value('slug', ''), $title);
        $categoryId = $this->positiveId($value('category_id', 0));
        $mentorId = $this->positiveId($value('mentor_id', 0));
        if ($creating || (isset($data['category_id']) && (int)$data['category_id'] !== (int)$existing['category_id'])) {
            $this->assertCategory($categoryId);
        }
        if ($creating || (isset($data['mentor_id']) && (int)$data['mentor_id'] !== (int)$existing['mentor_id'])) {
            $this->assertTutor($mentorId);
        }

        $price = filter_var($value('price', 0), FILTER_VALIDATE_FLOAT);
        $duration = filter_var($value('duration_weeks', 8), FILTER_VALIDATE_INT);
        $maxStudents = filter_var($value('max_students', 50), FILTER_VALIDATE_INT);
        if ($price === false || $price < 0 || $price > 99999999.99) {
            Response::error('Validation failed', ['price' => 'Enter a valid non-negative price'], 422);
        }
        if ($duration === false || $duration < 1 || $duration > 520) {
            Response::error('Validation failed', ['duration_weeks' => 'Must be between 1 and 520'], 422);
        }
        if ($maxStudents === false || $maxStudents < 1 || $maxStudents > 100000) {
            Response::error('Validation failed', ['max_students' => 'Must be between 1 and 100000'], 422);
        }

        return [
            'title' => $title,
            'slug' => $slug,
            'description' => $description,
            'category_id' => $categoryId,
            'mentor_id' => $mentorId,
            'price' => (float)$price,
            'duration_weeks' => (int)$duration,
            'level' => $this->cleanString($value('level', 'all-levels'), 50, true),
            'mode' => $this->cleanString($value('mode', 'Online, Classroom, Hybrid'), 255),
            'certification' => $this->cleanString($value('certification', ''), 500),
            'batch_options' => $this->cleanString($value('batch_options', 'Weekday / Weekend / Flexible'), 255),
            'locations' => $this->cleanString($value('locations', ''), 10000),
            'max_students' => (int)$maxStudents,
            'thumbnail' => $this->cleanString($value('thumbnail', ''), 255),
            'is_active' => $this->boolValue($value('is_active', true), true),
            'is_free_tutorial' => $this->boolValue($value('is_free_tutorial', false), false),
        ];
    }

    private function validateModules($modules) {
        if (!is_array($modules)) Response::error('Validation failed', ['modules' => 'Must be an array'], 422);
        if (count($modules) > self::MAX_SYLLABUS_MODULES) {
            Response::error('Validation failed', ['modules' => 'Too many syllabus modules'], 422);
        }
        $validated = [];
        foreach ($modules as $moduleIndex => $module) {
            if (!is_array($module)) Response::error('Validation failed', ['modules' => 'Each module must be an object'], 422);
            $this->rejectUnknownFields($module, ['id', 'title', 'description', 'sequence', 'lessons']);
            $lessons = $module['lessons'] ?? [];
            if (!is_array($lessons) || count($lessons) > self::MAX_LESSONS_PER_MODULE) {
                Response::error('Validation failed', ['modules' => "Invalid lessons in module " . ($moduleIndex + 1)], 422);
            }
            $validatedLessons = [];
            foreach ($lessons as $lessonIndex => $lesson) {
                if (!is_array($lesson)) Response::error('Validation failed', ['lessons' => 'Each lesson must be an object'], 422);
                $this->rejectUnknownFields($lesson, ['id', 'title', 'description', 'content', 'video_url', 'duration_minutes', 'sequence']);
                $duration = $lesson['duration_minutes'] ?? null;
                if ($duration !== null && $duration !== '') {
                    $duration = filter_var($duration, FILTER_VALIDATE_INT);
                    if ($duration === false || $duration < 0 || $duration > 100000) {
                        Response::error('Validation failed', ['duration_minutes' => 'Enter a valid duration'], 422);
                    }
                } else {
                    $duration = null;
                }
                $validatedLessons[] = [
                    'title' => $this->cleanString($lesson['title'] ?? '', 255, true),
                    'description' => $this->cleanString($lesson['description'] ?? '', 10000),
                    'content' => $this->cleanString($lesson['content'] ?? '', 200000),
                    'video_url' => $this->cleanString($lesson['video_url'] ?? '', 255),
                    'duration_minutes' => $duration,
                    'sequence' => (int)($lesson['sequence'] ?? ($lessonIndex + 1)),
                ];
            }
            $validated[] = [
                'title' => $this->cleanString($module['title'] ?? '', 255, true),
                'description' => $this->cleanString($module['description'] ?? '', 10000),
                'sequence' => (int)($module['sequence'] ?? ($moduleIndex + 1)),
                'lessons' => $validatedLessons,
            ];
        }
        return $validated;
    }

    private function replaceSyllabus($courseId, $modules) {
        $stmt = $this->conn->prepare(
            'DELETE l FROM lessons l INNER JOIN course_modules m ON m.id = l.module_id WHERE m.course_id = ?'
        );
        $stmt->bind_param('i', $courseId);
        $stmt->execute();
        $stmt->close();
        $stmt = $this->conn->prepare('DELETE FROM course_modules WHERE course_id = ?');
        $stmt->bind_param('i', $courseId);
        $stmt->execute();
        $stmt->close();

        $moduleStmt = $this->conn->prepare(
            'INSERT INTO course_modules (course_id, title, description, sequence, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())'
        );
        $lessonStmt = $this->conn->prepare(
            'INSERT INTO lessons (module_id, title, description, content, video_url, sequence, duration_minutes, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())'
        );
        foreach ($modules as $module) {
            $moduleStmt->bind_param('issi', $courseId, $module['title'], $module['description'], $module['sequence']);
            if (!$moduleStmt->execute()) throw new RuntimeException('Unable to save syllabus module');
            $moduleId = $this->conn->insert_id;
            foreach ($module['lessons'] as $lesson) {
                $lessonStmt->bind_param(
                    'issssii', $moduleId, $lesson['title'], $lesson['description'], $lesson['content'],
                    $lesson['video_url'], $lesson['sequence'], $lesson['duration_minutes']
                );
                if (!$lessonStmt->execute()) throw new RuntimeException('Unable to save syllabus lesson');
            }
        }
        $moduleStmt->close();
        $lessonStmt->close();
    }

    private function rawCourse($id) {
        $stmt = $this->conn->prepare('SELECT * FROM courses WHERE id = ?');
        $stmt->bind_param('i', $id);
        $stmt->execute();
        $course = $stmt->get_result()->fetch_assoc();
        $stmt->close();
        return $course ?: null;
    }

    public function getCourses() {
        $this->requireAdmin();
        [$page, $pageSize, $offset] = $this->pageParams();
        $search = $this->searchTerm();
        $status = $_GET['status'] ?? 'all';
        $freeTutorial = $_GET['is_free_tutorial'] ?? 'all';
        if (!in_array($status, ['all', 'active', 'inactive'], true)) Response::error('Invalid status filter', null, 422);
        if (!in_array((string)$freeTutorial, ['all', '0', '1'], true)) Response::error('Invalid free tutorial filter', null, 422);
        $where = 'WHERE 1 = 1';
        $params = [];
        $types = '';
        if ($search !== '') {
            $where .= ' AND (c.title LIKE ? OR c.slug LIKE ? OR cat.name LIKE ? OR u.name LIKE ?)';
            $like = '%' . $search . '%';
            array_push($params, $like, $like, $like, $like);
            $types .= 'ssss';
        }
        if ($status !== 'all') {
            $where .= ' AND c.is_active = ?';
            $params[] = $status === 'active' ? 1 : 0;
            $types .= 'i';
        }
        if ($freeTutorial !== 'all') {
            $where .= ' AND c.is_free_tutorial = ?';
            $params[] = (int)$freeTutorial;
            $types .= 'i';
        }
        $countSql = "SELECT COUNT(*) AS total FROM courses c LEFT JOIN categories cat ON cat.id = c.category_id LEFT JOIN users u ON u.id = c.mentor_id {$where}";
        $countStmt = $this->conn->prepare($countSql);
        if ($types !== '') $countStmt->bind_param($types, ...$params);
        $countStmt->execute();
        $total = (int)$countStmt->get_result()->fetch_assoc()['total'];
        $countStmt->close();
        $sql = "SELECT c.id, c.title, c.slug, c.price, c.duration_weeks, c.level, c.mode, c.thumbnail, c.is_active, c.is_free_tutorial,
                   c.created_at, c.updated_at, c.category_id, c.mentor_id, cat.name AS category_name, u.name AS mentor_name,
                   (SELECT COUNT(*) FROM course_modules m WHERE m.course_id = c.id) AS module_count,
                   (SELECT COUNT(*) FROM lessons l INNER JOIN course_modules m ON m.id = l.module_id WHERE m.course_id = c.id) AS lesson_count
                FROM courses c
                LEFT JOIN categories cat ON cat.id = c.category_id
                LEFT JOIN users u ON u.id = c.mentor_id
                {$where}
            ORDER BY c.updated_at DESC LIMIT ? OFFSET ?";
        $params[] = $pageSize;
        $params[] = $offset;
        $types .= 'ii';
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param($types, ...$params);
        $stmt->execute();
        $rows = [];
        $result = $stmt->get_result();
        while ($row = $result->fetch_assoc()) $rows[] = $row;
        $stmt->close();
        Response::paginated($rows, $total, $page, $pageSize, 'Courses retrieved successfully');
    }

    public function getCourse($id) {
        $this->requireAdmin();
        $id = $this->positiveId($id);
        $stmt = $this->conn->prepare(
            'SELECT c.*, cat.name AS category_name, u.name AS mentor_name FROM courses c LEFT JOIN categories cat ON cat.id = c.category_id LEFT JOIN users u ON u.id = c.mentor_id WHERE c.id = ?'
        );
        $stmt->bind_param('i', $id);
        $stmt->execute();
        $course = $stmt->get_result()->fetch_assoc();
        $stmt->close();
        if (!$course) Response::error('Course not found', null, 404);
        $moduleStmt = $this->conn->prepare(
            'SELECT id, title, description, sequence FROM course_modules WHERE course_id = ? ORDER BY sequence, id'
        );
        $moduleStmt->bind_param('i', $id);
        $moduleStmt->execute();
        $modules = [];
        $moduleResult = $moduleStmt->get_result();
        while ($module = $moduleResult->fetch_assoc()) {
            $lessonStmt = $this->conn->prepare(
                'SELECT id, title, description, content, video_url, sequence, duration_minutes FROM lessons WHERE module_id = ? ORDER BY sequence, id'
            );
            $lessonStmt->bind_param('i', $module['id']);
            $lessonStmt->execute();
            $lessons = [];
            $lessonResult = $lessonStmt->get_result();
            while ($lesson = $lessonResult->fetch_assoc()) $lessons[] = $lesson;
            $lessonStmt->close();
            $module['lessons'] = $lessons;
            $modules[] = $module;
        }
        $moduleStmt->close();
        $course['modules'] = $modules;
        Response::success($course, 'Course retrieved successfully');
    }

    public function createCourse() {
        $this->requireAdmin();
        $data = $this->body();
        $course = $this->coursePayload($data);
        $this->assertUnique('courses', 'slug', $course['slug']);
        $modules = $this->validateModules($data['modules'] ?? []);
        $this->conn->begin_transaction();
        try {
            $stmt = $this->conn->prepare(
                'INSERT INTO courses (title, slug, description, category_id, mentor_id, price, duration_weeks, level, mode, certification, batch_options, locations, max_students, thumbnail, is_active, is_free_tutorial, created_at, updated_at)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())'
            );
            $stmt->bind_param(
                'sssiidisssssisii', $course['title'], $course['slug'], $course['description'], $course['category_id'],
                $course['mentor_id'], $course['price'], $course['duration_weeks'], $course['level'], $course['mode'],
                $course['certification'], $course['batch_options'], $course['locations'], $course['max_students'],
                $course['thumbnail'], $course['is_active'], $course['is_free_tutorial']
            );
            if (!$stmt->execute()) throw new RuntimeException('Unable to create course');
            $id = $this->conn->insert_id;
            $stmt->close();
            $this->replaceSyllabus($id, $modules);
            $this->conn->commit();
        } catch (Throwable $e) {
            $this->conn->rollback();
            throw $e;
        }
        $this->audit('create', 'course', $id, ['slug' => $course['slug'], 'module_count' => count($modules)]);
        Response::success(['id' => $id], 'Course created successfully', 201);
    }

    public function updateCourse($id) {
        $this->requireAdmin();
        $id = $this->positiveId($id);
        $existing = $this->rawCourse($id);
        if (!$existing) Response::error('Course not found', null, 404);
        $data = $this->body();
        if (empty($data)) Response::error('No fields to update', null, 422);
        $course = $this->coursePayload($data, $existing);
        $this->assertUnique('courses', 'slug', $course['slug'], $id);
        $replaceModules = array_key_exists('modules', $data);
        $modules = $replaceModules ? $this->validateModules($data['modules']) : null;
        $this->conn->begin_transaction();
        try {
            $stmt = $this->conn->prepare(
                'UPDATE courses SET title = ?, slug = ?, description = ?, category_id = ?, mentor_id = ?, price = ?, duration_weeks = ?, level = ?, mode = ?, certification = ?, batch_options = ?, locations = ?, max_students = ?, thumbnail = ?, is_active = ?, is_free_tutorial = ?, updated_at = NOW() WHERE id = ?'
            );
            $stmt->bind_param(
                'sssiidisssssisiii', $course['title'], $course['slug'], $course['description'], $course['category_id'],
                $course['mentor_id'], $course['price'], $course['duration_weeks'], $course['level'], $course['mode'],
                $course['certification'], $course['batch_options'], $course['locations'], $course['max_students'],
                $course['thumbnail'], $course['is_active'], $course['is_free_tutorial'], $id
            );
            if (!$stmt->execute()) throw new RuntimeException('Unable to update course');
            $stmt->close();
            if ($replaceModules) $this->replaceSyllabus($id, $modules);
            $this->conn->commit();
        } catch (Throwable $e) {
            $this->conn->rollback();
            throw $e;
        }
        $this->audit('update', 'course', $id, ['fields' => array_keys($data), 'syllabus_replaced' => $replaceModules]);
        Response::success(['id' => $id], 'Course updated successfully');
    }

    public function deleteCourse($id) {
        $this->requireAdmin();
        $id = $this->positiveId($id);
        if (!$this->rawCourse($id)) Response::error('Course not found', null, 404);
        $stmt = $this->conn->prepare('UPDATE courses SET is_active = 0, updated_at = NOW() WHERE id = ?');
        $stmt->bind_param('i', $id);
        $ok = $stmt->execute();
        $stmt->close();
        if (!$ok) Response::error('Unable to deactivate course', null, 500);
        $this->audit('deactivate', 'course', $id);
        Response::success(null, 'Course deactivated successfully');
    }

    public function publicFounders() {
        $this->ensureAdminTables();
        $result = $this->conn->query('SELECT * FROM admin_founders WHERE is_active = 1 ORDER BY sort_order ASC, id ASC');
        $rows = [];
        while ($result && $row = $result->fetch_assoc()) $rows[] = $row;
        Response::success($rows, 'Founders retrieved successfully');
    }

    public function getFounders() {
        $this->requireAdmin();
        [$page, $pageSize, $offset] = $this->pageParams();
        $search = $this->searchTerm();
        $where = '';
        $like = '%' . $search . '%';
        if ($search !== '') $where = 'WHERE name LIKE ? OR role LIKE ? OR expertise LIKE ? OR location LIKE ?';
        $countStmt = $this->conn->prepare("SELECT COUNT(*) AS total FROM admin_founders {$where}");
        if ($search !== '') $countStmt->bind_param('ssss', $like, $like, $like, $like);
        $countStmt->execute();
        $total = (int)$countStmt->get_result()->fetch_assoc()['total'];
        $countStmt->close();
        $stmt = $this->conn->prepare("SELECT * FROM admin_founders {$where} ORDER BY sort_order ASC, id ASC LIMIT ? OFFSET ?");
        if ($search !== '') $stmt->bind_param('ssssii', $like, $like, $like, $like, $pageSize, $offset); else $stmt->bind_param('ii', $pageSize, $offset);
        $stmt->execute();
        $rows = [];
        $result = $stmt->get_result();
        while ($row = $result->fetch_assoc()) $rows[] = $row;
        $stmt->close();
        Response::paginated($rows, $total, $page, $pageSize, 'Founders retrieved successfully');
    }

    private function founderPayload($data, $existing = null) {
        $this->rejectUnknownFields($data, ['name', 'role', 'expertise', 'experience', 'location', 'country', 'photo_url', 'linkedin_url', 'bio', 'quote', 'sort_order', 'is_active']);
        $value = function ($field, $default = null) use ($data, $existing) {
            if (array_key_exists($field, $data)) return $data[$field];
            if ($existing && array_key_exists($field, $existing)) return $existing[$field];
            return $default;
        };
        $sortOrder = filter_var($value('sort_order', 0), FILTER_VALIDATE_INT, ['options' => ['min_range' => 0, 'max_range' => 9999]]);
        if ($sortOrder === false) Response::error('Validation failed', ['sort_order' => 'Must be between 0 and 9999'], 422);
        $country = strtoupper($this->cleanString($value('country', ''), 2));
        return [
            'name' => $this->cleanString($value('name', ''), 255, true), 'role' => $this->cleanString($value('role', ''), 255, true),
            'expertise' => $this->cleanString($value('expertise', ''), 500), 'experience' => $this->cleanString($value('experience', ''), 100),
            'location' => $this->cleanString($value('location', ''), 255), 'country' => $country,
            'photo_url' => $this->cleanString($value('photo_url', ''), 1000), 'linkedin_url' => $this->cleanString($value('linkedin_url', ''), 1000),
            'bio' => $this->cleanString($value('bio', ''), 5000), 'quote' => $this->cleanString($value('quote', ''), 1000),
            'sort_order' => (int)$sortOrder, 'is_active' => $this->boolValue($value('is_active', true), true),
        ];
    }

    public function createFounder() {
        $this->requireAdmin();
        $item = $this->founderPayload($this->body());
        $stmt = $this->conn->prepare('INSERT INTO admin_founders (name, role, expertise, experience, location, country, photo_url, linkedin_url, bio, quote, sort_order, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
        $stmt->bind_param('ssssssssssii', $item['name'], $item['role'], $item['expertise'], $item['experience'], $item['location'], $item['country'], $item['photo_url'], $item['linkedin_url'], $item['bio'], $item['quote'], $item['sort_order'], $item['is_active']);
        if (!$stmt->execute()) Response::error('Unable to create founder', null, 500);
        $id = $this->conn->insert_id; $stmt->close(); $this->audit('create', 'founder', $id);
        Response::success(['id' => $id], 'Founder created successfully', 201);
    }

    public function updateFounder($id) {
        $this->requireAdmin(); $id = $this->positiveId($id);
        $stmt = $this->conn->prepare('SELECT * FROM admin_founders WHERE id = ?'); $stmt->bind_param('i', $id); $stmt->execute();
        $existing = $stmt->get_result()->fetch_assoc(); $stmt->close();
        if (!$existing) Response::error('Founder not found', null, 404);
        $item = $this->founderPayload($this->body(), $existing);
        $stmt = $this->conn->prepare('UPDATE admin_founders SET name=?, role=?, expertise=?, experience=?, location=?, country=?, photo_url=?, linkedin_url=?, bio=?, quote=?, sort_order=?, is_active=?, updated_at=NOW() WHERE id=?');
        $stmt->bind_param('ssssssssssiii', $item['name'], $item['role'], $item['expertise'], $item['experience'], $item['location'], $item['country'], $item['photo_url'], $item['linkedin_url'], $item['bio'], $item['quote'], $item['sort_order'], $item['is_active'], $id);
        if (!$stmt->execute()) Response::error('Unable to update founder', null, 500);
        $stmt->close(); $this->audit('update', 'founder', $id); Response::success(['id' => $id], 'Founder updated successfully');
    }

    public function deleteFounder($id) {
        $this->requireAdmin(); $id = $this->positiveId($id);
        $stmt = $this->conn->prepare('DELETE FROM admin_founders WHERE id = ?'); $stmt->bind_param('i', $id); $stmt->execute();
        if ($stmt->affected_rows === 0) Response::error('Founder not found', null, 404);
        $stmt->close(); $this->audit('delete', 'founder', $id); Response::success(null, 'Founder deleted successfully');
    }

    public function publicBlogs($slug = null) {
        $this->ensureAdminTables();
        if ($slug !== null) {
            $stmt = $this->conn->prepare('SELECT * FROM admin_blogs WHERE slug = ? AND is_published = 1 LIMIT 1');
            $stmt->bind_param('s', $slug); $stmt->execute(); $row = $stmt->get_result()->fetch_assoc(); $stmt->close();
            if (!$row) Response::error('Blog not found', null, 404);
            Response::success($row, 'Blog retrieved successfully');
        }
        $result = $this->conn->query('SELECT * FROM admin_blogs WHERE is_published = 1 ORDER BY published_at DESC, id DESC');
        $rows = []; while ($result && $row = $result->fetch_assoc()) $rows[] = $row;
        Response::success($rows, 'Blogs retrieved successfully');
    }

    public function getBlogs() {
        $this->requireAdmin(); [$page, $pageSize, $offset] = $this->pageParams(); $search = $this->searchTerm();
        $where = ''; $like = '%' . $search . '%';
        if ($search !== '') $where = 'WHERE title LIKE ? OR category LIKE ? OR author LIKE ? OR excerpt LIKE ? OR content LIKE ?';
        $countStmt = $this->conn->prepare("SELECT COUNT(*) AS total FROM admin_blogs {$where}");
        if ($search !== '') $countStmt->bind_param('sssss', $like, $like, $like, $like, $like);
        $countStmt->execute(); $total = (int)$countStmt->get_result()->fetch_assoc()['total']; $countStmt->close();
        $stmt = $this->conn->prepare("SELECT * FROM admin_blogs {$where} ORDER BY published_at DESC, id DESC LIMIT ? OFFSET ?");
        if ($search !== '') $stmt->bind_param('sssssii', $like, $like, $like, $like, $like, $pageSize, $offset); else $stmt->bind_param('ii', $pageSize, $offset);
        $stmt->execute(); $rows = []; $result = $stmt->get_result(); while ($row = $result->fetch_assoc()) $rows[] = $row; $stmt->close();
        Response::paginated($rows, $total, $page, $pageSize, 'Blogs retrieved successfully');
    }

    private function blogPayload($data, $existing = null) {
        $this->rejectUnknownFields($data, ['title', 'slug', 'excerpt', 'content', 'image_url', 'author', 'category', 'read_time', 'source_platform', 'external_url', 'reference_url', 'published_at', 'is_published']);
        $value = function ($field, $default = null) use ($data, $existing) { if (array_key_exists($field, $data)) return $data[$field]; if ($existing && array_key_exists($field, $existing)) return $existing[$field]; return $default; };
        $title = $this->cleanString($value('title', ''), 255, true);
        $content = $this->cleanString($value('content', ''), 50000); $externalUrl = $this->cleanString($value('external_url', ''), 1000);
        if ($content === '' && $externalUrl === '') Response::error('Validation failed', ['content' => 'Add website content or an external post link'], 422);
        $source = $this->cleanString($value('source_platform', 'website'), 30, true);
        if (!in_array($source, ['website', 'linkedin', 'facebook', 'instagram', 'youtube', 'other'], true)) Response::error('Validation failed', ['source_platform' => 'Invalid platform'], 422);
        $publishedAt = $this->cleanString($value('published_at', date('Y-m-d')), 30, true);
        if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $publishedAt)) Response::error('Validation failed', ['published_at' => 'Use YYYY-MM-DD'], 422);
        return [
            'title' => $title, 'slug' => $this->slugValue($value('slug', ''), $title),
            'excerpt' => $this->cleanString($value('excerpt', ''), 1000, true), 'content' => $content,
            'image_url' => $this->cleanString($value('image_url', ''), 1000), 'author' => $this->cleanString($value('author', ''), 255, true),
            'category' => $this->cleanString($value('category', ''), 100, true), 'read_time' => $this->cleanString($value('read_time', ''), 50),
            'source_platform' => $source, 'external_url' => $externalUrl, 'reference_url' => $this->cleanString($value('reference_url', ''), 1000),
            'published_at' => $publishedAt, 'is_published' => $this->boolValue($value('is_published', false)),
        ];
    }

    public function createBlog() {
        $this->requireAdmin(); $item = $this->blogPayload($this->body()); $this->assertUnique('admin_blogs', 'slug', $item['slug']);
        $stmt = $this->conn->prepare('INSERT INTO admin_blogs (title, slug, excerpt, content, image_url, author, category, read_time, source_platform, external_url, reference_url, published_at, is_published) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
        $stmt->bind_param('ssssssssssssi', $item['title'], $item['slug'], $item['excerpt'], $item['content'], $item['image_url'], $item['author'], $item['category'], $item['read_time'], $item['source_platform'], $item['external_url'], $item['reference_url'], $item['published_at'], $item['is_published']);
        if (!$stmt->execute()) Response::error('Unable to create blog', null, 500);
        $id = $this->conn->insert_id; $stmt->close(); $this->audit('create', 'blog', $id); Response::success(['id' => $id], 'Blog created successfully', 201);
    }

    public function updateBlog($id) {
        $this->requireAdmin(); $id = $this->positiveId($id);
        $stmt = $this->conn->prepare('SELECT * FROM admin_blogs WHERE id = ?'); $stmt->bind_param('i', $id); $stmt->execute(); $existing = $stmt->get_result()->fetch_assoc(); $stmt->close();
        if (!$existing) Response::error('Blog not found', null, 404);
        $item = $this->blogPayload($this->body(), $existing); $this->assertUnique('admin_blogs', 'slug', $item['slug'], $id);
        $stmt = $this->conn->prepare('UPDATE admin_blogs SET title=?, slug=?, excerpt=?, content=?, image_url=?, author=?, category=?, read_time=?, source_platform=?, external_url=?, reference_url=?, published_at=?, is_published=?, updated_at=NOW() WHERE id=?');
        $stmt->bind_param('ssssssssssssii', $item['title'], $item['slug'], $item['excerpt'], $item['content'], $item['image_url'], $item['author'], $item['category'], $item['read_time'], $item['source_platform'], $item['external_url'], $item['reference_url'], $item['published_at'], $item['is_published'], $id);
        if (!$stmt->execute()) Response::error('Unable to update blog', null, 500);
        $stmt->close(); $this->audit('update', 'blog', $id); Response::success(['id' => $id], 'Blog updated successfully');
    }

    public function deleteBlog($id) {
        $this->requireAdmin(); $id = $this->positiveId($id);
        $stmt = $this->conn->prepare('DELETE FROM admin_blogs WHERE id = ?'); $stmt->bind_param('i', $id); $stmt->execute();
        if ($stmt->affected_rows === 0) Response::error('Blog not found', null, 404);
        $stmt->close(); $this->audit('delete', 'blog', $id); Response::success(null, 'Blog deleted successfully');
    }

    public function getFeedback() {
        $this->requireAdmin();
        [$page, $pageSize, $offset] = $this->pageParams();
        $search = $this->searchTerm();
        $status = $_GET['status'] ?? 'all';
        if (!in_array($status, ['all', 'new', 'reviewed', 'resolved'], true)) Response::error('Invalid status filter', null, 422);
        $where = 'WHERE 1 = 1';
        $params = [];
        $types = '';
        if ($search !== '') {
            $where .= ' AND (f.name LIKE ? OR f.email LIKE ? OR f.role LIKE ? OR f.subject LIKE ? OR f.message LIKE ?)';
            $like = '%' . $search . '%';
            array_push($params, $like, $like, $like, $like, $like);
            $types .= 'sssss';
        }
        if ($status !== 'all') {
            $where .= ' AND f.status = ?';
            $params[] = $status;
            $types .= 's';
        }
        $countStmt = $this->conn->prepare("SELECT COUNT(*) AS total FROM admin_feedback f {$where}");
        if ($types !== '') $countStmt->bind_param($types, ...$params);
        $countStmt->execute();
        $total = (int)$countStmt->get_result()->fetch_assoc()['total'];
        $countStmt->close();
        $sql = "SELECT f.*, c.title AS course_title FROM admin_feedback f LEFT JOIN courses c ON c.id = f.course_id {$where} ORDER BY f.created_at DESC LIMIT ? OFFSET ?";
        $params[] = $pageSize;
        $params[] = $offset;
        $types .= 'ii';
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param($types, ...$params);
        $stmt->execute();
        $rows = [];
        $result = $stmt->get_result();
        while ($row = $result->fetch_assoc()) $rows[] = $row;
        $stmt->close();
        Response::paginated($rows, $total, $page, $pageSize, 'Feedback retrieved successfully');
    }

    private function feedbackPayload($data, $existing = null) {
        $this->rejectUnknownFields($data, ['name', 'email', 'role', 'phone', 'course_id', 'subject', 'message', 'rating', 'status', 'is_published']);
        $value = function ($field, $default = null) use ($data, $existing) {
            if (array_key_exists($field, $data)) return $data[$field];
            if ($existing && array_key_exists($field, $existing)) return $existing[$field];
            return $default;
        };
        $rating = $value('rating');
        if ($rating !== null && $rating !== '') {
            $rating = filter_var($rating, FILTER_VALIDATE_INT);
            if ($rating === false || $rating < 1 || $rating > 5) Response::error('Validation failed', ['rating' => 'Rating must be 1 to 5'], 422);
        } else $rating = null;
        $courseId = $value('course_id');
        if ($courseId !== null && $courseId !== '') $courseId = $this->positiveId($courseId); else $courseId = null;
        $status = (string)$value('status', 'new');
        if (!in_array($status, ['new', 'reviewed', 'resolved'], true)) Response::error('Validation failed', ['status' => 'Invalid feedback status'], 422);
        return [
            'name' => $this->cleanString($value('name', ''), 255, true),
            'email' => $this->emailValue($value('email', '')),
            'role' => $this->cleanString($value('role', ''), 100),
            'phone' => $this->cleanString($value('phone', ''), 30),
            'course_id' => $courseId,
            'subject' => $this->cleanString($value('subject', ''), 255),
            'message' => $this->cleanString($value('message', ''), 20000, true),
            'rating' => $rating,
            'status' => $status,
            'is_published' => $this->boolValue($value('is_published', false)),
        ];
    }

    public function createFeedback() {
        $this->requireAdmin();
        $feedback = $this->feedbackPayload($this->body());
        $stmt = $this->conn->prepare(
            'INSERT INTO admin_feedback (name, email, role, phone, course_id, subject, message, rating, status, is_published, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())'
        );
        $stmt->bind_param('ssssissisi', $feedback['name'], $feedback['email'], $feedback['role'], $feedback['phone'], $feedback['course_id'], $feedback['subject'], $feedback['message'], $feedback['rating'], $feedback['status'], $feedback['is_published']);
        if (!$stmt->execute()) Response::error('Unable to create feedback', null, 500);
        $id = $this->conn->insert_id;
        $stmt->close();
        $this->audit('create', 'feedback', $id);
        Response::success(['id' => $id], 'Feedback created successfully', 201);
    }

    public function updateFeedback($id) {
        $this->requireAdmin();
        $id = $this->positiveId($id);
        $stmt = $this->conn->prepare('SELECT * FROM admin_feedback WHERE id = ?');
        $stmt->bind_param('i', $id);
        $stmt->execute();
        $existing = $stmt->get_result()->fetch_assoc();
        $stmt->close();
        if (!$existing) Response::error('Feedback not found', null, 404);
        $data = $this->body();
        if (empty($data)) Response::error('No fields to update', null, 422);
        $feedback = $this->feedbackPayload($data, $existing);
        $stmt = $this->conn->prepare(
            'UPDATE admin_feedback SET name = ?, email = ?, role = ?, phone = ?, course_id = ?, subject = ?, message = ?, rating = ?, status = ?, is_published = ?, updated_at = NOW() WHERE id = ?'
        );
        $stmt->bind_param('ssssissisii', $feedback['name'], $feedback['email'], $feedback['role'], $feedback['phone'], $feedback['course_id'], $feedback['subject'], $feedback['message'], $feedback['rating'], $feedback['status'], $feedback['is_published'], $id);
        $ok = $stmt->execute();
        $stmt->close();
        if (!$ok) Response::error('Unable to update feedback', null, 500);
        $this->audit('update', 'feedback', $id, ['fields' => array_keys($data)]);
        Response::success(['id' => $id], 'Feedback updated successfully');
    }

    public function deleteFeedback($id) {
        $this->requireAdmin();
        $id = $this->positiveId($id);
        $stmt = $this->conn->prepare('DELETE FROM admin_feedback WHERE id = ?');
        $stmt->bind_param('i', $id);
        $stmt->execute();
        $affected = $stmt->affected_rows;
        $stmt->close();
        if ($affected === 0) Response::error('Feedback not found', null, 404);
        $this->audit('delete', 'feedback', $id);
        Response::success(null, 'Feedback deleted permanently');
    }

    public function getRecords($type) {
        $this->requireAdmin();
        $allowedTypes = ['users', 'leads', 'enrollments', 'payments'];
        if (!in_array($type, $allowedTypes, true)) Response::error('Unknown record type', null, 404);
        [$page, $pageSize, $offset] = $this->pageParams();
        if (!$this->tableExists($type)) Response::paginated([], 0, $page, $pageSize, 'No records available');
        $search = $this->searchTerm();
        $configs = [
            'users' => [
                'from' => 'users r',
                'select' => 'r.id, r.name, r.email, r.phone, r.role, r.is_active, r.created_at',
                'search' => ['r.name', 'r.email', 'r.phone', 'r.role'],
                'order' => 'r.created_at DESC',
            ],
            'leads' => [
                'from' => 'leads r',
                'select' => 'r.id, r.name, r.email, r.phone, r.course_interested, r.message, r.source, r.status, r.created_at',
                'search' => ['r.name', 'r.email', 'r.phone', 'r.course_interested', 'r.status'],
                'order' => 'r.created_at DESC',
            ],
            'enrollments' => [
                'from' => 'enrollments r LEFT JOIN users u ON u.id = r.student_id LEFT JOIN courses c ON c.id = r.course_id',
                'select' => 'r.id, r.status, r.progress_percentage, r.enrollment_date, r.completion_date, u.name AS student_name, u.email AS student_email, c.title AS course_title',
                'search' => ['u.name', 'u.email', 'c.title', 'r.status'],
                'order' => 'r.enrollment_date DESC',
            ],
            'payments' => [
                'from' => 'payments r LEFT JOIN users u ON u.id = r.student_id LEFT JOIN courses c ON c.id = r.course_id',
                'select' => 'r.id, r.amount, r.payment_method, r.transaction_id, r.status, r.created_at, u.name AS student_name, u.email AS student_email, c.title AS course_title',
                'search' => ['u.name', 'u.email', 'c.title', 'r.transaction_id', 'r.status'],
                'order' => 'r.created_at DESC',
            ],
        ];
        $config = $configs[$type];
        $where = '';
        $params = [];
        $types = '';
        if ($search !== '') {
            $parts = [];
            $like = '%' . $search . '%';
            foreach ($config['search'] as $column) {
                $parts[] = "{$column} LIKE ?";
                $params[] = $like;
                $types .= 's';
            }
            $where = 'WHERE ' . implode(' OR ', $parts);
        }
        $countStmt = $this->conn->prepare("SELECT COUNT(*) AS total FROM {$config['from']} {$where}");
        if ($types !== '') $countStmt->bind_param($types, ...$params);
        $countStmt->execute();
        $total = (int)$countStmt->get_result()->fetch_assoc()['total'];
        $countStmt->close();
        $params[] = $pageSize;
        $params[] = $offset;
        $types .= 'ii';
        $stmt = $this->conn->prepare("SELECT {$config['select']} FROM {$config['from']} {$where} ORDER BY {$config['order']} LIMIT ? OFFSET ?");
        $stmt->bind_param($types, ...$params);
        $stmt->execute();
        $rows = [];
        $result = $stmt->get_result();
        while ($row = $result->fetch_assoc()) $rows[] = $row;
        $stmt->close();
        Response::paginated($rows, $total, $page, $pageSize, ucfirst($type) . ' retrieved successfully');
    }
}
?>
