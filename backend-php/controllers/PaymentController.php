<?php
/**
 * Payment Controller
 * Handles Razorpay and UPI payment endpoints
 */

class PaymentController extends BaseController {

    private function requestRazorpay($method, $path, $payload = null) {
        if (empty(RAZORPAY_KEY) || empty(RAZORPAY_SECRET)) {
            Response::error('Razorpay is not configured on server', null, 503);
        }

        $url = 'https://api.razorpay.com/v1/' . ltrim($path, '/');
        $ch = curl_init($url);

        $headers = ['Content-Type: application/json'];

        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_USERPWD, RAZORPAY_KEY . ':' . RAZORPAY_SECRET);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, strtoupper($method));
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_TIMEOUT, 20);

        if ($payload !== null) {
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
        }

        $responseBody = curl_exec($ch);
        $curlError = curl_error($ch);
        $statusCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($responseBody === false) {
            Response::error('Razorpay request failed', ['error' => $curlError], 502);
        }

        $decoded = json_decode($responseBody, true);

        if ($statusCode >= 400) {
            $errorMessage = isset($decoded['error']['description'])
                ? $decoded['error']['description']
                : 'Razorpay API error';
            Response::error($errorMessage, $decoded, $statusCode);
        }

        return $decoded;
    }

    /**
     * POST /api/payment/create-order
     */
    public function createOrder() {
        if ($this->getMethod() !== 'POST') {
            Response::error('Method not allowed', null, 405);
        }

        $data = $this->getRequestData();
        $requiredErrors = $this->validateRequired($data, ['courses', 'amount', 'email', 'name', 'phone']);

        if (!empty($requiredErrors)) {
            Response::error('Validation failed', $requiredErrors, 422);
        }

        if (!is_array($data['courses']) || count($data['courses']) === 0) {
            Response::error('At least one course is required', null, 422);
        }

        $amount = floatval($data['amount']);
        if ($amount <= 0) {
            Response::error('Valid amount is required', null, 422);
        }

        // Keep amount in rupees, convert to paise for Razorpay.
        $amountPaise = intval(round($amount * 100));

        $rzpOrder = $this->requestRazorpay('POST', 'orders', [
            'amount' => $amountPaise,
            'currency' => 'INR',
            'receipt' => 'rcpt_' . time(),
            'notes' => [
                'customer_name' => strval($data['name']),
                'customer_email' => strval($data['email'])
            ]
        ]);

        Response::success([
            'order_id' => $rzpOrder['id'],
            'amount' => $amount,
            'currency' => 'INR',
            'customer_email' => strval($data['email']),
            'customer_name' => strval($data['name']),
            'razorpay_key' => RAZORPAY_KEY
        ], 'Payment order created successfully', 201);
    }

    /**
     * POST /api/payment/verify-signature
     */
    public function verifySignature() {
        if ($this->getMethod() !== 'POST') {
            Response::error('Method not allowed', null, 405);
        }

        $data = $this->getRequestData();
        $requiredErrors = $this->validateRequired($data, ['razorpay_order_id', 'razorpay_payment_id', 'razorpay_signature']);

        if (!empty($requiredErrors)) {
            Response::error('Validation failed', $requiredErrors, 422);
        }

        if (empty(RAZORPAY_SECRET)) {
            Response::error('Razorpay secret is missing on server', null, 503);
        }

        $payload = strval($data['razorpay_order_id']) . '|' . strval($data['razorpay_payment_id']);
        $expected = hash_hmac('sha256', $payload, RAZORPAY_SECRET);
        $received = strval($data['razorpay_signature']);

        if (!hash_equals($expected, $received)) {
            Response::error('Invalid payment signature', null, 400);
        }

        Response::success([
            'order_id' => strval($data['razorpay_order_id']),
            'payment_id' => strval($data['razorpay_payment_id']),
            'status' => 'verified'
        ], 'Payment verified successfully');
    }

    /**
     * GET /api/payment/status/:orderId
     */
    public function getStatus($orderId) {
        if ($this->getMethod() !== 'GET') {
            Response::error('Method not allowed', null, 405);
        }

        if (strpos($orderId, 'order_') !== 0) {
            Response::error('Invalid order ID', null, 422);
        }

        $payments = $this->requestRazorpay('GET', 'orders/' . urlencode($orderId) . '/payments');
        $items = isset($payments['items']) && is_array($payments['items']) ? $payments['items'] : [];
        $latest = count($items) > 0 ? $items[0] : null;

        Response::success([
            'order_id' => $orderId,
            'status' => $latest ? $latest['status'] : 'created',
            'payment_id' => $latest ? $latest['id'] : null,
            'raw' => $payments
        ], 'Payment status retrieved');
    }

    /**
     * POST /api/payment/upi-qr
     */
    public function upiQr() {
        if ($this->getMethod() !== 'POST') {
            Response::error('Method not allowed', null, 405);
        }

        if (empty(UPI_ID)) {
            Response::error('UPI is not configured on server', null, 503);
        }

        $data = $this->getRequestData();
        $requiredErrors = $this->validateRequired($data, ['amount']);

        if (!empty($requiredErrors)) {
            Response::error('Validation failed', $requiredErrors, 422);
        }

        $amount = floatval($data['amount']);
        if ($amount <= 0) {
            Response::error('Valid amount is required', null, 422);
        }

        $note = isset($data['note']) ? strval($data['note']) : 'Course Payment';
        $merchant = !empty(UPI_MERCHANT_NAME) ? UPI_MERCHANT_NAME : 'TrainerMentors';

        $upiString = 'upi://pay?pa=' . rawurlencode(UPI_ID)
            . '&pn=' . rawurlencode($merchant)
            . '&am=' . rawurlencode(number_format($amount, 2, '.', ''))
            . '&cu=INR'
            . '&tn=' . rawurlencode($note);

        Response::success([
            'upi_id' => UPI_ID,
            'merchant_name' => $merchant,
            'amount' => $amount,
            'currency' => 'INR',
            'upi_string' => $upiString
        ], 'UPI QR payload generated successfully');
    }
}
?>