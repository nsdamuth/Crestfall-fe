"use client";

import { useState } from "react";

const PERSONALITY_OPTIONS = [
  ["STOIC", "Stoic", "Restrained, steady, difficult to shake."],
  ["CHARMING", "Charming", "Warm, socially smooth, persuasive."],
  ["PROTECTIVE", "Protective", "Loyal, vigilant, quick to defend."],
  ["AMBITIOUS", "Ambitious", "Driven by power, success, status, or recognition."],
  ["PLAYFUL", "Playful", "Light, energetic, teasing, expressive."],
  ["MISCHIEVOUS", "Mischievous", "Prankish, clever, evasive, likes playful trouble."],
  ["SEDUCTIVE", "Seductive", "Alluring, sensual, magnetic, emotionally provocative."],
  ["FOLLOWER", "Follower", "Supportive, receptive, cooperative, prefers guidance."],
  ["THINKER", "Thinker", "Reflective, analytical, inward, pattern-seeking."],
  ["PEACEMAKER", "Peacemaker", "Diplomatic, calming, conflict-softening."],
  ["BROODING", "Brooding", "Guarded, intense, emotionally heavy."],
  ["SCHOLARLY", "Scholarly", "Curious, studious, knowledge-seeking."],
  ["CHAOTIC", "Chaotic", "Impulsive, unpredictable, freedom-seeking."],
  ["NURTURING", "Nurturing", "Caretaking, supportive, emotionally attentive."],
  ["COMMANDING", "Commanding", "Decisive, dominant, expects action."],
  ["MYSTERIOUS", "Mysterious", "Layered, evasive, hard to read."],
  ["IDEALISTIC", "Idealistic", "Principled, hopeful, belief-driven."],
  ["CUSTOM", "Custom", "Write your own personality shorthand."],
].map(([id, label, description]) => ({
  id,
  label,
  description,
  isCustom: id === "CUSTOM",
}));

export function usePersonalityModalViewModel({
  label = "Personality",
  field = "",
  form = {},
  updateField = null,
} = {}) {
  const [open, setOpen] = useState(false);
  const [customActive, setCustomActive] = useState(false);
  const [customValue, setCustomValue] = useState("");

  const currentValue = field ? form?.[field] : "";
  const selectedOption = PERSONALITY_OPTIONS.find(
    (option) => option.id === currentValue
  );

  function openModal() {
    setOpen(true);
  }

  function closeModal() {
    setOpen(false);
    setCustomActive(false);
  }

  function chooseOption(optionId) {
    const option = PERSONALITY_OPTIONS.find((item) => item.id === optionId);

    if (!option) return;

    if (option.isCustom) {
      setCustomActive(true);
      return;
    }

    updateField?.(field, option.id);
    setOpen(false);
  }

  function backFromCustom() {
    setCustomActive(false);
  }

  function useCustomValue() {
    const nextValue = customValue.trim();

    if (!nextValue) return;

    updateField?.(field, nextValue);
    setCustomValue("");
    setCustomActive(false);
    setOpen(false);
  }

  return {
    open,
    triggerLabel: label,
    triggerSummary:
      selectedOption?.label || (currentValue ? String(currentValue) : "Not chosen"),
    modalTitle: label,
    modalDescription:
      "Choose a shorthand archetype. Outward personality is what others see first; internal personality is what drives the character beneath the surface.",
    options: PERSONALITY_OPTIONS.map((option) => ({
      ...option,
      isSelected: option.id === currentValue,
    })),
    customActive,
    customTitle: "Custom Personality",
    customValue,
    customPlaceholder: "Type a custom archetype...",
    onOpen: openModal,
    onClose: closeModal,
    onChooseOption: chooseOption,
    onChangeCustomValue: setCustomValue,
    onBackFromCustom: backFromCustom,
    onUseCustomValue: useCustomValue,
  };
}
