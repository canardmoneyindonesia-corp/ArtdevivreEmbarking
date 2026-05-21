"use client";

import { useEffect, useRef } from "react";
import {
  CompositeBlock as CompositeBlockType,
  QuestionLeafBlock,
} from "@/lib/brief-schema";
import { cn } from "@/lib/utils";
import { UseBriefState } from "@/lib/use-brief-state";
import { MultiSelectBlock } from "./MultiSelectBlock";
import { SingleSelectBlock } from "./SingleSelectBlock";
import { GroupedSelectBlock } from "./GroupedSelectBlock";
import { FreeTextBlock } from "./FreeTextBlock";
import { NotesBlock } from "./NotesBlock";

type Props = {
  block: CompositeBlockType;
  state: UseBriefState;
};

function renderLeaf(
  child: QuestionLeafBlock,
  parentId: string,
  s: UseBriefState
) {
  const stateKey = `${parentId}.${child.id}`;

  switch (child.type) {
    case "multi-select": {
      const answer = s.getAnswer(stateKey);
      return (
        <MultiSelectBlock
          block={child}
          stateKey={stateKey}
          nested
          checked={answer.checked}
          freeText={answer.freeText}
          onToggle={(o) => s.toggleOption(stateKey, o)}
          onFreeTextChange={(v) => s.setFreeText(stateKey, v)}
        />
      );
    }
    case "single-select": {
      return (
        <SingleSelectBlock
          block={child}
          stateKey={stateKey}
          nested
          value={s.getSingleChoice(stateKey)}
          freeText={s.getAnswer(stateKey).freeText}
          onSelect={(o) => s.setSingleChoice(stateKey, o)}
          onFreeTextChange={(v) => s.setFreeText(stateKey, v)}
        />
      );
    }
    case "grouped-select": {
      return (
        <GroupedSelectBlock
          block={child}
          stateKey={stateKey}
          nested
          freeText={s.getAnswer(stateKey).freeText}
          getSingle={(g) => s.getGroupedSingle(stateKey, g)}
          setSingle={(g, v) => s.setGroupedSingle(stateKey, g, v)}
          getMulti={(g) => s.getGroupedMulti(stateKey, g)}
          toggleMulti={(g, o) => s.toggleGroupedOption(stateKey, g, o)}
          onFreeTextChange={(v) => s.setFreeText(stateKey, v)}
        />
      );
    }
    case "free-text": {
      return (
        <FreeTextBlock
          block={child}
          stateKey={stateKey}
          nested
          getValue={(fid) => s.getFieldValue(stateKey, fid)}
          onChange={(fid, v) => s.setFieldValue(stateKey, fid, v)}
        />
      );
    }
    case "notes": {
      return (
        <NotesBlock
          block={child}
          stateKey={stateKey}
          nested
          value={s.getAnswer(stateKey).freeText}
          onChange={(v) => s.setFreeText(stateKey, v)}
        />
      );
    }
  }
}

export function CompositeBlock({ block, state }: Props) {
  const taRef = useRef<HTMLTextAreaElement | null>(null);
  const compositeFreeText = state.getAnswer(block.id).freeText;

  function autosize() {
    const ta = taRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${ta.scrollHeight}px`;
  }

  useEffect(() => {
    autosize();
  }, [compositeFreeText]);

  return (
    <article id={block.id} className="flex flex-col">
      <h2 className="font-serif text-[28px] leading-[1.15] text-[var(--color-fg)] max-sm:text-[24px]">
        {block.heading}
      </h2>
      {block.prompt && (
        <p className="mt-2 font-sans text-[15px] leading-[1.5] text-[var(--color-fg)]/70 m-0 max-w-[60ch]">
          {block.prompt}
        </p>
      )}
      <div className="mt-5 flex flex-col gap-8">
        {block.blocks.map((child) => (
          <div key={child.id}>{renderLeaf(child, block.id, state)}</div>
        ))}
      </div>

      {block.freeTextLabel && (
        <div className="mt-8">
          <label
            htmlFor={`${block.id}-freetext`}
            className="font-serif text-[18px] leading-tight text-[var(--color-fg)]"
          >
            {block.freeTextLabel}
          </label>
          <textarea
            id={`${block.id}-freetext`}
            ref={taRef}
            value={compositeFreeText}
            onChange={(e) => {
              state.setFreeText(block.id, e.target.value);
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
    </article>
  );
}
