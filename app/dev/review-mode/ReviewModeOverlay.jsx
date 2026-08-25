"use client";

// DEV-ONLY TOOLING. Not a product package: excluded from product scope
// the same way app/dev/ui-preview/ is (docs/FRONTEND-SOP.md section 2),
// renders nothing unless a developer explicitly toggles it on, ships no
// product contract, and is never mounted in production (see the
// NODE_ENV guard in app/layout.js, the only place this file is
// imported). Ported 8 Aug 2026 from the design-system proof's Review
// Mode / Notes feature (docs/_legacy-reference/design-system/proof/studio.html,
// #rvw-bar / #rvw-panel), which is why its visual recipe is the proof's
// own literal hex values rather than app/theme.css tokens: it is a
// distinct, intentionally-different-looking dev overlay, not product
// chrome, and token-first is a product-scope rule.
//
// One deliberate addition beyond the proof: notes persist per page
// (keyed by pathname) in localStorage across reloads, authorized
// explicitly for this dev-tooling case. The proof itself keeps notes
// only in memory. The copyable export block's shape is otherwise
// ported verbatim, since that shape is what the strategy chat already
// reads.

import { useCallback, useEffect, useRef, useState } from "react";

const STORAGE_PREFIX = "crestfall-review-mode:";

function safeLoad(key) {
  if (typeof window === "undefined") return { notes: [], general: "" };
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return { notes: [], general: "" };
    const parsed = JSON.parse(raw);
    return {
      notes: Array.isArray(parsed?.notes) ? parsed.notes : [],
      general: typeof parsed?.general === "string" ? parsed.general : "",
    };
  } catch {
    return { notes: [], general: "" };
  }
}

function safeSave(key, state) {
  if (typeof window === "undefined" || !key) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(state));
  } catch {
    // Storage full or unavailable (private browsing): notes stay
    // in-memory for the rest of this session, same as the proof.
  }
}

// Same element description recipe as the proof's describe(): tag plus
// up to two classes, the nearest landmark's heading as "section", and
// a short excerpt of the element's own text.
function describeElement(el) {
  const bits = [el.tagName.toLowerCase()];
  if (el.className && typeof el.className === "string") {
    const classes = el.className.trim().split(/\s+/).slice(0, 2).join(".");
    if (classes) bits.push("." + classes);
  }
  const container = el.closest("section,article,aside,header,footer,main");
  let where = "";
  if (container) {
    const heading = container.querySelector("h1,h2,h3");
    if (heading) where = heading.textContent.trim().slice(0, 42);
  }
  const text = (el.textContent || "").trim().replace(/\s+/g, " ").slice(0, 42);
  return { sel: bits.join(""), where, text };
}

function buildExportText(pageTitle, notes, general) {
  let out = `CRESTFALL REVIEW - ${pageTitle}\n${"=".repeat(46)}\n\n`;
  notes.forEach((entry, index) => {
    out += `${index + 1}. ${entry.note}\n   element: ${entry.sel}`;
    if (entry.where) out += `\n   section: ${entry.where}`;
    if (entry.text) out += `\n   content: "${entry.text}"`;
    out += "\n\n";
  });
  const trimmedGeneral = general.trim();
  if (trimmedGeneral) out += `GENERAL\n-------\n${trimmedGeneral}\n`;
  if (!notes.length && !trimmedGeneral) out += "(no notes yet)\n";
  return out;
}

