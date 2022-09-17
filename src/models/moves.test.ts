import { describe, expect, test } from "vitest";
import { tryToGetTo } from "./moves";

describe("tryToGetTo()", () => {
  test("handles simple cases", () => {
    expect(tryToGetTo(1, 2, [{ move: 1 }])).toMatchObject({
      to: 2,
      cardsUsed: [{ move: 1 }],
    });

    expect(tryToGetTo(0, 8, [{ move: 4 }, { move: 3 }])).toMatchObject({
      to: 7,
      cardsUsed: [{ move: 3 }, { move: 4 }],
    });
  });

  test("handles negative direction", () => {
    expect(tryToGetTo(1, -2, [{ move: 1 }])).toMatchObject({
      to: 0,
      cardsUsed: [{ move: 1 }],
    });

    expect(tryToGetTo(0, -8, [{ move: 4 }, { move: 3 }])).toMatchObject({
      to: -7,
      cardsUsed: [{ move: 3 }, { move: 4 }],
    });
  });

  test("uses the most cards possible to get as close as possible", () => {
    expect(
      tryToGetTo(0, 5, [
        // Use these...
        { move: 2 },
        { move: 3 },
        // ...not this:
        { move: 5 },
      ])
    ).toMatchObject({
      to: 5,
      cardsUsed: [{ move: 2 }, { move: 3 }],
    });

    // And in reverse, to be sure
    expect(
      tryToGetTo(0, 5, [
        // Don't use this...
        { move: 5 },
        // ...use these:
        { move: 3 },
        { move: 2 },
      ])
    ).toMatchObject({
      to: 5,
      cardsUsed: [{ move: 2 }, { move: 3 }],
    });

    expect(
      tryToGetTo(0, 5, [
        // Ignore this:
        { move: 1 },
        // Use these:
        { move: 2 },
        { move: 3 },
        // Ignore this:
        { move: 5 },
      ])
    ).toMatchObject({
      to: 5,
      cardsUsed: [{ move: 2 }, { move: 3 }],
    });

    expect(
      tryToGetTo(0, 8, [
        // Use this:
        { move: 4 },
        // Ignore this:
        { move: 3 },
        // Use these:
        { move: 2 },
        { move: 2 },
      ])
    ).toMatchObject({
      to: 8,
      cardsUsed: [{ move: 2 }, { move: 2 }, { move: 4 }],
    });

    expect(
      tryToGetTo(0, -8, [
        // Use these:
        { move: 1 },
        { move: 2 },
        // Ignore this:
        { move: 3 },
        // Use this:
        { move: 5 },
      ])
    ).toMatchObject({
      to: -8,
      cardsUsed: [{ move: 1 }, { move: 2 }, { move: 5 }],
    });

    expect(
      tryToGetTo(0, -7, [
        // Use these
        { move: 1 },
        { move: 4 },
        // Ignore this:
        { move: 4 },
      ])
    ).toMatchObject({
      to: -5,
      cardsUsed: [{ move: 1 }, { move: 4 }],
    });
  });
});
