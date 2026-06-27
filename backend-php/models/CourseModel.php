<?php
/**
 * Course Model
 * Database operations for courses
 */

class CourseModel {
    protected $conn;
    protected $table = 'courses';

    public function __construct($conn) {
        $this->conn = $conn;
    }

    /**
     * Get all courses with pagination
     */
    public function getAll($page = 1, $pageSize = DEFAULT_PAGE_SIZE, $filters = []) {
        $offset = ($page - 1) * $pageSize;
        $whereClause = "WHERE is_active = 1";
        $params = [];
        $types = '';

        // Apply filters
        if (!empty($filters['search'])) {
            $whereClause .= " AND (c.title LIKE ? OR c.description LIKE ? OR cat.name LIKE ?)";
            $searchTerm = '%' . $filters['search'] . '%';
            $params[] = $searchTerm;
            $params[] = $searchTerm;
            $params[] = $searchTerm;
            $types .= 'sss';
        }

        // Category filter: by slug (corporate/technical/non-technical)
        if (!empty($filters['category'])) {
            $whereClause .= " AND cat.slug = ?";
            $params[] = strtolower($filters['category']);
            $types .= 's';
        } elseif (!empty($filters['main_category'])) {
            $whereClause .= " AND cat.slug = ?";
            $params[] = strtolower($filters['main_category']);
            $types .= 's';
        } elseif (!empty($filters['category_id'])) {
            $whereClause .= " AND c.category_id = ?";
            $params[] = $filters['category_id'];
            $types .= 'i';
        }

        // Level filter
        if (!empty($filters['level'])) {
            $whereClause .= " AND c.level = ?";
            $params[] = strtolower($filters['level']);
            $types .= 's';
        }

        // Mode filter
        if (!empty($filters['mode'])) {
            $whereClause .= " AND LOWER(c.mode) LIKE ?";
            $params[] = '%' . strtolower($filters['mode']) . '%';
            $types .= 's';
        }

        if (!empty($filters['mentor_id'])) {
            $whereClause .= " AND c.mentor_id = ?";
            $params[] = $filters['mentor_id'];
            $types .= 'i';
        }

        // Get total count (with JOINs for category slug filter)
        $countQuery = "SELECT COUNT(*) as total FROM " . $this->table . " c
                       LEFT JOIN categories cat ON c.category_id = cat.id
                       " . $whereClause;
        $countStmt = $this->conn->prepare($countQuery);
        if (!empty($params)) {
            $countStmt->bind_param($types, ...$params);
        }
        $countStmt->execute();
        $total = $countStmt->get_result()->fetch_assoc()['total'];
        $countStmt->close();

        // Get paginated results
        $query = "SELECT c.*, u.name as mentor_name, cat.name as category_name 
                  FROM " . $this->table . " c
                  LEFT JOIN users u ON c.mentor_id = u.id
                  LEFT JOIN categories cat ON c.category_id = cat.id
                  " . $whereClause . "
                  ORDER BY c.created_at DESC
                  LIMIT ? OFFSET ?";

        $params[] = $pageSize;
        $params[] = $offset;
        $types .= 'ii';

        $stmt = $this->conn->prepare($query);
        if (!empty($params)) {
            $stmt->bind_param($types, ...$params);
        }
        $stmt->execute();
        $result = $stmt->get_result();

        $courses = [];
        while ($row = $result->fetch_assoc()) {
            $courses[] = $row;
        }

        $stmt->close();
        return ['data' => $courses, 'total' => $total];
    }

    /**
     * Get course by ID
     */
    public function getById($id) {
        $query = "SELECT c.*, u.name as mentor_name, u.email as mentor_email, u.phone as mentor_phone,
                         cat.name as category_name
                  FROM " . $this->table . " c
                  LEFT JOIN users u ON c.mentor_id = u.id
                  LEFT JOIN categories cat ON c.category_id = cat.id
                  WHERE c.id = ? AND c.is_active = 1";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param('i', $id);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows === 0) {
            $stmt->close();
            return null;
        }

        $course = $result->fetch_assoc();
        $stmt->close();
        return $course;
    }

    /**
     * Create course (admin only)
     */
    public function create($data) {
        $query = "INSERT INTO " . $this->table . "
                  (title, slug, description, category_id, mentor_id, price, duration_weeks, 
                   level, max_students, thumbnail, is_active, created_at, updated_at)
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, NOW(), NOW())";

        $stmt = $this->conn->prepare($query);
        if (!$stmt) {
            return false;
        }

        $stmt->bind_param(
            'sssiiidiss',
            $data['title'],
            $data['slug'],
            $data['description'],
            $data['category_id'],
            $data['mentor_id'],
            $data['price'],
            $data['duration_weeks'],
            $data['level'],
            $data['max_students'],
            $data['thumbnail']
        );

        if ($stmt->execute()) {
            $courseId = $this->conn->insert_id;
            $stmt->close();
            return $courseId;
        }

        $stmt->close();
        return false;
    }

    /**
     * Update course
     */
    public function update($id, $data) {
        $updates = [];
        $params = [];
        $types = '';

        foreach ($data as $key => $value) {
            if ($key !== 'id' && $key !== 'created_at') {
                $updates[] = $key . " = ?";
                $params[] = $value;
                $types .= is_numeric($value) ? 'i' : 's';
            }
        }

        if (empty($updates)) {
            return false;
        }

        $query = "UPDATE " . $this->table . " SET " . implode(', ', $updates);
        $query .= ", updated_at = NOW() WHERE id = ?";
        
        $params[] = $id;
        $types .= 'i';

        $stmt = $this->conn->prepare($query);
        if (!$stmt) {
            return false;
        }

        $stmt->bind_param($types, ...$params);
        $result = $stmt->execute();
        $stmt->close();

        return $result;
    }

    /**
     * Delete course (soft delete)
     */
    public function delete($id) {
        $query = "UPDATE " . $this->table . " SET is_active = 0, updated_at = NOW() WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param('i', $id);
        $result = $stmt->execute();
        $stmt->close();
        return $result;
    }
}
?>
