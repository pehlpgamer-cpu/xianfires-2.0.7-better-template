# Event Driven Programming — XianFire / Custom `.xian` View Engine Conversation

> Conversation export prepared on 2026-09-22.
>
> This Markdown file contains the conversation content available in the current chat context, including the XianFire / Express / Handlebars discussion and the implementation details developed during the conversation.

---

## User — 2026-09-22 01:27 UTC

> Give me a the implementation of priority 1 up to 9

## Assistant

Bro, I’ll turn priorities 1–9 into one coherent Xian engine: isolated Handlebars instance, recursive loading, startup sync, caching, layouts, helpers, errors, dev watching, and development strict mode.

### 1. Final architecture

```text
src/
├── app.js
│
├── routes/
│   ├── web.js
│   └── api_v1.js
│
└── xian/
    ├── engine.js
    ├── errors.js
    ├── helpers.js
    ├── layouts.js
    ├── partials.js
    ├── watcher.js
    └── index.js

views/
├── layouts/
│   └── main.xian
│
├── pages/
│   ├── home.xian
│   └── admin/
│       └── users/
│           └── index.xian
│
├── partials/
│   ├── navbar.xian
│   └── components/
│       ├── button.xian
│       └── card.xian
│
└── helpers/
    ├── json.js
    ├── uppercase.js
    └── currency.js
```

I recommend installing Chokidar for Priority 8:

```powershell
npm install chokidar
```

---

# 2. `src/xian/errors.js`

This handles Priority **7 — better template errors**.

```js
/**
 * Custom error used by the Xian template engine.
 *
 * This gives template errors useful information such as:
 *
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

/**
 * Attempts to extract line/column information from
 * a Handlebars compiler error.
 */
function extractLocation(error) {
  return {
    line: error?.lineNumber ?? error?.line ?? null,

    column: error?.columnNumber ?? error?.column ?? null,
  };
}

/**
 * Converts an arbitrary error into a XianTemplateError.
 */
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
```

Example error:

```text
XianTemplateError:
Failed to render Xian template
"C:\project\views\pages\home.xian" (line 12, column 8):
Missing helper: "currency"
```

---

# 3. `src/xian/partials.js`

This implements Priority **2 — recursive partial loading**.

It also gives us functions that the watcher can use later.

```js
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
```

For example:

```text
partials/
├── navbar.xian
├── components/
│   ├── button.xian
│   └── card.xian
└── admin/
    └── sidebar.xian
```

becomes:

```text
navbar
components/button
components/card
admin/sidebar
```

So:

```hbs
{{> navbar}}

{{> components/button}}

{{> admin/sidebar}}
```

---

# 4. `src/xian/helpers.js`

This implements Priority **6 — helper auto-registration**.

Each file represents one helper.

### `helpers/uppercase.js`

```js
export default function uppercase(value) {
  return String(value ?? "").toUpperCase();
}
```

### `helpers/json.js`

```js
export default function json(value) {
  return JSON.stringify(value);
}
```

### `helpers/currency.js`

```js
export default function currency(value) {
  const amount = Number(value);

  if (!Number.isFinite(amount)) {
    return "";
  }

  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(amount);
}
```

Then the loader:

```js
import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

/**
 * Converts a filename into a helper name.
 *
 * currency.js -> currency
 */
function createHelperName(fileName) {
  return fileName.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9_-]/g, "_");
}

/**
 * Finds helper files.
 */
async function findHelperFiles(directory) {
  const entries = await fs.readdir(directory, {
    withFileTypes: true,
  });

  return entries
    .filter((entry) => entry.isFile() && /\.(js|mjs)$/.test(entry.name))
    .map((entry) => path.join(directory, entry.name));
}

/**
 * Registers all helpers inside the helpers directory.
 */
export async function registerHelpers(handlebars, helpersDirectory) {
  const files = await findHelperFiles(helpersDirectory);

  for (const filePath of files) {
    const module = await import(pathToFileURL(filePath).href);

    const helperName = createHelperName(path.basename(filePath));

    const helper = module.default ?? module[helperName];

    if (typeof helper !== "function") {
      throw new TypeError(`Helper "${filePath}" must export a function.`);
    }

    handlebars.registerHelper(helperName, helper);
  }

  return files;
}
```

