import app, { bootstrap } from "./app.js";

const PORT = process.env.PORT ?? 3000;
const NODE_ENV = process.env.NODE_ENV ?? "development";

async function startServer() {
  await bootstrap();

  app.listen(PORT, () => {
    console.log(`🔥 XianFire running at http://localhost:${PORT}`);

    console.log(`🔥 Xian environment: ${NODE_ENV}`);
  });
}

startServer().catch((error) => {
  console.error("❌ Failed to start XianFire:", error);

  process.exitCode = 1;
});
