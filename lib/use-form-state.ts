"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Answers,
  AnswerValue,
  FormSchema,
  isAnswered,
} from "./form-schema";

const STORAGE_KEY = "discovery-form-answers-v1";
const INDEX_KEY = "discovery-form-index-v1";

export type Phase = "form" | "recap";

export type UseFormState = {
  index: number;
  phase: Phase;
  total: number;
  currentStep: number;
  totalSteps: number;
  answers: Answers;
  setAnswer: (id: string, value: AnswerValue) => void;
  next: () => void;
  prev: () => void;
  skip: () => void;
  goToRecap: () => void;
  reset: () => void;
  canAdvance: boolean;
  canGoBack: boolean;
  canSkip: boolean;
  isLastQuestion: boolean;
  progress: number;
};

export function useFormState(schema: FormSchema): UseFormState {
  const [answers, setAnswers] = useState<Answers>({});
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("form");
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const rawAnswers = localStorage.getItem(STORAGE_KEY);
      if (rawAnswers) setAnswers(JSON.parse(rawAnswers));
      const rawIndex = localStorage.getItem(INDEX_KEY);
      if (rawIndex) {
        const i = parseInt(rawIndex, 10);
        if (!Number.isNaN(i) && i >= 0 && i < schema.questions.length) {
          setIndex(i);
        }
      }
    } catch {
      // ignore
    }
    setHydrated(true);
  }, [schema.questions.length]);

  // Persist answers
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
    } catch {
      // ignore
    }
  }, [answers, hydrated]);

  // Persist index
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(INDEX_KEY, String(index));
    } catch {
      // ignore
    }
  }, [index, hydrated]);

  const total = schema.questions.length;
  const totalSteps = schema.steps.length;
  const currentQ = schema.questions[index];
  const currentStep = currentQ?.step ?? 1;

  const setAnswer = useCallback((id: string, value: AnswerValue) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  }, []);

  const isLastQuestion = index === total - 1;

  const canAdvance = useMemo(() => {
    if (!currentQ) return false;
    if (!currentQ.required) return true;
    return isAnswered(currentQ, answers[currentQ.id]);
  }, [currentQ, answers]);

  const canGoBack = index > 0 || phase === "recap";

  const next = useCallback(() => {
    if (phase === "recap") return;
    if (!canAdvance) return;
    if (isLastQuestion) {
      setPhase("recap");
      return;
    }
    setIndex((i) => Math.min(i + 1, total - 1));
  }, [phase, canAdvance, isLastQuestion, total]);

  const prev = useCallback(() => {
    if (phase === "recap") {
      setPhase("form");
      return;
    }
    setIndex((i) => Math.max(i - 1, 0));
  }, [phase]);

  const skip = useCallback(() => {
    if (phase === "recap") return;
    if (currentQ?.required) return;
    if (isLastQuestion) {
      setPhase("recap");
      return;
    }
    setIndex((i) => Math.min(i + 1, total - 1));
  }, [phase, currentQ, isLastQuestion, total]);

  const canSkip = phase === "form" && !!currentQ && !currentQ.required;

  const progress =
    phase === "recap" ? 1 : total === 0 ? 0 : (index + 1) / total;

  const goToRecap = useCallback(() => setPhase("recap"), []);

  const reset = useCallback(() => {
    setAnswers({});
    setIndex(0);
    setPhase("form");
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(INDEX_KEY);
    } catch {
      // ignore
    }
  }, []);

  return {
    index,
    phase,
    total,
    currentStep,
    totalSteps,
    answers,
    setAnswer,
    next,
    prev,
    skip,
    goToRecap,
    reset,
    canAdvance,
    canGoBack,
    canSkip,
    isLastQuestion,
    progress,
  };
}
