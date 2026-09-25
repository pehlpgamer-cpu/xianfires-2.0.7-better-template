import fs from "node:fs/promises";
import hbs from "hbs";
import { registerPartials } from "./partials.js";
import { registerHelpers } from "./helpers.js";
import { resolveLayout } from "./layouts.js";
import { createTemplateError } from "./errors.js";
import { watchXianFiles } from "./watcher.js";

// (FOR .src/xian/index.js)
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
  
  const xian = hbs.create(); // isolated HBS instance: We DO NOT use the global `hbs` instance for application registrations.  
  const handlebars = xian.handlebars; // The actual Handlebars implementation behind this HBS instance.

  // Application-level compiled template cache.
  // Map: absolute file path -> compiled Handlebars function
  const templateCache = new Map();

  async function compileTemplate(filePath) {
    // Production: If already compiled, reuse it.
    if (cache && templateCache.has(filePath)) {
      return templateCache.get(filePath);
    }

    const source = await fs.readFile(filePath, "utf8");

    let template;

    try {
      template = handlebars.compile(source, {
        strict, // Development strict mode detects missing properties instead of silently returning undefined. 
        noEscape: false, //Keep HTML escaping enabled.
      });
    } catch (error) {
      throw createTemplateError(error, filePath);
    }

    
    //Cache only when enabled.
    
    if (cache) {
      templateCache.set(filePath, template);
    }

    return template;
  }

   // Render a layout around page content.
  async function renderLayout({ layoutName, body, options }) {
    const layoutPath = await resolveLayout(layoutsDirectory, layoutName);

    const layout = await compileTemplate(layoutPath);

    // Put the rendered page inside `body`.
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

   // Express view-engine interface.
  async function render(filePath, options, callback) {
    try {
      
      const template = await compileTemplate(filePath); //Compile page.
      // Express puts request locals inside options._locals.
      // We don't want to expose Express internals directly as template data.
      const templateData = {
        ...options,
        ...options?._locals,
      };

      const pageHtml = template(templateData); // Render page first.
      const requestedLayout = options?.layout === false ? null : (options?.layout ?? defaultLayout); // Layout selection.

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
    } 
    catch (error) {
      const xianError = createTemplateError(error, filePath);

      callback(xianError);
    }
  }

  // Invalidate cached templates when files change.
  function invalidateTemplate(filePath) {
    templateCache.delete(filePath);
  }

  // Register partials BEFORE the application starts. This is why createXianEngine() is async.
  await registerPartials(handlebars, partialsDirectory);

  // Register helpers BEFORE the application starts.
  await registerHelpers(handlebars, helpersDirectory);

  // Start development watcher.
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

  return {
    engine: render, // Express-compatible engine: app.engine("xian", engine.engine)
    hbs: xian, // Raw HBS instance: Useful if you need to manually register something.
    handlebars, // Underlying Handlebars instance.
    templateCache,
    invalidateTemplate, // Manually invalidate one template.
    // Stop watcher.
    async close() {
      if (watcher) {
        await watcher.close();
      }
    },
  };
}
