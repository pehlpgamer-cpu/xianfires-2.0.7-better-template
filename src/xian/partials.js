import fs from "node:fs/promises";
import path from "node:path";

/**
 * Determines whether a file is a Xian template.
 */
function isXianFile(fileName) {
  return fileName.endsWith(".xian");
}

/**
 * Converts a filesystem path into a Handlebars partial name.
 *
 * Example:
 *
 * views/partials/components/button.xian
 *
 * becomes:
 *
 * components/button
 */
function createPartialName(baseDirectory, filePath) {
  const relativePath = path.relative(baseDirectory, filePath);

  return relativePath
    .replace(/\.xian$/, "")
    .split(path.sep)
    .join("/");
}

/**
 * Recursively discovers every .xian file.
 */
export async function findPartialFiles(directory) {
  const entries = await fs.readdir(directory, {
    withFileTypes: true,
  });

  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      const nestedFiles = await findPartialFiles(fullPath);

      files.push(...nestedFiles);

      continue;
    }

    if (entry.isFile() && isXianFile(entry.name)) {
      files.push(fullPath);
    }
  }

  return files;
}

/**
 * Registers one partial.
 */
export async function registerPartial(handlebars, partialsDirectory, filePath) {
  const content = await fs.readFile(filePath, "utf8");

  const partialName = createPartialName(partialsDirectory, filePath);

  handlebars.registerPartial(partialName, content);

  return partialName;
}

/**
 * Recursively registers all Xian partials.
 */
export async function registerPartials(handlebars, partialsDirectory) {
  const files = await findPartialFiles(partialsDirectory);

  for (const filePath of files) {
    await registerPartial(handlebars, partialsDirectory, filePath);
  }

  return files;
}

/**
 * Removes a partial from the Handlebars instance.
 */
export function unregisterPartial(handlebars, partialsDirectory, filePath) {
  const partialName = createPartialName(partialsDirectory, filePath);

  handlebars.unregisterPartial(partialName);

  return partialName;
}
