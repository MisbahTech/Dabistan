import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { createHttpError } from "../utils/http.js";
import { User } from "../models/User.js";

export function signToken(payload) {
  return jwt.sign(payload, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
}

export async function requireAuth(req, _res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return next(createHttpError(401, "Authorization required"));
  }

  const token = header.slice("Bearer ".length);
  try {
    const decoded = jwt.verify(token, env.jwtSecret);
    const user = await User.findOne({ id: decoded.id })
      .populate("role")
      .select("-password_hash");

    if (!user) {
      return next(createHttpError(401, "Invalid or expired token"));
    }

    req.user = user;
    return next();
  } catch {
    return next(createHttpError(401, "Invalid or expired token"));
  }
}

export function requireRole(roles = []) {
  return (req, _res, next) => {
    const roleObj = req.user?.role;
    // Handle both populated role object and legacy string role
    const roleSlug = typeof roleObj === "string" ? roleObj : roleObj?.slug;

    if (!roleSlug || (roles.length && !roles.includes(roleSlug))) {
      return next(createHttpError(403, "Insufficient permissions"));
    }
    return next();
  };
}

