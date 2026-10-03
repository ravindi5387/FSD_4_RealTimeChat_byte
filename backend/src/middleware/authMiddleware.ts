import { Request, Response, NextFunction } from "express";
import { pool } from "../config/db";
import { verifyToken } from "../utils/jwt";

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const header = req.header("authorization");

    if (!header?.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const token = header.slice("Bearer ".length);
    const payload = verifyToken(token);
    const userId = Number(payload.sub);

    if (!Number.isInteger(userId)) {
      return res.status(401).json({
        message: "Invalid authentication token",
      });
    }

    const result = await pool.query(
      "SELECT id, name, email FROM users WHERE id = $1",
      [userId],
    );

    if (result.rowCount !== 1) {
      return res.status(401).json({
        message: "User no longer exists",
      });
    }

    req.user = result.rows[0];
    next();
  } catch {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
}
