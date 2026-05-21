"use client";

import { useEffect, useRef } from "react";
import { GroupedSelectBlock as GroupedSelectBlockType } from "@/lib/brief-schema";
import { cn } from "@/lib/utils";

type Props = {
  block: GroupedSelectBlockType;
  stateKey: string;
  nested?: boolean;
  freeText: string;
  getSingle: (groupLabel: string) => string | undefined;
  setSingle: (groupLabel: string, value: string) => void;
  getMulti: (groupLabel: string) => string[];
  toggleMulti: (groupLabel: string, option: string) => void;
  onFreeTextChange: (value: string) => void;
};

const PILL_BASE =
  "w-full min-h-[44px] rounded-[12px] px-4 py-3 text-left flex items-center gap-3 transition-[background-color,border-color,transform] duration-[180ms] ease-out active:scale-[0.98] border";
const PILL_SELECTED = "border-transparent bg-[var(--color-surface)]";
const PILL_UNSELECTED = "border-[var(--color-fg)]/10 bg-transparent";
const LABEL_TEXT = "font-sans text-[14px] text-[var(--color-fg)]";

export function GroupedSelectBlock({
  block,
  stateKey,
  nested = false,
  freeText,
  getSingle,
  setSingle,
  getMulti,
  toggleMulti,
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

      <div className="mt-5 flex flex-col">
        {block.groups.map((group, gi) => {
          const labelId = `${stateKey}-group-${gi}`;
          const isMulti = group.selectionMode === "multi";
          const single = isMulti ? undefined : getSingle(group.label);
          const multi = isMulti ? getMulti(group.label) : [];
          return (
            <div
              key={group.label}
              role={isMulti ? "group" : "radiogroup"}
              aria-labelledby={labelId}
              className="flex flex-col"
            >
              <p
                id={labelId}
                className={cn(
                  "font-serif italic text-[13px] text-[var(--color-fg)]/60 mb-2",
                  gi === 0 ? "mt-0" : "mt-6"
                )}
              >
                {group.label}
              </p>
              <div className="flex flex-col gap-2">
                {group.options.map((option) => {
                  const isSelected = isMulti
                    ? multi.includes(option)
                    : single === option;
                  return (
                    <button
                      key={option}
                      type="button"
                      {...(isMulti
                        ? { "aria-pressed": isSelected }
                        : { role: "radio", "aria-checked": isSelected })}
                      onClick={() =>
                        isMulti
                          ? toggleMulti(group.label, option)
                          : setSingle(group.label, option)
                      }
                      className={cn(
                        PILL_BASE,
                        isSelected ? PILL_SELECTED : PILL_UNSELECTED
                      )}
                    >
                      <span
                        aria-hidden="true"
                        className={cn(
                          "flex h-[14px] w-[14px] flex-none items-center justify-center transition-colors duration-[180ms] ease-out",
                          isMulti ? "rounded-[3px]" : "rounded-full",
                          isSelected
                            ? "bg-[var(--color-fg)]/60"
                            : "border border-[var(--color-fg)]/30 bg-transparent"
                        )}
                      >
                        {isMulti && isSelected && (
                          <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
                            <path
                              d="M1.5 5.2L4 7.5L8.5 2.5"
                              stroke="var(--color-bg)"
                              strokeWidth="1.6"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </span>
                      <span className={LABEL_TEXT}>{option}</span>
                    </button>
                  );
                })}
              </div>
            </div>
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
