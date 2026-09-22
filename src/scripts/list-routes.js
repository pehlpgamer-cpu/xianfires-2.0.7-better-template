import { styleText } from "node:util";

import app from "../app.js";
import { routeGroups } from "../../routes/index.js";

const routes = [];

const routerPrefixes = new Map(
  routeGroups.map(({ router, prefix }) => [
    router,
    prefix,
  ]),
);

function walk(stack, prefix = "") {
  for (const layer of stack ?? []) {
    if (layer.route) {
      const methods = Object.keys(layer.route.methods)
        .filter(
          (method) => layer.route.methods[method],
        )
        .map((method) => method.toUpperCase());

      const handler = layer.route.stack
        .map(
          (entry) =>
            entry.handle?.name ?? "anonymous",
        )
        .join(" → ");

      const routePath =
        typeof layer.route.path === "string"
          ? layer.route.path
          : String(layer.route.path);

      routes.push({
        methods,
        path: joinPaths(prefix, routePath),
        handler,
      });

      continue;
    }

    if (layer.handle?.stack) {
      const nestedPrefix =
        routerPrefixes.get(layer.handle);

      walk(
        layer.handle.stack,
        nestedPrefix !== undefined
          ? joinPaths(prefix, nestedPrefix)
          : prefix,
      );
    }
  }
}

function joinPaths(...parts) {
  const result = parts
    .filter(Boolean)
    .join("/")
    .replace(/\/+/g, "/");

  if (!result || result === "/") {
    return "/";
  }

  return result.startsWith("/")
    ? result
    : `/${result}`;
}

const applicationRouter = app._router;

if (!applicationRouter?.stack) {
  console.error(
    "❌ Unable to inspect Express router stack.",
  );

  process.exitCode = 1;
} else {
  walk(applicationRouter.stack);

  console.log("");

  console.log(
    styleText(
      ["bold", "underline"],
      "🔥 XianFire — Registered Routes",
    ),
  );

  console.log("");

  if (routes.length === 0) {
    console.log("⚠️ No routes found");
  } else {
    const methodWidth = Math.max(
      6,
      ...routes.flatMap((route) =>
        route.methods.map(
          (method) => method.length,
        ),
      ),
    );

    const pathWidth = Math.max(
      4,
      ...routes.map(
        (route) => route.path.length,
      ),
    );

    for (const [index, route] of routes.entries()) {
      const number = String(index + 1).padStart(3);
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

      console.log(
        `${number}  ${methods}  ${path}  ${route.handler}`,
      );
    }
  }

  console.log(
    `\nTotal: ${routes.length} route(s) registered\n`,
  );
}