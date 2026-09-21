import express from "express";
import path from "node:path";
import fs from "node:fs/promises";
import session from "express-session";
import flash from "connect-flash";
import hbs from "hbs";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const PORT = process.env.PORT || 3000;

const viewDir = {
    pages: path.join(__dirname, "views", "pages"),
    partials: path.join(__dirname, "views", "partials"),
};

async function registerPartials(
    directory,
    baseDirectory = directory,
) {
    const entries = await fs.readdir(directory, {
        withFileTypes: true,
    });

    await Promise.all(
        entries.map(async (entry) => {
            const fullPath = path.join(directory, entry.name);

            if (entry.isDirectory()) {
                await registerPartials(fullPath, baseDirectory);
                return;
            }

            if (!entry.isFile() || !entry.name.endsWith(".xian")) {
                return;
            }

            const partialName = path
                .relative(baseDirectory, fullPath)
                .replace(/\.xian$/, "")
                .split(path.sep)
                .join("/");

            const content = await fs.readFile(fullPath, "utf8");

            hbs.registerPartial(partialName, content);

            console.log(`Registered partial: ${partialName}`);
        }),
    );
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");

    next();
});

app.engine("xian", hbs.__express);

app.set("views", viewDir.pages);
app.set("view engine", "xian");

// ROUTES
import web_router from "./routes/web.js";
import api_v1_router from "./routes/api_v1.js";

app.use("/", web_router);
app.use("/api/v1", api_v1_router);

async function bootstrap() {
    await registerPartials(viewDir.partials);

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