Now you can write:

```hbs
<h1>{{uppercase name}}</h1>

<p>{{currency price}}</p>

<pre>{{json product}}</pre>
```

---

# 5. `src/xian/layouts.js`

This implements Priority **5 — layouts**.

Support:

```js
res.render("home", {
  layout: "main",
});
```

and:

```js
res.render("home", {
  layout: false,
});
```

The resulting HTML becomes:

```text
main.xian
    ↓
{{{body}}}
    ↓
home.xian
```

### Layout loader

```js
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
```

---

# 6. `src/xian/watcher.js`

This implements Priority **8 — development watcher**.

Install:

```powershell
npm install chokidar
```

Then:

```js
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
```

This means editing:

```text
views/pages/home.xian
```

can be detected without restarting the server.

---

# 7. `src/xian/engine.js`

This is the main part.

It implements:

- Priority 1 — isolated instance
- Priority 3 — startup synchronization
- Priority 4 — caching
- Priority 5 — layouts
- Priority 7 — errors
- Priority 9 — strict mode

```js
import fs from "node:fs/promises";
import path from "node:path";

import hbs from "hbs";

import { registerPartials } from "./partials.js";

import { registerHelpers } from "./helpers.js";

import { resolveLayout } from "./layouts.js";

import { createTemplateError } from "./errors.js";

import { watchXianFiles } from "./watcher.js";

/**
 * Creates the Xian view engine.
 */
export async function createXianEngine({
  partialsDirectory,
  layoutsDirectory,
  helpersDirectory,

  environment = process.env.NODE_ENV ?? "development",

  defaultLayout = "main",

  strict = environment === "development",

  watch = environment === "development",

  cache = environment === "production",
}) {
  /*
   * ---------------------------------------------------------
   * PRIORITY 1
   * ---------------------------------------------------------
   *
   * Create an isolated HBS instance.
   *
   * We DO NOT use the global `hbs` instance for application
   * registrations.
   */
  const xian = hbs.create();

  /*
   * The actual Handlebars implementation behind this HBS
   * instance.
   */
  const handlebars = xian.handlebars;

  /*
   * ---------------------------------------------------------
   * PRIORITY 4
   * ---------------------------------------------------------
   *
   * Application-level compiled template cache.
   *
   * Map:
   *
   * absolute file path
   *        ↓
   * compiled Handlebars function
   */
  const templateCache = new Map();

  /*
   * ---------------------------------------------------------
   * Compile a template.
   * ---------------------------------------------------------
   */
  async function compileTemplate(filePath) {
    /*
     * Production:
     *
     * If already compiled, reuse it.
     */
    if (cache && templateCache.has(filePath)) {
      return templateCache.get(filePath);
    }

    const source = await fs.readFile(filePath, "utf8");

    let template;

    try {
      template = handlebars.compile(source, {
        /*
         * PRIORITY 9
         *
         * Development strict mode detects
         * missing properties instead of silently
         * returning undefined.
         */
        strict,

        /*
         * Keep HTML escaping enabled.
         */
        noEscape: false,
      });
    } catch (error) {
      throw createTemplateError(error, filePath);
    }

    /*
     * Cache only when enabled.
     */
    if (cache) {
      templateCache.set(filePath, template);
    }

    return template;
  }

  /*
   * ---------------------------------------------------------
   * PRIORITY 5
   *
   * Render a layout around page content.
   * ---------------------------------------------------------
   */
  async function renderLayout({ layoutName, body, options }) {
    const layoutPath = await resolveLayout(layoutsDirectory, layoutName);

    const layout = await compileTemplate(layoutPath);

    /*
     * Put the rendered page inside `body`.
     */
    const layoutData = {
      ...options,
      body,
    };

    try {
      return layout(layoutData);
    } catch (error) {
      throw createTemplateError(error, layoutPath);
    }
  }

  /*
   * ---------------------------------------------------------
   * Express view-engine interface.
   *
   * Express expects:
   *
   * engine(filePath, options, callback)
   * ---------------------------------------------------------
   */
  async function render(filePath, options, callback) {
    try {
      /*
       * Compile page.
       */
      const template = await compileTemplate(filePath);

      /*
       * Express puts request locals inside
       * options._locals.
       *
       * We don't want to expose Express internals
       * directly as template data.
       */
      const templateData = {
        ...options,
        ...(options?._locals ?? {}),
      };

      /*
       * -------------------------------------------------
       * Render page first.
       * -------------------------------------------------
       */
      const pageHtml = template(templateData);

      /*
       * -------------------------------------------------
       * PRIORITY 5
       *
       * Layout selection.
       * -------------------------------------------------
       *
       * layout: false
       *     => no layout
       *
       * layout: "main"
       *     => views/layouts/main.xian
       *
       * otherwise
       *     => default layout
       */
      const requestedLayout = options?.layout === false ? null : (options?.layout ?? defaultLayout);

      if (!requestedLayout) {
        callback(null, pageHtml);

        return;
      }

      const html = await renderLayout({
        layoutName: requestedLayout,

        body: pageHtml,

        options: templateData,
      });

      callback(null, html);
    } catch (error) {
      const xianError = createTemplateError(error, filePath);

      callback(xianError);
    }
  }

  /*
   * ---------------------------------------------------------
   * PRIORITY 8
   *
   * Invalidate cached templates when files change.
   * ---------------------------------------------------------
   */
  function invalidateTemplate(filePath) {
    templateCache.delete(filePath);
  }

  /*
   * ---------------------------------------------------------
   * PRIORITY 2
   *
   * Register partials BEFORE the application starts.
   *
   * This is why createXianEngine() is async.
   * ---------------------------------------------------------
   */
  await registerPartials(handlebars, partialsDirectory);

  /*
   * ---------------------------------------------------------
   * PRIORITY 6
   *
   * Register helpers BEFORE the application starts.
   * ---------------------------------------------------------
   */
  await registerHelpers(handlebars, helpersDirectory);

  /*
   * ---------------------------------------------------------
   * PRIORITY 8
   *
   * Start development watcher.
   * ---------------------------------------------------------
   */
  let watcher = null;

  if (watch) {
    watcher = watchXianFiles({
      handlebars,

      partialsDirectory,

      layoutsDirectory,

      helpersDirectory,

      invalidateTemplate,
    });
  }

  /*
   * ---------------------------------------------------------
   * Return public engine API.
   * ---------------------------------------------------------
   */
  return {
    /*
     * Express-compatible engine.
     *
     * app.engine("xian", engine.engine)
     */
    engine: render,

    /*
     * Raw HBS instance.
     *
     * Useful if you need to manually register something.
     */
    hbs: xian,

    /*
     * Underlying Handlebars instance.
     */
    handlebars,

    /*
     * Cache.
     */
    templateCache,

    /*
     * Manually invalidate one template.
     */
    invalidateTemplate,

    /*
     * Stop watcher.
     */
    async close() {
      if (watcher) {
        await watcher.close();
      }
    },
  };
}
```

