import chokidar from "chokidar";
import { registerPartial, unregisterPartial } from "./partials.js";

/**
 * Watches Xian template directories.
 *
 * This should only be enabled in development.
 */
export function watchXianFiles({
  handlebars,
  partialsDirectory,
  layoutsDirectory,
  helpersDirectory,
  invalidateTemplate,
}) {
  const watcher = chokidar.watch([partialsDirectory, layoutsDirectory, helpersDirectory], {
    ignoreInitial: true,
  });

  watcher.on("add", async (filePath) => {
    try {
      if (filePath.endsWith(".xian")) {
        await registerPartial(handlebars, partialsDirectory, filePath);
      }

      invalidateTemplate(filePath);

      console.log(`🔥 Xian file added: ${filePath}`);
    } catch (error) {
      console.error("❌ Xian watcher error:", error);
    }
  });

  watcher.on("change", async (filePath) => {
    try {
      if (filePath.endsWith(".xian")) {
        await registerPartial(handlebars, partialsDirectory, filePath);
      }

      invalidateTemplate(filePath);

      console.log(`♻️ Xian file changed: ${filePath}`);
    } catch (error) {
      console.error("❌ Xian watcher error:", error);
    }
  });

  watcher.on("unlink", (filePath) => {
    try {
      if (filePath.endsWith(".xian")) {
        unregisterPartial(handlebars, partialsDirectory, filePath);
      }

      invalidateTemplate(filePath);

      console.log(`🗑️ Xian file removed: ${filePath}`);
    } catch (error) {
      console.error("❌ Xian watcher error:", error);
    }
  });

  return watcher;
}
