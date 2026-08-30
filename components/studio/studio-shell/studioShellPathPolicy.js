export function isStoryChatPath(pathname = "") {
  return (
    /^\/studio\/story-rooms\/[^/]+(?:\/.*)?$/.test(pathname) ||
    /^\/studio\/v2\/stories\/[^/]+(?:\/.*)?$/.test(pathname)
  );
}
