export type Locale = "en" | "zh";

export const localeStorageKey = "lbl_locale";

type ReadableStorage = Pick<Storage, "getItem">;

export function readSessionLocale(storage: ReadableStorage): Locale {
  return storage.getItem(localeStorageKey) === "zh" ? "zh" : "en";
}
