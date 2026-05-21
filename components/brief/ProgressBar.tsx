"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type Props = {
  currentStepIndex: number;
  totalSteps: number;
  onPrev: () => void;
  canPrev: boolean;
};

export function ProgressBar({
  currentStepIndex,
  totalSteps,
  onPrev,
  canPrev,
}: Props) {
  const stepNumber = currentStepIndex + 1;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <header className="sticky top-0 z-10 w-full bg-[var(--color-bg)] px-6 py-2">
      <div className="mx-auto w-full max-w-[540px]">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
          <div className="flex justify-start">
            <button
              type="button"
              onClick={onPrev}
              disabled={!canPrev}
              aria-label="Précédent"
              className={cn(
                "group flex h-7 w-7 items-center justify-center rounded-full text-[var(--color-fg)] transition-colors",
                canPrev
                  ? "hover:bg-black/[0.06]"
                  : "cursor-not-allowed opacity-30"
              )}
            >
              <span
                className={cn(
                  "inline-flex transition-transform duration-150 ease-out",
                  canPrev && "group-hover:-translate-x-[2px]"
                )}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M10 3L5 8l5 5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </button>
          </div>

          <div className="flex justify-center">
            <span className="text-xs font-medium tracking-wide text-[var(--color-muted)]">
              Étape {stepNumber} sur {totalSteps}
            </span>
          </div>

          <div />
        </div>

        <div
          className="mt-2 flex w-full gap-1.5"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={totalSteps}
          aria-valuenow={stepNumber}
        >
          {Array.from({ length: totalSteps }).map((_, i) => {
            const filled = i <= currentStepIndex;
            return (
              <div
                key={i}
                className="relative h-[2px] flex-1 overflow-hidden rounded-full bg-[var(--color-line)]"
              >
                <div
                  className="absolute inset-0 origin-left rounded-full bg-[var(--color-fg)] transition-transform duration-[400ms] ease-out"
                  style={{
                    transform: mounted && filled ? "scaleX(1)" : "scaleX(0)",
                    transitionDelay: `${i * 80}ms`,
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </header>
  );
}
