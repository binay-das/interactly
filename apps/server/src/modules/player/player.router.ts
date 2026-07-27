import { Router } from "express";

const playerRouter: Router = Router();

playerRouter.get("/", (req, res) => {
  res.json({ success: true, message: "Player module ready" });
});

export default playerRouter;
