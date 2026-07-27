import { Router } from "express";

const gameplayRouter: Router = Router();

gameplayRouter.get("/", (req, res) => {
  res.json({ success: true, message: "Gameplay module ready" });
});

export default gameplayRouter;
