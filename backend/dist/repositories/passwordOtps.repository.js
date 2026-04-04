import { PasswordReset } from '../models/PasswordReset.js';
export async function replaceOtpForEmail({ email, otp_hash, expires_at }) {
    await PasswordReset.deleteMany({ email });
    await PasswordReset.create({
        email,
        otp_hash,
        expires_at,
    });
}
export async function createOtp(email, otp_hash, expires_at) {
    return PasswordReset.create({
        email,
        otp_hash,
        expires_at,
    });
}
export async function findValidOtp(email) {
    return PasswordReset.findOne({
        email,
        expires_at: { $gt: new Date() },
        consumed_at: null,
    }).sort({ created_at: -1 });
}
export async function consumeOtp(id) {
    await PasswordReset.findByIdAndUpdate(id, {
        $set: { consumed_at: new Date() },
    });
}
//# sourceMappingURL=passwordOtps.repository.js.map