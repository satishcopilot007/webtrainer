<?php
/**
 * Configuration File
 * All application settings and constants
 */

// Hostinger shared hosting does not expose project settings as process
// environment variables, so load the private API .env before constants.
$envFile = dirname(__DIR__) . '/.env';
if (is_readable($envFile)) {
    $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines ?: [] as $line) {
        $line = trim($line);
        if ($line === '' || $line[0] === '#' || strpos($line, '=') === false) {
            continue;
        }

        list($key, $value) = explode('=', $line, 2);
        $key = trim($key);
        $value = trim(trim($value), "\"'");

        if ($key !== '' && getenv($key) === false) {
            putenv($key . '=' . $value);
            $_ENV[$key] = $value;
            $_SERVER[$key] = $value;
        }
    }
}

// Environment
define('ENV', getenv('APP_ENV') ?: 'development');
define('DEBUG', ENV === 'development');

// API Settings
define('API_VERSION', '1.0.0');
define('API_BASE_URL', getenv('API_BASE_URL') ?: 'http://localhost/api');
define('FRONTEND_URL', getenv('FRONTEND_URL') ?: 'http://localhost:3000');

// Database
define('DB_HOST', getenv('DB_HOST') ?: 'localhost');
define('DB_NAME', getenv('DB_NAME') ?: 'trainermentors_db');
define('DB_USER', getenv('DB_USER') ?: 'root');
define('DB_PASS', getenv('DB_PASS') ?: '');

// JWT Settings
define('JWT_SECRET', getenv('JWT_SECRET') ?: 'your-secret-key-change-in-production');
define('JWT_EXPIRY', 3600); // 1 hour
define('JWT_REFRESH_EXPIRY', 604800); // 7 days

// CORS Settings
define('ALLOWED_ORIGINS', [
    'http://localhost:3000',
    'http://localhost:5173',
    getenv('FRONTEND_URL') ?: 'http://localhost:3000'
]);

// Pagination
define('DEFAULT_PAGE_SIZE', 12);
define('MAX_PAGE_SIZE', 100);

// File Upload
define('UPLOAD_DIR', dirname(__DIR__) . '/uploads');
define('MAX_UPLOAD_SIZE', 5 * 1024 * 1024); // 5MB
define('ALLOWED_EXTENSIONS', ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'mp4']);

// Email Settings
define('EMAIL_FROM', getenv('EMAIL_FROM') ?: 'noreply@trainermentors.com');
define('SMTP_HOST', getenv('SMTP_HOST') ?: 'smtp.gmail.com');
define('SMTP_PORT', getenv('SMTP_PORT') ?: 587);
define('SMTP_USER', getenv('SMTP_USER') ?: '');
define('SMTP_PASS', getenv('SMTP_PASS') ?: '');

// Payment Settings (Razorpay)
define('RAZORPAY_KEY', getenv('RAZORPAY_KEY') ?: '');
define('RAZORPAY_SECRET', getenv('RAZORPAY_SECRET') ?: '');
define('UPI_ID', getenv('UPI_ID') ?: '');
define('UPI_MERCHANT_NAME', getenv('UPI_MERCHANT_NAME') ?: 'TrainerMentors');

// Application
define('APP_NAME', 'TrainerMentors');
define('APP_TIMEZONE', 'Asia/Kolkata');

// Error Handling
if (DEBUG) {
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
} else {
    error_reporting(E_ALL);
    ini_set('display_errors', 0);
    ini_set('log_errors', 1);
}

date_default_timezone_set(APP_TIMEZONE);
?>
