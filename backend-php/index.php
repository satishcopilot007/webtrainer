<?php
/**
 * API Router
 * Routes requests to appropriate controller
 */

// Load configuration and classes
require_once __DIR__ . '/config/Config.php';
require_once __DIR__ . '/config/Database.php';
require_once __DIR__ . '/config/JWT.php';
require_once __DIR__ . '/middleware/Auth.php';
require_once __DIR__ . '/middleware/CORS.php';
require_once __DIR__ . '/utils/Response.php';
require_once __DIR__ . '/controllers/BaseController.php';
require_once __DIR__ . '/controllers/AuthController.php';
require_once __DIR__ . '/controllers/CourseController.php';
require_once __DIR__ . '/controllers/UserController.php';
require_once __DIR__ . '/controllers/EnrollmentController.php';
require_once __DIR__ . '/controllers/PaymentController.php';
require_once __DIR__ . '/controllers/AdminController.php';
require_once __DIR__ . '/controllers/FeedbackController.php';
require_once __DIR__ . '/controllers/LeadController.php';
require_once __DIR__ . '/models/UserModel.php';
require_once __DIR__ . '/models/CourseModel.php';
require_once __DIR__ . '/models/EnrollmentModel.php';

// Handle CORS
CORS::handle();

// Set JSON header
header('Content-Type: application/json');

// Connect to database
$db = new Database();
$conn = $db->connect();

// Get request path and method
$requestUri = $_SERVER['REQUEST_URI'];
$basePath = '/api'; // Adjust based on your server configuration
$path = str_replace($basePath, '', $requestUri);
$path = parse_url($path, PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];

// Route matching
$routePattern = preg_replace('~{(\w+)}~', '(?P<$1>[^/]+)', $path);

