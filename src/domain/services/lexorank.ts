const BASE = 100000;
const STEP = 1000;

function formatRankValue(val: number): string {
  return Math.floor(val).toString().padStart(12, "0");
}

function parseRankValue(rank: string): number {
  const num = Number.parseInt(rank, 10);
  return Number.isNaN(num) ? BASE : num;
}

export function generateInitialRank(index: number): string {
  return formatRankValue(BASE + (index + 1) * STEP);
}

export function computeBetweenRank(
  prevRank: string | null,
  nextRank: string | null
): string {
  if (!prevRank && !nextRank) {
    return generateInitialRank(0);
  }
  if (!prevRank && nextRank) {
    const nextVal = parseRankValue(nextRank);
    return formatRankValue(Math.max(10, Math.floor(nextVal / 2)));
  }
  if (prevRank && !nextRank) {
    const prevVal = parseRankValue(prevRank);
    return formatRankValue(prevVal + STEP);
  }
  const prevVal = parseRankValue(prevRank!);
  const nextVal = parseRankValue(nextRank!);
  if (nextVal - prevVal <= 1) {
    return `${prevRank}5`;
  }
  return formatRankValue(prevVal + Math.floor((nextVal - prevVal) / 2));
}