export default function ReviewModeOverlay() {
  const [ready, setReady] = useState(false);
  const [reviewOn, setReviewOn] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [notes, setNotes] = useState([]);
  const [general, setGeneral] = useState("");
  const [copyLabel, setCopyLabel] = useState("Copy all notes");

  const storageKeyRef = useRef("");
  const sessionElementsRef = useRef(new Map());
  const overlayRootRef = useRef(null);

  // localStorage is unavailable during SSR; reading it in an effect
  // (instead of a useState lazy initializer) keeps the server and the
  // pre-hydration client render identical (both empty, `ready` false),
  // avoiding a hydration mismatch. This is the synchronize-with-an-
  // external-system case the lint rule's own message calls out as
  // legitimate.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const key = STORAGE_PREFIX + window.location.pathname;
    storageKeyRef.current = key;
    const stored = safeLoad(key);
    setNotes(stored.notes);
    setGeneral(stored.general);
    setReady(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    if (!ready) return;
    safeSave(storageKeyRef.current, { notes, general });
  }, [ready, notes, general]);

  const repositionTrackedPins = useCallback(() => {
    setNotes((current) =>
      current.map((entry) => {
        const el = sessionElementsRef.current.get(entry.id);
        if (!el || !el.isConnected) return entry;
        const rect = el.getBoundingClientRect();
        return {
          ...entry,
          x: rect.left + window.scrollX,
          y: rect.top + window.scrollY,
        };
      }),
    );
  }, []);

  useEffect(() => {
    if (!reviewOn) return undefined;

    function isInsideOverlay(node) {
      return Boolean(overlayRootRef.current?.contains(node));
    }

    function handleMouseOver(event) {
      if (isInsideOverlay(event.target)) return;
      event.target.classList.add("cf-review-hi");
    }

    function handleMouseOut(event) {
      event.target.classList.remove("cf-review-hi");
    }

    function handleClick(event) {
      if (isInsideOverlay(event.target)) return;
      event.preventDefault();
      event.stopPropagation();

      const target = event.target;
      const described = describeElement(target);
      const noteText = window.prompt(
        `Note for ${described.sel}${described.text ? ` ("${described.text}")` : ""}`,
      );
      if (!noteText) return;

      const rect = target.getBoundingClientRect();
      const id = `n-${Date.now()}-${Math.round(Math.random() * 1000)}`;
      sessionElementsRef.current.set(id, target);

      setNotes((current) => [
        ...current,
        {
          id,
          note: noteText,
          sel: described.sel,
          where: described.where,
          text: described.text,
          x: rect.left + window.scrollX,
          y: rect.top + window.scrollY,
        },
      ]);
      setPanelOpen(true);
    }

    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseout", handleMouseOut);
    document.addEventListener("click", handleClick, true);
    window.addEventListener("resize", repositionTrackedPins);

    return () => {
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
      document.removeEventListener("click", handleClick, true);
      window.removeEventListener("resize", repositionTrackedPins);
      document
        .querySelectorAll(".cf-review-hi")
        .forEach((el) => el.classList.remove("cf-review-hi"));
    };
  }, [reviewOn, repositionTrackedPins]);

  function removeNote(id) {
    sessionElementsRef.current.delete(id);
    setNotes((current) => current.filter((entry) => entry.id !== id));
  }

  async function copyAllNotes() {
    const text = buildExportText(document.title, notes, general);
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopyLabel("Copied");
      setTimeout(() => setCopyLabel("Copy all notes"), 1600);
    } catch {
      // Clipboard permission denied: leave the button label alone,
      // same silent-fail behavior as the proof.
    }
  }

  if (!ready) return null;

  return (
    <div ref={overlayRootRef}>
      <style>{`
        .cf-review-hi{outline:2px dashed rgba(242,209,148,.7)!important;outline-offset:2px;cursor:crosshair!important}
        .cf-review-pin{position:absolute;z-index:9998;width:24px;height:24px;border-radius:999px;background:#e0ab5e;
          color:#1c1408;font:700 12px/24px 'Alegreya Sans',system-ui,sans-serif;text-align:center;
          box-shadow:0 2px 8px rgba(0,0,0,.6);pointer-events:none}
        #cf-review-bar{position:fixed;right:16px;bottom:16px;z-index:9999;display:flex;gap:8px;align-items:center;
          font-family:'Alegreya Sans',system-ui,sans-serif;font-size:13px}
        #cf-review-bar button{border:1px solid rgba(242,209,148,.4);background:#16130d;color:#ece7dc;
          border-radius:999px;padding:0 18px;height:44px;cursor:pointer;font:inherit;font-weight:700;box-shadow:0 8px 24px rgba(0,0,0,.5)}
        #cf-review-bar button.cf-review-on{background:#e0ab5e;color:#1c1408;border-color:#e0ab5e}
        #cf-review-panel{position:fixed;right:16px;bottom:72px;z-index:9999;width:min(360px,calc(100vw - 32px));
          max-height:60vh;overflow:auto;background:#16130d;border:1px solid rgba(242,209,148,.28);border-radius:16px;
          padding:16px;font-family:'Alegreya Sans',system-ui,sans-serif;color:#ece7dc;
          box-shadow:0 20px 48px rgba(0,0,0,.6)}
        #cf-review-panel h3{margin:0 0 4px;font-family:'Cormorant Garamond',serif;font-size:20px;font-weight:600}
        #cf-review-panel p.cf-review-hint{margin:0 0 12px;font-size:12px;color:#8d8674;line-height:1.5}
        #cf-review-list{list-style:none;margin:0 0 12px;padding:0;display:grid;gap:8px}
        #cf-review-list li{font-size:12px;line-height:1.5;border-bottom:1px solid rgba(242,209,148,.1);padding-bottom:8px;
          display:grid;grid-template-columns:22px 1fr auto;gap:8px;align-items:start}
        #cf-review-list b{color:#e0ab5e;font-variant-numeric:tabular-nums}
        #cf-review-list em{color:#8d8674;font-style:normal;display:block;font-size:11px;margin-top:2px}
        #cf-review-list button{background:none;border:0;color:#8d8674;cursor:pointer;font-size:14px;padding:0 4px;min-height:24px}
        #cf-review-panel textarea{width:100%;background:#0f0e0c;border:1px solid rgba(242,209,148,.16);border-radius:8px;
          color:#ece7dc;font:inherit;font-size:12px;padding:8px;min-height:64px;resize:vertical;margin-bottom:8px}
        #cf-review-copy{width:100%;border:0;background:#e0ab5e;color:#1c1408;border-radius:12px;height:44px;
          font:inherit;font-weight:700;cursor:pointer}
      `}</style>

      {notes.map((entry, index) => (
        <div
          key={entry.id}
          className="cf-review-pin"
          style={{ left: entry.x - 8, top: entry.y - 8 }}
        >
          {index + 1}
        </div>
      ))}

      <div id="cf-review-bar">
        <button
          type="button"
          className={reviewOn ? "cf-review-on" : ""}
          onClick={() => setReviewOn((value) => !value)}
        >
          {reviewOn ? "Review mode ON" : "Review mode"}
        </button>
        <button type="button" onClick={() => setPanelOpen((value) => !value)}>
          Notes {notes.length}
        </button>
      </div>

      {panelOpen ? (
        <div id="cf-review-panel">
          <h3>Review notes</h3>
          <p className="cf-review-hint">
            Turn on Review mode, then click any element to attach a note.
            Copy the block at the end and paste it into the chat.
          </p>
          <ul id="cf-review-list">
            {notes.map((entry, index) => (
              <li key={entry.id}>
                <b>{index + 1}</b>
                <span>
                  {entry.note}
                  <em>
                    {entry.sel}
                    {entry.where ? ` · in "${entry.where}"` : ""}
                  </em>
                </span>
                <button
                  type="button"
                  aria-label="Remove note"
                  onClick={() => removeNote(entry.id)}
                >
                  &#215;
                </button>
              </li>
            ))}
          </ul>
          <textarea
            placeholder="General notes about this page"
            value={general}
            onChange={(event) => setGeneral(event.target.value)}
          />
          <button id="cf-review-copy" type="button" onClick={copyAllNotes}>
            {copyLabel}
          </button>
        </div>
      ) : null}
    </div>
  );
}
