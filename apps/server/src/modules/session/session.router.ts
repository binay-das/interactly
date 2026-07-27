import { Router } from "express";

const sessionRouter: Router = Router();

sessionRouter.get("/", (req, res) => {
  res.json({ success: true, message: "Session module ready" });
});

export default sessionRouter;
