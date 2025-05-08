export const ResponseMessages = {
    // Auth related messages
    AUTH_SUCCESS: 'Authentication successful',
    AUTH_FAILED: 'Authentication failed',
    INVALID_CREDENTIALS: 'Invalid credentials',
    ACCOUNT_INACTIVE: 'Account is inactive or blocked',
    PASSWORD_MISMATCH: 'Passwords do not match',
    CURRENT_PASSWORD_INCORRECT: 'Current password is incorrect',
    OTP_INVALID: 'Invalid OTP',
    OTP_EXPIRED: 'OTP has expired',
    PASSWORD_RESET_FAILED: 'Failed to process password reset request',
    TOKEN_VALIDATION_FAILED: 'Token validation failed',
    TOKEN_VALIDATION_SUCCESS: 'Token validated successfully',
    LOGOUT_SUCCESS: 'Logout successful',

    // User related messages
    USER_NOT_FOUND: 'User not found',
    USER_CREATED: 'User created successfully',
    USER_UPDATED: 'User updated successfully',
    EMAIL_EXISTS: 'Email already exists',
    PHONE_EXISTS: 'Phone number already exists',
    AADHAAR_EXISTS: 'Aadhaar number already exists',
    EMAIL_ALREADY_VERIFIED: 'Email is already verified',
    EMAIL_VERIFICATION_SENT: 'Verification email sent successfully',
    EMAIL_VERIFICATION_FAILED: 'Failed to send verification email',
    IF_EMAIL_IS_REGISTERED:
        'If your email is registered with us, you will receive a password reset OTP.',
    OTP_VERIFICATION_SUCCESS: 'OTP verified successfully',
    OTP_VERIFICATION_FAILED: 'OTP verification failed',
    PASSWORD_RESET_SUCCESS:
        'Password has been reset successfully. You can now login with your new password.',
    PASSWORD_CHANGE_SUCCESS: 'Password changed successfully',
    PASSWORD_CHANGE_FAILED: 'Failed to change password',
    EMAIL_RETRIEVAL_SUCCESS: 'Email retrieved successfully',
    EMAIL_RETRIEVAL_FAILED: 'Failed to retrieve email',
    REGISTRATION_INITIATED_SUCCESS:
        'Registration initiated. Please check your email for the verification OTP',
    EMAIL_VERIFICATION_SUCCESS:
        'Email verified successfully. Your account is now active.',
    VERIFICATION_OTP_SENT: 'Verification OTP sent. Please check your email.',
    USERS_RETRIEVAL_SUCCESS: 'All users retrieved successfully',
    USER_RETRIEVAL_SUCCESS: 'User retrieved successfully',
    PROFILE_RETRIEVAL_SUCCESS: 'Profile retrieved successfully',
    AADHAR_VERIFICATION_SUCCESS: 'Aadhaar verification successful',
    EMAIL_CANNOT_BE_UPDATED:
        'Email cannot be updated. Please contact support if you need to change your email.',
    ACCOUNT_NOT_VERIFIED:
        'Account not verified. Please verify your email first.',
    AADHAAR_NOT_PROVIDED: 'Aadhaar number not provided',
    CANNOT_ACTIVATE_UNVERIFIED: 'Cannot activate account. Email not verified.',
    UNAUTHORIZED_UPDATE: 'You are not authorized to update this user',

    // Api related messages
    API_KEY_MISSING: 'API key is missing',
    API_KEY_INVALID: 'Invalid API key',

    // General messages
    SUCCESS: 'Operation successful',
    FAILED: 'Operation failed',
    BAD_REQUEST: 'Bad request',
    UNAUTHORIZED: 'Unauthorized request',
    NOT_FOUND: 'Resource not found',
    CONFLICT: 'Resource conflict',
};

export const ResponseCodes = {
    // Success codes
    SUCCESS: 'SUCCESS',
    FAILED: 'FAILED',

    // Auth related codes
    AUTH_FAILED: 'AUTH_FAILED',
    INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
    ACCOUNT_INACTIVE: 'ACCOUNT_INACTIVE',
    PASSWORD_MISMATCH: 'PASSWORD_MISMATCH',
    CURRENT_PASSWORD_INCORRECT: 'CURRENT_PASSWORD_INCORRECT',
    OTP_INVALID: 'OTP_INVALID',
    OTP_EXPIRED: 'OTP_EXPIRED',
    PASSWORD_RESET_FAILED: 'PASSWORD_RESET_FAILED',

    // User related codes
    USER_NOT_FOUND: 'USER_NOT_FOUND',
    EMAIL_EXISTS: 'EMAIL_EXISTS',
    PHONE_EXISTS: 'PHONE_EXISTS',
    AADHAAR_EXISTS: 'AADHAAR_EXISTS',
    EMAIL_ALREADY_VERIFIED: 'EMAIL_ALREADY_VERIFIED',
    EMAIL_VERIFICATION_FAILED: 'EMAIL_VERIFICATION_FAILED',
    EMAIL_CANNOT_BE_UPDATED: 'EMAIL_CANNOT_BE_UPDATED',
    ACCOUNT_NOT_VERIFIED: 'ACCOUNT_NOT_VERIFIED',
    AADHAAR_NOT_PROVIDED: 'AADHAAR_NOT_PROVIDED',
    CANNOT_ACTIVATE_UNVERIFIED: 'CANNOT_ACTIVATE_UNVERIFIED',
    UNAUTHORIZED_UPDATE: 'UNAUTHORIZED_UPDATE',

    // Api related codes
    API_KEY_MISSING: 'API_KEY_MISSING',
    API_KEY_INVALID: 'API_KEY_INVALID',

    // General codes
    BAD_REQUEST: 'BAD_REQUEST',
    UNAUTHORIZED: 'UNAUTHORIZED',
    NOT_FOUND: 'NOT_FOUND',
    CONFLICT: 'CONFLICT',
};
