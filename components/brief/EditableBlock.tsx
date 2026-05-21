"use client";

import { useEffect, useRef, useState } from "react";
import { TextBlock } from "@/lib/brief-schema";
import { cn } from "@/lib/utils";

type Props = {
  block: TextBlock;
  value: string;
  isModified: boolean;
  onChange: (value: string) => void;
};

const BODY_CLASSES =
  "font-sans text-[16px] leading-[1.7] text-[var(--color-fg)] m-0";

export function EditableBlock({ block, value, isModified, onChange }: Props) {
  const [editing, setEditing] = useState(false);
  const [hovered, setHovered] = useState(false);
  const taRef = useRef<HTMLTextAreaElement | null>(null);

  function autosize() {
    const ta = taRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${ta.scrollHeight}px`;
  }

  useEffect(() => {
    if (!editing) return;
    const ta = taRef.current;
    if (!ta) return;
    ta.focus();
    const len = ta.value.length;
    ta.setSelectionRange(len, len);
    autosize();
  }, [editing]);

  function enterEdit() {
    if (!editing) setEditing(true);
  }

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={enterEdit}
      className={cn(
        "group relative -mx-4 cursor-text rounded-lg px-4 py-3 transition-colors",
        hovered && !editing ? "bg-[var(--color-fg)]/5" : "bg-transparent"
      )}
    >
      <div className="flex items-baseline gap-3">
        <h2 className="font-serif text-2xl leading-tight text-[var(--color-fg)]">
          {block.heading}
        </h2>
        {isModified && (
          <span className="text-[11px] uppercase tracking-[0.1em] text-[var(--color-muted)]">
            modifié
          </span>
        )}
        <span
          aria-hidden="true"
          className={cn(
            "ml-auto self-center text-[var(--color-muted)] transition-opacity",
            hovered && !editing ? "opacity-100" : "opacity-0"
          )}
        >
          <PencilIcon />
        </span>
      </div>

      <div className="mt-3">
        {editing ? (
          <textarea
            ref={taRef}
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
              autosize();
            }}
            onBlur={() => setEditing(false)}
            onClick={(e) => e.stopPropagation()}
            rows={1}
            className={cn(
              BODY_CLASSES,
              "block w-full resize-none border-0 bg-transparent p-0 focus:outline-none"
            )}
          />
        ) : (
          <p className={BODY_CLASSES}>{value}</p>
        )}
      </div>
    </div>
  );
}

function PencilIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
    >
      <path
        d="M11.5 1.5l3 3-9 9H2.5v-3l9-9z"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
