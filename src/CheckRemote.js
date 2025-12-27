export const checkRemote = (url) =>
  fetch(url, { method: "HEAD" }).then(
    () => true,
    () => false
  );
