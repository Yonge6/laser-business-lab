"use client";

import { createContext, useContext, useEffect, useMemo, useSyncExternalStore, type ReactNode } from "react";

import { localeStorageKey, readSessionLocale, type Locale } from "@/lib/locale-preference";

export type { Locale } from "@/lib/locale-preference";

type LanguageContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

const localeEvent = "lbl-locale-change";

function subscribeLocale(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(localeEvent, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(localeEvent, callback);
  };
}

function getLocaleSnapshot(): Locale {
  return readSessionLocale(window.sessionStorage);
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const locale = useSyncExternalStore<Locale>(subscribeLocale, getLocaleSnapshot, () => "en");

  useEffect(() => {
    window.localStorage.removeItem(localeStorageKey);
  }, []);

  const setLocale = (next: Locale) => {
    window.sessionStorage.setItem(localeStorageKey, next);
    document.documentElement.lang = next === "zh" ? "zh-CN" : "en";
    window.dispatchEvent(new Event(localeEvent));
  };

  const value = useMemo(() => ({ locale, setLocale }), [locale]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used inside LanguageProvider");
  return context;
}
