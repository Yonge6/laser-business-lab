export const siteBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function assetPath(src: string) {
  if (!src.startsWith("/")) return src;
  return `${siteBasePath}${src}`;
}

export function sitePath(path: string) {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${siteBasePath}${normalized}`;
}
