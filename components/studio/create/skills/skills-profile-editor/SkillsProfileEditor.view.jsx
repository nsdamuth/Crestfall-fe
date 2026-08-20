"use client";

import { BookOpenCheck, Braces, Plus, Trash2 } from "lucide-react";

function Label({ children }) {
  return (
    <label className="text-xs uppercase tracking-[0.16em] text-[var(--muted-gold)]">
      {children}
    </label>
  );
}

function TextInput({ value, onChange, placeholder = "", type = "text", min, max }) {
  return (
    <input
      type={type}
      min={min}
      max={max}
      value={value ?? ""}
      onChange={(event) => onChange?.(event.target.value)}
      placeholder={placeholder}
      className="mt-2 w-full rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted)] focus:border-[var(--muted-gold)]/50"
    />
  );
}

function TextArea({ value, onChange, rows = 3, placeholder = "" }) {
  return (
    <textarea
      rows={rows}
      value={value ?? ""}
      onChange={(event) => onChange?.(event.target.value)}
      placeholder={placeholder}
      className="mt-2 w-full rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm leading-6 text-[var(--foreground)] outline-none placeholder:text-[var(--muted)] focus:border-[var(--muted-gold)]/50"
    />
  );
}

function ValidationPanel({ errors = [], warnings = [] }) {
  if (!errors.length && !warnings.length) {
    return (
      <div className="rounded-xl border border-emerald-300/20 bg-emerald-300/5 p-4 text-sm text-emerald-100">
        Skills Profile definitions are valid.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {errors.length ? (
        <div className="rounded-xl border border-rose-300/20 bg-rose-300/5 p-4 text-sm text-rose-100">
          <p className="font-semibold">Errors</p>
          <ul className="mt-2 space-y-1">
            {errors.map((entry, index) => (
              <li key={`${entry.code}-${entry.path}-${index}`}>
                {entry.path}: {entry.message}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      {warnings.length ? (
        <div className="rounded-xl border border-amber-300/20 bg-amber-300/5 p-4 text-sm text-amber-100">
          <p className="font-semibold">Warnings</p>
          <ul className="mt-2 space-y-1">
            {warnings.map((entry, index) => (
              <li key={`${entry.code}-${entry.path}-${index}`}>{entry.message}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

function RankCard({ rank, skillIndex, rankIndex, onUpdateRankField }) {
  const prerequisites = rank.prerequisites || {};
  const grants = rank.grants || {};

  return (
    <div className="rounded-xl border border-white/10 bg-black/25 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-semibold text-[var(--foreground)]">
          Rank {rank.rank}
        </p>
        <span className="rounded-full border border-white/10 px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-[var(--muted)]">
          skills_rank_definition_v0
        </span>
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div>
          <Label>Rank title</Label>
          <TextInput
            value={rank.title}
            onChange={(value) =>
              onUpdateRankField?.(skillIndex, rankIndex, "title", value)
            }
          />
        </div>
        <div>
          <Label>Point cost</Label>
          <TextInput
            type="number"
            min={0}
            value={rank.pointCost}
            onChange={(value) =>
              onUpdateRankField?.(skillIndex, rankIndex, "pointCost", value)
            }
          />
        </div>
        <div>
          <Label>Minimum level</Label>
          <TextInput
            type="number"
            min={0}
            value={prerequisites.minimumLevel || 0}
            onChange={(value) =>
              onUpdateRankField?.(skillIndex, rankIndex, "minimumLevel", value)
            }
          />
        </div>
        <div>
          <Label>Required tier IDs</Label>
          <TextInput
            value={(prerequisites.requiredTierIds || []).join(", ")}
            onChange={(value) =>
              onUpdateRankField?.(skillIndex, rankIndex, "requiredTierIds", value)
            }
            placeholder="tier.novice, tier.veteran"
          />
        </div>
        <div className="md:col-span-2 xl:col-span-4">
          <Label>Description</Label>
          <TextArea
            value={rank.description}
            onChange={(value) =>
              onUpdateRankField?.(skillIndex, rankIndex, "description", value)
            }
            rows={2}
          />
        </div>
        <div className="md:col-span-2">
          <Label>Granted tags</Label>
          <TextInput
            value={(grants.tags || []).join(", ")}
            onChange={(value) =>
              onUpdateRankField?.(skillIndex, rankIndex, "grantTags", value)
            }
            placeholder="trained, stealth"
          />
        </div>
        <div className="md:col-span-2">
          <Label>Granted command IDs</Label>
          <TextInput
            value={(grants.commandIds || []).join(", ")}
            onChange={(value) =>
              onUpdateRankField?.(skillIndex, rankIndex, "commandIds", value)
            }
            placeholder="command.hide"
          />
        </div>
      </div>
      <p className="mt-3 text-xs leading-5 text-[var(--muted)]">
        Advancement-unlock and cross-skill prerequisites remain available through
        the complete JSON editor so their structured identities are preserved.
      </p>
    </div>
  );
}

export default function SkillsProfileEditorView({
  profile = {},
  errors = [],
  warnings = [],
  metrics = {},
  onUpdateProfileField = null,
  onAddSkill = null,
  onRemoveSkill = null,
  onUpdateSkillField = null,
  onUpdateRankField = null,
  onOpenJsonEditor = null,
}) {
  const skills = Array.isArray(profile.skillDefinitions)
    ? profile.skillDefinitions
    : [];

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-[var(--muted-gold)]/20 bg-black/35 p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[var(--muted-gold)]">
              <BookOpenCheck size={18} />
              <p className="text-xs uppercase tracking-[0.2em]">
                Skills & Proficiencies Definition
              </p>
            </div>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--muted)]">
              Author reusable Skill ranks, point costs, prerequisites, and grants.
              Actor ranks and unspent points remain isolated Story state.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onOpenJsonEditor?.()}
            className="inline-flex items-center gap-2 rounded-xl border border-[var(--muted-gold)]/35 bg-[var(--muted-gold)]/10 px-4 py-2 text-xs uppercase tracking-[0.14em] text-[var(--muted-gold)]"
          >
            <Braces size={15} />
            JSON Editor & AI Guide
          </button>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <div>
            <Label>Profile title</Label>
            <TextInput
              value={profile.title}
              onChange={(value) => onUpdateProfileField?.("title", value)}
              placeholder="Adventurer Skills"
            />
          </div>
          <div>
            <Label>Default rank point cost</Label>
            <TextInput
              type="number"
              min={0}
              value={profile.defaultPointCost}
              onChange={(value) =>
                onUpdateProfileField?.("defaultPointCost", value)
              }
            />
          </div>
          <div className="lg:col-span-2">
            <Label>Description</Label>
            <TextArea
              value={profile.description}
              onChange={(value) => onUpdateProfileField?.("description", value)}
              placeholder="Explain the intended proficiency system."
            />
          </div>
          <div className="lg:col-span-2">
            <Label>Tags</Label>
            <TextInput
              value={(profile.tags || []).join(", ")}
              onChange={(value) => onUpdateProfileField?.("tags", value)}
              placeholder="skills, fantasy, adventurer"
            />
          </div>
        </div>

        <label className="mt-4 flex items-center gap-3 text-sm text-[var(--foreground)]">
          <input
            type="checkbox"
            checked={profile.enabled !== false}
            onChange={(event) =>
              onUpdateProfileField?.("enabled", event.target.checked)
            }
          />
          Profile enabled
        </label>
      </section>

      <ValidationPanel errors={errors} warnings={warnings} />

      <section className="rounded-2xl border border-white/10 bg-black/30 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted-gold)]">
              Skill Definitions
            </p>
            <p className="mt-1 text-sm text-[var(--muted)]">
              {metrics.enabledSkillDefinitionCount || 0} enabled skills · {metrics.rankDefinitionCount || 0} rank definitions
            </p>
          </div>
          <button
            type="button"
            onClick={() => onAddSkill?.()}
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-4 py-2 text-xs uppercase tracking-[0.14em] text-[var(--foreground)]"
          >
            <Plus size={15} /> Add Skill
          </button>
        </div>

        <div className="mt-5 space-y-5">
          {skills.map((skill, skillIndex) => (
            <article
              key={`${skill.id}-${skillIndex}`}
              className="rounded-2xl border border-white/10 bg-black/25 p-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-base font-semibold text-[var(--foreground)]">
                    {skill.title || skill.id || `Skill ${skillIndex + 1}`}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-[0.14em] text-[var(--muted)]">
                    {skill.id} · {skill.maximumRank} ranks
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onRemoveSkill?.(skillIndex)}
                  className="inline-flex items-center gap-2 rounded-xl border border-rose-300/20 px-3 py-2 text-xs text-rose-100"
                >
                  <Trash2 size={14} /> Remove
                </button>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <div>
                  <Label>Skill ID</Label>
                  <TextInput
                    value={skill.id}
                    onChange={(value) =>
                      onUpdateSkillField?.(skillIndex, "id", value)
                    }
                    placeholder="skill.stealth"
                  />
                </div>
                <div>
                  <Label>Title</Label>
                  <TextInput
                    value={skill.title}
                    onChange={(value) =>
                      onUpdateSkillField?.(skillIndex, "title", value)
                    }
                  />
                </div>
                <div>
                  <Label>Category</Label>
                  <TextInput
                    value={skill.category}
                    onChange={(value) =>
                      onUpdateSkillField?.(skillIndex, "category", value)
                    }
                    placeholder="GENERAL"
                  />
                </div>
                <div>
                  <Label>Tags</Label>
                  <TextInput
                    value={(skill.tags || []).join(", ")}
                    onChange={(value) =>
                      onUpdateSkillField?.(skillIndex, "tags", value)
                    }
                  />
                </div>
                <div>
                  <Label>Starting rank</Label>
                  <TextInput
                    type="number"
                    min={0}
                    max={skill.maximumRank}
                    value={skill.startingRank}
                    onChange={(value) =>
                      onUpdateSkillField?.(skillIndex, "startingRank", value)
                    }
                  />
                </div>
                <div>
                  <Label>Maximum rank</Label>
                  <TextInput
                    type="number"
                    min={1}
                    max={20}
                    value={skill.maximumRank}
                    onChange={(value) =>
                      onUpdateSkillField?.(skillIndex, "maximumRank", value)
                    }
                  />
                </div>
                <div className="md:col-span-2">
                  <Label>Description</Label>
                  <TextArea
                    rows={2}
                    value={skill.description}
                    onChange={(value) =>
                      onUpdateSkillField?.(skillIndex, "description", value)
                    }
                  />
                </div>
              </div>

              <label className="mt-4 flex items-center gap-3 text-sm text-[var(--foreground)]">
                <input
                  type="checkbox"
                  checked={skill.enabled !== false}
                  onChange={(event) =>
                    onUpdateSkillField?.(
                      skillIndex,
                      "enabled",
                      event.target.checked
                    )
                  }
                />
                Skill enabled
              </label>

              <div className="mt-5 space-y-3">
                {skill.rankDefinitions.map((rank, rankIndex) => (
                  <RankCard
                    key={`${skill.id}-${rank.rank}`}
                    rank={rank}
                    skillIndex={skillIndex}
                    rankIndex={rankIndex}
                    onUpdateRankField={onUpdateRankField}
                  />
                ))}
              </div>
            </article>
          ))}

          {!skills.length ? (
            <div className="rounded-xl border border-dashed border-white/15 p-8 text-center text-sm text-[var(--muted)]">
              No skills are authored yet. Add a Skill or paste a complete profile through the JSON editor.
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