---

# 8. `src/xian/index.js`

This gives a clean public entry point.

```js
export { createXianEngine } from "./engine.js";

export { XianTemplateError } from "./errors.js";
```

The rest of the application doesn't need to know about the internal Xian files.

---

# 9. `src/app.js`

The Express application becomes much cleaner.

```js
import express from "express";
import path from "node:path";
import session from "express-session";
import flash from "connect-flash";

import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

import { createXianEngine } from "./xian/index.js";

import webRouter from "./routes/web.js";
import apiV1Router from "./routes/api_v1.js";

/*
 * ---------------------------------------------------------
 * ES module directory information.
 * ---------------------------------------------------------
 */
const __filename = fileURLToPath(import.meta.url);

const __dirname = dirname(__filename);

/*
 * ---------------------------------------------------------
 * Application configuration.
 * ---------------------------------------------------------
 */
const app = express();

const PORT = process.env.PORT ?? 3000;

const NODE_ENV = process.env.NODE_ENV ?? "development";

/*
 * ---------------------------------------------------------
 * Xian directories.
 * ---------------------------------------------------------
 */
const viewDirectories = {
  pages: path.join(__dirname, "../views/pages"),

  partials: path.join(__dirname, "../views/partials"),

  layouts: path.join(__dirname, "../views/layouts"),

  helpers: path.join(__dirname, "../views/helpers"),
};

/*
 * ---------------------------------------------------------
 * Express middleware.
 * ---------------------------------------------------------
 */

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  }),
);

app.use(express.static(path.join(process.cwd(), "public")));

/*
 * ---------------------------------------------------------
 * Session.
 * ---------------------------------------------------------
 */

app.use(
  session({
    secret: process.env.SECRET_KEY ?? "development-secret",

    resave: false,

    saveUninitialized: false,
  }),
);

/*
 * ---------------------------------------------------------
 * Flash messages.
 * ---------------------------------------------------------
 */

app.use(flash());

/*
 * ---------------------------------------------------------
 * Flash messages → template locals.
 * ---------------------------------------------------------
 */

app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");

  res.locals.error_msg = req.flash("error_msg");

  next();
});

/*
 * ---------------------------------------------------------
 * Routes.
 * ---------------------------------------------------------
 */

app.use("/", webRouter);

app.use("/api/v1", apiV1Router);

/*
 * ---------------------------------------------------------
 * Application bootstrap.
 * ---------------------------------------------------------
 *
 * IMPORTANT:
 *
 * Xian must initialize BEFORE the server starts accepting
 * requests.
 * ---------------------------------------------------------
 */
async function bootstrap() {
  const xian = await createXianEngine({
    partialsDirectory: viewDirectories.partials,

    layoutsDirectory: viewDirectories.layouts,

    helpersDirectory: viewDirectories.helpers,

    environment: NODE_ENV,

    /*
     * Default layout.
     */
    defaultLayout: "main",

    /*
     * Strict mode:
     *
     * development = true
     * production = false
     */
    strict: NODE_ENV === "development",

    /*
     * Watch files only in development.
     */
    watch: NODE_ENV === "development",

    /*
     * Cache compiled templates in production.
     */
    cache: NODE_ENV === "production",
  });

  /*
   * ---------------------------------------------------------
   * Register Xian as the Express view engine.
   * ---------------------------------------------------------
   */
  app.engine("xian", xian.engine);

  app.set("views", viewDirectories.pages);

  app.set("view engine", "xian");

  /*
   * ---------------------------------------------------------
   * Start HTTP server.
   * ---------------------------------------------------------
   */
  if (!process.env.ELECTRON) {
    app.listen(PORT, () => {
      console.log(`🔥 XianFire running at http://localhost:${PORT}`);

      console.log(`🔥 Xian environment: ${NODE_ENV}`);
    });
  }
}

