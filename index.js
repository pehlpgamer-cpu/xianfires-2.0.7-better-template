import express from "express";
import path from "node:path";
import session from "express-session";
import flash from "connect-flash";
import { fileURLToPath } from "node:url";

import { createXianEngine } from "./xian/engine.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const PORT = process.env.PORT || 3000;

const viewDir = {
    pages: path.join(__dirname, "views", "pages"),
    partials: path.join(__dirname, "views", "partials"),
};

app.use(express.json());

app.use(
    express.urlencoded({
        extended: true,
    }),
);

app.use(
    express.static(
        path.join(process.cwd(), "public"),
    ),
);

app.use(
    session({
        secret: process.env.SECRET_KEY,
        resave: false,
        saveUninitialized: false,
    }),
);

app.use(flash());

app.use((req, res, next) => {
    res.locals.success_msg = req.flash(
        "success_msg",
    );

    res.locals.error_msg = req.flash(
        "error_msg",
    );

    next();
});

app.set("views", viewDir.pages);
app.set("view engine", "xian");

// Routes
import web_router from "./routes/web.js";
import api_v1_router from "./routes/api_v1.js";

app.use("/", web_router);
app.use("/api/v1", api_v1_router);

/**
 * Start the application.
 *
 * Xian must be initialized before Express starts
 * accepting HTTP requests because the partials are
 * loaded asynchronously.
 */
async function bootstrap() {
    // Create our isolated Xian/Handlebars instance.
    const xian = await createXianEngine({
        partialsDirectory: viewDir.partials,
    });

    /*
     * Register Xian as Express' `.xian` view engine.
     *
     * No Promise wrapper is necessary because hbs already
     * provides an Express-compatible `__express` function.
     */
    app.engine("xian", xian.__express);

    if (!process.env.ELECTRON) {
        app.listen(PORT, () => {
            console.log(
                `🔥 XianFire running at http://localhost:${PORT}`,
            );
        });
    }
}

await bootstrap();

export default app;