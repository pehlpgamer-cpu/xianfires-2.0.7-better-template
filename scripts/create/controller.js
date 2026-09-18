import path from "path";
import fs from "fs/promises";
import { toCamelCase, toPascalCase, ensureDir } from "../utils.js";


// Generate Express Controller (named exports)
export const createController = async (controllerName) => {
  const controllerDir = path.join(process.cwd(), "controllers");
  await ensureDir(controllerDir);

  const camelName = toCamelCase(controllerName); // e.g., userController
  const pascalModelName = toPascalCase(camelName.replace(/controller$/, "")); // e.g., User
  const controllerPath = path.join(controllerDir, `${camelName}.js`);

  const controllerContent = `
import { ${pascalModelName}, sequelize } from "../models/${pascalModelName}.js";
await sequelize.sync();
const ${camelName} ={
  index: async (req, res) => {
    res.send("Index Page");
  },
};
export { ${camelName} };
`.trim();

  await fs.writeFile(controllerPath, controllerContent);
  console.log(`✅ Express Controller created: ${controllerPath}`);
};
