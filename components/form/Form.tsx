"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { formSchema } from "@/lib/form-schema";
import { useFormState } from "@/lib/use-form-state";
import { TopBar } from "./TopBar";
import { BottomBar } from "./BottomBar";
import { Question } from "./Question";
import { Recap } from "./Recap";

export function Form() {
  const state = useFormState(formSchema);

  const currentQuestion = formSchema.questions[state.index];

  // Global keyboard nav (Arrow up/down, Tab is native)
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      const inField =
        target &&
        (target.tagName === "INPUT" || target.tagName === "TEXTAREA");

      if (e.key === "ArrowDown") {
        // Don't hijack when typing in a textarea/input
        if (inField) return;
        e.preventDefault();
        state.next();
      } else if (e.key === "ArrowUp") {
        if (inField) return;
        e.preventDefault();
        state.prev();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [state]);

  return (
    <div className="flex min-h-dvh flex-col">
      <TopBar
        currentStep={state.currentStep}
        totalSteps={state.totalSteps}
        phase={state.phase}
        progress={state.progress}
        onPrev={state.prev}
        onSkip={state.skip}
        canGoBack={state.canGoBack}
        canSkip={state.canSkip}
      />

      <main className="flex flex-1 justify-center px-6 pt-6 pb-4">
        <div className="w-full max-w-[540px]">
          <AnimatePresence mode="wait">
            {state.phase === "form" && currentQuestion ? (
              <motion.div
                key={currentQuestion.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              >
                <Question
                  question={currentQuestion}
                  value={state.answers[currentQuestion.id]}
                  onChange={(v) => state.setAnswer(currentQuestion.id, v)}
                  onSubmit={state.next}
                />
              </motion.div>
            ) : (
              <motion.div
                key="recap"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              >
                <Recap
                  schema={formSchema}
                  answers={state.answers}
                  onReset={state.reset}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {state.phase === "form" && (
        <BottomBar
          onNext={state.next}
          canAdvance={state.canAdvance}
          isLastQuestion={state.isLastQuestion}
        />
      )}
    </div>
  );
}
