import webRouter from "./web.js";
import apiV1Router from "./api_v1.js";

export const routeGroups = Object.freeze([
  {
    name: "web",
    prefix: "/",
    router: webRouter,
  },
  {
    name: "api-v1",
    prefix: "/api/v1",
    router: apiV1Router,
  },
]);

export function registerRoutes(app) {
  for (const routeGroup of routeGroups) {
    app.use(routeGroup.prefix, routeGroup.router);
  }
}