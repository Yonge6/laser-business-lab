"use client";

import { createContext, useContext, useMemo, useSyncExternalStore, type ReactNode } from "react";

export type Locale = "en" | "zh";

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
  return window.localStorage.getItem("lbl_locale") === "zh" ? "zh" : "en";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const locale = useSyncExternalStore<Locale>(subscribeLocale, getLocaleSnapshot, () => "en");

  const setLocale = (next: Locale) => {
    window.localStorage.setItem("lbl_locale", next);
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
