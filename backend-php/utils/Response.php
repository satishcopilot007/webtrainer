<?php
/**
 * API Response Handler
 * Standardized JSON response format
 */

class Response {
    public static function success($data = null, $message = 'Success', $statusCode = 200) {
        http_response_code($statusCode);
        header('Content-Type: application/json');
        
        echo json_encode([
            'success' => true,
            'message' => $message,
            'data' => $data,
            'timestamp' => date('c')
        ]);
        exit;
    }

    public static function error($message = 'Error', $errors = null, $statusCode = 400) {
        http_response_code($statusCode);
        header('Content-Type: application/json');
        
        echo json_encode([
            'success' => false,
            'message' => $message,
            'errors' => $errors,
            'timestamp' => date('c')
        ]);
        exit;
    }

    public static function paginated($data, $total, $page, $pageSize, $message = 'Success') {
        http_response_code(200);
        header('Content-Type: application/json');
        
        $totalPages = ceil($total / $pageSize);
        
        echo json_encode([
            'success' => true,
            'message' => $message,
            'data' => $data,
            'pagination' => [
                'total' => $total,
                'page' => $page,
                'pageSize' => $pageSize,
                'totalPages' => $totalPages,
                'hasNextPage' => $page < $totalPages,
                'hasPreviousPage' => $page > 1
            ],
            'timestamp' => date('c')
        ]);
        exit;
    }
}
?>