/*
 * ---------------------------------------------------------
 * Start application.
 * ---------------------------------------------------------
 */
bootstrap().catch((error) => {
  console.error("❌ Failed to start XianFire:", error);

  process.exitCode = 1;
});

export default app;
```

---

# 10. Layout

Create:

```text
views/layouts/main.xian
```

```hbs
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    >

    <title>
        {{title}}
    </title>

    <link
        rel="stylesheet"
        href="/css/app.css"
    >
</head>

<body>

    {{> navbar}}

    <main>
        {{{body}}}
    </main>

</body>

</html>
```

The triple braces are intentional:

```hbs
{{{body}}}
```

The page has already been rendered into HTML, so the entire page should not be HTML-escaped.

---

# 11. Navbar partial

```text
views/partials/navbar.xian
```

```hbs
<nav>
  <a href="/">
    XianFire
  </a>

  <a href="/products">
    Products
  </a>

  <a href="/login">
    Login
  </a>
</nav>
```

---

# 12. Component partial

```text
views/partials/components/card.xian
```

```hbs
<article class="card">

  <h2>
    {{title}}
  </h2>

  <p>
    {{description}}
  </p>

  <strong>
    {{currency price}}
  </strong>

</article>
```

Use it with:

```hbs
{{> components/card
    title="Acer Nitro 5"
    description="Gaming laptop"
    price=49999
}}
```

---

# 13. Example page

```text
views/pages/home.xian
```

```hbs
<section>

    <h1>
        Welcome to XianFire
    </h1>

    <p>
        This page is rendered using the Xian template engine.
    </p>

    {{> components/card
        title="Acer Nitro 5"
        description="Gaming laptop"
        price=49999
    }}

