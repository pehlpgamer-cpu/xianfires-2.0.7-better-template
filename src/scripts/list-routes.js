// ./src/scripts/list-routes.js
import express from "express";
import { styleText } from "node:util";

const app = express();

//! Same logic in `./src/app.js` on line 11-12 and 109-111
//TODO - reduce duplicate code
const web_router = (await import("../../routes/web.js")).default;
const api_v1_router = (await import("../../routes/api_v1.js")).default;
app.use("/", web_router);
app.use("/api/v1", api_v1_router);
//! -----------------------------------------------------------------------------------


const routes = [];

function walk(stack, prefix = "") {
  for (const layer of stack ?? []) {
    // Regular route
    if (layer.route) {
      const methods = Object.keys(layer.route.methods)
        .filter((method) => layer.route.methods[method])
        .map((method) => method.toUpperCase());

      const handler = layer.route.stack
        .map((entry) => entry.handle?.name || "anonymous")
        .join(" → ");

      routes.push({
        methods,
        path: prefix + layer.route.path,
        handler,
      });

      continue;
    }

    // Nested router
    if (layer.handle?.stack) {
      walk(layer.handle.stack, prefix);
    }
  }
}

const applicationRouter = app._router;

if (!applicationRouter?.stack) {
  console.error("❌ Unable to inspect Express router stack.");
  process.exit(1);
}

walk(applicationRouter.stack);

console.log("\n");
console.log(`║ ${styleText(["bold", "underline", "bgBlack"], "🔥 XianFire — Registered Routes")}`);

if (routes.length === 0) {
  console.log("║ ⚠️ No routes found");
} else {
  const methodWidth = Math.max(
    ...routes.flatMap((route) => route.methods.map((method) => method.length)),
    6,
  );

  const pathWidth = Math.max(...routes.map((route) => route.path.length), 4);
  for (const [index, route] of routes.entries()) {
    const line = String(index + 1).padStart(3);
    const path = route.path.padEnd(pathWidth);

    const methods = route.methods
      .map((method) => {
        const padded = method.padEnd(methodWidth);

        switch (method) {
          case "GET":
            return styleText("green", padded);

          case "POST":
            return styleText("yellow", padded);

          case "PUT":
          case "PATCH":
            return styleText("blue", padded);

          case "DELETE":
            return styleText("red", padded);

          default:
            return padded;
        }
      })
      .join(", ");

    console.log(`║ ${line}  ${methods}  ${path}  ${route.handler}`);
  }
}

console.log(`\n   Total: ${routes.length} route(s) registered\n`);

process.exit(0);
