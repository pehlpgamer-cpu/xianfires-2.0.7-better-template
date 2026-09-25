/**
 * Custom error used by the Xian template engine.
 * This gives template errors useful information such as:
 * - template file
 * - original error
 * - line number
 * - column number
 */
export class XianTemplateError extends Error {
  constructor(message, { templatePath = null, cause = null, line = null, column = null } = {}) {
    super(message, { cause });

    this.name = "XianTemplateError";
    this.templatePath = templatePath;
    this.line = line;
    this.column = column;
  }
}



// Attempts to extract line/column information from a Handlebars compiler error.
function extractLocation(error) {
  return {
    line: error?.lineNumber ?? error?.line ?? null,

    column: error?.columnNumber ?? error?.column ?? null,
  };
}


// Converts an arbitrary error into a XianTemplateError. (FOR ENGINE)
export function createTemplateError(error, templatePath) {
  if (error instanceof XianTemplateError) {
    return error;
  }

  const { line, column } = extractLocation(error);

  const location = [];

  if (line !== null) {
    location.push(`line ${line}`);
  }

  if (column !== null) {
    location.push(`column ${column}`);
  }

  const locationText = location.length > 0 ? ` (${location.join(", ")})` : "";

  const originalMessage = error instanceof Error ? error.message : String(error);

  return new XianTemplateError(
    `Failed to render Xian template "${templatePath}"${locationText}: ${originalMessage}`,
    {
      templatePath,
      cause: error,
      line,
      column,
    },
  );
}
