import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { AppProviders } from "@/components/providers/app-providers";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
  useSearchParams: () => { throw new Promise(() => undefined); },
}));

vi.mock("posthog-js", () => ({ default: { init: vi.fn() } }));

describe("analytics query boundary", () => {
  it("keeps page content in server HTML when only query analytics suspends", () => {
    const html = renderToString(createElement(AppProviders, null,
      createElement("main", null, "Maker guide remains server rendered"),
    ));
    expect(html).toContain("<main>Maker guide remains server rendered</main>");
  });
});
