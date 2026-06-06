<?php
/**
 * User Model
 * Database operations for users
 */

class UserModel {
    protected $conn;
    protected $table = 'users';

    public function __construct($conn) {
        $this->conn = $conn;
    }

    /**
     * Create user
     */
    public function create($data) {
        $query = "INSERT INTO " . $this->table . " 
                  (name, email, password, phone, role, profile_image, bio, is_active, created_at, updated_at) 
                  VALUES (?, ?, ?, ?, ?, ?, ?, 1, NOW(), NOW())";
        
        $stmt = $this->conn->prepare($query);
        if (!$stmt) {
            return false;
        }

        $stmt->bind_param(
            'ssssiss',
            $data['name'],
            $data['email'],
            $data['password'],
            $data['phone'],
            $data['role'],
            $data['profile_image'],
            $data['bio']
        );

        if ($stmt->execute()) {
            $stmt->close();
            return $this->conn->insert_id;
        }

        $stmt->close();
        return false;
    }

    /**
     * Get user by email
     */
    public function getByEmail($email) {
        $query = "SELECT * FROM " . $this->table . " WHERE email = ? AND is_active = 1";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param('s', $email);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows === 0) {
            $stmt->close();
            return null;
        }

        $user = $result->fetch_assoc();
        $stmt->close();
        return $user;
    }

    /**
     * Get user by ID
     */
    public function getById($id) {
        $query = "SELECT id, name, email, phone, role, profile_image, bio, created_at FROM " . $this->table . " WHERE id = ? AND is_active = 1";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param('i', $id);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows === 0) {
            $stmt->close();
            return null;
        }

        $user = $result->fetch_assoc();
        $stmt->close();
        return $user;
    }

    /**
     * Update user
     */
    public function update($id, $data) {
        $query = "UPDATE " . $this->table . " SET ";
        $params = [];
        $types = '';

        foreach ($data as $key => $value) {
            if ($key !== 'id' && $key !== 'created_at') {
                $query .= $key . " = ?, ";
                $params[] = $value;
                $types .= 's';
            }
        }

        $query = rtrim($query, ', ');
        $query .= " WHERE id = ?";
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
     * Get all users (for admin)
     */
    public function getAll($page = 1, $pageSize = DEFAULT_PAGE_SIZE) {
        $offset = ($page - 1) * $pageSize;
        
        // Get total count
        $countQuery = "SELECT COUNT(*) as total FROM " . $this->table . " WHERE is_active = 1";
        $countResult = $this->conn->query($countQuery);
        $total = $countResult->fetch_assoc()['total'];

        // Get paginated results
        $query = "SELECT id, name, email, phone, role, profile_image, created_at FROM " . $this->table . " 
                  WHERE is_active = 1 
                  ORDER BY created_at DESC 
                  LIMIT ? OFFSET ?";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param('ii', $pageSize, $offset);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $users = [];
        while ($row = $result->fetch_assoc()) {
            $users[] = $row;
        }

        $stmt->close();
        return ['data' => $users, 'total' => $total];
    }
}
?>
