"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useBriefState } from "@/lib/use-brief-state";
import { ProgressBar } from "@/components/brief/ProgressBar";
import { Step } from "@/components/brief/Step";
import { BriefNav } from "@/components/brief/BriefNav";
import { Recap } from "@/components/brief/Recap";

export default function Home() {
  const b = useBriefState();

  const [atBottom, setAtBottom] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [b.index, b.done]);

  useEffect(() => {
    function check() {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight > 1;
      if (!scrollable) {
        setAtBottom(true);
        return;
      }
      const reached =
        window.innerHeight + window.scrollY >= doc.scrollHeight - 2;
      setAtBottom(reached);
    }
    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    const ro = new ResizeObserver(check);
    ro.observe(document.body);
    return () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
      ro.disconnect();
    };
  }, [b.index, b.done]);

  function handleNext() {
    if (b.isLastStep) {
      b.finish();
      return;
    }
    b.goNext();
  }

  return (
    <div className="flex min-h-dvh flex-col">
      {!b.done && (
        <ProgressBar
          currentStepIndex={b.index}
          totalSteps={b.total}
          onPrev={b.goPrev}
          canPrev={b.canPrev}
        />
      )}

      <main className="flex flex-1 flex-col items-center px-6 pt-3 pb-2">
        <div className="w-full max-w-[540px]">
          <AnimatePresence mode="wait">
            {b.done ? (
              <motion.div
                key="recap"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              >
                <Recap
                  steps={b.steps}
                  getContent={b.getContent}
                  getAnswer={b.getAnswer}
                  onPrev={b.unfinish}
                />
              </motion.div>
            ) : (
              <motion.div
                key={b.current.id}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              >
                <Step step={b.current} state={b} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {!b.done && (
        <BriefNav
          onNext={handleNext}
          onPrev={b.goPrev}
          canPrev={b.canPrev}
          canNext={atBottom}
          isLastStep={b.isLastStep}
        />
      )}
    </div>
  );
}
