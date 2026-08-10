"use client";

import { useState } from "react";

import KitModalFrame from "@/components/kit/KitModalFrame";
import { kitModalFrameFixtures } from "@/components/kit/modal-frame/KitModalFrame.fixtures";
import KitPreviewShell from "../kit-batch-1/KitPreviewShell";

export default function ModalFramePreviewClient() {
  const [openId, setOpenId] = useState(null);
  const [stackedOpen, setStackedOpen] = useState(false);
  const [lastAction, setLastAction] = useState(
    "Choose a fixture to open the frame."
  );

  const activeFixture = kitModalFrameFixtures.find((fixture) => fixture.id === openId);

  function closeAll() {
    setOpenId(null);
    setStackedOpen(false);
    setLastAction("Closed.");
  }

  return (
    <KitPreviewShell
      title="Kit Modal Frame"
      description="The unified modal frame: veil, panel anatomy, and close control standing on the existing ModalShell behavior. Backdrop click, Escape, and the close control all dismiss."
      states={kitModalFrameFixtures.map((fixture) => ({
        key: fixture.id,
        label: fixture.label,
      }))}
      activeKey={openId}
      onSelectState={(id) => {
        setOpenId(id);
        setStackedOpen(false);
        setLastAction(`Opened the ${id} fixture.`);
      }}
      note={lastAction}
    >
      <div className="flex flex-wrap gap-[var(--space-3)]">
        {kitModalFrameFixtures.map((fixture) => (
          <button
            key={fixture.id}
            type="button"
            onClick={() => {
              setOpenId(fixture.id);
              setStackedOpen(false);
              setLastAction(`Opened the ${fixture.label} fixture.`);
            }}
            className="kit-focus cf-btn cf-btn--secondary"
          >
            Open {fixture.label}
          </button>
        ))}
      </div>

      {activeFixture && (
        <KitModalFrame
          {...activeFixture.props}
          onClose={activeFixture.props.onClose === null ? null : closeAll}
        >
          {activeFixture.props.children}
          {activeFixture.id === "stacked" && (
            <div className="px-[var(--space-6)] pb-[var(--space-6)]">
              <button
                type="button"
                onClick={() => setStackedOpen(true)}
                className="cf-btn cf-btn--secondary"
              >
                Open picker over this modal
              </button>
            </div>
          )}
        </KitModalFrame>
      )}

      {stackedOpen && (
        <KitModalFrame
          variant="sheet"
          panelClassName="max-w-sm"
          ariaLabel="Stacked picker"
          onClose={() => {
            setStackedOpen(false);
            setLastAction("Closed the stacked picker; modal scroll lock restored.");
          }}
        >
          <div className="p-[var(--space-6)]">
            <p className="font-display text-[length:var(--text-lead)] leading-[var(--lh-lead)] text-[var(--ink)]">
              Picker over modal
            </p>
            <p className="mt-[var(--space-2)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
              Proves per-layer scroll locks and LIFO restore: closing
              this picker returns the scroll lock to the modal beneath
              it.
            </p>
          </div>
        </KitModalFrame>
      )}
    </KitPreviewShell>
  );
}
