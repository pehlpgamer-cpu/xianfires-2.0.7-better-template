import { configure, processCLIArgs, run } from "@japa/runner";
import { expect } from "@japa/expect";
import { apiClient } from "@japa/api-client";

import { expectTypeOf } from "@japa/expect-type";
import { snapshot } from "@japa/snapshot";
import { browserClient } from "@japa/browser-client";

processCLIArgs(process.argv.splice(2));
configure({
  suites: [
    {
      name: "browser",
      timeout: 30 * 1000,
      files: ["tests/browser/**/*.spec.js"],
    },
    {
      name: "feature",
      files: ["tests/feature/**/*.spec.js"],
    },
    {
      name: "unit",
      files: ["tests/unit/**/*.spec.js"],
    },
  ],
  plugins: [
    expect(),
    apiClient("http://localhost:3000"),
    expectTypeOf(),
    snapshot(),
    browserClient({ runInSuites: ["browser"] }),
  ],
});

run();
