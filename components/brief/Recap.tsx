"use client";

import { Block, QuestionLeafBlock, Step } from "@/lib/brief-schema";
import { UseBriefState } from "@/lib/use-brief-state";
import { generateBriefPdf } from "@/lib/pdf";

type Props = {
  steps: Step[];
  state: UseBriefState;
  onPrev: () => void;
};

const DASH = <span className="text-[var(--color-muted)]">—</span>;

function LeafView({
  block,
  state,
}: {
  block: QuestionLeafBlock;
  state: UseBriefState;
}) {
  if (block.type === "multi-select") {
    const a = state.getAnswer(block.id);
    return (
      <div className="flex flex-col gap-1 text-sm text-[var(--color-fg)]">
        {a.checked.length > 0 ? (
          <ul className="list-disc pl-5">
            {a.checked.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        ) : (
          DASH
        )}
        {a.freeText.trim() && (
          <p className="text-sm text-[var(--color-muted)]">
            Autre — {a.freeText.trim()}
          </p>
        )}
      </div>
    );
  }
  if (block.type === "single-select") {
    const v = state.getSingleChoice(block.id);
    const a = state.getAnswer(block.id);
    return (
      <div className="flex flex-col gap-1 text-sm text-[var(--color-fg)]">
        <span>{v || DASH}</span>
        {a.freeText.trim() && (
          <p className="text-sm text-[var(--color-muted)]">
            Autre — {a.freeText.trim()}
          </p>
        )}
      </div>
    );
  }
  if (block.type === "grouped-select") {
    const a = state.getAnswer(block.id);
    return (
      <div className="flex flex-col gap-2 text-sm text-[var(--color-fg)]">
        {block.groups.map((g) => {
          const value =
            g.selectionMode === "single"
              ? state.getGroupedSingle(block.id, g.label)
              : state.getGroupedMulti(block.id, g.label);
          const display = Array.isArray(value)
            ? value.length
              ? value.join(", ")
              : null
            : value || null;
          return (
            <div key={g.label} className="flex flex-col">
              <span className="text-xs text-[var(--color-muted)]">
                {g.label}
              </span>
              <span>{display ?? DASH}</span>
            </div>
          );
        })}
        {a.freeText.trim() && (
          <p className="text-sm text-[var(--color-muted)]">
            {a.freeText.trim()}
          </p>
        )}
      </div>
    );
  }
  if (block.type === "free-text") {
    return (
      <div className="flex flex-col gap-2 text-sm text-[var(--color-fg)]">
        {block.fields.map((f) => {
          const v = state.getFieldValue(block.id, f.id);
          return (
            <div key={f.id} className="flex flex-col">
              <span className="text-xs text-[var(--color-muted)]">
                {f.label}
              </span>
              <span>{v.trim() ? v : DASH}</span>
            </div>
          );
        })}
      </div>
    );
  }
  // notes
  const a = state.getAnswer(block.id);
  return (
    <div className="text-sm text-[var(--color-fg)] whitespace-pre-wrap">
      {a.freeText.trim() ? a.freeText : DASH}
    </div>
  );
}

function BlockView({ block, state }: { block: Block; state: UseBriefState }) {
  if (block.type === "text") {
    return (
      <dd className="font-serif text-base text-[var(--color-fg)]">
        {state.getContent(block.id) || "—"}
      </dd>
    );
  }
  if (block.type === "composite") {
    return (
      <dd className="flex flex-col gap-3">
        {block.blocks.map((sub) => (
          <div key={sub.id} className="flex flex-col gap-1">
            <span className="text-xs text-[var(--color-muted)]">
              {sub.prompt}
            </span>
            <LeafView block={sub} state={state} />
          </div>
        ))}
      </dd>
    );
  }
  return (
    <dd>
      <LeafView block={block} state={state} />
    </dd>
  );
}

export function Recap({ steps, state, onPrev }: Props) {
  function handleDownload() {
    generateBriefPdf(steps, state);
  }

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <p className="text-xs uppercase tracking-[0.15em] text-[var(--color-muted)]">
          Récapitulatif
        </p>
        <h1 className="font-serif text-3xl leading-[1.1] text-[var(--color-fg)]">
          Votre brief est prêt
        </h1>
        <p className="text-sm text-[var(--color-muted)]">
          Téléchargez le PDF ou recommencez pour ajuster vos réponses.
        </p>
      </header>

      <div className="flex flex-col gap-6">
        {steps.map((step) => (
          <section key={step.id} className="flex flex-col gap-3">
            <h2 className="border-b border-[var(--color-line)] pb-2 text-xs font-semibold uppercase tracking-[0.15em] text-[var(--color-fg)]">
              {step.label}
            </h2>
            <dl className="flex flex-col gap-4">
              {step.blocks.map((block) => {
                const heading =
                  "heading" in block && block.heading ? block.heading : block.id;
                return (
                  <div key={block.id} className="flex flex-col gap-1">
                    <dt className="text-xs text-[var(--color-muted)]">
                      {heading}
                    </dt>
                    <BlockView block={block} state={state} />
                  </div>
                );
              })}
            </dl>
          </section>
        ))}
      </div>

      <div className="sticky bottom-0 -mx-6 flex items-center justify-between border-t border-[var(--color-line)] bg-[var(--color-bg)] px-6 pt-4 pb-5">
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
        <button
          type="button"
          onClick={handleDownload}
          className="rounded-full bg-[var(--color-fg)] px-6 py-3 text-sm font-medium text-[var(--color-bg)] transition-opacity hover:opacity-90"
        >
          Télécharger le PDF
        </button>
      </div>
    </div>
  );
}
