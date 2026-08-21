import { describe, expect, it } from "vitest";

import { withElianSource } from "@/lib/commerce/outbound";
import { marketCases } from "@/lib/opportunities/market-cases";

describe("outbound link attribution", () => {
  it("adds the Elian source to a clean external URL", () => {
    expect(withElianSource("https://example.com/product")).toBe("https://example.com/product?utm_source=elian");
  });

  it("preserves existing query parameters and fragments", () => {
    expect(withElianSource("https://example.com/product?variant=red#details")).toBe("https://example.com/product?variant=red&utm_source=elian#details");
  });

  it("replaces an existing source instead of duplicating it", () => {
    const result = new URL(withElianSource("https://example.com/product?utm_source=old&utm_source=older"));
    expect(result.searchParams.getAll("utm_source")).toEqual(["elian"]);
  });

  it("leaves internal and non-web destinations unchanged", () => {
    expect(withElianSource("/calculator")).toBe("/calculator");
    expect(withElianSource("mailto:hello@example.com")).toBe("mailto:hello@example.com");
  });

  it("attributes every marketplace product example and search path", () => {
    expect(marketCases.every(({ sourceUrl, searchUrl }) => [sourceUrl, searchUrl].every((href) => new URL(href).searchParams.get("utm_source") === "elian"))).toBe(true);
  });

  it("builds a distinct Etsy search query for every opportunity", () => {
    expect(marketCases.every(({ searchUrl }) => {
      const url = new URL(searchUrl);
      return url.origin === "https://www.etsy.com" && url.pathname === "/search" && Boolean(url.searchParams.get("q"));
    })).toBe(true);
    expect(new Set(marketCases.map(({ searchUrl }) => new URL(searchUrl).searchParams.get("q"))).size).toBe(marketCases.length);
  });
});
