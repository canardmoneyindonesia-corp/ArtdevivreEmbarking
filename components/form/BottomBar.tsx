"use client";

import { cn } from "@/lib/utils";

type Props = {
  onNext: () => void;
  canAdvance: boolean;
  isLastQuestion: boolean;
};

export function BottomBar({ onNext, canAdvance, isLastQuestion }: Props) {
  return (
    <footer className="sticky bottom-0 z-10 bg-[var(--color-bg)] px-6 pb-5 pt-2">
      <div className="mx-auto flex w-full max-w-[540px] items-center justify-end">
        <button
          type="button"
          onClick={onNext}
          disabled={!canAdvance}
          className={cn(
            "group inline-flex items-center gap-2 text-sm font-medium tracking-wide transition-opacity duration-200",
            canAdvance
              ? "text-[var(--color-fg)] hover:opacity-60"
              : "cursor-not-allowed text-[var(--color-muted)] opacity-40"
          )}
        >
          <span className="underline decoration-[0.5px] underline-offset-[6px]">
            {isLastQuestion ? "Terminer" : "Suivant"}
          </span>
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            className={cn(
              "transition-transform duration-300",
              canAdvance && "group-hover:translate-x-1"
            )}
          >
            <path
              d="M2 7H12M12 7L7.5 2.5M12 7L7.5 11.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </footer>
  );
}
