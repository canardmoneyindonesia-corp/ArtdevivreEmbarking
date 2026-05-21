"use client";

import { useEffect, useRef } from "react";
import { FreeTextBlock as FreeTextBlockType } from "@/lib/brief-schema";
import { cn } from "@/lib/utils";

type Props = {
  block: FreeTextBlockType;
  stateKey: string;
  nested?: boolean;
  getValue: (fieldId: string) => string;
  onChange: (fieldId: string, value: string) => void;
};

function AutoGrowInput({
  id,
  value,
  placeholder,
  onChange,
}: {
  id: string;
  value: string;
  placeholder?: string;
  onChange: (v: string) => void;
}) {
  const ref = useRef<HTMLTextAreaElement | null>(null);

  function autosize() {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }

  useEffect(() => {
    autosize();
  }, [value]);

  return (
    <textarea
      id={id}
      ref={ref}
      value={value}
      rows={1}
      placeholder={placeholder}
      onChange={(e) => {
        onChange(e.target.value);
        autosize();
      }}
      className={cn(
        "block w-full resize-none border-0 border-b border-[var(--color-fg)]/15 bg-transparent px-0 py-2 min-h-[44px]",
        "font-sans text-[15px] leading-[1.5] text-[var(--color-fg)]",
        "transition-[border-color] duration-200",
        "focus:outline-none focus:border-b-2 focus:border-[var(--color-fg)]",
        "placeholder:italic placeholder:text-[var(--color-fg)]/40"
      )}
    />
  );
}

export function FreeTextBlock({
  block,
  stateKey,
  nested = false,
  getValue,
  onChange,
}: Props) {
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

      <div className="mt-5 flex flex-col gap-4">
        {block.fields.map((field) => {
          const inputId = `${stateKey}-${field.id}`;
          return (
            <div
              key={field.id}
              className="flex flex-col gap-1 sm:flex-row sm:items-start sm:gap-4"
            >
              <label
                htmlFor={inputId}
                className="font-sans text-[14px] leading-[1.5] text-[var(--color-fg)]/70 sm:w-[40%] sm:pt-2"
              >
                {field.label}
              </label>
              <div className="sm:w-[60%]">
                <AutoGrowInput
                  id={inputId}
                  value={getValue(field.id)}
                  placeholder={field.placeholder}
                  onChange={(v) => onChange(field.id, v)}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
