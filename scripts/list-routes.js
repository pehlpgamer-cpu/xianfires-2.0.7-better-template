/**
 * MIT License
 *
 * Copyright (c) 2025 Christian I. Cabrera || XianFire Framework
 * Mindoro State University - Philippines
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

/**
 * XianFire — Route List Utility
 *
 * Usage:
 *   xian route:list
 *
 * Prints all registered Express routes in a formatted table.
 */

import express from "express";
import { styleText } from "node:util";

const app = express();

const router = (await import("../routes/web.js")).default;

app.use("/", router);

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

// Express 4: app._router
const applicationRouter = app._router;

if (!applicationRouter?.stack) {
    console.error("❌ Unable to inspect Express router stack.");
    process.exit(1);
}

walk(applicationRouter.stack);

console.log("\n");
console.log(`║ ${styleText(['bold', 'underline', 'bgBlack'],'🔥 XianFire — Registered Routes')}`);

if (routes.length === 0) {
    console.log("║ ⚠️ No routes found");
} else {
    const methodWidth = Math.max(
        ...routes.flatMap((route) => route.methods.map((method) => method.length)),
        6,
    );

    const pathWidth = Math.max(
        ...routes.map((route) => route.path.length),
        4,
    );
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

        console.log(
            `║ ${line}  ${methods}  ${path}  ${route.handler}`,
        );
    }
}

console.log(`\n   Total: ${routes.length} route(s) registered\n`);

process.exit(0);