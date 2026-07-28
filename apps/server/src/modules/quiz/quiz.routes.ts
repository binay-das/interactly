import { Router } from "express";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { quizController } from "./quiz.controller.js";

const quizRouter: Router = Router();

// Quiz CRUD
quizRouter.post("/", authenticate, asyncHandler(quizController.createQuiz));
quizRouter.get("/", authenticate, asyncHandler(quizController.listQuizzes));
quizRouter.get("/:id", asyncHandler(quizController.getQuiz));
quizRouter.patch("/:id", authenticate, asyncHandler(quizController.updateQuiz));
quizRouter.delete("/:id", authenticate, asyncHandler(quizController.deleteQuiz));
quizRouter.post("/:id/publish", authenticate, asyncHandler(quizController.publishQuiz));
quizRouter.post("/:id/archive", authenticate, asyncHandler(quizController.archiveQuiz));

// Questions
quizRouter.post("/:quizId/questions", authenticate, asyncHandler(quizController.addQuestion));
quizRouter.patch("/questions/:questionId", authenticate, asyncHandler(quizController.editQuestion));
quizRouter.delete("/questions/:questionId", authenticate, asyncHandler(quizController.deleteQuestion));
quizRouter.post("/:quizId/questions/reorder", authenticate, asyncHandler(quizController.reorderQuestions));

// Options
quizRouter.post("/questions/:questionId/options", authenticate, asyncHandler(quizController.createOption));
quizRouter.get("/questions/:questionId/options", asyncHandler(quizController.readOptions));
quizRouter.patch("/options/:optionId", authenticate, asyncHandler(quizController.updateOption));
quizRouter.delete("/options/:optionId", authenticate, asyncHandler(quizController.deleteOption));

export default quizRouter;
