"use client";

import { useEffect, useMemo, useState } from "react";
import { Activity, Layers3, Search } from "lucide-react";

import KitModalFrame from "@/components/kit/KitModalFrame";
import {
  fetchCommunityCreations,
  fetchOwnedCreations,
} from "@/lib/client/studio/creations/creationClient";

function normalizeArray(value) {
  return Array.isArray(value) ? value : [];
}
function normalizeObject(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}
function normalizeString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function summarizeCreation(creation, sourceId, creationType) {
  const data = normalizeObject(creation?.data);
  const isSet = creationType === "MECHANICS_ACTION_SET";
  const definition = isSet
    ? normalizeObject(data.mechanics_action_set || data.mechanicsActionSet)
    : normalizeObject(data.mechanics_action || data.mechanicsAction || data.action);
  const stableKey = isSet
    ? normalizeString(data.actionSetKey || data.action_set_key || definition.id)
    : normalizeString(data.actionKey || data.action_key || definition.id);
  const count = isSet ? normalizeArray(definition.actionReferences).length : null;
  return {
    selectionId: `${sourceId}:${creation?.id}`,
    creation,
    title: creation?.title || (isSet ? "Untitled Action Set" : "Untitled Action"),
    description: creation?.description || definition.description || "",
    stableKey,
    count,
    sourceLabel: sourceId === "mine" ? "Mine" : "Public",
    status: creation?.status || "DRAFT",
    visibility: creation?.visibility || "PRIVATE",
  };
}

export default function MechanicsAssetPickerModal({
  creationType,
  excludedIds = [],
  title,
  description,
  onClose,
  onSelected,
}) {
  const [owned, setOwned] = useState([]);
  const [publicItems, setPublicItems] = useState([]);
  const [activeSource, setActiveSource] = useState("mine");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");
  const excluded = useMemo(() => new Set(normalizeArray(excludedIds).filter(Boolean)), [excludedIds]);

  useEffect(() => {
    let cancelled = false;
    Promise.allSettled([
      fetchOwnedCreations({ type: creationType }),
      fetchCommunityCreations({ type: creationType }),
    ]).then(([ownedResult, publicResult]) => {
      if (cancelled) return;
      setOwned(ownedResult.status === "fulfilled" ? normalizeArray(ownedResult.value) : []);
      setPublicItems(publicResult.status === "fulfilled" ? normalizeArray(publicResult.value) : []);
      if (ownedResult.status === "rejected" && publicResult.status === "rejected") {
        setStatus("error");
        setMessage(ownedResult.reason?.message || publicResult.reason?.message || "Assets could not be loaded.");
      } else {
        setStatus("loaded");
      }
    });
    return () => { cancelled = true; };
  }, [creationType]);

  const items = useMemo(() => {
    const source = activeSource === "public" ? publicItems : owned;
    const normalizedQuery = query.trim().toLowerCase();
    return source
      .filter((creation) => !excluded.has(creation?.id))
      .map((creation) => summarizeCreation(creation, activeSource, creationType))
      .filter((item) => !normalizedQuery || [item.title, item.description, item.stableKey, item.status, item.visibility]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(normalizedQuery)));
  }, [activeSource, creationType, excluded, owned, publicItems, query]);

  const isSet = creationType === "MECHANICS_ACTION_SET";
  const Icon = isSet ? Layers3 : Activity;

  return (
    <KitModalFrame onClose={onClose} ariaLabel={title} panelClassName="w-full max-w-4xl">
      <div className="flex max-h-[92dvh] flex-col">
        <div className="border-b border-white/10 px-6 py-5 pr-16">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--gold-ornament)]">{isSet ? "Action Sets" : "Mechanics Actions"}</p>
          <h2 className="mt-2 font-display text-3xl">{title}</h2>
          <p className="mt-2 text-sm leading-6 text-[var(--ink-dim)]">{description}</p>
        </div>
        <div className="border-b border-white/10 p-6">
          <div className="flex gap-2">
            {[{id:"mine",label:"Mine"},{id:"public",label:"Public"}].map((source) => (
              <button key={source.id} type="button" onClick={() => { setActiveSource(source.id); setQuery(""); }} className={`cf-btn ${activeSource === source.id ? "cf-btn--primary" : "cf-btn--secondary"}`}>{source.label}</button>
            ))}
          </div>
          <label className="mt-4 flex items-center gap-3 rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm">
            <Search size={16} className="text-[var(--gold-ornament)]" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={isSet ? "Search Action Sets..." : "Search Mechanics Actions..."} className="w-full bg-transparent outline-none" />
          </label>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto p-6">
          {status === "loading" ? <p className="text-sm text-[var(--ink-dim)]">Loading...</p> : null}
          {status === "error" ? <p className="text-sm text-[var(--status-danger)]">{message}</p> : null}
          {status === "loaded" && items.length ? (
            <div className="grid gap-4 md:grid-cols-2">
              {items.map((item) => (
                <button key={item.selectionId} type="button" onClick={() => { onSelected?.(item.creation); onClose?.(); }} className="rounded-xl border border-white/10 bg-black/25 p-4 text-left transition hover:border-[var(--gold-ornament)]/50">
                  <div className="flex items-start gap-3"><div className="rounded-xl border border-[var(--gold-ornament)]/25 bg-[var(--gold-ornament)]/10 p-3 text-[var(--gold-ornament)]"><Icon size={18} /></div><div className="min-w-0"><p className="text-xs uppercase tracking-[0.18em] text-[var(--gold-ornament)]">{item.sourceLabel}</p><h3 className="mt-1 font-display text-xl">{item.title}</h3></div></div>
                  {item.description ? <p className="mt-3 line-clamp-2 text-sm text-[var(--ink-dim)]">{item.description}</p> : null}
                  <p className="mt-3 break-all text-xs text-[var(--ink-dim)]">{item.stableKey || "No stable key"}</p>
                  <p className="mt-2 text-xs text-[var(--ink-dim)]">{item.count !== null ? `${item.count} Actions · ` : ""}{item.status} · {item.visibility}</p>
                </button>
              ))}
            </div>
          ) : null}
          {status === "loaded" && !items.length ? <p className="text-sm text-[var(--ink-dim)]">No available {isSet ? "Action Sets" : "Mechanics Actions"} found.</p> : null}
        </div>
      </div>
    </KitModalFrame>
  );
}
