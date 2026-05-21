"use client";

import { useMemo } from "react";
import { Answers, FormSchema, Question } from "@/lib/form-schema";
import { generatePdf } from "@/lib/pdf";

type Props = {
  schema: FormSchema;
  answers: Answers;
  onReset: () => void;
};

function formatAnswer(q: Question, value: Answers[string]): string {
  if (value === undefined || value === null || value === "") return "—";
  if (Array.isArray(value)) {
    if (value.length === 0) return "—";
    return value
      .map((v) => q.options?.find((o) => o.value === v)?.label ?? v)
      .join(", ");
  }
  if (q.type === "single-select" && q.options) {
    return q.options.find((o) => o.value === value)?.label ?? String(value);
  }
  return String(value);
}

export function Recap({ schema, answers, onReset }: Props) {
  const groups = useMemo(() => {
    const out: { label: string; questions: Question[] }[] = [];
    for (const q of schema.questions) {
      let g = out.find((x) => x.label === q.sectionLabel);
      if (!g) {
        g = { label: q.sectionLabel, questions: [] };
        out.push(g);
      }
      g.questions.push(q);
    }
    return out;
  }, [schema]);

  function handleDownload() {
    generatePdf(schema, answers);
  }

  return (
    <div className="flex flex-col gap-10 pb-12">
      <header className="flex flex-col gap-3">
        <p className="text-xs uppercase tracking-[0.15em] text-[var(--color-muted)]">
          Récapitulatif
        </p>
        <h1 className="font-serif text-4xl leading-[1.1] text-[var(--color-fg)]">
          Merci pour vos réponses
        </h1>
        <p className="text-sm text-[var(--color-muted)]">
          Relisez ci-dessous puis téléchargez votre récapitulatif au format
          PDF.
        </p>
      </header>

      <div className="flex flex-col gap-8">
        {groups.map((group) => (
          <section key={group.label} className="flex flex-col gap-4">
            <h2 className="border-b border-[var(--color-line)] pb-2 text-xs font-semibold uppercase tracking-[0.15em] text-[var(--color-fg)]">
              {group.label}
            </h2>
            <dl className="flex flex-col gap-5">
              {group.questions.map((q) => (
                <div key={q.id} className="flex flex-col gap-1">
                  <dt className="text-xs text-[var(--color-muted)]">
                    {q.question}
                  </dt>
                  <dd className="font-serif text-lg text-[var(--color-fg)]">
                    {formatAnswer(q, answers[q.id])}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
      </div>

      <div className="flex flex-col gap-3 border-t border-[var(--color-line)] pt-8 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={onReset}
          className="text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-fg)]"
        >
          ← Recommencer
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
