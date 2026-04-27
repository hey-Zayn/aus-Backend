const transporter = require('../Config/Nodemailer/nodemailer.config');
const { VERIFICATION_EMAIL_TEMPLATE, LOGIN_VERIFICATION_TEMPLATE, PASSWORD_RESET_REQUEST_TEMPLATE, DOCUMENT_EMAIL_TEMPLATE } = require('../templates/emailTemplates');

const sendVerificationEmail = async (email, verificationCode) => {
    try {
        const response = await transporter.sendMail({
            from: `"AUS Visa Support" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Verify your email",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationCode),
        });
        return response;
    } catch (error) {
        console.error(`Error sending verification email`, error);
        throw new Error(`Error sending verification email: ${error.message}`);
    }
};

const sendLoginVerificationEmail = async (email, verificationCode) => {
    try {
        const response = await transporter.sendMail({
            from: `"AUS Visa Support" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Login Verification Code",
            html: LOGIN_VERIFICATION_TEMPLATE.replace("{verificationCode}", verificationCode),
        });
        return response;
    } catch (error) {
        console.error(`Error sending login verification email`, error);
        throw new Error(`Error sending login verification email: ${error.message}`);
    }
};

const sendPasswordResetEmail = async (email, resetURL) => {
    try {
        const response = await transporter.sendMail({
            from: `"AUS Visa Support" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Reset your password",
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
        });
        return response;
    } catch (error) {
        console.error(`Error sending password reset email`, error);
        throw new Error(`Error sending password reset email: ${error.message}`);
    }
};

const sendDocumentEmail = async (email, fullName, documentType, pdfBuffer, fileName) => {
    try {
        const response = await transporter.sendMail({
            from: `"AUS Visa Support" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: `Important Document: ${documentType} — ${fullName}`,
            html: DOCUMENT_EMAIL_TEMPLATE
                .replace(/{fullName}/g, fullName)
                .replace(/{documentType}/g, documentType)
                .replace(/{date}/g, new Date().toLocaleDateString("en-AU")),
            attachments: [
                {
                    filename: fileName,
                    content: pdfBuffer,
                }
            ]
        });
        return response;
    } catch (error) {
        console.error(`Error sending document email`, error);
        throw new Error(`Error sending document email: ${error.message}`);
    }
};

module.exports = {
    sendVerificationEmail,
    sendLoginVerificationEmail,
    sendPasswordResetEmail,
    sendDocumentEmail
};
