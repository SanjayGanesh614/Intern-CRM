import nodemailer from 'nodemailer';
// Basic configuration - placeholder for now if envs are missing
// You'd typically use process.env.SMTP_HOST etc.
// For now, we'll try to log if not configured.
// Extend env in head if needed, or just use process.env here for specific SMTP stuff
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.ethereal.email',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER || 'ethereal_user',
        pass: process.env.SMTP_PASS || 'ethereal_pass',
    },
});
export const sendEmail = async (to, subject, html) => {
    if (!process.env.SMTP_HOST) {
        console.log(`[Email Mock] To: ${to}, Subject: ${subject}`);
        return; // Mock send
    }
    try {
        const info = await transporter.sendMail({
            from: process.env.SMTP_FROM || '"Intern CRM" <no-reply@interncrm.com>',
            to,
            subject,
            html,
        });
        console.log('Message sent: %s', info.messageId);
    }
    catch (error) {
        console.error('Error sending email:', error);
    }
};
