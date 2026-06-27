<?php
/**
 * Category Model
 * Database operations for categories
 */

class CategoryModel {
    protected $conn;
    protected $table = 'categories';

    public function __construct($conn) {
        $this->conn = $conn;
    }

    /**
     * Get active categories with active course counts
     */
    public function getAllWithCourseCounts() {
        $query = "SELECT cat.id, cat.name, cat.slug, cat.description,
                         COUNT(c.id) AS course_count
                  FROM " . $this->table . " cat
                  LEFT JOIN courses c ON c.category_id = cat.id AND c.is_active = 1
                  WHERE cat.is_active = 1
                  GROUP BY cat.id, cat.name, cat.slug, cat.description
                  ORDER BY cat.name ASC";

        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        $result = $stmt->get_result();

        $categories = [];
        while ($row = $result->fetch_assoc()) {
            $row['course_count'] = intval($row['course_count']);
            $categories[] = $row;
        }

        $stmt->close();
        return $categories;
    }
}
?>