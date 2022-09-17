import { describe, expect, test } from "vitest";
import { tryToGetTo } from "./moves";

describe("tryToGetTo()", () => {
  test("handles simple cases", () => {
    expect(tryToGetTo(1, 2, [{ move: 1 }])).toMatchObject({
      to: 2,
      cards: [{ move: 1 }],
    });

    expect(tryToGetTo(0, 8, [{ move: 4 }, { move: 3 }])).toMatchObject({
      to: 7,
      cards: [{ move: 3 }, { move: 4 }],
    });
  });

  test("handles negative direction", () => {
    expect(tryToGetTo(1, -2, [{ move: 1 }])).toMatchObject({
      to: 0,
      cards: [{ move: 1 }],
    });

    expect(tryToGetTo(0, -8, [{ move: 4 }, { move: 3 }])).toMatchObject({
      to: -7,
      cards: [{ move: 3 }, { move: 4 }],
    });
  });

  test("uses the most cards possible", () => {
    expect(
      tryToGetTo(0, 5, [{ move: 2 }, { move: 3 }, { move: 5 }])
    ).toMatchObject({
      to: 5,
      cards: [{ move: 2 }, { move: 3 }],
    });

    // And in reverse, to be sure
    expect(
      tryToGetTo(0, 5, [{ move: 5 }, { move: 3 }, { move: 2 }])
    ).toMatchObject({
      to: 5,
      cards: [{ move: 2 }, { move: 3 }],
    });
  });
});