// Parse routes
try {
    $routeMatch = null;
    $routeParams = [];

    // Define routes
    $routes = [
        // Auth routes
        'GET' => [
            '/auth/me' => ['AuthController', 'getCurrentUser'],
            '/admin/overview' => ['AdminController', 'overview'],
            '/admin/tutors' => ['AdminController', 'getTutors'],
            '/admin/tutors/{id}' => ['AdminController', 'getTutor'],
            '/admin/categories' => ['AdminController', 'getCategories'],
            '/admin/courses' => ['AdminController', 'getCourses'],
            '/admin/courses/{id}' => ['AdminController', 'getCourse'],
            '/admin/founders' => ['AdminController', 'getFounders'],
            '/admin/blogs' => ['AdminController', 'getBlogs'],
            '/admin/feedback' => ['AdminController', 'getFeedback'],
            '/admin/records/{type}' => ['AdminController', 'getRecords'],
            '/categories' => ['CourseController', 'getCategories'],
            '/mentors' => ['CourseController', 'getMentors'],
            '/founders' => ['AdminController', 'publicFounders'],
            '/blogs' => ['AdminController', 'publicBlogs'],
            '/blogs/{slug}' => ['AdminController', 'publicBlogs'],
            '/courses' => ['CourseController', 'getAll'],
            '/courses/featured' => ['CourseController', 'getFeatured'],
            '/courses/options' => ['CourseController', 'getOptions'],
            '/courses/{id}' => ['CourseController', 'getById'],
            '/payment/status/{orderId}' => ['PaymentController', 'getStatus'],
            '/users' => ['UserController', 'getAll'],
            '/users/{id}' => ['UserController', 'getById'],
            '/users/{id}/courses' => ['UserController', 'getUserCourses'],
            '/users/{id}/enrollments' => ['UserController', 'getUserEnrollments'],
            '/enrollments/{id}' => ['EnrollmentController', 'getById'],
        ],
        'POST' => [
            '/auth/register' => ['AuthController', 'register'],
            '/auth/login' => ['AuthController', 'login'],
            '/auth/refresh' => ['AuthController', 'refreshToken'],
            '/auth/change-password' => ['AuthController', 'changePassword'],
            '/admin/tutors/profile-image' => ['AdminController', 'uploadTutorProfileImage'],
            '/admin/tutors' => ['AdminController', 'createTutor'],
            '/admin/categories' => ['AdminController', 'createCategory'],
            '/admin/courses' => ['AdminController', 'createCourse'],
            '/admin/founders' => ['AdminController', 'createFounder'],
            '/admin/blogs' => ['AdminController', 'createBlog'],
            '/admin/feedback' => ['AdminController', 'createFeedback'],
            '/feedback' => ['FeedbackController', 'submit'],
            '/leads' => ['LeadController', 'submit'],
            '/courses' => ['CourseController', 'create'],
            '/enrollments' => ['EnrollmentController', 'create'],
            '/payment/create-order' => ['PaymentController', 'createOrder'],
            '/payment/verify-signature' => ['PaymentController', 'verifySignature'],
            '/payment/upi-qr' => ['PaymentController', 'upiQr'],
            '/users/{id}/promote-mentor' => ['UserController', 'promoteMentor'],
            '/enrollments/{id}/complete' => ['EnrollmentController', 'markComplete'],
            '/enrollments/{id}/drop' => ['EnrollmentController', 'drop'],
        ],
        'PUT' => [
            '/auth/profile' => ['AuthController', 'updateProfile'],
            '/admin/tutors/{id}' => ['AdminController', 'updateTutor'],
            '/admin/categories/{id}' => ['AdminController', 'updateCategory'],
            '/admin/courses/{id}' => ['AdminController', 'updateCourse'],
            '/admin/founders/{id}' => ['AdminController', 'updateFounder'],
            '/admin/blogs/{id}' => ['AdminController', 'updateBlog'],
            '/admin/feedback/{id}' => ['AdminController', 'updateFeedback'],
            '/courses/{id}' => ['CourseController', 'update'],
            '/enrollments/{id}/progress' => ['EnrollmentController', 'updateProgress'],
        ],
        'DELETE' => [
            '/admin/tutors/{id}' => ['AdminController', 'deleteTutor'],
            '/admin/categories/{id}' => ['AdminController', 'deleteCategory'],
            '/admin/courses/{id}' => ['AdminController', 'deleteCourse'],
            '/admin/founders/{id}' => ['AdminController', 'deleteFounder'],
            '/admin/blogs/{id}' => ['AdminController', 'deleteBlog'],
            '/admin/feedback/{id}' => ['AdminController', 'deleteFeedback'],
            '/courses/{id}' => ['CourseController', 'delete'],
            '/users/{id}' => ['UserController', 'delete'],
        ],
    ];

    // Match route
    foreach ($routes as $httpMethod => $endpoints) {
        if ($method !== $httpMethod) continue;

        foreach ($endpoints as $route => $handler) {
            $pattern = '^' . preg_replace('~{(\w+)}~', '(?P<$1>[^/]+)', $route) . '$';

            if (preg_match('~' . $pattern . '~', $path, $matches)) {
                $routeMatch = $handler;
                foreach ($matches as $key => $value) {
                    if (is_string($key)) {
                        $routeParams[$key] = $value;
                    }
                }
                break;
            }
        }

        if ($routeMatch) break;
    }

    if (!$routeMatch) {
        Response::error('Route not found', null, 404);
    }

    // Call controller method
    list($controllerName, $methodName) = $routeMatch;
    $controller = new $controllerName($conn);

    if (count($routeParams) > 0) {
        call_user_func_array([$controller, $methodName], $routeParams);
    } else {
        $controller->$methodName();
    }

} catch (Throwable $e) {
    error_log('API request failed: ' . $e->getMessage());
    http_response_code(500);
    Response::error('Internal server error', DEBUG ? ['error' => $e->getMessage()] : null, 500);
} finally {
    $db->closeConnection();
}
?>
