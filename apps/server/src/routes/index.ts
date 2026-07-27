import { Router } from "express";
import authRouter from "../modules/auth/auth.router.js";
import quizRouter from "../modules/quiz/quiz.router.js";
import sessionRouter from "../modules/session/session.router.js";
import playerRouter from "../modules/player/player.router.js";
import gameplayRouter from "../modules/gameplay/gameplay.router.js";

const apiRouter: Router = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/quizzes", quizRouter);
apiRouter.use("/sessions", sessionRouter);
apiRouter.use("/players", playerRouter);
apiRouter.use("/gameplay", gameplayRouter);

export default apiRouter;
