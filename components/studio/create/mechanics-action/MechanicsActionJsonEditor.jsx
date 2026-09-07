"use client";

import { useEffect, useMemo, useState } from "react";

import {
  MECHANICS_ACTION_DEFINITION_VERSION,
  normalizeMechanicsActionObject,
} from "./mechanicsActionContract";

function pretty(value) {
  return JSON.stringify(normalizeMechanicsActionObject(value), null, 2);
}

function validateShape(value) {
  const source = normalizeMechanicsActionObject(value);
  const issues = [];
  if (source.actionVersion !== MECHANICS_ACTION_DEFINITION_VERSION) {
    issues.push(`actionVersion must be ${MECHANICS_ACTION_DEFINITION_VERSION}.`);
  }
  if (typeof source.id !== "string" || !source.id.trim()) {
    issues.push("id is required and becomes the stable Action key.");
  }
  if (!source.resolution || typeof source.resolution !== "object" || Array.isArray(source.resolution)) {
    issues.push("resolution must be a JSON object.");
  }
  return issues;
}

export default function MechanicsActionJsonEditor({ value = {}, onChange = null }) {
  const [text, setText] = useState(() => pretty(value));
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("idle");

  useEffect(() => {
    setText(pretty(value));
  }, [value]);

  const currentId = useMemo(() => {
    try {
      const parsed = JSON.parse(text);
      return typeof parsed?.id === "string" ? parsed.id.trim() : "";
    } catch {
      return "";
    }
  }, [text]);

  function applyJson() {
    try {
      const parsed = JSON.parse(text);
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
        throw new Error("Expected a JSON object containing the Action definition.");
      }
      const issues = validateShape(parsed);
      if (issues.length) {
        setStatus("error");
        setMessage(issues.join(" "));
        return;
      }
      onChange?.(parsed);
      setText(pretty(parsed));
      setStatus("saved");
      setMessage("Action JSON applied. Save the creation to persist it.");
    } catch (error) {
      setStatus("error");
      setMessage(error?.message || "Action JSON is invalid.");
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-[var(--gold-ornament)]/20 bg-black/25 p-4 text-sm leading-6 text-[var(--ink-dim)]">
        <p className="font-medium text-[var(--ink)]">First-class Mechanics Action</p>
        <p className="mt-1">
          Paste the complete <code>mechanics_action_definition_v0</code> here.
          Do not wrap it in <code>instanceData</code> and do not paste it into a Mechanics Module.
        </p>
        <p className="mt-2">
          Stable Action key: <span className="text-[var(--gold-bright)]">{currentId || "set action.id"}</span>
        </p>
      </div>

      <textarea
        value={text}
        onChange={(event) => {
          setText(event.target.value);
          setStatus("idle");
          setMessage("");
        }}
        spellCheck={false}
        className="min-h-[34rem] w-full resize-y rounded-xl border border-white/10 bg-black/45 px-4 py-4 font-mono text-xs leading-6 text-[var(--ink)] outline-none focus:border-[var(--gold-ornament)]/50"
        aria-label="Mechanics Action JSON"
      />

      <div className="flex flex-wrap items-center gap-3">
        <button type="button" className="cf-btn cf-btn--secondary" onClick={applyJson}>
          Apply Action JSON
        </button>
        {message ? (
          <p className={status === "error" ? "text-sm text-[var(--status-danger)]" : "text-sm text-[var(--status-success)]"}>
            {message}
          </p>
        ) : null}
      </div>
    </div>
  );
}
