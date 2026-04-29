import path from "node:path";

export const MAX_ASSET_SIZE = Number(process.env.MAX_ASSET_SIZE_BYTES ?? 5 * 1024 * 1024);

const allowedMimeExtensions = new Map([
  ["image/jpeg", new Set([".jpg", ".jpeg"])],
  ["image/png", new Set([".png"])],
  ["image/webp", new Set([".webp"])],
  ["image/gif", new Set([".gif"])],
  ["image/svg+xml", new Set([".svg"])],
  ["image/x-icon", new Set([".ico"])],
  ["font/woff", new Set([".woff"])],
  ["font/woff2", new Set([".woff2"])],
  ["application/pdf", new Set([".pdf"])],
]);

export function validateAssetFile(file: File) {
  const extension = path.extname(file.name).toLowerCase();
  const allowedExtensions = allowedMimeExtensions.get(file.type);

  if (file.size <= 0) {
    throw new Error("Arquivo inválido.");
  }

  if (file.size > MAX_ASSET_SIZE) {
    throw new Error(`Arquivo excede o limite de ${Math.floor(MAX_ASSET_SIZE / 1024 / 1024)} MB.`);
  }

  if (!allowedExtensions?.has(extension)) {
    throw new Error("Tipo de arquivo não permitido.");
  }
}

export function isInsideStorage(storagePath: string) {
  const storageDir = getStorageDir();
  const resolvedPath = path.resolve(/* turbopackIgnore: true */ storagePath);

  return resolvedPath.startsWith(storageDir + path.sep);
}

export function getStorageDir() {
  return path.resolve(/* turbopackIgnore: true */ process.env.STORAGE_DIR ?? "./storage");
}
