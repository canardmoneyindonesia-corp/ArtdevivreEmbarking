"use client";

type Props = {
  progress: number;
};

export function ProgressBar({ progress }: Props) {
  const pct = Math.max(0, Math.min(1, progress)) * 100;
  return (
    <div
      className="h-[3px] w-full overflow-hidden rounded-full bg-[var(--color-line)]"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(pct)}
    >
      <div
        className="h-full rounded-full bg-[var(--color-fg)] transition-[width] duration-500 ease-out"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
