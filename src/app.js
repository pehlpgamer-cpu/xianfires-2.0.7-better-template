import express from "express";
import path from "node:path";
import session from "express-session";
import flash from "connect-flash";

import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

import { createXianEngine } from "./xian/index.js";

import webRouter from "../routes/web.js";
import apiV1Router from "../routes/api_v1.js";

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
