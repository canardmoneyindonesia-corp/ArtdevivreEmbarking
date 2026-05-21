"use client";

import { cn } from "@/lib/utils";
import { ProgressBar } from "./ProgressBar";

type Props = {
  currentStep: number;
  totalSteps: number;
  phase: "form" | "recap";
  progress: number;
  onPrev: () => void;
  onSkip: () => void;
  canGoBack: boolean;
  canSkip: boolean;
};

export function TopBar({
  currentStep,
  totalSteps,
  phase,
  progress,
  onPrev,
  onSkip,
  canGoBack,
  canSkip,
}: Props) {
  return (
    <header className="sticky top-0 z-10 w-full bg-[var(--color-bg)] px-6 py-2">
      <div className="mx-auto w-full max-w-[540px]">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
          <div className="flex justify-start">
            <button
              type="button"
              onClick={onPrev}
              disabled={!canGoBack}
              aria-label="Précédent"
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-full text-[var(--color-fg)] transition-colors",
                canGoBack
                  ? "hover:bg-black/[0.06]"
                  : "cursor-not-allowed opacity-30"
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
            </button>
          </div>

          <div className="flex justify-center">
            <span className="text-xs font-medium tracking-wide text-[var(--color-muted)]">
              {phase === "recap"
                ? "Récapitulatif"
                : `Étape ${currentStep} sur ${totalSteps}`}
            </span>
          </div>

          <div className="flex justify-end">
            {canSkip && (
              <button
                type="button"
                onClick={onSkip}
                className="text-sm font-medium text-[var(--color-fg)] transition-opacity hover:opacity-70"
              >
                Passer
              </button>
            )}
          </div>
        </div>

        <div className="mt-2">
          <ProgressBar progress={progress} />
        </div>
      </div>
    </header>
  );
}
