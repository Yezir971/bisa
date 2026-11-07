"use client";

import Chart from "chart.js/auto";

export const DC_PALETTE_ORDER = [
  "primary",
  "secondary",
  "accent",
  "info",
  "success",
  "warning",
  "error",
] as const;

export type DaisyColorToken =
  | (typeof DC_PALETTE_ORDER)[number]
  | "base-100"
  | "base-200"
  | "base-300"
  | "base-content"
  | "neutral"
  | "neutral-content";

export function dcColor(token: DaisyColorToken, fallback = "#6366f1"): string {
  if (typeof window === "undefined") return fallback;
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue(`--color-${token}`)
    .trim();
  return raw || fallback;
}

export function dcAlpha(token: DaisyColorToken, percent: number): string {
  const c = dcColor(token);
  return `color-mix(in oklab, ${c} ${percent}%, transparent)`;
}

export function dcPalette(count = 7, alphaPercent?: number): string[] {
  return Array.from({ length: count }, (_, i) => {
    const token = DC_PALETTE_ORDER[i % DC_PALETTE_ORDER.length];
    return alphaPercent ? dcAlpha(token, alphaPercent) : dcColor(token);
  });
}

export function applyDaisyChartDefaults() {
  if (typeof window === "undefined") return;
  Chart.defaults.color = dcColor("base-content", "#334155");
  Chart.defaults.borderColor = dcColor("base-300", "#e2e8f0");
  Chart.defaults.font.family = "inherit";
  Chart.defaults.font.size = 12;
  Chart.defaults.plugins.tooltip.backgroundColor = dcColor("neutral", "#1e293b");
  Chart.defaults.plugins.tooltip.titleColor = dcColor(
    "neutral-content",
    "#f8fafc"
  );
  Chart.defaults.plugins.tooltip.bodyColor = dcColor(
    "neutral-content",
    "#f8fafc"
  );
  Chart.defaults.plugins.tooltip.cornerRadius = 8;
  Chart.defaults.plugins.tooltip.padding = 10;
  Chart.defaults.plugins.legend.labels.color = dcColor(
    "base-content",
    "#334155"
  );
  const reducedMotion =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  Chart.defaults.animation = reducedMotion ? false : { duration: 500 };
}
