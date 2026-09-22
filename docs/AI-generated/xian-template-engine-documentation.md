# Xian Template Engine

## 1. Overview

**Xian** is a custom Express.js view-engine subsystem built on top of
Handlebars. It lets an Express application render `.xian` files while
providing an organized architecture for partials, layouts, helpers,
template caching, development watching, strict mode, and structured
errors.

Xian is not intended to replace Handlebars. It wraps Handlebars and
provides application-level conventions and lifecycle management.

### Main features

-   Isolated Handlebars instance with `hbs.create()`
-   Express `app.engine()` integration
-   `.xian` templates
-   Recursive partial discovery and registration
-   Namespaced/nested partials
-   Layouts with a default layout
-   Per-render layout selection or disabling
-   Automatic JavaScript helper registration
-   Development/production template caching
-   Chokidar development watcher
-   Template-cache invalidation
-   Development strict mode
-   Structured `XianTemplateError`
-   Synchronized initialization before the server starts

------------------------------------------------------------------------

# 2. Architecture

``` text
src/
├── app.js
├── routes/
│   ├── web.js
│   └── api_v1.js
└── xian/
    ├── engine.js
    ├── errors.js
    ├── helpers.js
    ├── layouts.js
    ├── partials.js
    ├── watcher.js
    └── index.js

views/
├── pages/
├── partials/
├── layouts/
└── helpers/
```

Responsibilities:

  Module          Responsibility
  --------------- ----------------------------------------------
  `engine.js`     Main Express-compatible rendering engine
  `partials.js`   Recursive discovery and partial registration
  `layouts.js`    Layout resolution
  `helpers.js`    Automatic helper discovery/registration
  `errors.js`     Xian-specific rendering errors
  `watcher.js`    Development filesystem watching
  `index.js`      Public Xian API

High-level flow:

``` text
Express
   │
   ▼
Xian Engine
   ├── template compiler
   ├── template cache
   ├── partial registry
   ├── helper registry
   ├── layout resolver
   ├── error handling
   └── development watcher
   │
   ▼
Handlebars
   │
   ▼
HTML
```

------------------------------------------------------------------------

# 3. Installation

Xian uses the existing Handlebars/HBS integration and Chokidar for
development watching.

``` powershell
npm install hbs
npm install chokidar
```

If `hbs` is already installed, only install Chokidar:

``` powershell
npm install chokidar
```

------------------------------------------------------------------------

# 4. Directory Structure

Recommended structure:

``` text
project/
├── src/
│   ├── app.js
│   ├── routes/
│   │   ├── web.js
│   │   └── api_v1.js
│   └── xian/
│       ├── engine.js
│       ├── errors.js
│       ├── helpers.js
│       ├── layouts.js
│       ├── partials.js
│       ├── watcher.js
│       └── index.js
│
├── views/
│   ├── pages/
│   │   ├── home.xian
│   │   └── admin/
│   │       └── users/
│   │           ├── index.xian
│   │           └── show.xian
│   │
│   ├── partials/
│   │   ├── navbar.xian
│   │   ├── components/
│   │   │   ├── button.xian
│   │   │   └── card.xian
│   │   └── admin/
│   │       └── sidebar.xian
│   │
│   ├── layouts/
│   │   ├── main.xian
│   │   └── admin.xian
│   │
│   └── helpers/
│       ├── json.js
│       ├── uppercase.js
│       └── currency.js
│
├── public/
├── package.json
└── .env
```

------------------------------------------------------------------------

# 5. Express Integration

Configure the view directories:

``` js
const viewDirectories = {
    pages: path.join(
        __dirname,
        "../views/pages",
    ),

    partials: path.join(
        __dirname,
        "../views/partials",
    ),

    layouts: path.join(
        __dirname,
        "../views/layouts",
    ),

    helpers: path.join(
        __dirname,
        "../views/helpers",
    ),
};
```

Initialize Xian:

