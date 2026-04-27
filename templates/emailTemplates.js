const VERIFICATION_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email</title>
</head>
<body style="font-family: sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: #004a82; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 24px; font-weight: normal;">Email Verification</h1>
  </div>
  <div style="background-color: #ffffff; padding: 20px; border-radius: 0 0 8px 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border: 1px solid #e1e1e1;">
    <p>Hello,</p>
    <p>Thank you for signing up! Your verification code is:</p>
    <div style="text-align: center; margin: 30px 0;">
      <span style="font-size: 32px; letter-spacing: 5px; color: #004a82; background: #f0f7ff; padding: 10px 20px; border-radius: 4px; border: 1px solid #d0e7ff;">{verificationCode}</span>
    </div>
    <p>Enter this code on the verification page to complete your registration. This code will expire in 15 minutes.</p>
    <p>If you didn't create an account, please ignore this email.</p>
    <p>Best regards,<br>Australian Visa Support Team</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 12px;">
    <p>This is an automated message, please do not reply to this email.</p>
  </div>
</body>
</html>
`;

const LOGIN_VERIFICATION_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Login Verification</title>
</head>
<body style="font-family: sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: #004a82; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 24px; font-weight: normal;">Login Verification</h1>
  </div>
  <div style="background-color: #ffffff; padding: 20px; border-radius: 0 0 8px 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border: 1px solid #e1e1e1;">
    <p>Hello,</p>
    <p>You are attempting to log in to your account. Your login verification code is:</p>
    <div style="text-align: center; margin: 30px 0;">
      <span style="font-size: 32px; letter-spacing: 5px; color: #004a82; background: #f0f7ff; padding: 10px 20px; border-radius: 4px; border: 1px solid #d0e7ff;">{verificationCode}</span>
    </div>
    <p>This code will expire in 15 minutes. If you did not attempt to log in, please secure your account immediately.</p>
    <p>Best regards,<br>Australian Visa Support Team</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 12px;">
    <p>This is an automated message, please do not reply to this email.</p>
  </div>
</body>
</html>
`;

const PASSWORD_RESET_REQUEST_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password</title>
</head>
<body style="font-family: sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: #004a82; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 24px; font-weight: normal;">Password Reset</h1>
  </div>
  <div style="background-color: #ffffff; padding: 20px; border-radius: 0 0 8px 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border: 1px solid #e1e1e1;">
    <p>Hello,</p>
    <p>We received a request to reset your password. If you didn't make this request, please ignore this email.</p>
    <p>To reset your password, click the button below:</p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="{resetURL}" style="background-color: #004a82; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px; font-size: 16px;">Reset Password</a>
    </div>
    <p>This link will expire in 1 hour for your security.</p>
    <p>Best regards,<br>Australian Visa Support Team</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 12px;">
    <p>This is an automated message, please do not reply to this email.</p>
  </div>
</body>
</html>
`;

const DOCUMENT_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Document is Ready</title>
</head>
<body style="font-family: sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: #004a82; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 24px; font-weight: normal;">Document Ready</h1>
  </div>
  <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border: 1px solid #e1e1e1;">
    <p style="font-size: 16px;">Hello <strong>{fullName}</strong>,</p>
    <p>Your requested document <strong>{documentType}</strong> has been generated successfully and is attached to this email.</p>
    
    <div style="background-color: #f8f9fa; border-left: 4px solid #004a82; padding: 15px; margin: 20px 0; font-size: 14px;">
      <p style="margin: 0;"><strong>Document Details:</strong></p>
      <p style="margin: 5px 0 0 0;">Type: {documentType}</p>
      <p style="margin: 2px 0 0 0;">Generated on: {date}</p>
    </div>

    <p>Please keep this document safe for your records. If you have any questions, feel free to contact us.</p>
    <br/>
    <p>Best regards,<br><strong>Australian Visa Support Team</strong></p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 11px;">
    <p>This is an automated delivery service. Please do not reply to this email.</p>
    <p>&copy; ${new Date().getFullYear()} AUS Visa Management System</p>
  </div>
</body>
</html>
`;

module.exports = {
    VERIFICATION_EMAIL_TEMPLATE,
    LOGIN_VERIFICATION_TEMPLATE,
    PASSWORD_RESET_REQUEST_TEMPLATE,
    DOCUMENT_EMAIL_TEMPLATE
};
