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

  // Api related codes
  API_KEY_MISSING: 'API_KEY_MISSING',
  API_KEY_INVALID: 'API_KEY_INVALID',

  // General codes
  BAD_REQUEST: 'BAD_REQUEST',
  UNAUTHORIZED: 'UNAUTHORIZED',
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
};
