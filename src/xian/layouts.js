import fs from "node:fs/promises";
import path from "node:path";

/**
 * Finds a layout file.
 */
export async function resolveLayout(layoutsDirectory, layoutName) {
  if (!layoutName) {
    return null;
  }

  const layoutPath = path.join(layoutsDirectory, `${layoutName}.xian`);

  try {
    await fs.access(layoutPath);
  } catch {
    throw new Error(`Xian layout "${layoutName}" was not found at "${layoutPath}".`);
  }

  return layoutPath;
}
