"use client";

import { useEffect, useRef } from "react";
import { Question as QuestionType, AnswerValue } from "@/lib/form-schema";
import { Pills } from "./Pills";

type Props = {
  question: QuestionType;
  value: AnswerValue;
  onChange: (value: AnswerValue) => void;
  onSubmit: () => void;
};

export function Question({ question, value, onChange, onSubmit }: Props) {
  const focusRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  useEffect(() => {
    focusRef.current?.focus();
  }, [question.id]);

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      if (question.type === "long-text" && e.shiftKey) return;
      e.preventDefault();
      onSubmit();
    }
  }

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h1 className="font-serif text-2xl leading-[1.15] tracking-tight text-[var(--color-fg)] sm:text-4xl">
          {question.question}
        </h1>
        {question.hint && (
          <p className="text-sm text-[var(--color-muted)]">{question.hint}</p>
        )}
      </div>

      <div className="pt-1">
        {question.type === "short-text" && (
          <input
            ref={(el) => {
              focusRef.current = el;
            }}
            type="text"
            value={(value as string) ?? ""}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKey}
            placeholder={question.placeholder}
            className="w-full border-b border-[var(--color-fg)] bg-transparent py-3 text-xl text-[var(--color-fg)] placeholder:text-[var(--color-muted)]/60 focus:outline-none"
          />
        )}

        {question.type === "long-text" && (
          <textarea
            ref={(el) => {
              focusRef.current = el;
            }}
            value={(value as string) ?? ""}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKey}
            placeholder={question.placeholder}
            rows={4}
            className="w-full resize-none rounded-md border border-[var(--color-line)] bg-transparent p-4 text-base text-[var(--color-fg)] placeholder:text-[var(--color-muted)]/60 focus:border-[var(--color-fg)] focus:outline-none"
          />
        )}

        {question.type === "number" && (
          <input
            ref={(el) => {
              focusRef.current = el;
            }}
            type="number"
            inputMode="numeric"
            value={
              value === undefined || value === null ? "" : String(value)
            }
            onChange={(e) => {
              const raw = e.target.value;
              if (raw === "") onChange(undefined);
              else {
                const n = Number(raw);
                onChange(Number.isNaN(n) ? raw : n);
              }
            }}
            onKeyDown={handleKey}
            placeholder={question.placeholder}
            className="w-full border-b border-[var(--color-fg)] bg-transparent py-3 text-xl text-[var(--color-fg)] placeholder:text-[var(--color-muted)]/60 focus:outline-none"
          />
        )}

        {question.type === "single-select" && question.options && (
          <Pills
            options={question.options}
            mode="single"
            value={value as string | undefined}
            onChange={(v) => onChange(v as string)}
          />
        )}

        {question.type === "multi-select" && question.options && (
          <Pills
            options={question.options}
            mode="multi"
            value={value as string[] | undefined}
            onChange={(v) => onChange(v as string[])}
          />
        )}
      </div>
    </div>
  );
}
