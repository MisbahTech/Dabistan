import nodemailer from 'nodemailer';
import { env } from '../config/env.js';
import { createHttpError } from './http.js';
let cachedTransport = null;
function getTransport() {
    if (cachedTransport) {
        return cachedTransport;
    }
    if (!env.smtpHost || !env.smtpUser || !env.smtpPass) {
        throw createHttpError(500, 'SMTP is not configured');
    }
    cachedTransport = nodemailer.createTransport({
        host: env.smtpHost,
        port: env.smtpPort,
        secure: env.smtpSecure,
        auth: {
            user: env.smtpUser,
            pass: env.smtpPass,
        },
    });
    return cachedTransport;
}
export async function sendEmail({ to, subject, text, html }) {
    const transport = getTransport();
    const from = env.smtpFrom || env.smtpUser;
    await transport.sendMail({
        from,
        to,
        subject,
        text,
        html,
    });
}
//# sourceMappingURL=mailer.js.map