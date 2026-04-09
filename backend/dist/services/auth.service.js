import crypto from 'node:crypto';
import { env } from '../config/env.js';
import { createHttpError, requireFields } from '../utils/http.js';
import { comparePassword, hashPassword } from './password.service.js';
import { signToken } from '../middlewares/auth.middleware.js';
import { usersService } from './users.service.js';
import { consumeOtp, findValidOtp, replaceOtpForEmail } from '../repositories/passwordOtps.repository.js';
import { isMailConfigured, sendMail } from './mailer.service.js';
const OTP_TTL_MINUTES = 10;
const MIN_PASSWORD_LENGTH = 8;
function normalizeEmail(email) {
    return String(email || '').trim().toLowerCase();
}
export async function authenticateUser({ email, password, role }) {
    const normalizedEmail = normalizeEmail(email);
    const normalizedRole = String(role || '').trim().toLowerCase();
    requireFields({ email: normalizedEmail, password }, ['email', 'password']);
    const user = await usersService.getByEmail(normalizedEmail);
    if (!user) {
        throw createHttpError(401, 'Invalid credentials');
    }
    const valid = await comparePassword(password, user.password_hash);
    if (!valid) {
        throw createHttpError(401, 'Invalid credentials');
    }
    await usersService.updateLastLogin(user.id);
    const roleSlug = user.role?.slug || user.role;
    const roleName = user.role?.name || roleSlug;
    if (normalizedRole && roleSlug !== normalizedRole) {
        throw createHttpError(403, 'This account is not allowed for the selected role');
    }
    const token = signToken({ id: user.id, email: user.email, role: roleSlug });
    return {
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: {
                slug: roleSlug,
                name: roleName,
            },
        },
    };
}
export async function requestPasswordOtp({ email }) {
    const normalizedEmail = normalizeEmail(email);
    requireFields({ email: normalizedEmail }, ['email']);
    const user = await usersService.getByEmail(normalizedEmail);
    if (!user) {
        return { message: 'If this email exists, an OTP has been sent.' };
    }
    const otp = String(crypto.randomInt(0, 1000000)).padStart(6, '0');
    const otp_hash = await hashPassword(otp);
    const expires_at = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);
    await replaceOtpForEmail({ email: normalizedEmail, otp_hash, expires_at });
    const subject = 'Your Dabistan OTP';
    const text = `Your Dabistan OTP is ${otp}. It expires in ${OTP_TTL_MINUTES} minutes.`;
    const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.5;">
      <h2 style="margin: 0 0 8px;">Dabistan OTP</h2>
      <p style="margin: 0 0 12px;">Use the following one-time password to continue:</p>
      <p style="font-size: 22px; font-weight: 700; letter-spacing: 2px; margin: 0 0 12px;">
        ${otp}
      </p>
      <p style="margin: 0;">This OTP expires in ${OTP_TTL_MINUTES} minutes.</p>
    </div>
  `;
    if (!isMailConfigured()) {
        if (env.nodeEnv === 'production') {
            throw createHttpError(500, 'SMTP is not configured');
        }
        return {
            message: 'SMTP is not configured. Use the OTP below for local testing.',
            debugOtp: otp,
        };
    }
    await sendMail({ to: normalizedEmail, subject, text, html });
    return { message: 'If this email exists, an OTP has been sent.' };
}
export async function resetPasswordWithOtp({ email, otp, newPassword }) {
    const normalizedEmail = normalizeEmail(email);
    const normalizedOtp = String(otp || '').trim();
    requireFields({ email: normalizedEmail, otp: normalizedOtp, newPassword }, ['email', 'otp', 'newPassword']);
    if (String(newPassword).length < MIN_PASSWORD_LENGTH) {
        throw createHttpError(400, `Password must be at least ${MIN_PASSWORD_LENGTH} characters long`);
    }
    const user = await usersService.getByEmail(normalizedEmail);
    if (!user) {
        throw createHttpError(400, 'Invalid or expired OTP');
    }
    const otpRecord = await findValidOtp(normalizedEmail);
    if (!otpRecord) {
        throw createHttpError(400, 'Invalid or expired OTP');
    }
    const validOtp = await comparePassword(normalizedOtp, otpRecord.otp_hash);
    if (!validOtp) {
        throw createHttpError(400, 'Invalid or expired OTP');
    }
    await usersService.updatePassword(user.id, newPassword);
    await consumeOtp(String(otpRecord._id));
    return { message: 'Password reset successful.' };
}
//# sourceMappingURL=auth.service.js.map