``` js
const xian = await createXianEngine({
    partialsDirectory:
        viewDirectories.partials,

    layoutsDirectory:
        viewDirectories.layouts,

    helpersDirectory:
        viewDirectories.helpers,

    environment:
        NODE_ENV,

    defaultLayout:
        "main",

    strict:
        NODE_ENV === "development",

    watch:
        NODE_ENV === "development",

    cache:
        NODE_ENV === "production",
});
```

Register it with Express:

``` js
app.engine(
    "xian",
    xian.engine,
);

app.set(
    "views",
    viewDirectories.pages,
);

app.set(
    "view engine",
    "xian",
);
```

Now:

``` js
res.render("home");
```

resolves to:

``` text
views/pages/home.xian
```

A nested page:

``` js
res.render("admin/users/index");
```

resolves to:

``` text
views/pages/admin/users/index.xian
```

Express resolves pages. Xian does not need to recursively scan the pages
directory.

------------------------------------------------------------------------

# 6. Why Initialization Must Be Asynchronous

Partials and helpers are loaded from the filesystem.

Therefore Xian must finish initialization before requests are accepted.

Recommended lifecycle:

``` text
start application
      ↓
create Xian
      ↓
create Handlebars instance
      ↓
register partials
      ↓
register helpers
      ↓
start watcher
      ↓
register Express engine
      ↓
listen()
```

Do not start the HTTP server before:

``` js
await createXianEngine(...)
```

has completed.

This prevents the first request from racing against partial/helper
initialization.

------------------------------------------------------------------------

# 7. Isolated Handlebars Instance

Xian uses:

``` js
const xian = hbs.create();

const handlebars = xian.handlebars;
```

rather than relying on a global registry.

This isolates:

-   partials
-   helpers
-   Handlebars configuration
-   template-engine state

The result is easier to test and avoids request-time mutation of global
state.

------------------------------------------------------------------------

# 8. Pages

Pages are complete view templates.

Example:

``` text
views/pages/home.xian
```

``` hbs
<section>

    <h1>
        Welcome to XianFire
    </h1>

    <p>
        This page is rendered using Xian.
    </p>

</section>
```

Route:

``` js
router.get("/", (req, res) => {
    res.render("home", {
        title: "Home",
    });
});
```

Nested pages use normal Express view resolution:

``` text
views/pages/
└── admin/
    └── users/
        ├── index.xian
        └── show.xian
```

``` js
res.render("admin/users/index");
```

------------------------------------------------------------------------

# 9. Partials

Partials are reusable Handlebars fragments.

Example:

``` text
views/partials/navbar.xian
```

``` hbs
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

Use:

``` hbs
{{> navbar}}
```

------------------------------------------------------------------------

# 10. Recursive Partials

Xian recursively scans the partial directory.

Given:

``` text
views/partials/
├── navbar.xian
├── components/
│   ├── button.xian
│   └── card.xian
└── admin/
    └── sidebar.xian
```

the registered names are:

``` text
navbar
components/button
components/card
admin/sidebar
```

Usage:

``` hbs
{{> navbar}}

{{> components/button}}

{{> components/card}}

{{> admin/sidebar}}
```

The partial name is derived from the file path relative to
`views/partials`.

------------------------------------------------------------------------

# 11. Partial Registration

Conceptually, Xian:

1.  Reads the partial directory.
2.  Detects directories.
3.  Recursively enters directories.
4.  Detects `.xian` files.
5.  Reads each file.
6.  Converts the relative path into a partial name.
7.  Registers it with Handlebars.

Example:

``` text
views/partials/components/card.xian
```

becomes:

``` text
components/card
```

and is registered using:

``` js
handlebars.registerPartial(
    "components/card",
    content,
);
```

------------------------------------------------------------------------

# 12. Components

Nested partials provide a simple component organization strategy.

Example:

``` text
views/partials/components/card.xian
```

``` hbs
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

Use:

``` hbs
{{> components/card
    title="Acer Nitro 5"
    description="Gaming laptop"
    price=49999
}}
```

------------------------------------------------------------------------

# 13. Layouts

