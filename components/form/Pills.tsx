"use client";

import { cn } from "@/lib/utils";
import { Option } from "@/lib/form-schema";

type Props = {
  options: Option[];
  mode: "single" | "multi";
  value: string | string[] | undefined;
  onChange: (value: string | string[]) => void;
};

export function Pills({ options, mode, value, onChange }: Props) {
  const selectedSet = new Set<string>(
    mode === "single"
      ? value
        ? [value as string]
        : []
      : (value as string[] | undefined) ?? []
  );

  function toggle(optValue: string) {
    if (mode === "single") {
      onChange(optValue);
      return;
    }
    const next = new Set(selectedSet);
    if (next.has(optValue)) next.delete(optValue);
    else next.add(optValue);
    onChange(Array.from(next));
  }

  return (
    <div
      role={mode === "single" ? "radiogroup" : "group"}
      className="flex flex-wrap gap-2"
    >
      {options.map((opt) => {
        const selected = selectedSet.has(opt.value);
        return (
          <button
            key={opt.value}
            type="button"
            role={mode === "single" ? "radio" : "checkbox"}
            aria-checked={selected}
            onClick={() => toggle(opt.value)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm transition-colors",
              selected
                ? "border-[var(--color-fg)] bg-[var(--color-fg)] text-[var(--color-bg)]"
                : "border-[var(--color-line)] bg-transparent text-[var(--color-fg)] hover:border-[var(--color-fg)]"
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
