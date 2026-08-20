import { describe, expect, it } from "vitest";

import { findCenteredItemId } from "@/lib/opportunities/carousel-selection";

const items = [
  { id: "first", left: 0, width: 400 },
  { id: "second", left: 416, width: 400 },
  { id: "third", left: 832, width: 400 },
];

describe("carousel selection", () => {
  it("selects the card closest to the viewport center", () => {
    expect(findCenteredItemId(200, 800, items)).toBe("second");
  });

  it("updates when the viewport moves across the carousel", () => {
    expect(findCenteredItemId(620, 800, items)).toBe("third");
  });

  it("returns null when the carousel has no cards", () => {
    expect(findCenteredItemId(0, 800, [])).toBeNull();
  });
});
