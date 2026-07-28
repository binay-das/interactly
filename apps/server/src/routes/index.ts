import { Router } from "express";
import authRouter from "../modules/auth/auth.routes.js";
import quizRouter from "../modules/quiz/quiz.routes.js";
import sessionRouter from "../modules/session/session.routes.js";
import playerRouter from "../modules/player/player.routes.js";
import gameplayRouter from "../modules/gameplay/gameplay.routes.js";

const apiRouter: Router = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/quizzes", quizRouter);
apiRouter.use("/sessions", sessionRouter);
apiRouter.use("/players", playerRouter);
apiRouter.use("/gameplay", gameplayRouter);

export default apiRouter;
