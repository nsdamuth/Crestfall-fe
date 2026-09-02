"use client";

import { createContext, useContext } from "react";

import { useStudioAccountProviderViewModel } from "./studio-account-provider/useStudioAccountProviderViewModel";

const StudioAccountContext = createContext(null);

export function StudioAccountProvider({
  children,
  loadAccount,
  loadCapabilities,
}) {
  const value = useStudioAccountProviderViewModel({
    loadAccount,
    loadCapabilities,
  });

  return (
    <StudioAccountContext.Provider value={value}>
      {children}
    </StudioAccountContext.Provider>
  );
}

export function useStudioAccount() {
  const context = useContext(StudioAccountContext);

  if (!context) {
    throw new Error(
      "useStudioAccount must be used inside StudioAccountProvider."
    );
  }

  return context;
}
