"use client";

import { Block, Step as StepType } from "@/lib/brief-schema";
import { UseBriefState } from "@/lib/use-brief-state";
import { EditableBlock } from "./EditableBlock";
import { MultiSelectBlock } from "./MultiSelectBlock";
import { SingleSelectBlock } from "./SingleSelectBlock";
import { GroupedSelectBlock } from "./GroupedSelectBlock";
import { FreeTextBlock } from "./FreeTextBlock";
import { NotesBlock } from "./NotesBlock";
import { CompositeBlock } from "./CompositeBlock";

type Props = {
  step: StepType;
  state: UseBriefState;
};

function BlockRouter({ block, state }: { block: Block; state: UseBriefState }) {
  switch (block.type) {
    case "text":
      return (
        <EditableBlock
          block={block}
          value={state.getContent(block.id)}
          isModified={state.isModified(block.id)}
          onChange={(v) => state.updateBlock(block.id, v)}
        />
      );
    case "multi-select": {
      const answer = state.getAnswer(block.id);
      return (
        <div id={block.id}>
          <MultiSelectBlock
            block={block}
            stateKey={block.id}
            checked={answer.checked}
            freeText={answer.freeText}
            onToggle={(o) => state.toggleOption(block.id, o)}
            onFreeTextChange={(v) => state.setFreeText(block.id, v)}
          />
        </div>
      );
    }
    case "single-select":
      return (
        <div id={block.id}>
          <SingleSelectBlock
            block={block}
            stateKey={block.id}
            value={state.getSingleChoice(block.id)}
            freeText={state.getAnswer(block.id).freeText}
            onSelect={(o) => state.setSingleChoice(block.id, o)}
            onFreeTextChange={(v) => state.setFreeText(block.id, v)}
          />
        </div>
      );
    case "grouped-select":
      return (
        <div id={block.id}>
          <GroupedSelectBlock
            block={block}
            stateKey={block.id}
            freeText={state.getAnswer(block.id).freeText}
            getSingle={(g) => state.getGroupedSingle(block.id, g)}
            setSingle={(g, v) => state.setGroupedSingle(block.id, g, v)}
            getMulti={(g) => state.getGroupedMulti(block.id, g)}
            toggleMulti={(g, o) => state.toggleGroupedOption(block.id, g, o)}
            onFreeTextChange={(v) => state.setFreeText(block.id, v)}
          />
        </div>
      );
    case "free-text":
      return (
        <div id={block.id}>
          <FreeTextBlock
            block={block}
            stateKey={block.id}
            getValue={(fid) => state.getFieldValue(block.id, fid)}
            onChange={(fid, v) => state.setFieldValue(block.id, fid, v)}
          />
        </div>
      );
    case "notes":
      return (
        <div id={block.id}>
          <NotesBlock
            block={block}
            stateKey={block.id}
            value={state.getAnswer(block.id).freeText}
            onChange={(v) => state.setFreeText(block.id, v)}
          />
        </div>
      );
    case "composite":
      return <CompositeBlock block={block} state={state} />;
  }
}

export function Step({ step, state }: Props) {
  return (
    <section className="mx-auto flex w-full max-w-[540px] flex-col">
      {step.intro && (
        <p className="text-xs text-[var(--color-muted)]">{step.intro}</p>
      )}
      <div className="flex flex-col gap-4 sm:gap-6">
        {step.blocks.map((block) => (
          <BlockRouter key={block.id} block={block} state={state} />
        ))}
      </div>
    </section>
  );
}
