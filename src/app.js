import express from "express";
import path from "node:path";
import session from "express-session";
import flash from "connect-flash";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

import { createXianEngine } from "./xian/index.js";
import { registerRoutes } from "../routes/routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

const NODE_ENV = process.env.NODE_ENV ?? "development";

const viewDirectories = {
  pages: path.join(__dirname, "../views/pages"),
  partials: path.join(__dirname, "../views/partials"),
  layouts: path.join(__dirname, "../views/layouts"),
  helpers: path.join(__dirname, "../views/helpers"),
};

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  }),
);

app.use(express.static(path.join(process.cwd(), "public")));

app.use(
  session({
    secret: process.env.SECRET_KEY ?? "development-secret",
    resave: false,
    saveUninitialized: false,
  }),
);

app.use(flash());

app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");

  next();
});

registerRoutes(app);

export async function bootstrap() {
  const xian = await createXianEngine({
    partialsDirectory: viewDirectories.partials,
    layoutsDirectory: viewDirectories.layouts,
    helpersDirectory: viewDirectories.helpers,

    environment: NODE_ENV,

    defaultLayout: "main",

    strict: NODE_ENV === "development",

    watch: NODE_ENV === "development",

    cache: NODE_ENV === "production",
  });

  app.engine("xian", xian.engine);
  app.set("views", viewDirectories.pages);
  app.set("view engine", "xian");
}

export default app;
