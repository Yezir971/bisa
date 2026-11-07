import { describe, it, expect } from "vitest";
import { computeBetweenRank, generateInitialRank } from "./lexorank";

describe("LexoRank Service (TDD & KISS)", () => {
  it("génère un rang initial ordonné lexicographiquement", () => {
    const r0 = generateInitialRank(0);
    const r1 = generateInitialRank(1);
    const r2 = generateInitialRank(2);
    expect(r0 < r1).toBe(true);
    expect(r1 < r2).toBe(true);
  });

  it("calcule un rang intermédiaire strictement compris entre deux rangs existants", () => {
    const rA = generateInitialRank(1);
    const rB = generateInitialRank(2);
    const mid = computeBetweenRank(rA, rB);
    expect(mid > rA).toBe(true);
    expect(mid < rB).toBe(true);
  });

  it("calcule un rang avant le premier élément si prevRank est null", () => {
    const first = generateInitialRank(0);
    const before = computeBetweenRank(null, first);
    expect(before < first).toBe(true);
  });

  it("calcule un rang après le dernier élément si nextRank est null", () => {
    const last = generateInitialRank(5);
    const after = computeBetweenRank(last, null);
    expect(after > last).toBe(true);
  });
});
