import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

/**
 * Converts a filename into a helper name.
 *
 * currency.js -> currency
 */
function createHelperName(fileName) {
    return fileName
        .replace(/\.[^/.]+$/, "")
        .replace(/[^a-zA-Z0-9_-]/g, "_");
}

/**
 * Finds helper files.
 */
async function findHelperFiles(directory) {
    const entries = await fs.readdir(directory, {
        withFileTypes: true,
    });

    return entries
        .filter(
            (entry) =>
                entry.isFile() &&
                /\.(js|mjs)$/.test(entry.name),
        )
        .map((entry) =>
            path.join(
                directory,
                entry.name,
            ),
        );
}

/**
 * Registers all helpers inside the helpers directory.
 */
export async function registerHelpers(
    handlebars,
    helpersDirectory,
) {
    const files =
        await findHelperFiles(helpersDirectory);

    for (const filePath of files) {
        const module = await import(
            pathToFileURL(filePath).href
        );

        const helperName =
            createHelperName(
                path.basename(filePath),
            );

        const helper =
            module.default ?? module[helperName];

        if (typeof helper !== "function") {
            throw new TypeError(
                `Helper "${filePath}" must export a function.`,
            );
        }

        handlebars.registerHelper(
            helperName,
            helper,
        );
    }

    return files;
}