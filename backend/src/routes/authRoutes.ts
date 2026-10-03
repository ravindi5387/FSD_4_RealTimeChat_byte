import { Router, Request, Response } from "express";
import { login, register } from "../controllers/authController";
import { requireAuth } from "../middleware/authMiddleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);

router.get("/me", requireAuth, (req: Request, res: Response) => {
  res.status(200).json({
    user: req.user,
  });
});

export default router;
