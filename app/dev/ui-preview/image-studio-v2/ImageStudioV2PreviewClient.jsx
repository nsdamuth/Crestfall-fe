"use client";

import { useMemo, useState } from "react";
import { History, Send } from "lucide-react";

import ImageStudioComposerView from "@/components/studio/image-studio/image-studio-composer/ImageStudioComposer.view";
import { imageStudioComposerDefaultFixture } from "@/components/studio/image-studio/image-studio-composer/ImageStudioComposer.fixtures";
import ModeSwitchView from "@/components/studio/image-studio/v2-concept/ModeSwitch.view";
import { modeSwitchDefaultFixture } from "@/components/studio/image-studio/v2-concept/ModeSwitch.fixtures";
import SegmentListView from "@/components/studio/image-studio/v2-concept/SegmentList.view";
import {
  segmentListEmptyFixture,
  segmentListFilledFixture,
} from "@/components/studio/image-studio/v2-concept/SegmentList.fixtures";
import RegionEditBarView from "@/components/studio/image-studio/v2-concept/RegionEditBar.view";
import {
  regionEditBarEmptyFixture,
  regionEditBarFilledFixture,
} from "@/components/studio/image-studio/v2-concept/RegionEditBar.fixtures";
import RemixComposerView from "@/components/studio/image-studio/v2-concept/RemixComposer.view";
import {
  remixComposerEmptyFixture,
  remixComposerFilledFixture,
} from "@/components/studio/image-studio/v2-concept/RemixComposer.fixtures";
import AssignPublishDrawerView from "@/components/studio/image-studio/v2-concept/AssignPublishDrawer.view";
import {
  assignPublishDrawerEmptyFixture,
  assignPublishDrawerFilledFixture,
  assignTargetsByType,
} from "@/components/studio/image-studio/v2-concept/AssignPublishDrawer.fixtures";

const VARIANTS = {
  filled: "Filled",
  empty: "Empty",
};

const HISTORY = [
  { id: "h1", label: "Generate 1", tone: "linear-gradient(135deg, var(--surface-4), var(--gold-deep))" },
  { id: "h2", label: "Edit 1", tone: "linear-gradient(135deg, var(--surface-3), var(--neutral-6))" },
  { id: "h3", label: "Remix 1", tone: "linear-gradient(135deg, var(--surface-4), var(--gold-ornament))" },
];

