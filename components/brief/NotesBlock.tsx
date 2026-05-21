"use client";

import { useEffect, useRef } from "react";
import { NotesBlock as NotesBlockType } from "@/lib/brief-schema";
import { cn } from "@/lib/utils";

type Props = {
  block: NotesBlockType;
  stateKey: string;
  nested?: boolean;
  value: string;
  onChange: (value: string) => void;
};

export function NotesBlock({
  block,
  stateKey,
  nested = false,
  value,
  onChange,
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
  }, [value]);

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

      {block.bullets && block.bullets.length > 0 && (
        <ul className="mt-5 flex flex-col gap-2 list-disc pl-5 marker:text-[var(--color-fg)]/40">
          {block.bullets.map((b) => (
            <li
              key={b}
              className="font-sans text-[15px] leading-[1.5] text-[var(--color-fg)]"
            >
              {b}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-6">
        {block.textareaLabel && (
          <label
            htmlFor={`${stateKey}-notes`}
            className="font-serif text-[18px] leading-tight text-[var(--color-fg)]"
          >
            {block.textareaLabel}
          </label>
        )}
        <textarea
          id={`${stateKey}-notes`}
          ref={taRef}
          value={value}
          rows={4}
          placeholder={block.textareaPlaceholder}
          onChange={(e) => {
            onChange(e.target.value);
            autosize();
          }}
          className={cn(
            block.textareaLabel ? "mt-2" : "",
            "block w-full resize-none border-0 border-b border-[var(--color-fg)]/15 bg-transparent px-0 py-2 min-h-[140px]",
            "font-sans text-[15px] leading-[1.5] text-[var(--color-fg)]",
            "transition-[border-color] duration-200",
            "focus:outline-none focus:border-b-2 focus:border-[var(--color-fg)]",
            "placeholder:italic placeholder:text-[var(--color-fg)]/40"
          )}
        />
      </div>
    </div>
  );
}
