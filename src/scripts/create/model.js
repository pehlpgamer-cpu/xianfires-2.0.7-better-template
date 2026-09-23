import path from "path";
import fs from "fs/promises";
import { toPascalCase, ensureDir } from "../utils.js";

// Generate Model (Sequelize for MySQL, Mongoose for MongoDB, Firestore helpers for Firebase)
export const createModel = async (modelName) => {
  const modelDir = path.join(process.cwd(), "app/models");
  await ensureDir(modelDir);

  const pascalName = toPascalCase(modelName);
  const modelPath = path.join(modelDir, `${pascalName}.js`);

  let modelContent = `
import { DataTypes } from "sequelize";
import { sequelize } from "../../database/database.js";

export default sequelize.define(
  "${pascalName}",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  },
  {
    paranoid: true,
  },
); 
  `.trim();

  await fs.writeFile(modelPath, modelContent);
  console.log(`✅ Model created: ${modelPath}`);
};
