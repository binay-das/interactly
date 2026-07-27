import { Router } from "express";

const quizRouter: Router = Router();

quizRouter.get("/", (req, res) => {
  res.json({ success: true, message: "Quiz module ready" });
});

export default quizRouter;
