import { styleText } from "node:util";

import app from "../app.js";
import { routeGroups } from "../../config/routes.js";

const routes = [];

const routerGroups = new Map(
  routeGroups.map(({ router, prefix = "", name, group }) => [
    router,
    {
      name: group ?? name ?? (prefix || "default"),
      prefix,
    },
  ]),
);

function joinPaths(...parts) {
  const result = parts.filter(Boolean).join("/").replace(/\/+/g, "/");

  if (!result || result === "/") {
    return "/";
  }

  return result.startsWith("/") ? result : `/${result}`;
}

function walk(stack, prefix = "", groupName = "default") {
  for (const layer of stack ?? []) {
    if (layer.route) {
      const methods = Object.keys(layer.route.methods)
        .filter((method) => layer.route.methods[method])
        .map((method) => method.toUpperCase());

      const handler =
        layer.route.stack?.map((entry) => entry.handle?.name ?? "anonymous").join(" → ") ??
        "anonymous";

      const routePath =
        typeof layer.route.path === "string" ? layer.route.path : String(layer.route.path);

      routes.push({
        group: groupName,
        methods,
        path: joinPaths(prefix, routePath),
        handler,
      });

      continue;
    }

    if (layer.handle?.stack) {
      const nestedGroup = routerGroups.get(layer.handle);

      walk(
        layer.handle.stack,
        nestedGroup ? joinPaths(prefix, nestedGroup.prefix) : prefix,
        nestedGroup?.name ?? groupName,
      );
    }
  }
}

function parseArguments(argv) {
  const groups = [];
  let help = false;

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];

    if (argument === "--help" || argument === "-h") {
      help = true;
      continue;
    }

    if (argument === "--group") {
      const value = argv[index + 1];

      if (!value || value.startsWith("--")) {
        throw new Error("Missing value for --group. Example: --group=api-v1");
      }

      groups.push(...value.split(","));
      index += 1;
      continue;
    }

    if (argument.startsWith("--group=")) {
      const value = argument.slice("--group=".length);

      if (!value) {
        throw new Error("Missing value for --group. Example: --group=api-v1");
      }

      groups.push(...value.split(","));
      continue;
    }

    throw new Error(`Unknown argument: ${argument}`);
  }

  return {
    help,
    groups: groups.map((group) => group.trim()).filter(Boolean),
  };
}

function showHelp() {
  console.log(`
Usage:
  npm run route:list
  npm run route:list -- --group=api-v1
  npm run route:list -- --group api-v1
  npm run route:list -- --group=web,api-v1

Options:
  --group=<name>    Show only routes belonging to the specified group.
  --group <name>    Same as above.
  -h, --help        Show this help message.
`);
}

function getMethodStyle(method) {
  switch (method) {
    case "GET":
      return "green";

    case "POST":
      return "yellow";

    case "PUT":
    case "PATCH":
      return "blue";

    case "DELETE":
      return "red";

    default:
      return "white";
  }
}

function getGroupStyle(group) {
  const styles = ["cyan", "blue", "magenta", "green", "yellow"];

  let hash = 0;

  for (const character of group) {
    hash += character.charCodeAt(0);
  }

  return styles[hash % styles.length];
}

try {
  const { help, groups: groupFilters } = parseArguments(process.argv.slice(2));

  if (help) {
    showHelp();
    process.exit(0);
  }

  const applicationRouter = app._router;

  if (!applicationRouter?.stack) {
    console.error("❌ Unable to inspect Express router stack.");

    process.exitCode = 1;
  } else {
    walk(applicationRouter.stack);

    const filteredRoutes =
      groupFilters.length === 0
        ? routes
        : routes.filter((route) =>
            groupFilters.some((group) => route.group.toLowerCase() === group.toLowerCase()),
          );

    const availableGroups = [...new Set(routes.map((route) => route.group))];

    const missingGroups = groupFilters.filter(
      (group) =>
        !availableGroups.some(
          (availableGroup) => availableGroup.toLowerCase() === group.toLowerCase(),
        ),
    );

    if (missingGroups.length > 0) {
      console.error(`❌ Unknown route group(s): ${missingGroups.join(", ")}`);

      console.error(`Available groups: ${availableGroups.join(", ") || "none"}`);

      process.exitCode = 1;
    } else {
      console.log("");

      console.log(styleText(["bold", "underline"], "🔥 XianFire — Registered Routes"));

      if (groupFilters.length > 0) {
        console.log(styleText("dim", `Filtered groups: ${groupFilters.join(", ")}`));
      }

      console.log("");

      if (filteredRoutes.length === 0) {
        console.log("⚠️ No routes found");
      } else {
        const methodWidth = Math.max(
          6,
          ...filteredRoutes.flatMap((route) => route.methods.map((method) => method.length)),
        );

        const pathWidth = Math.max(4, ...filteredRoutes.map((route) => route.path.length));

        const handlerWidth = Math.max(7, ...filteredRoutes.map((route) => route.handler.length));

        let currentGroup = null;

        for (const [index, route] of filteredRoutes.entries()) {
          if (route.group !== currentGroup) {
            currentGroup = route.group;

            console.log(
              `\n${styleText(
                ["bold", "underline", getGroupStyle(route.group)],
                `[ ${route.group} ]`,
              )}`,
            );
          }

          const number = String(index + 1).padStart(3);

          const methodText = route.methods.map((method) => method.padEnd(methodWidth)).join(", ");

          const pathText = route.path.padEnd(pathWidth);

          const handlerText = route.handler.padEnd(handlerWidth);

          const line = `${number}  ` + `${methodText}  ` + `${pathText}  ` + `${handlerText}`;

          const routeStyle = getMethodStyle(route.methods[0] ?? "UNKNOWN");

          console.log(styleText(routeStyle, line));
        }
      }

      console.log(`\nTotal: ${filteredRoutes.length} route(s) registered\n`);
    }
  }
} catch (error) {
  console.error(`❌ ${error instanceof Error ? error.message : String(error)}`);

  process.exitCode = 1;
}
