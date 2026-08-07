"use client";

export function useEyebrowViewModel({ children = null, showRuleMark = true }) {
  return {
    children,
    showRuleMark,
  };
}
