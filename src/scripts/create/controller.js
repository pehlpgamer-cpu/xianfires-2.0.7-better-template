import path from "path";
import fs from "fs/promises";
import { toCamelCase, toPascalCase, ensureDir } from "../utils.js";

// Generate Express Controller (named exports)
export const createController = async (controllerName) => {
  const controllerDir = path.join(process.cwd(), "app/http/controllers");
  await ensureDir(controllerDir);

  const camelName = toCamelCase(controllerName); // e.g., userController
  const pascalModelName = toPascalCase(camelName.replace(/controller$/, "")); // e.g., User
  const controllerPath = path.join(controllerDir, `${controllerName}.js`);

  // TODO - fix generated model import name
  const controllerContent = `
//import { ${pascalModelName}, sequelize } from "../../models/${pascalModelName}.js"; 

export default {
  show: async (req, res) => 
  {
    //
  },
  index: async (req, res) => 
  {
    //
  },
  store: async (req, res) => 
  {
    //
  },
  update: async (req, res) => 
  {
    //
  },
  replace: async (req, res) => 
  {
    //
  },
  destroy: async (req, res) => 
  {
    //
  },
  create: async (req, res) => 
  {
    //page
  },
  edit: async (req, res) => 
  {
    //page
  },
};

`.trim();

  await fs.writeFile(controllerPath, controllerContent);
  console.log(`✅ Express Controller created: ${controllerPath}`);
};
