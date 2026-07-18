<?php

$providedToken = isset($_POST['token']) ? (string) $_POST['token'] : '';
if (!hash_equals('__DEPLOY_CLEANUP_TOKEN__', $providedToken)) {
    http_response_code(403);
    exit('Forbidden');
}

function removeDeploymentPath($path)
{
    if (is_link($path) || is_file($path)) {
        return @unlink($path);
    }

    if (!is_dir($path)) {
        return true;
    }

    $entries = scandir($path);
    if ($entries === false) {
        return false;
    }

    foreach ($entries as $entry) {
        if ($entry === '.' || $entry === '..') {
            continue;
        }
        if (!removeDeploymentPath($path . DIRECTORY_SEPARATOR . $entry)) {
            return false;
        }
    }

    return @rmdir($path);
}

$preserve = array_fill_keys(array(
    '.deployment-cleanup.php',
    '.ftp-deploy-domain-root-state.json',
    '.htaccess',
    '.well-known',
    'api',
    'assets',
    'cgi-bin',
    'favicon.svg',
    'index.html',
    'robots.txt',
    'sitemap.xml',
    'uploads',
), true);
$removed = array();
$failed = array();
$entries = scandir(__DIR__);

if ($entries === false) {
    http_response_code(500);
    exit('Unable to read deployment directory');
}

foreach ($entries as $entry) {
    if ($entry === '.' || $entry === '..' || isset($preserve[$entry])) {
        continue;
    }
    if (removeDeploymentPath(__DIR__ . DIRECTORY_SEPARATOR . $entry)) {
        $removed[] = $entry;
    } else {
        $failed[] = $entry;
    }
}

header('Content-Type: application/json');
if ($failed) {
    http_response_code(500);
}
echo json_encode(array('removed' => $removed, 'failed' => $failed));

if (!$failed) {
    @unlink(__FILE__);
}
