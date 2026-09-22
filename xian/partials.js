import fs from "node:fs/promises";
import path from "node:path";

/**
 * Recursively registers all `.xian` files inside a directory
 * as Handlebars partials.
 *
 * Example:
 *
 * partials/
 * ├── navbar.xian
 * └── components/
 *     └── button.xian
 *
 * Becomes:
 *
 * {{> navbar}}
 * {{> components/button}}
 *
 * @param {object} handlebars - The isolated Handlebars/hbs instance.
 * @param {string} partialsDirectory - Root directory containing partials.
 * @returns {Promise<void>}
 */
export async function registerPartials(
    handlebars,
    partialsDirectory,
) {
    await registerDirectory(
        handlebars,
        partialsDirectory,
        partialsDirectory,
    );
}

/**
 * Recursively walks through a directory.
 *
 * `baseDirectory` is kept unchanged so we can calculate
 * the partial's name relative to the root partial directory.
 *
 * @param {object} handlebars
 * @param {string} currentDirectory
 * @param {string} baseDirectory
 * @returns {Promise<void>}
 */
async function registerDirectory(
    handlebars,
    currentDirectory,
    baseDirectory,
) {
    const entries = await fs.readdir(currentDirectory, {
        withFileTypes: true,
    });

    for (const entry of entries) {
        const fullPath = path.join(
            currentDirectory,
            entry.name,
        );

        // If this is a directory, recursively scan it.
        if (entry.isDirectory()) {
            await registerDirectory(
                handlebars,
                fullPath,
                baseDirectory,
            );

            continue;
        }

        // Ignore anything that isn't a `.xian` file.
        if (
            !entry.isFile() ||
            !entry.name.endsWith(".xian")
        ) {
            continue;
        }

        // Read the partial's source code.
        const content = await fs.readFile(
            fullPath,
            "utf8",
        );

        /*
         * Calculate the path relative to the root
         * `views/partials` directory.
         *
         * Example:
         *
         * base:
         * views/partials
         *
         * file:
         * views/partials/components/button.xian
         *
         * result:
         * components/button.xian
         */
        const relativePath = path.relative(
            baseDirectory,
            fullPath,
        );

        /*
         * Remove the `.xian` extension.
         *
         * components/button.xian
         * ↓
         * components/button
         */
        const partialName = relativePath
            .replace(/\.xian$/, "")

            /*
             * Windows uses `\` as its path separator.
             *
             * Handlebars partial names should use `/`
             * regardless of the operating system.
             */
            .split(path.sep)
            .join("/");

        // Register the partial in our isolated Handlebars instance.
        handlebars.registerPartial(
            partialName,
            content,
        );

        console.log(
            `✓ Registered Xian partial: ${partialName}`,
        );
    }
}