</section>
```

Route:

```js
router.get("/", (req, res) => {
  res.render("home", {
    title: "Home",
  });
});
```

Express resolves:

```text
res.render("home")
        ↓
views/pages/home.xian
```

Xian wraps it with:

```text
views/layouts/main.xian
```

The resulting structure is:

```text
main.xian
│
├── navbar.xian
│
└── {{{body}}}
        │
        └── home.xian
              │
              └── components/card.xian
```

---

# 14. Nested pages

You can have:

```text
views/
└── pages/
    ├── home.xian
    │
    └── admin/
        └── users/
            ├── index.xian
            └── show.xian
```

Route:

```js
router.get("/admin/users", (req, res) => {
  res.render("admin/users/index", {
    title: "Users",
  });
});
```

Express resolves:

```text
views/pages/admin/users/index.xian
```

A recursive page loader is unnecessary because Express resolves view paths relative to `app.set("views", ...)`.

---

# 15. Disable the layout

```js
res.render("admin/login", {
  title: "Login",
  layout: false,
});
```

Result:

```text
admin/login.xian
```

without:

```text
main.xian
```

---

# 16. Use another layout

Create:

```text
views/layouts/
├── main.xian
└── admin.xian
```

Then:

```js
res.render("admin/dashboard", {
  title: "Dashboard",
  layout: "admin",
});
```

Result:

```text
admin.xian
    ↓
{{{body}}}
    ↓
admin/dashboard.xian
```

---

# 17. Priority 4 cache behavior

### Development

```js
cache: false;
```

Every render reads the `.xian` file again:

```text
request
  ↓
read file
  ↓
compile
  ↓
render
```

### Production

```js
cache: true;
```

First request:

```text
request
  ↓
read file
  ↓
compile
  ↓
cache compiled function
  ↓
render
```

Later requests:

```text
request
  ↓
compiled function from cache
  ↓
render
```

---

# 18. Priority 8 watcher behavior

During development:

```text
home.xian changed
        ↓
Chokidar
        ↓
invalidateTemplate()
        ↓
next request
        ↓
compile new version
```

For a partial:

```text
navbar.xian changed
        ↓
Chokidar
        ↓
registerPartial()
        ↓
new partial is immediately available
```

---

# 19. Priority 9 strict mode

Development:

```js
strict: true;
```

Template:

```hbs
<h1>
  {{user.name}}
</h1>
```

Controller:

```js
res.render("home", {
  user: {},
});
```

Strict mode can surface missing properties rather than silently producing empty output.

---

# 20. Architectural improvement

One important architectural limitation is that a mature implementation should distinguish:

```text
partial changed
      ↓
partial registration updated
```

from:

```text
layout changed
      ↓
layout cache invalidated
```

A page using a partial doesn't necessarily need recompilation because Handlebars resolves registered partials during rendering.

For layouts, however:

```text
main.xian
```

is compiled and cached independently, so changing it should invalidate its cache entry.

The resulting dependency structure is:

```text
                  ┌──────────────┐
                  │ Xian Engine  │
                  └──────┬───────┘
                         │
       ┌─────────────────┼─────────────────┐
       ↓                 ↓                 ↓
   Templates         Partials           Layouts
       │                 │                 │
       ↓                 ↓                 ↓
    Cache             Registry           Cache
       │                 │                 │
       └─────────────────┼─────────────────┘
                         ↓
                     Handlebars
                         ↓
                       HTML