Layouts provide the outer document structure.

Example:

``` text
views/layouts/main.xian
```

``` hbs
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

The page is rendered first and its HTML is passed as:

``` text
body
```

to the layout.

------------------------------------------------------------------------

# 14. Default Layout

Configure:

``` js
defaultLayout: "main"
```

Then:

``` js
res.render("home", {
    title: "Home",
});
```

automatically uses:

``` text
views/layouts/main.xian
```

Rendering:

``` text
home.xian
    ↓
page HTML
    ↓
main.xian
    ↓
{{{body}}}
    ↓
final HTML
```

------------------------------------------------------------------------

# 15. Disabling a Layout

Use:

``` js
res.render("admin/login", {
    title: "Login",
    layout: false,
});
```

This renders the page without the default layout.

Useful for:

-   login pages
-   special standalone pages
-   error pages
-   HTML fragments

------------------------------------------------------------------------

# 16. Selecting a Different Layout

Use:

``` js
res.render("admin/dashboard", {
    title: "Dashboard",
    layout: "admin",
});
```

Xian resolves:

``` text
views/layouts/admin.xian
```

This allows separate layouts for public, authentication, and
administrative areas.

------------------------------------------------------------------------

# 17. Layout Resolution

The layout resolver turns:

``` text
main
```

into:

``` text
views/layouts/main.xian
```

and verifies that the file exists.

A missing layout results in an error rather than silently rendering an
incomplete page.

------------------------------------------------------------------------

# 18. Helpers

Helpers are JavaScript functions exposed to templates.

Example:

``` text
views/helpers/uppercase.js
```

``` js
export default function uppercase(value) {
    return String(value ?? "").toUpperCase();
}
```

Template:

``` hbs
<h1>
    {{uppercase name}}
</h1>
```

------------------------------------------------------------------------

# 19. JSON Helper

``` js
export default function json(value) {
    return JSON.stringify(value);
}
```

Use:

``` hbs
<pre>
    {{json product}}
</pre>
```

This is especially useful while debugging template data.

------------------------------------------------------------------------

# 20. Currency Helper

``` js
export default function currency(value) {
    const amount = Number(value);

    if (!Number.isFinite(amount)) {
        return "";
    }

    return new Intl.NumberFormat(
        "en-PH",
        {
            style: "currency",
            currency: "PHP",
        },
    ).format(amount);
}
```

Use:

``` hbs
{{currency price}}
```

------------------------------------------------------------------------

# 21. Automatic Helper Registration

Xian scans:

``` text
views/helpers/
```

for:

``` text
.js
.mjs
```

files.

A default export is treated as the helper:

``` js
export default function currency(value) {
    // ...
}
```

The file name determines the helper name:

``` text
currency.js → currency
uppercase.js → uppercase
json.js → json
```

Therefore:

``` hbs
{{currency price}}
{{uppercase name}}
{{json product}}
```

------------------------------------------------------------------------

# 22. Helper Validation

A helper must export a function.

This is valid:

``` js
export default function helper(value) {
    return value;
}
```

This is invalid:

``` js
export default "hello";
```

Xian validates:

``` js
typeof helper === "function"
```

and throws a `TypeError` for invalid helper modules.

------------------------------------------------------------------------

# 23. Template Compilation

Xian reads a `.xian` file:

``` js
const source = await fs.readFile(
    filePath,
    "utf8",
);
```

and compiles it:

``` js
const template =
    handlebars.compile(
        source,
        {
            strict,
            noEscape: false,
        },
    );
```

The result is a rendering function.

``` text
.xian source
    ↓
Handlebars compiler
    ↓
compiled function
    ↓
HTML
```

------------------------------------------------------------------------

# 24. Template Cache

Xian uses:

``` js
const templateCache = new Map();
```

The conceptual mapping is:

``` text
template path
      ↓
compiled template function
```

Example:

``` text
views/pages/home.xian
      ↓
compiled Handlebars function
```

------------------------------------------------------------------------

# 25. Development Cache

Recommended:

``` js
cache: false
```

Rendering:

``` text
request
   ↓
