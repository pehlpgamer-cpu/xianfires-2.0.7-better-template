import path from 'path';
import fs from 'fs/promises';
import { toPascalCase, ensureDir } from "../utils.js"
import { licenseComment } from "../constants.js"

// Generate Model (Sequelize for MySQL, Mongoose for MongoDB, Firestore helpers for Firebase)
export const createModel = async (modelName) => {
  const modelDir = path.join(process.cwd(), 'models');
  await ensureDir(modelDir);

  const pascalName = toPascalCase(modelName);
  const modelPath = path.join(modelDir, `${pascalName}.js`);

  let modelContent = `
  ${licenseComment}
  // Firebase doesn't require predefined models.
  // Use Firestore directly in controllers or create helper functions here.
  // Collection name: "${pascalName.toLowerCase()}"

  import { DataTypes } from "sequelize";
import { sequelize } from "./db.js";


export const ${pascalName} = sequelize.define("${pascalName.toLowerCase()}", {

  FirstName: { type: DataTypes.STRING, allowNull: false },
  LastName: { type: DataTypes.STRING, allowNull: false },
  MiddleName: { type: DataTypes.STRING, allowNull: false },
  Program: { type: DataTypes.STRING, allowNull: false },
  YearLevel: { type: DataTypes.STRING, allowNull: false },
  Section: { type: DataTypes.STRING, allowNull: false },
});
export { sequelize }; 
  `.trim();

  await fs.writeFile(modelPath, modelContent);
  console.log(`✅ Model created: ${modelPath}`);
};