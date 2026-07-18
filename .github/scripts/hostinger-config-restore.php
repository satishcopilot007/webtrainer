<?php

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit('Method not allowed');
}

$providedToken = isset($_SERVER['HTTP_X_CONFIG_TOKEN'])
    ? (string) $_SERVER['HTTP_X_CONFIG_TOKEN']
    : '';
$expectedHash = '671cd74349717fb431d7acfa6fef36aa3a5025ccb36bf5d160256a9b695604dd';

if (!hash_equals($expectedHash, hash('sha256', $providedToken))) {
    http_response_code(403);
    exit('Forbidden');
}

$config = file_get_contents('php://input');
if ($config === false || strlen($config) < 50 || strlen($config) > 65536) {
    http_response_code(400);
    exit('Invalid configuration');
}

$requiredVariables = array(
    'APP_ENV',
    'DB_HOST',
    'DB_NAME',
    'DB_USER',
    'DB_PASS',
    'JWT_SECRET',
    'RAZORPAY_KEY',
    'RAZORPAY_SECRET',
);

foreach ($requiredVariables as $variable) {
    if (!preg_match('/^' . preg_quote($variable, '/') . '=.+$/m', $config)) {
        http_response_code(400);
        exit('Missing required configuration');
    }
}

$target = __DIR__ . '/api/.env';
$temporary = $target . '.restore-' . uniqid('', true);
if (file_put_contents($temporary, $config, LOCK_EX) === false) {
    http_response_code(500);
    exit('Unable to write configuration');
}

@chmod($temporary, 0600);
if (!@rename($temporary, $target)) {
    @unlink($temporary);
    http_response_code(500);
    exit('Unable to activate configuration');
}

header('Content-Type: application/json');
echo json_encode(array('restored' => true));
@unlink(__FILE__);
