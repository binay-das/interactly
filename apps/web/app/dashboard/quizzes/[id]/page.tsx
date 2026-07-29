"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { QuizStatus, type QuizDetails } from "@repo/types";
import { ProtectedRoute } from "../../../../components/protected-route";
import { Navbar } from "../../../../components/navbar";
import { QuizMetadataHeader } from "../../../../components/quiz-editor/quiz-metadata-header";
import { QuestionItem } from "../../../../components/quiz-editor/question-item";
import { QuestionForm, type QuestionFormData } from "../../../../components/quiz-editor/question-form";
import {
  addQuestionApi,
  deleteQuestionApi,
  editQuestionApi,
  getQuizApi,
  publishQuizApi,
  reorderQuestionsApi,
  updateQuizApi,
} from "../../../../lib/api-client";

interface QuizEditorPageProps {
  params: Promise<{ id: string }>;
}

export default function QuizEditorPage({ params }: QuizEditorPageProps) {
  const { id: quizId } = use(params);

  const [quiz, setQuiz] = useState<QuizDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);

  const fetchQuiz = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getQuizApi(quizId);
      setQuiz(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load quiz details";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuiz();
  }, [quizId]);

  // Edit Metadata
  const handleUpdateMetadata = async (data: { title: string; description?: string; status?: QuizStatus }) => {
    if (!quiz) return;
    setActionError(null);
    const prev = { ...quiz };

    // Optimistic update
    setQuiz({ ...quiz, ...data });

    try {
      const updated = await updateQuizApi(quiz.id, data);
      setQuiz(updated);
    } catch (err: unknown) {
      setQuiz(prev);
      const msg = err instanceof Error ? err.message : "Failed to update quiz settings";
      setActionError(msg);
      throw err;
    }
  };

  // Publish
  const handlePublish = async () => {
    if (!quiz) return;
    setActionError(null);
    try {
      const updated = await publishQuizApi(quiz.id);
      setQuiz(updated);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to publish quiz";
      setActionError(msg);
    }
  };

  // Add Question
  const handleAddQuestion = async (data: QuestionFormData) => {
    if (!quiz) return;
    setActionError(null);

    try {
      const newQuestion = await addQuestionApi(quiz.id, {
        text: data.text,
        order: quiz.questions.length,
        timeLimit: data.timeLimit,
        points: data.points,
        options: data.options,
      });

      setQuiz({
        ...quiz,
        questions: [...quiz.questions, newQuestion],
        totalQuestions: (quiz.questions.length || 0) + 1,
      });
      setIsAddingQuestion(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to add question";
      setActionError(msg);
      throw err;
    }
  };

  // Edit Question
  const handleEditQuestion = async (questionId: string, data: QuestionFormData) => {
    if (!quiz) return;
    setActionError(null);
    const prevQuestions = [...quiz.questions];

    try {
      const updatedQuestion = await editQuestionApi(questionId, {
        text: data.text,
        timeLimit: data.timeLimit,
        points: data.points,
        options: data.options,
      });

      setQuiz({
        ...quiz,
        questions: quiz.questions.map((q) => (q.id === questionId ? updatedQuestion : q)),
      });
    } catch (err: unknown) {
      setQuiz({ ...quiz, questions: prevQuestions });
      const msg = err instanceof Error ? err.message : "Failed to update question";
      setActionError(msg);
      throw err;
    }
  };

  // Delete Question (Optimistic)
  const handleDeleteQuestion = async (questionId: string) => {
    if (!quiz) return;
    setActionError(null);
    const prevQuestions = [...quiz.questions];

    // Optimistic state update
    const updatedQuestions = quiz.questions.filter((q) => q.id !== questionId);
    setQuiz({
      ...quiz,
      questions: updatedQuestions,
      totalQuestions: updatedQuestions.length,
    });

    try {
      await deleteQuestionApi(questionId);
    } catch (err: unknown) {
      setQuiz({ ...quiz, questions: prevQuestions });
      const msg = err instanceof Error ? err.message : "Failed to delete question";
      setActionError(msg);
    }
  };

  // Move Question Up (Optimistic)
  const handleMoveUp = async (index: number) => {
    if (!quiz || index === 0) return;
    const questions = [...quiz.questions];
    const target = questions[index];
    const prev = questions[index - 1];

    if (!target || !prev) return;

    questions[index - 1] = { ...target, order: index - 1 };
    questions[index] = { ...prev, order: index };

    setQuiz({ ...quiz, questions });
    setIsActionLoading(true);

    try {
      const orders = questions.map((q, idx) => ({
        questionId: q.id,
        newOrder: idx,
      }));
      await reorderQuestionsApi(quiz.id, orders);
    } catch (err: unknown) {
      fetchQuiz(); // Revert on failure
      const msg = err instanceof Error ? err.message : "Failed to reorder questions";
      setActionError(msg);
    } finally {
      setIsActionLoading(false);
    }
  };

  // Move Question Down (Optimistic)
  const handleMoveDown = async (index: number) => {
    if (!quiz || index >= quiz.questions.length - 1) return;
    const questions = [...quiz.questions];
    const target = questions[index];
    const next = questions[index + 1];

    if (!target || !next) return;

    questions[index + 1] = { ...target, order: index + 1 };
    questions[index] = { ...next, order: index };

    setQuiz({ ...quiz, questions });
    setIsActionLoading(true);

    try {
      const orders = questions.map((q, idx) => ({
        questionId: q.id,
        newOrder: idx,
      }));
      await reorderQuestionsApi(quiz.id, orders);
    } catch (err: unknown) {
      fetchQuiz();
      const msg = err instanceof Error ? err.message : "Failed to reorder questions";
      setActionError(msg);
    } finally {
      setIsActionLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col selection:bg-zinc-800">
        <Navbar />

        <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8">
          {/* Top Breadcrumb Link */}
          <div className="mb-6">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-200 transition-colors font-medium"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Back to Dashboard</span>
            </Link>
          </div>

          {/* Loading Skeleton */}
          {isLoading && (
            <div className="space-y-6 animate-pulse">
              <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-6 h-36" />
              <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-6 h-28" />
            </div>
          )}

          {/* Error Banner */}
          {error && (
            <div className="bg-red-950/40 border border-red-800/50 rounded-xl p-6 text-center my-6">
              <p className="text-xs text-red-300 font-medium mb-3">{error}</p>
              <button
                onClick={fetchQuiz}
                className="px-3.5 py-1.5 rounded-md text-xs font-medium text-zinc-200 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {!isLoading && quiz && (
            <>
              {/* Action Error Banner */}
              {actionError && (
                <div className="mb-6 bg-red-950/40 border border-red-800/50 text-red-300 px-4 py-3 rounded-lg text-xs flex items-center justify-between gap-3 animate-in fade-in">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-red-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{actionError}</span>
                  </div>
                  <button
                    onClick={() => setActionError(null)}
                    className="text-red-400 hover:text-red-200 transition-colors"
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* Quiz Metadata Header Component */}
              <QuizMetadataHeader
                quiz={quiz}
                onUpdateMetadata={handleUpdateMetadata}
                onPublish={handlePublish}
              />

              {/* Questions Section Header */}
              <div className="flex items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-lg font-bold tracking-tight text-zinc-100">
                    Questions ({quiz.questions?.length || 0})
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Add, edit, or reorder questions for this quiz session.
                  </p>
                </div>

                {!isAddingQuestion && (
                  <button
                    onClick={() => setIsAddingQuestion(true)}
                    className="px-3.5 py-2 rounded-md text-xs font-medium text-zinc-950 bg-zinc-100 hover:bg-zinc-200 transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Add Question</span>
                  </button>
                )}
              </div>

              {/* Add Question Inline Form */}
              {isAddingQuestion && (
                <div className="mb-6">
                  <QuestionForm
                    orderIndex={quiz.questions?.length || 0}
                    onSubmit={handleAddQuestion}
                    onCancel={() => setIsAddingQuestion(false)}
                    submitLabel="Create Question"
                  />
                </div>
              )}

              {/* Empty Questions State */}
              {(!quiz.questions || quiz.questions.length === 0) && !isAddingQuestion && (
                <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-10 text-center my-4">
                  <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto mb-3 text-zinc-500">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h4 className="text-sm font-semibold text-zinc-200">No questions added yet</h4>
                  <p className="text-xs text-zinc-500 mt-1 mb-4">
                    Quizzes must have at least one question before they can be published.
                  </p>
                  <button
                    onClick={() => setIsAddingQuestion(true)}
                    className="px-3.5 py-1.5 rounded-md text-xs font-medium text-zinc-950 bg-zinc-100 hover:bg-zinc-200 transition-colors inline-flex items-center gap-1.5"
                  >
                    <span>Add First Question</span>
                  </button>
                </div>
              )}

              {/* Question List */}
              {quiz.questions && quiz.questions.length > 0 && (
                <div className="space-y-4">
                  {quiz.questions.map((question, idx) => (
                    <QuestionItem
                      key={question.id}
                      question={question}
                      index={idx}
                      totalCount={quiz.questions.length}
                      onUpdate={handleEditQuestion}
                      onDelete={handleDeleteQuestion}
                      onMoveUp={handleMoveUp}
                      onMoveDown={handleMoveDown}
                      isActionLoading={isActionLoading}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
