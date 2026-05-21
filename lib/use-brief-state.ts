"use client";

import { useCallback, useMemo, useState } from "react";
import { brief as defaultSteps, Step } from "./brief-schema";

export type QuestionAnswer = {
  checked: string[];
  freeText: string;
};

export type UseBriefState = {
  steps: Step[];
  index: number;
  current: Step;
  total: number;
  canPrev: boolean;
  isLastStep: boolean;
  done: boolean;
  goNext: () => void;
  goPrev: () => void;
  finish: () => void;
  unfinish: () => void;
  reset: () => void;
  updateBlock: (blockId: string, value: string) => void;
  getContent: (blockId: string) => string;
  isModified: (blockId: string) => boolean;
  getAnswer: (blockId: string) => QuestionAnswer;
  toggleOption: (blockId: string, option: string) => void;
  setFreeText: (blockId: string, value: string) => void;
  getSingleChoice: (blockId: string) => string | undefined;
  setSingleChoice: (blockId: string, value: string) => void;
  getGroupedSingle: (blockId: string, groupLabel: string) => string | undefined;
  setGroupedSingle: (blockId: string, groupLabel: string, value: string) => void;
  getGroupedMulti: (blockId: string, groupLabel: string) => string[];
  toggleGroupedOption: (blockId: string, groupLabel: string, option: string) => void;
  getFieldValue: (blockId: string, fieldId: string) => string;
  setFieldValue: (blockId: string, fieldId: string, value: string) => void;
};

const EMPTY_ANSWER: QuestionAnswer = { checked: [], freeText: "" };

export function useBriefState(steps: Step[] = defaultSteps): UseBriefState {
  const originals = useMemo(() => {
    const m: Record<string, string> = {};
    for (const s of steps)
      for (const b of s.blocks) if (b.type === "text") m[b.id] = b.content;
    return m;
  }, [steps]);

  const [edits, setEdits] = useState<Record<string, string>>({});
  const [answers, setAnswers] = useState<Record<string, QuestionAnswer>>({});
  const [singleChoice, setSingleChoiceState] = useState<Record<string, string>>({});
  const [groupedChoice, setGroupedChoiceState] = useState<
    Record<string, Record<string, string | string[]>>
  >({});
  const [fieldValues, setFieldValuesState] = useState<
    Record<string, Record<string, string>>
  >({});
  const [index, setIndex] = useState(0);
  const [done, setDone] = useState(false);

  const total = steps.length;
  const current = steps[index];
  const isLastStep = index === total - 1;
  const canPrev = index > 0;

  const goNext = useCallback(() => {
    setIndex((i) => Math.min(i + 1, total - 1));
  }, [total]);

  const goPrev = useCallback(() => {
    setIndex((i) => Math.max(i - 1, 0));
  }, []);

  const finish = useCallback(() => setDone(true), []);
  const unfinish = useCallback(() => setDone(false), []);

  const reset = useCallback(() => {
    setEdits({});
    setAnswers({});
    setSingleChoiceState({});
    setGroupedChoiceState({});
    setFieldValuesState({});
    setIndex(0);
    setDone(false);
  }, []);

  const updateBlock = useCallback((blockId: string, value: string) => {
    setEdits((prev) => ({ ...prev, [blockId]: value }));
  }, []);

  const getContent = useCallback(
    (blockId: string) => edits[blockId] ?? originals[blockId] ?? "",
    [edits, originals]
  );

  const isModified = useCallback(
    (blockId: string) =>
      edits[blockId] !== undefined && edits[blockId] !== originals[blockId],
    [edits, originals]
  );

  const getAnswer = useCallback(
    (blockId: string) => answers[blockId] ?? EMPTY_ANSWER,
    [answers]
  );

  const toggleOption = useCallback((blockId: string, option: string) => {
    setAnswers((prev) => {
      const curr = prev[blockId] ?? EMPTY_ANSWER;
      const has = curr.checked.includes(option);
      const checked = has
        ? curr.checked.filter((o) => o !== option)
        : [...curr.checked, option];
      return { ...prev, [blockId]: { ...curr, checked } };
    });
  }, []);

  const setFreeText = useCallback((blockId: string, value: string) => {
    setAnswers((prev) => {
      const curr = prev[blockId] ?? EMPTY_ANSWER;
      return { ...prev, [blockId]: { ...curr, freeText: value } };
    });
  }, []);

  const getSingleChoice = useCallback(
    (blockId: string) => singleChoice[blockId],
    [singleChoice]
  );

  const setSingleChoice = useCallback((blockId: string, value: string) => {
    setSingleChoiceState((prev) => ({ ...prev, [blockId]: value }));
  }, []);

  const getGroupedSingle = useCallback(
    (blockId: string, groupLabel: string) => {
      const v = groupedChoice[blockId]?.[groupLabel];
      return typeof v === "string" ? v : undefined;
    },
    [groupedChoice]
  );

  const setGroupedSingle = useCallback(
    (blockId: string, groupLabel: string, value: string) => {
      setGroupedChoiceState((prev) => ({
        ...prev,
        [blockId]: { ...(prev[blockId] ?? {}), [groupLabel]: value },
      }));
    },
    []
  );

  const getGroupedMulti = useCallback(
    (blockId: string, groupLabel: string) => {
      const v = groupedChoice[blockId]?.[groupLabel];
      return Array.isArray(v) ? v : [];
    },
    [groupedChoice]
  );

  const toggleGroupedOption = useCallback(
    (blockId: string, groupLabel: string, option: string) => {
      setGroupedChoiceState((prev) => {
        const block = prev[blockId] ?? {};
        const curr = block[groupLabel];
        const arr = Array.isArray(curr) ? curr : [];
        const next = arr.includes(option)
          ? arr.filter((o) => o !== option)
          : [...arr, option];
        return { ...prev, [blockId]: { ...block, [groupLabel]: next } };
      });
    },
    []
  );

  const getFieldValue = useCallback(
    (blockId: string, fieldId: string) =>
      fieldValues[blockId]?.[fieldId] ?? "",
    [fieldValues]
  );

  const setFieldValue = useCallback(
    (blockId: string, fieldId: string, value: string) => {
      setFieldValuesState((prev) => ({
        ...prev,
        [blockId]: { ...(prev[blockId] ?? {}), [fieldId]: value },
      }));
    },
    []
  );

  return {
    steps,
    index,
    current,
    total,
    canPrev,
    isLastStep,
    done,
    goNext,
    goPrev,
    finish,
    unfinish,
    reset,
    updateBlock,
    getContent,
    isModified,
    getAnswer,
    toggleOption,
    setFreeText,
    getSingleChoice,
    setSingleChoice,
    getGroupedSingle,
    setGroupedSingle,
    getGroupedMulti,
    toggleGroupedOption,
    getFieldValue,
    setFieldValue,
  };
}