read file
   ↓
compile
   ↓
render
```

This provides immediate template feedback.

The trade-off is more filesystem and compilation work.

------------------------------------------------------------------------

# 26. Production Cache

Recommended:

``` js
cache: true
```

First request:

``` text
request
   ↓
read
   ↓
compile
   ↓
cache
   ↓
render
```

Later requests:

``` text
request
   ↓
cache lookup
   ↓
compiled function
   ↓
render
```

This avoids repeatedly compiling unchanged templates.

------------------------------------------------------------------------

# 27. Cache Invalidation

Xian exposes:

``` js
invalidateTemplate(filePath);
```

which performs:

``` js
templateCache.delete(filePath);
```

The development watcher uses this when templates change.

Example:

``` text
home.xian changes
       ↓
watcher
       ↓
invalidateTemplate()
       ↓
next request
       ↓
read + compile new template
```

------------------------------------------------------------------------

# 28. Development Watcher

Xian uses Chokidar.

Install:

``` powershell
npm install chokidar
```

The watcher monitors:

``` text
partials/
layouts/
helpers/
```

with:

``` js
chokidar.watch(
    [
        partialsDirectory,
        layoutsDirectory,
        helpersDirectory,
    ],
    {
        ignoreInitial: true,
    },
);
```

The watcher is intended for development, not production.

------------------------------------------------------------------------

# 29. File Change Handling

When a `.xian` file changes:

``` text
file changed
    ↓
Chokidar
    ↓
if partial → re-register
    ↓
invalidate cache
```

When a partial is added:

``` text
new .xian file
    ↓
registerPartial()
```

When a partial is removed:

``` text
deleted .xian file
    ↓
unregisterPartial()
```

------------------------------------------------------------------------

# 30. Strict Mode

Development can enable:

``` js
strict: true
```

Example:

``` hbs
<h1>
    {{user.name}}
</h1>
```

Controller:

``` js
res.render("home", {
    user: {},
});
```

Strict mode can surface missing properties rather than silently
producing empty output.

Recommended development configuration:

``` js
strict: true
```

Production behavior can be configured separately.

------------------------------------------------------------------------

# 31. Structured Template Errors

Xian defines:

``` js
export class XianTemplateError extends Error
```

It can retain:

-   template path
-   original error
-   line
-   column

The normalized message follows the general form:

``` text
Failed to render Xian template
"views/pages/home.xian"
(line 12, column 8):
<original error message>
```

Location information is extracted from possible error properties such
as:

``` js
error.lineNumber
error.line
error.columnNumber
error.column
```

If location information is unavailable, Xian still reports the template
path and original error.

------------------------------------------------------------------------

# 32. Error Flow

Rendering failures are converted through:

``` js
createTemplateError(
    error,
    filePath,
);
```

and passed to Express:

``` js
callback(xianError);
```

This gives the application's error middleware a consistent Xian-specific
error type.

------------------------------------------------------------------------

# 33. HTML Escaping

Normal Handlebars interpolation:

``` hbs
{{value}}
```

is escaped.

Raw HTML interpolation:

``` hbs
{{{value}}}
```

is not escaped.

Xian explicitly uses:

``` js
noEscape: false
```

to retain normal escaping behavior.

Use triple braces carefully.

For untrusted user input, prefer:

``` hbs
{{userInput}}
```

rather than:

``` hbs
{{{userInput}}}
```

The layout's:

``` hbs
{{{body}}}
```

is intentional because `body` already contains rendered page HTML.

------------------------------------------------------------------------

# 34. Rendering Data

A route can pass ordinary JavaScript data:

``` js
res.render("products/index", {
    title: "Products",
    products,
});
```

Template:

``` hbs
<h1>
    {{title}}
</h1>

