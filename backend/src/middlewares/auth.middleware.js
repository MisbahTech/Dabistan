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
      .populate({
        path: "role",
        populate: { path: "permissions" },
      })
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
    const roleSlug = typeof roleObj === "string" ? roleObj : roleObj?.slug;

    if (!roleSlug || (roles.length && !roles.includes(roleSlug))) {
      return next(createHttpError(403, "Insufficient permissions"));
    }
    return next();
  };
}

export function requirePermission(permissionSlug) {
  return (req, _res, next) => {
    const role = req.user?.role;
    if (!role) {
      return next(createHttpError(403, "Insufficient permissions"));
    }

    // Role handles as a string (legacy) or object (populated)
    const permissions = role.permissions || [];
    const permissionSlugs = permissions.map((p) => (typeof p === "string" ? p : p.slug));

    // Admin/Superuser check: 'all' permission allows everything
    const hasAllAccess = permissionSlugs.includes("all");
    const hasSpecificPermission = permissionSlugs.includes(permissionSlug);

    if (!hasAllAccess && !hasSpecificPermission) {
      return next(createHttpError(403, "Insufficient permissions"));
    }

    return next();
  };
}

