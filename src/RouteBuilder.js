//! WIP...
// Similar to laravel
export class RouteBuilder {
    #router;

    constructor(router) {
        this.#router = router;
    }

    resource( uri, controllerObject, handlers = { include: [], exclude: []}) {
        const routes = {
            index: {
                method: "get",
                uri,
            },

            show: {
                method: "get",
                uri: `${uri}/:id`,
            },

            store: {
                method: "post",
                uri,
            },

            update: {
                method: "patch",
                uri: `${uri}/:id`,
            },

            replace: {
                method: "put",
                uri: `${uri}/:id`,
            },

            destroy: {
                method: "delete",
                uri: `${uri}/:id`,
            },

            create: {
                method: "get",
                uri,
            },

            edit: {
                method: "get",
                uri: `${uri}/:id`,
            },
        };

        const validHandlers = new Set(Object.keys(routes));

        const include = new Set(handlers.include);
        const exclude = new Set(handlers.exclude);


        for (const handler of include) {
        if (!validHandlers.has(handler)) {
            throw new Error(`${handler} is invalid RouteBuilder resource method parameter`);
        }
        }


        for (const handler of exclude) {
        if (!validHandlers.has(handler)) {
            throw new Error(`${handler} is invalid RouteBuilder resource method parameter`);
        }
        }

    
        const selectedHandlers = include.size > 0 ? new Set(include) : new Set(validHandlers);

        // Remove excluded handlers
        for (const handler of exclude) {
        selectedHandlers.delete(handler);
        }

        for (const handler of selectedHandlers) {
        const route = routes[handler];
        const controllerHandler = controllerObject[handler];

        if (typeof controllerHandler !== "function") {
            throw new TypeError(`Controller method "${handler}" is required for resource "${uri}"`);
        }

        this.#router[route.method](route.uri, controllerHandler);
        }
    }

    apiResource( uri, controllerObject, handlers = { include: [], exclude: []}) 
    {
        const routes = {
            index: {
                method: "get",
                uri,
            },

            show: {
                method: "get",
                uri: `${uri}/:id`,
            },

            store: {
                method: "post",
                uri,
            },

            update: {
                method: "patch",
                uri: `${uri}/:id`,
            },

            replace: {
                method: "put",
                uri: `${uri}/:id`,
            },

            destroy: {
                method: "delete",
                uri: `${uri}/:id`,
            },
        };

        const validHandlers = new Set(Object.keys(routes));

        const include = new Set(handlers.include);
        const exclude = new Set(handlers.exclude);


        for (const handler of include) {
            if (!validHandlers.has(handler)) {
                throw new Error(
                    `${handler} is invalid RouteBuilder apiResource method parameter`,
                );
            }
        }

        for (const handler of exclude) {
            if (!validHandlers.has(handler)) {
                throw new Error(
                    `${handler} is invalid RouteBuilder apiResource method parameter`,
                );
            }
        }

        
        const selectedHandlers =
            include.size > 0
                ? new Set(include)
                : new Set(validHandlers);

        
        for (const handler of exclude) {
            selectedHandlers.delete(handler);
        }

        // Register selected routes.
        for (const handler of selectedHandlers) {
            const route = routes[handler];
            const controllerHandler = controllerObject[handler];

            if (typeof controllerHandler !== "function") {
                throw new TypeError(
                    `Controller method "${handler}" is required for apiResource "${uri}"`,
                );
            }

            this.#router[route.method](
                route.uri,
                controllerHandler,
            );
        }
    }
}
