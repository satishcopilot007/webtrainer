<?php
/**
 * Public free-session lead capture and administrator notification.
 */
class LeadController extends BaseController {
    private function textValue($value, $field, $maxLength, $minLength = 1) {
        if (!is_string($value)) {
            Response::error('Validation failed', [$field => 'A text value is required'], 422);
        }
        $value = trim(preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $value));
        $length = function_exists('mb_strlen') ? mb_strlen($value) : strlen($value);
        if ($length < $minLength || $length > $maxLength) {
            Response::error('Validation failed', [$field => "Must be between {$minLength} and {$maxLength} characters"], 422);
        }
        return $value;
    }

    private function sendAdminEmail($lead) {
        if (!filter_var(ADMIN_EMAIL, FILTER_VALIDATE_EMAIL)) {
            error_log('ADMIN_EMAIL is not configured; free-session notification was not emailed');
            return false;
        }

        $escape = function ($value) {
            return htmlspecialchars((string)$value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
        };
        $adminUrl = rtrim(FRONTEND_URL, '/') . '/admin/notifications';
        $subject = 'New free session request - ' . $lead['course'];
        $body = '<html><body style="font-family:Arial,sans-serif;color:#172033">'
            . '<h2>New free session request</h2>'
            . '<table cellpadding="8" cellspacing="0" style="border-collapse:collapse">'
            . '<tr><td><strong>Name</strong></td><td>' . $escape($lead['name']) . '</td></tr>'
            . '<tr><td><strong>Email</strong></td><td>' . $escape($lead['email']) . '</td></tr>'
            . '<tr><td><strong>Phone</strong></td><td>' . $escape($lead['phone']) . '</td></tr>'
            . '<tr><td><strong>Course</strong></td><td>' . $escape($lead['course']) . '</td></tr>'
            . '<tr><td><strong>Mode</strong></td><td>' . $escape($lead['mode']) . '</td></tr>'
            . '<tr><td><strong>Preferred date</strong></td><td>' . $escape($lead['timeline']) . '</td></tr>'
            . '<tr><td><strong>Message</strong></td><td>' . $escape($lead['user_message'] ?: '—') . '</td></tr>'
            . '</table><p><a href="' . $escape($adminUrl) . '">Open admin notifications</a></p>'
            . '</body></html>';
        $headers = [
            'MIME-Version: 1.0',
            'Content-Type: text/html; charset=UTF-8',
            'From: ' . APP_NAME . ' <' . EMAIL_FROM . '>',
            'Reply-To: ' . $lead['email'],
        ];
        $sent = @mail(ADMIN_EMAIL, $subject, $body, implode("\r\n", $headers));
        if (!$sent) error_log('Unable to send admin email for free-session lead ' . $lead['id']);
        return $sent;
    }

    public function submit() {
        if ($this->getMethod() !== 'POST') Response::error('Method not allowed', null, 405);
        $data = $this->getRequestData();
        if (!is_array($data)) Response::error('A JSON object is required', null, 422);

        $name = $this->textValue($data['name'] ?? null, 'name', 255, 2);
        $email = strtolower(trim((string)($data['email'] ?? '')));
        if (!filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 255) {
            Response::error('Validation failed', ['email' => 'Enter a valid email address'], 422);
        }
        $phone = $this->textValue($data['phone'] ?? null, 'phone', 20, 7);
        if (!preg_match('/^[0-9+()\-\s]+$/', $phone)) {
            Response::error('Validation failed', ['phone' => 'Enter a valid phone number'], 422);
        }
        $courseId = filter_var($data['course_id'] ?? null, FILTER_VALIDATE_INT, ['options' => ['min_range' => 1]]);
        if ($courseId === false) Response::error('Validation failed', ['course_id' => 'Select a valid course'], 422);

        $courseStmt = $this->conn->prepare('SELECT title FROM courses WHERE id = ? AND is_active = 1 LIMIT 1');
        $courseStmt->bind_param('i', $courseId);
        $courseStmt->execute();
        $course = $courseStmt->get_result()->fetch_assoc();
        $courseStmt->close();
        if (!$course) Response::error('Validation failed', ['course_id' => 'The selected course is unavailable'], 422);

        $mode = strtolower($this->textValue($data['mode'] ?? null, 'mode', 20));
        if (!in_array($mode, ['online', 'classroom', 'center', 'hybrid'], true)) {
            Response::error('Validation failed', ['mode' => 'Select a valid learning mode'], 422);
        }
        $timeline = $this->textValue($data['timeline'] ?? ($data['preferred_date'] ?? null), 'timeline', 100);
        $userMessage = isset($data['message']) && trim((string)$data['message']) !== ''
            ? $this->textValue($data['message'], 'message', 10000)
            : '';

        $duplicateStmt = $this->conn->prepare('SELECT id FROM leads WHERE email = ? AND course_interested = ? AND created_at >= DATE_SUB(NOW(), INTERVAL 30 SECOND) LIMIT 1');
        $duplicateStmt->bind_param('ss', $email, $course['title']);
        $duplicateStmt->execute();
        $duplicate = $duplicateStmt->get_result()->num_rows > 0;
        $duplicateStmt->close();
        if ($duplicate) Response::error('This request was already received. Please wait before submitting it again.', null, 429);

        $storedMessage = "Learning mode: {$mode}\nPreferred date/timeline: {$timeline}";
        if ($userMessage !== '') $storedMessage .= "\n\nUser message:\n{$userMessage}";
        $source = 'demo-booking';
        $status = 'new';
        $stmt = $this->conn->prepare('INSERT INTO leads (name, email, phone, course_interested, message, source, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())');
        $stmt->bind_param('sssssss', $name, $email, $phone, $course['title'], $storedMessage, $source, $status);
        if (!$stmt->execute()) {
            $stmt->close();
            throw new RuntimeException('Unable to save free-session request');
        }
        $id = $this->conn->insert_id;
        $stmt->close();

        $lead = [
            'id' => $id,
            'name' => $name,
            'email' => $email,
            'phone' => $phone,
            'course' => $course['title'],
            'mode' => $mode,
            'timeline' => $timeline,
            'user_message' => $userMessage,
        ];
        $emailSent = $this->sendAdminEmail($lead);

        Response::success([
            'id' => $id,
            'status' => $status,
            'admin_email_sent' => $emailSent,
        ], 'Free session request submitted successfully', 201);
    }
}
?>
