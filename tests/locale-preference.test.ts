import { describe, expect, it } from "vitest";

import { localeStorageKey, readSessionLocale } from "@/lib/locale-preference";

function storageWith(value: string | null) {
  return {
    getItem: (key: string) => (key === localeStorageKey ? value : null),
  };
}

describe("locale preference", () => {
  it("defaults a new session to English", () => {
    expect(readSessionLocale(storageWith(null))).toBe("en");
  });

  it("keeps Chinese only when selected in the current session", () => {
    expect(readSessionLocale(storageWith("zh"))).toBe("zh");
  });

  it("falls back to English for unknown stored values", () => {
    expect(readSessionLocale(storageWith("fr"))).toBe("en");
  });
});