export default function ImageStudioV2PreviewClient() {
  const [modeId, setModeId] = useState("generate");
  const [variant, setVariant] = useState("filled");
  const [feedback, setFeedback] = useState("No preview action yet.");

  const [selectedSegmentId, setSelectedSegmentId] = useState(
    segmentListFilledFixture.selectedSegmentId
  );
  const [regionPrompt, setRegionPrompt] = useState(regionEditBarFilledFixture.promptValue);
  const [quickActionId, setQuickActionId] = useState(regionEditBarFilledFixture.activeQuickActionId);
  const [direction, setDirection] = useState(remixComposerFilledFixture.directionValue);
  const [ratio, setRatio] = useState(remixComposerFilledFixture.ratioField.value);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [targetTypeId, setTargetTypeId] = useState(assignPublishDrawerFilledFixture.selectedTargetTypeId);
  const [targetId, setTargetId] = useState(assignPublishDrawerFilledFixture.selectedTargetId);
  const [visibilityId, setVisibilityId] = useState(assignPublishDrawerFilledFixture.selectedVisibilityId);

  const isFilled = variant === "filled";

  const changeMode = (nextMode) => {
    setModeId(nextMode);
    setDrawerOpen(nextMode === "assign");
    setFeedback(`Mode: ${nextMode}`);
  };

  const composerProps = useMemo(
    () => ({
      ...imageStudioComposerDefaultFixture,
      ingredientSlotItems: imageStudioComposerDefaultFixture.ingredientSlotItems.map((item) => ({
        ...item,
        viewProps: {
          ...item.viewProps,
          onOpenSlot: () => setFeedback(`Open ingredient: ${item.viewProps.label}`),
          onClearSlot: () => setFeedback(`Clear ingredient: ${item.viewProps.label}`),
        },
      })),
      onGenerateImage: () => setFeedback("Preview generate (fixture only)."),
    }),
    []
  );

  const segmentBase = isFilled ? segmentListFilledFixture : segmentListEmptyFixture;
  const selectedSegment = segmentBase.segments.find((segment) => segment.id === selectedSegmentId);
  const regionBase = isFilled ? regionEditBarFilledFixture : regionEditBarEmptyFixture;
  const regionProps = {
    ...regionBase,
    selectedSegmentLabel: selectedSegment ? selectedSegment.label : "",
    promptValue: isFilled ? regionPrompt : "",
    activeQuickActionId: isFilled ? quickActionId : "",
    canApply: Boolean(selectedSegment) && Boolean(isFilled ? regionPrompt.trim() : false),
    onChangePrompt: setRegionPrompt,
    onSelectQuickAction: (id) => {
      setQuickActionId(id);
      setFeedback(`Quick action: ${id}`);
    },
    onApply: () => setFeedback(`Preview region edit on ${selectedSegment?.label}: ${regionPrompt}`),
    ingredientSlot: regionBase.ingredientSlot
      ? {
          ...regionBase.ingredientSlot,
          onOpenSlot: () => setFeedback("Open ingredient picker for the edit."),
          onClearSlot: () => setFeedback("Clear edit ingredient."),
        }
      : null,
  };

  const remixBase = isFilled ? remixComposerFilledFixture : remixComposerEmptyFixture;
  const remixProps = {
    ...remixBase,
    directionValue: isFilled ? direction : remixBase.directionValue,
    ratioField: {
      ...remixBase.ratioField,
      value: ratio,
      onChange: (next) => {
        setRatio(next);
        setFeedback(`Aspect ratio: ${next}`);
      },
    },
    onChangeDirection: setDirection,
    onAddCharacter: () => setFeedback("Add a third Character slot (fixture only)."),
    onRemix: () => setFeedback(`Preview remix: ${direction}`),
  };

  const drawerBase = isFilled ? assignPublishDrawerFilledFixture : assignPublishDrawerEmptyFixture;
  const drawerTargets = assignTargetsByType[targetTypeId] || [];
  const drawerProps = {
    ...drawerBase,
    open: drawerOpen,
    selectedTargetTypeId: targetTypeId,
    targets: drawerTargets,
    selectedTargetId: targetId,
    selectedVisibilityId: visibilityId,
    canPublish: Boolean(drawerTargets.find((target) => target.id === targetId)),
    helpText: drawerTargets.length ? "" : drawerBase.helpText,
    onClose: () => {
      setDrawerOpen(false);
      setFeedback("Drawer closed.");
    },
    onChangeTargetType: (id) => {
      setTargetTypeId(id);
      setTargetId("");
      setFeedback(`Assign to type: ${id}`);
    },
    onSelectTarget: (id) => {
      setTargetId(id);
      setFeedback(`Assign target: ${id}`);
    },
    onChangeVisibility: (id) => {
      setVisibilityId(id);
      setFeedback(`Visibility: ${id}`);
    },
    onPublish: () => setFeedback(`Preview publish: ${targetTypeId}/${targetId} as ${visibilityId}`),
  };

  return (
    <main className="min-h-screen bg-[var(--canvas)] px-4 py-8 text-[var(--ink)] sm:px-6">
      <div className="mx-auto max-w-7xl space-y-5">
        <header className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--surface-2)] p-5">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--gold-ornament)]">
            Fixture-driven concept preview
          </p>
          <h1 className="mt-2 font-display text-4xl">Image Studio v2</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--ink-dim)]">
            Create Assets, then Craft Images in four steps (Generate, Edit, Remix,
            Edit again), then Assign and Publish. Nothing here opens production
            pickers, spends coins, or starts a job.
          </p>
          <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Fixture variant">
            {Object.entries(VARIANTS).map(([key, label]) => (
              <button
                key={key}
                type="button"
                aria-pressed={variant === key}
                onClick={() => {
                  setVariant(key);
                  setFeedback(`Variant: ${label}`);
                }}
                className={`rounded-[var(--radius-sm)] border px-3 py-1.5 text-xs transition ${
                  variant === key
                    ? "border-[var(--gold-ornament)]/45 bg-[var(--gold-ornament)]/10 text-[var(--ink)]"
                    : "border-[var(--line)] text-[var(--ink-dim)] hover:text-[var(--ink)]"
                }`}
              >
                {label} fixtures
              </button>
            ))}
          </div>
        </header>

        <ModeSwitchView {...modeSwitchDefaultFixture} activeModeId={modeId} onChangeMode={changeMode} />

        <p className="rounded-[var(--radius-sm)] border border-[var(--line)] bg-[var(--surface-1)] px-4 py-2 text-xs text-[var(--ink-dim)]">
          Preview feedback: {feedback}
        </p>

        <section className="grid gap-5 xl:grid-cols-[1fr_440px]">
          <div className="space-y-4">
            <div
              className="relative flex aspect-[16/10] w-full items-end overflow-hidden rounded-[var(--radius-md)] border border-[var(--line)]"
              style={{ background: HISTORY[0].tone }}
              role="img"
              aria-label="Current result image placeholder"
            >
              {modeId === "edit" && selectedSegment ? (
                <span
                  className="absolute rounded-[var(--radius-xs)] border-2 border-dashed border-[var(--gold-action)]"
                  style={{ inset: selectedSegment.regionInset }}
                  aria-hidden="true"
                />
              ) : null}
              <div className="flex w-full items-center justify-between gap-3 bg-[var(--scrim)] px-4 py-3 text-xs text-[var(--ink)]">
                <span>Result canvas (fixture placeholder)</span>
                {modeId !== "assign" ? (
                  <button
                    type="button"
                    onClick={() => changeMode("assign")}
                    className="flex items-center gap-1.5 rounded-[var(--radius-sm)] border border-[var(--line-strong)] px-3 py-1.5 text-xs transition hover:border-[var(--gold-ornament)]/45"
                  >
                    <Send size={12} aria-hidden="true" />
                    Assign and publish
                  </button>
                ) : null}
              </div>
            </div>

            {modeId === "edit" ? (
              <SegmentListView
                {...segmentBase}
                selectedSegmentId={selectedSegmentId}
                onSelectSegment={(id) => {
                  setSelectedSegmentId(id);
                  setFeedback(`Segment: ${id}`);
                }}
                onRedetect={segmentBase.onRedetect ? () => setFeedback("Detect segments again (fixture only).") : null}
              />
            ) : null}

            <div className="rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-2)] p-4">
              <p className="flex items-center gap-1.5 text-xs text-[var(--ink-dim)]">
                <History size={13} aria-hidden="true" />
                Session history
              </p>
              <ul className="mt-3 flex gap-2 overflow-x-auto">
                {HISTORY.map((item) => (
                  <li key={item.id} className="shrink-0">
                    <span
                      className="block h-16 w-24 rounded-[var(--radius-sm)] border border-[var(--line)]"
                      style={{ background: item.tone }}
                      aria-hidden="true"
                    />
                    <span className="mt-1 block text-[11px] text-[var(--ink-dim)]">{item.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            {modeId === "generate" ? <ImageStudioComposerView {...composerProps} /> : null}
            {modeId === "edit" ? <RegionEditBarView {...regionProps} /> : null}
            {modeId === "remix" ? <RemixComposerView {...remixProps} /> : null}
            {modeId === "assign" ? (
              <div className="rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-2)] p-4 text-sm text-[var(--ink-dim)]">
                <p>The Assign and Publish drawer is open over the canvas.</p>
                <button
                  type="button"
                  onClick={() => setDrawerOpen(true)}
                  className="mt-3 rounded-[var(--radius-sm)] border border-[var(--line-strong)] px-3 py-1.5 text-xs text-[var(--ink)] transition hover:border-[var(--gold-ornament)]/45"
                >
                  Reopen drawer
                </button>
              </div>
            ) : null}
          </div>
        </section>
      </div>

      <AssignPublishDrawerView {...drawerProps} />
    </main>
  );
}