{{#each products}}
    <article>
        <h2>
            {{name}}
        </h2>
    </article>
{{/each}}
```

Xian does not require a special data-transfer object for view rendering.

------------------------------------------------------------------------

# 35. Flash Messages

Xian works with `res.locals`.

Example:

``` js
app.use((req, res, next) => {
    res.locals.success_msg =
        req.flash("success_msg");

    res.locals.error_msg =
        req.flash("error_msg");

    next();
});
```

Template:

``` hbs
{{#if success_msg}}
    <div class="alert success">
        {{success_msg}}
    </div>
{{/if}}

{{#if error_msg}}
    <div class="alert error">
        {{error_msg}}
    </div>
{{/if}}
```

------------------------------------------------------------------------

# 36. Complete Rendering Example

### Page

`views/pages/home.xian`

``` hbs
<section>

    <h1>
        Welcome to XianFire
    </h1>

    <p>
        This page is rendered using Xian.
    </p>

    {{> components/card
        title="Acer Nitro 5"
        description="Gaming laptop"
        price=49999
    }}

</section>
```

### Partial

`views/partials/components/card.xian`

``` hbs
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

### Layout

`views/layouts/main.xian`

``` hbs
<!DOCTYPE html>
<html lang="en">

<head>
    <title>{{title}}</title>
</head>

<body>

    {{> navbar}}

    <main>
        {{{body}}}
    </main>

</body>

</html>
```

### Route

``` js
router.get("/", (req, res) => {
    res.render("home", {
        title: "Home",
    });
});
```

Rendering flow:

``` text
GET /
 ↓
route
 ↓
res.render("home")
 ↓
home.xian
 ↓
components/card
 ↓
main.xian
 ↓
{{{body}}}
 ↓
HTML response
```

------------------------------------------------------------------------

# 37. Environment Configuration

Recommended development:

``` js
{
    environment: "development",
    strict: true,
    watch: true,
    cache: false,
}
```

Recommended production:

``` js
{
    environment: "production",
    strict: false,
    watch: false,
    cache: true,
}
```

The important distinction is:

  Feature                  Development    Production
  ---------------------- ------------- -------------
  Cache                    Usually off            On
  Watcher                           On           Off
  Strict mode                       On   Usually off
  Recompile on request        Possible       Avoided

------------------------------------------------------------------------

# 38. Xian Engine API

`createXianEngine()` returns an object containing:

``` js
{
    engine,
    hbs,
    handlebars,
    templateCache,
    invalidateTemplate,
    close,
}
```

### `engine`

Express-compatible view-engine function.

``` js
app.engine("xian", xian.engine);
```

### `hbs`

The isolated `hbs` instance.

### `handlebars`

The underlying Handlebars instance.

### `templateCache`

The compiled template `Map`.

### `invalidateTemplate`

Invalidates one cached template:

``` js
xian.invalidateTemplate(filePath);
```

### `close`

Closes the watcher:

``` js
await xian.close();
```

Useful for graceful shutdown and tests.

------------------------------------------------------------------------

# 39. Public API

The recommended public import is:

``` js
import {
    createXianEngine,
    XianTemplateError,
} from "./xian/index.js";
```

`index.js` acts as the public boundary of the subsystem.

Application code should normally use:

``` js
createXianEngine()
```

rather than importing internal implementation modules directly.

------------------------------------------------------------------------

# 40. Graceful Shutdown

Because development mode may create a Chokidar watcher, the watcher
should be closed during shutdown.

Example:

``` js
process.on("SIGTERM", async () => {
    await xian.close();

    server.close(() => {
        process.exit(0);
    });
});
```

This avoids leaving filesystem watchers active after the application
stops.

------------------------------------------------------------------------

# 41. Testing Strategy

Xian should be tested at several levels.

## Unit tests

Test:

-   recursive partial discovery
-   partial-name generation
-   partial registration
-   partial unregistration
-   layout resolution
-   missing-layout errors
-   helper discovery
-   invalid helper exports
-   template-error normalization

## Integration tests

Test:

``` text
Express
+
Xian
+
Handlebars
```

Example:

``` js
const response = await request(app)
    .get("/");

expect(response.status).toBe(200);

expect(response.text)
    .toContain("Welcome to XianFire");
```

## Rendering tests

Verify:

-   page rendering
-   nested pages
-   partials
-   layouts
-   layout disabling
-   alternate layouts
-   helpers
-   escaping
-   strict-mode failures

------------------------------------------------------------------------

# 42. Common Problems

## Partial not found

For:

``` text
views/partials/components/card.xian
```

use:

``` hbs
{{> components/card}}
```

not:

``` hbs
{{> card}}
```

unless `card` was registered under that exact name.

## Layout not found

For:

``` js
layout: "admin"
```

the file must be:

``` text
views/layouts/admin.xian
```

## Helper not found

For:

``` hbs
{{currency price}}
```

verify:

``` text
views/helpers/currency.js
```

exports a function.

## Changes are not visible

Development should normally use:

``` js
cache: false
watch: true
```

Also verify that the changed file is under a watched directory.

## Missing values

Enable:

``` js
strict: true
```

during development to catch missing properties earlier.

------------------------------------------------------------------------

# 43. Why the Architecture Is Modular

Each concern has its own module:

``` text
engine.js
    ↓
orchestration

partials.js
    ↓
partial discovery + registry

layouts.js
    ↓
layout resolution

helpers.js
    ↓
helper discovery + registry

errors.js
    ↓
error normalization

watcher.js
    ↓
development filesystem events

index.js
    ↓
public API
```

This avoids putting all template-engine behavior into `app.js`.

It also makes individual parts easier to test and replace.

------------------------------------------------------------------------

# 44. Important Design Decisions

## Isolated state

Use:

``` js
hbs.create()
```

instead of mutating a global Handlebars instance.

## Startup registration

Register partials and helpers before the server accepts requests.

## Request-time rendering

Pages are compiled/rendered when Express calls the Xian engine.

## Environment-aware caching

Development prioritizes feedback; production prioritizes runtime
efficiency.

## Explicit layouts

Layouts are resolved by Xian instead of making controllers manually
assemble HTML.

## Automatic helpers

Helper files become template helpers based on their filenames.

## Development watcher

Filesystem changes are handled automatically during development.

## Structured errors

Rendering errors retain template context.

------------------------------------------------------------------------

# 45. Current Feature Matrix

  Feature                         Status
  ------------------------------- -------------
  `.xian` Express engine          Implemented
  Isolated Handlebars instance    Implemented
  Recursive partials              Implemented
  Nested partial namespaces       Implemented
  Startup synchronization         Implemented
  Compiled-template cache         Implemented
  Default layout                  Implemented
  Per-render layout selection     Implemented
  Layout disabling                Implemented
  Automatic helper registration   Implemented
  Structured template errors      Implemented
  Development watcher             Implemented
  Strict development mode         Implemented

------------------------------------------------------------------------

# 46. Future Extensions

The current architecture can be extended with:

### Template precompilation

``` text
.xian
 ↓
build step
 ↓
compiled templates
 ↓
production
```

### Layout inheritance

Possible hierarchy:

``` text
main
  ↓
admin
  ↓
dashboard
```

### Component abstraction

A higher-level component syntax could eventually be built on top of
partials.

### Dependency-aware cache invalidation

A dependency graph could track:

``` text
home.xian
 ├── navbar.xian
 └── components/card.xian
```

Then changing `card.xian` could invalidate pages that depend on it.

### Template metadata

Templates could expose metadata such as:

-   source path
-   layout
-   dependencies
-   template name

This could improve diagnostics and development tooling.

------------------------------------------------------------------------

# 47. Performance Model

Development:

``` text
Request
  ↓
Filesystem read
  ↓
Compile
  ↓
Render
```

Production after first render:

``` text
Request
  ↓
Cache lookup
  ↓
Compiled template
  ↓
Render
```

Partials and helpers are initialized at startup rather than discovered
for every request.

This separates initialization work from request-time rendering work.

------------------------------------------------------------------------

# 48. Security Model

Recommended rules:

1.  Keep normal Handlebars escaping enabled.
2.  Use `{{value}}` for untrusted text.
3.  Use `{{{value}}}` only for intentionally trusted HTML.
4.  Do not pass raw user input into trusted HTML output without
    appropriate sanitization.
5.  Do not expose server-only secrets through render contexts.
6.  Keep helper functions deterministic and narrowly scoped.
7.  Avoid helpers that execute arbitrary code or shell commands from
    template input.

The template engine should be treated as part of the application's
presentation layer, not as a security boundary.

------------------------------------------------------------------------

# 49. Recommended Development Defaults

``` js
const xian = await createXianEngine({
    partialsDirectory:
        viewDirectories.partials,

    layoutsDirectory:
        viewDirectories.layouts,

    helpersDirectory:
        viewDirectories.helpers,

    environment:
        "development",

    defaultLayout:
        "main",

    strict:
        true,

    watch:
        true,

    cache:
        false,
});
```

------------------------------------------------------------------------

# 50. Recommended Production Defaults

``` js
const xian = await createXianEngine({
    partialsDirectory:
        viewDirectories.partials,

    layoutsDirectory:
        viewDirectories.layouts,

    helpersDirectory:
        viewDirectories.helpers,

    environment:
        "production",

    defaultLayout:
        "main",

    strict:
        false,

    watch:
        false,

    cache:
        true,
});
```

------------------------------------------------------------------------

# 51. Nine Core Implementation Priorities

The Xian architecture was implemented around nine priorities:

  ------------------------------------------------------------------------
                      Priority Feature               Purpose
  ---------------------------- --------------------- ---------------------
                             1 Isolated Handlebars   Prevent global
                               instance              mutable template
                                                     state

                             2 Recursive partial     Support organized
                               loader                nested partials

                             3 Startup               Prevent
                               synchronization       initialization races

                             4 Template caching      Improve production
                                                     rendering efficiency

                             5 Layout system         Separate page content
                                                     from document
                                                     structure

                             6 Helper                Keep helpers modular
                               auto-registration     and discoverable

                             7 Better template       Improve debugging
                               errors                

                             8 Development watcher   Automatically detect
                                                     template changes

                             9 Strict development    Catch missing
                               mode                  template data earlier
  ------------------------------------------------------------------------

------------------------------------------------------------------------

# 52. Complete Conceptual Rendering Pipeline

``` text
                     APPLICATION START
                            │
                            ▼
                  createXianEngine()
                            │
             ┌──────────────┼──────────────┐
             ▼              ▼              ▼
        Partials         Helpers       Watcher
        registry         registry      (dev only)
             │              │              │
             └──────────────┼──────────────┘
                            ▼
                    Express engine
                            │
                     HTTP request
                            │
                            ▼
                    res.render("...")
                            │
                            ▼
                    Resolve page path
                            │
                            ▼
                    Template cache?
                       /         \
                     hit         miss
                      │            │
                      │       read + compile
                      │            │
                      │       store cache
                      └──────┬─────┘
                             ▼
                       Render page
                             │
                             ▼
                       Resolve layout
                             │
                             ▼
                       Render layout
                             │
                             ▼
                    insert {{{body}}}
                             │
                             ▼
                         HTML response
```

------------------------------------------------------------------------

# 53. Final Summary

Xian is a modular Express.js template-engine layer built around
Handlebars.

Its core responsibilities are:

``` text
Express integration
        +
template compilation
        +
partial registration
        +
layout rendering
        +
helper registration
        +
template caching
        +
development watching
        +
strict validation
        +
structured errors
```

The most important architectural separation is:

``` text
Express
  → pages/routes

Xian
  → rendering infrastructure

Handlebars
  → template language
```

This lets controllers remain simple:

``` js
router.get("/", (req, res) => {
    res.render("home", {
        title: "Home",
    });
});
```

while Xian handles the infrastructure required to make `.xian` templates
maintainable as the application grows.

The result is a small, modular server-side rendering subsystem that can
evolve independently from the rest of the Express application.
