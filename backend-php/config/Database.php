<?php
/**
 * Database Connection Class
 * MySQL Database Handler for Hostinger Shared Hosting
 */

class Database {
    private $host = 'localhost';
    private $db_name = 'trainermentors_db';
    private $db_user = 'root';
    private $db_pass = '';
    private $conn;

    // Constructor - set credentials from environment or .env file
    public function __construct() {
        $this->loadEnv();
    }

    // Load environment variables from .env file
    private function loadEnv() {
        $envFile = dirname(__DIR__) . '/.env';
        if (file_exists($envFile)) {
            $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
            foreach ($lines as $line) {
                if (strpos($line, '=') !== false && strpos($line, '#') !== 0) {
                    list($key, $value) = explode('=', $line, 2);
                    $key = trim($key);
                    $value = trim($value, '\'"');
                    
                    if ($key === 'DB_HOST') $this->host = $value;
                    if ($key === 'DB_NAME') $this->db_name = $value;
                    if ($key === 'DB_USER') $this->db_user = $value;
                    if ($key === 'DB_PASS') $this->db_pass = $value;
                }
            }
        }
    }

    // Connect to Database
    public function connect() {
        $this->conn = null;

        try {
            $this->conn = new mysqli(
                $this->host,
                $this->db_user,
                $this->db_pass,
                $this->db_name
            );

            if ($this->conn->connect_error) {
                throw new Exception('Connection Error: ' . $this->conn->connect_error);
            }

            // Set charset to UTF-8
            $this->conn->set_charset("utf8mb4");

            return $this->conn;
        } catch (Exception $e) {
            http_response_code(500);
            die(json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]));
        }
    }

    // Get connection
    public function getConnection() {
        return $this->conn;
    }

    // Close connection
    public function closeConnection() {
        if ($this->conn) {
            $this->conn->close();
        }
    }
}
?>
