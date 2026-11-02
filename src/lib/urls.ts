const base = import.meta.env.BASE_URL.replace(/\/$/, "");

export function withBase(path: string) {
  if (!path || /^(?:[a-z][a-z\d+.-]*:|#)/i.test(path)) {
    return path;
  }

  if (!path.startsWith("/")) {
    return path;
  }

  return `${base}${path}` || "/";
}
