export type SupportedSourceImageFormat = "JPG" | "PNG" | "WEBP";

export const ALLOWED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
] as const;

export const MAX_SOURCE_IMAGE_BYTES = 15 * 1024 * 1024; // 15 Mo max en entrée

export interface ConvertedWebpImage {
  name: string;
  originalFormat: SupportedSourceImageFormat;
  mimeType: "image/webp";
  dataUrl: string;
  width: number;
  height: number;
  originalSizeBytes: number;
  webpSizeBytes: number;
}

/**
 * Détecte et valide que le fichier fourni est bien une image JPG, PNG ou WEBP.
 */
export function validateSourceImageFile(file: {
  name: string;
  type: string;
  size: number;
}): SupportedSourceImageFormat {
  if (!file || file.size <= 0) {
    throw new Error("Le fichier image sélectionné est vide.");
  }
  if (file.size > MAX_SOURCE_IMAGE_BYTES) {
    throw new Error(
      "L'image dépasse la taille maximale autorisée (15 Mo). Veuillez choisir une image plus légère."
    );
  }

  const mime = file.type.toLowerCase().trim();
  const lowerName = file.name.toLowerCase().trim();

  if (
    mime === "image/jpeg" ||
    mime === "image/jpg" ||
    lowerName.endsWith(".jpg") ||
    lowerName.endsWith(".jpeg")
  ) {
    return "JPG";
  }

  if (mime === "image/png" || lowerName.endsWith(".png")) {
    return "PNG";
  }

  if (mime === "image/webp" || lowerName.endsWith(".webp")) {
    return "WEBP";
  }

  throw new Error(
    "Format d'image non supporté. Seuls les formats JPG, PNG et WEBP sont acceptés."
  );
}

/**
 * Normalise le nom du fichier pour remplacer son extension (.jpg, .jpeg, .png, .webp) par .webp
 */
export function toWebpFileName(originalName: string): string {
  const trimmed = originalName.trim() || "contexte-ticket";
  const withoutExt = trimmed.replace(/\.(jpe?g|png|webp)$/i, "");
  const safeBase =
    withoutExt.replace(/[^a-zA-Z0-9._-\u00C0-\u017F ]/g, "").trim() ||
    "contexte-ticket";
  return `${safeBase}.webp`;
}

/**
 * Calcule la taille approximative en octets d'une Data URL base64.
 */
export function estimateDataUrlBytes(dataUrl: string): number {
  const base64Index = dataUrl.indexOf(";base64,");
  if (base64Index === -1) return dataUrl.length;
  const base64 = dataUrl.slice(base64Index + 8);
  const padding = base64.endsWith("==") ? 2 : base64.endsWith("=") ? 1 : 0;
  return Math.max(1, Math.floor((base64.length * 3) / 4) - padding);
}

/**
 * Calcule les dimensions cibles en conservant le ratio d'aspect pour optimiser les performances.
 */
export function computeOptimizedDimensions(
  width: number,
  height: number,
  maxDimension = 1440
): { width: number; height: number } {
  const safeW = Math.max(1, Math.round(width));
  const safeH = Math.max(1, Math.round(height));
  if (safeW <= maxDimension && safeH <= maxDimension) {
    return { width: safeW, height: safeH };
  }
  const scale = maxDimension / Math.max(safeW, safeH);
  return {
    width: Math.max(1, Math.round(safeW * scale)),
    height: Math.max(1, Math.round(safeH * scale)),
  };
}

/**
 * Convertit un fichier image (JPG, PNG ou WEBP) en image WebP optimisée côté navigateur
 * via l'API HTML5 Canvas pour maximiser les performances d'affichage et de transfert.
 */
export async function convertImageFileToWebp(
  file: File,
  options?: { maxDimension?: number; quality?: number }
): Promise<ConvertedWebpImage> {
  const originalFormat = validateSourceImageFile(file);
  const maxDimension = options?.maxDimension ?? 1440;
  const quality = options?.quality ?? 0.82;

  const objectUrl = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const element = new Image();
      element.onload = () => resolve(element);
      element.onerror = () =>
        reject(new Error("Impossible de décoder le fichier image sélectionné."));
      element.src = objectUrl;
    });

    const targetDims = computeOptimizedDimensions(
      img.naturalWidth || img.width || 800,
      img.naturalHeight || img.height || 600,
      maxDimension
    );

    const canvas = document.createElement("canvas");
    canvas.width = targetDims.width;
    canvas.height = targetDims.height;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Contexte graphique 2D indisponible pour la conversion WebP.");
    }

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, 0, 0, targetDims.width, targetDims.height);

    const dataUrl = canvas.toDataURL("image/webp", quality);
    if (!dataUrl.startsWith("data:image/webp")) {
      throw new Error(
        "Votre navigateur n'a pas pu encoder l'image au format WebP."
      );
    }

    return {
      name: toWebpFileName(file.name),
      originalFormat,
      mimeType: "image/webp",
      dataUrl,
      width: targetDims.width,
      height: targetDims.height,
      originalSizeBytes: file.size,
      webpSizeBytes: estimateDataUrlBytes(dataUrl),
    };
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}
