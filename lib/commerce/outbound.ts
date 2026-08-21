export const ELIAN_UTM_SOURCE = "elian";

export function withElianSource(href: string) {
  if (!/^https?:\/\//i.test(href)) return href;

  const url = new URL(href);
  url.searchParams.set("utm_source", ELIAN_UTM_SOURCE);
  return url.toString();
}
