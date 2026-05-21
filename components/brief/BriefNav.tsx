"use client";

type Props = {
  onNext: () => void;
  onPrev: () => void;
  canPrev: boolean;
  canNext?: boolean;
  isLastStep: boolean;
};

export function BriefNav({ onNext, onPrev, canPrev, canNext = true, isLastStep }: Props) {
  return (
    <footer className="sticky bottom-0 z-10 px-6 py-2.5 backdrop-blur-[8px] bg-[color-mix(in_srgb,var(--color-bg)_85%,transparent)]">
      <div className="mx-auto flex w-full max-w-[540px] items-center justify-between">
        {canPrev ? (
          <button
            type="button"
            onClick={onPrev}
            className="group inline-flex items-center gap-2 text-sm font-medium tracking-wide text-[var(--color-fg)] transition-opacity duration-200 hover:opacity-60"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:-translate-x-1"
            >
              <path
                d="M12 7H2M2 7L6.5 2.5M2 7L6.5 11.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="underline decoration-[0.5px] underline-offset-[6px]">
              Précédent
            </span>
          </button>
        ) : (
          <span />
        )}
        <button
          type="button"
          onClick={onNext}
          disabled={!canNext}
          aria-disabled={!canNext}
          title={!canNext ? "Faites défiler jusqu'en bas pour continuer" : undefined}
          className="group inline-flex items-center gap-2 text-sm font-medium tracking-wide text-[var(--color-fg)] transition-opacity duration-200 hover:opacity-60 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:opacity-30"
        >
          <span className="underline decoration-[0.5px] underline-offset-[6px]">
            {isLastStep ? "Voir le récapitulatif" : "Suivant"}
          </span>
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            className="transition-transform duration-300 group-hover:translate-x-1"
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