```

---

# Previous XianFire discussion/context

The application originally used this Express setup:

```js
import express from "express";
import path from "path";
import session from "express-session";
import flash from "connect-flash";
import fs from "fs";
import hbs from "hbs";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(process.cwd(), "public")));

app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
  }),
);

app.use(flash());

app.engine("xian", async (filePath, options, callback) => {
  try {
    const originalPartialsDir = hbs.partialsDir;
    hbs.partialsDir = path.join(__dirname, "views");

    const result = await new Promise((resolve, reject) => {
      hbs.__express(filePath, options, (err, html) => {
        if (err) return reject(err);
        resolve(html);
      });
    });

    hbs.partialsDir = originalPartialsDir;
    callback(null, result);
  } catch (err) {
    callback(err);
  }
});

app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  next();
});

const viewDir = {
  pages: "views/pages",
  partials: "views/partials",
};

app.set("views", path.join(__dirname, viewDir.pages));
app.set("view engine", "xian");

const partialsDir = path.join(__dirname, viewDir.partials);

fs.readdir(partialsDir, (err, files) => {
  if (err) {
    console.error("❌ Could not read partials directory:", err);
    return;
  }

  files
    .filter((file) => file.endsWith(".xian"))
    .forEach((file) => {
      const partialName = file.replace(".xian", "");
      const fullPath = path.join(partialsDir, file);

      fs.readFile(fullPath, "utf8", (err, content) => {
        if (err) {
          console.error(`❌ Failed to read partial: ${file}`, err);
          return;
        }

        hbs.registerPartial(partialName, content);
      });
    });
});

import web_router from "./routes/web.js";
import api_v1_router from "./routes/api_v1.js";

app.use("/", web_router);
app.use("/api/v1", api_v1_router);

if (!process.env.ELECTRON) {
  app.listen(PORT, () => console.log(`🔥 XianFire running at http://localhost:${PORT}`));
}

export default app;
```

The earlier analysis identified these issues:

1. `app.engine("xian", ...)` registers a custom Express view engine for `.xian`.
2. `app.set("views", ...)` points Express to `views/pages`.
3. `app.set("view engine", "xian")` means `res.render("home")` resolves to `views/pages/home.xian`.
4. `hbs.__express(filePath, options, callback)` is the actual HBS Express adapter.
5. The Promise wrapper unnecessarily converts callback → Promise → async/await → callback.
6. Mutating global `hbs.partialsDir` per request is shared mutable state and is unsafe.
7. Manual `fs.readdir()` loading only scans one level.
8. Partial registration was asynchronous, so the server could begin serving requests before partial registration completed.
9. Partial names are globally registered within the HBS instance.
10. Nested partials require recursive discovery.
11. Nested pages do not need recursive loading because Express resolves nested page paths.
12. `res.locals` middleware is appropriate for flash messages.
13. A modular Xian implementation should isolate engine setup from `app.js`.

The initial recommended priority roadmap was:

1. Isolated `hbs.create()` instance
2. Recursive `.xian` partial loader
3. Startup synchronization
4. Production/development cache
5. Layout system
6. Helper auto-registration
7. Better template errors
8. Development watcher
9. Strict mode in development
10. Precompilation

The current implementation covers priorities **1 through 9**.

---

# Current XianFire design

The intended responsibility split is:

```text
Express
├── HTTP
├── middleware
├── sessions
├── flash
├── routing
└── res.render()

Xian
├── template compilation
├── template caching
├── partial discovery
├── partial registration
├── layouts
├── helpers
├── development watching
├── strict mode
└── template errors

Handlebars
└── actual template rendering
```

This makes Xian a reusable view-engine layer instead of putting all Handlebars configuration directly in `app.js`.

---

# End of conversation export
