import { describe, expect, it } from "vitest";
import {
  computeOptimizedDimensions,
  estimateDataUrlBytes,
  toWebpFileName,
  validateSourceImageFile,
} from "./webp-image-converter";

describe("WebP Image Converter & Validator", () => {
  it("accepte uniquement les formats JPG, PNG et WEBP et rejette les autres formats", () => {
    expect(
      validateSourceImageFile({
        name: "capture.jpg",
        type: "image/jpeg",
        size: 120_000,
      })
    ).toBe("JPG");

    expect(
      validateSourceImageFile({
        name: "maquette.png",
        type: "image/png",
        size: 340_000,
      })
    ).toBe("PNG");

    expect(
      validateSourceImageFile({
        name: "schema.webp",
        type: "image/webp",
        size: 85_000,
      })
    ).toBe("WEBP");

    expect(() =>
      validateSourceImageFile({
        name: "animation.gif",
        type: "image/gif",
        size: 50_000,
      })
    ).toThrow(/Seuls les formats JPG, PNG et WEBP sont acceptés/);

    expect(() =>
      validateSourceImageFile({
        name: "document.pdf",
        type: "application/pdf",
        size: 50_000,
      })
    ).toThrow(/Seuls les formats JPG, PNG et WEBP sont acceptés/);
  });

  it("renomme proprement l'extension du fichier source en .webp", () => {
    expect(toWebpFileName("erreur-checkout.PNG")).toBe("erreur-checkout.webp");
    expect(toWebpFileName("photo_client.jpeg")).toBe("photo_client.webp");
    expect(toWebpFileName("deja-optimise.webp")).toBe("deja-optimise.webp");
  });

  it("redimensionne proportionnellement les grandes images et estime la taille en octets", () => {
    const dims = computeOptimizedDimensions(2880, 1440, 1440);
    expect(dims).toEqual({ width: 1440, height: 720 });

    const smallDims = computeOptimizedDimensions(800, 600, 1440);
    expect(smallDims).toEqual({ width: 800, height: 600 });

    const sampleDataUrl = "data:image/webp;base64,UklGRhIAAABXRUJQVlA4TAYAAAAvAAAAAAfQ//73v/+BiOh/AAA=";
    expect(estimateDataUrlBytes(sampleDataUrl)).toBeGreaterThan(20);
  });
});
