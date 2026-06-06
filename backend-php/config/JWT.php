<?php
/**
 * JWT Token Handler
 * Generate and verify JWT tokens for authentication
 */

class JWT {
    private static $secret = JWT_SECRET;
    private static $algorithm = 'HS256';

    /**
     * Generate JWT Token
     */
    public static function generateToken($data, $expiry = JWT_EXPIRY) {
        $header = ['alg' => self::$algorithm, 'typ' => 'JWT'];
        $payload = array_merge($data, [
            'iat' => time(),
            'exp' => time() + $expiry
        ]);

        $header_encoded = self::base64url_encode(json_encode($header));
        $payload_encoded = self::base64url_encode(json_encode($payload));
        $signature = hash_hmac('sha256', "$header_encoded.$payload_encoded", self::$secret, true);
        $signature_encoded = self::base64url_encode($signature);

        return "$header_encoded.$payload_encoded.$signature_encoded";
    }

    /**
     * Verify and decode JWT Token
     */
    public static function verifyToken($token) {
        try {
            $parts = explode('.', $token);
            if (count($parts) !== 3) {
                throw new Exception('Invalid token format');
            }

            list($header_encoded, $payload_encoded, $signature_encoded) = $parts;

            $signature = hash_hmac('sha256', "$header_encoded.$payload_encoded", self::$secret, true);
            $signature_expected = self::base64url_encode($signature);

            if ($signature_encoded !== $signature_expected) {
                throw new Exception('Invalid signature');
            }

            $payload = json_decode(self::base64url_decode($payload_encoded), true);

            if ($payload['exp'] < time()) {
                throw new Exception('Token expired');
            }

            return $payload;
        } catch (Exception $e) {
            return null;
        }
    }

    /**
     * Generate Refresh Token
     */
    public static function generateRefreshToken($userId) {
        $data = [
            'user_id' => $userId,
            'type' => 'refresh'
        ];
        return self::generateToken($data, JWT_REFRESH_EXPIRY);
    }

    /**
     * Base64 URL Encode
     */
    private static function base64url_encode($data) {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }

    /**
     * Base64 URL Decode
     */
    private static function base64url_decode($data) {
        return base64_decode(strtr($data, '-_', '+/') . str_repeat('=', 4 - strlen($data) % 4));
    }
}
?>
