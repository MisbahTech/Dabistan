import { authenticateUser, requestPasswordOtp, resetPasswordWithOtp } from '../services/auth.service.js';
import { requireBody } from '../utils/handlers.js';
export async function login(req, res, next) {
    try {
        requireBody(req);
        const result = await authenticateUser(req.body);
        res.json(result);
    }
    catch (error) {
        next(error);
    }
}
export async function me(req, res) {
    res.json({ user: req.user });
}
export async function forgotPassword(req, res, next) {
    try {
        requireBody(req);
        const result = await requestPasswordOtp(req.body);
        res.json(result);
    }
    catch (error) {
        next(error);
    }
}
export async function resetPassword(req, res, next) {
    try {
        requireBody(req);
        const result = await resetPasswordWithOtp(req.body);
        res.json(result);
    }
    catch (error) {
        next(error);
    }
}
//# sourceMappingURL=auth.controller.js.map