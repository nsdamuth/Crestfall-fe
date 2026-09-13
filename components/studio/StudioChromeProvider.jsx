"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

// One left panel at a time (fe/chat-studio item 1, decision J1, 12 Sep
// 2026): the primary nav and a page-level left rail share the left edge.
// `leftOwner` names who holds it: "nav" when the user expanded the
// sidebar, "page" when a route opened its own left rail (the story chat
// story list), null when neither claimed it. The sidebar view model reads
// "page" as collapsed; a page reads "page" as its rail being open. Shaped
// like StudioAccountProvider, mounted once in StudioShell.
const StudioChromeContext = createContext(null);

const NOOP_CHROME = Object.freeze({
  leftOwner: null,
  claimLeft: () => {},
  releaseLeft: () => {},
});

export function StudioChromeProvider({ children }) {
  const [leftOwner, setLeftOwner] = useState(null);

  const claimLeft = useCallback((owner) => {
    setLeftOwner(owner === "nav" || owner === "page" ? owner : null);
  }, []);

  const releaseLeft = useCallback(() => {
    setLeftOwner(null);
  }, []);

  const value = useMemo(
    () => ({ leftOwner, claimLeft, releaseLeft }),
    [leftOwner, claimLeft, releaseLeft]
  );

  return (
    <StudioChromeContext.Provider value={value}>
      {children}
    </StudioChromeContext.Provider>
  );
}

// Unlike useStudioAccount this never throws: previews and kit harnesses
// render the sidebar and the chat shell without the provider.
export function useStudioChrome() {
  return useContext(StudioChromeContext) || NOOP_CHROME;
}
