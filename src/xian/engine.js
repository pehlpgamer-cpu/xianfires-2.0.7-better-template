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
        ...options?._locals,
      };

      /*
       * Render page first.
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
