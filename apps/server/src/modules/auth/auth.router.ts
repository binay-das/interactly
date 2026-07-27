import { Router } from "express";

const authRouter: Router = Router();

authRouter.get("/me", (req, res) => {
  res.json({ success: true, message: "Auth module ready" });
});

export default authRouter;
