"use client";

import { useEffect, useRef } from "react";
import { SingleSelectBlock as SingleSelectBlockType } from "@/lib/brief-schema";
import { cn } from "@/lib/utils";

type Props = {
  block: SingleSelectBlockType;
  stateKey: string;
  nested?: boolean;
  value: string | undefined;
  freeText: string;
  onSelect: (option: string) => void;
  onFreeTextChange: (value: string) => void;
};

export function SingleSelectBlock({
  block,
  stateKey,
  nested = false,
  value,
  freeText,
  onSelect,
  onFreeTextChange,
}: Props) {
  const taRef = useRef<HTMLTextAreaElement | null>(null);

  function autosize() {
    const ta = taRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${ta.scrollHeight}px`;
  }

  useEffect(() => {
    autosize();
  }, [freeText]);

  return (
    <div className="flex flex-col">
      {!nested && block.heading && (
        <h2 className="font-serif text-[28px] leading-[1.15] text-[var(--color-fg)] max-sm:text-[24px]">
          {block.heading}
        </h2>
      )}
      <p
        className={cn(
          nested
            ? "font-sans text-[14px] italic leading-[1.5] text-[var(--color-fg)]/70 m-0 max-w-[60ch]"
            : "mt-2 font-sans text-[15px] leading-[1.5] text-[var(--color-fg)]/70 m-0 max-w-[60ch]"
        )}
      >
        {block.prompt}
      </p>

      <div role="radiogroup" className="mt-5 flex flex-col gap-2">
        {block.options.map((option) => {
          const isSelected = value === option;
          return (
            <button
              key={option}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onSelect(option)}
              className={cn(
                "w-full min-h-[44px] rounded-[12px] px-4 py-3 text-left",
                "flex items-center gap-3",
                "transition-[background-color,border-color,transform] duration-[180ms] ease-out",
                "active:scale-[0.98]",
                "border",
                isSelected
                  ? "border-transparent bg-[var(--color-surface)]"
                  : "border-[var(--color-fg)]/10 bg-transparent"
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  "flex h-[14px] w-[14px] flex-none items-center justify-center rounded-full transition-colors duration-[180ms] ease-out",
                  isSelected
                    ? "bg-[var(--color-fg)]/60"
                    : "border border-[var(--color-fg)]/30 bg-transparent"
                )}
              />
              <span className="font-sans text-[14px] text-[var(--color-fg)]">
                {option}
              </span>
            </button>
          );
        })}
      </div>

      {block.freeTextLabel && (
        <div className="mt-8">
          <label
            htmlFor={`${stateKey}-freetext`}
            className="font-serif text-[18px] leading-tight text-[var(--color-fg)]"
          >
            {block.freeTextLabel}
          </label>
          <textarea
            id={`${stateKey}-freetext`}
            ref={taRef}
            value={freeText}
            onChange={(e) => {
              onFreeTextChange(e.target.value);
              autosize();
            }}
            placeholder={block.freeTextPlaceholder}
            rows={1}
            className={cn(
              "mt-2 block w-full resize-none border-0 border-b border-[var(--color-fg)]/15 bg-transparent px-0 py-2 min-h-[80px]",
              "font-sans text-[15px] leading-[1.5] text-[var(--color-fg)]",
              "transition-[border-color] duration-200",
              "focus:outline-none focus:border-b-2 focus:border-[var(--color-fg)]",
              "placeholder:italic placeholder:text-[var(--color-fg)]/40"
            )}
          />
        </div>
      )}
    </div>
  );
}
