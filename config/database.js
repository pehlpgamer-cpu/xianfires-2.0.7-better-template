// import fs from 'fs';
// import path from 'path';
import { fileURLToPath } from "url";

// Replicate __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
//const __dirname = path.dirname(__filename);

export const development = {
  username: "root",
  password: "mYNSn4qm6sgEez29agtW7dbfs7MG08YamNf8VPQfSaHxXssW26vXXa7drW3urJxn",
  database: "xianfire-2.0.7-better-template-local",
  host: "localhost",
  port: 3306,
  dialect: "mysql",
  dialectOptions: {
    bigNumberStrings: true,
  },
};

export const test = {
  username: process.env.CI_DB_USERNAME,
  password: process.env.CI_DB_PASSWORD,
  database: process.env.CI_DB_NAME,
  host: "127.0.0.1",
  port: 3306,
  dialect: "mysql",
  dialectOptions: {
    bigNumberStrings: true,
  },
};

export const production = {
  username: process.env.PROD_DB_USERNAME,
  password: process.env.PROD_DB_PASSWORD,
  database: process.env.PROD_DB_NAME,
  host: process.env.PROD_DB_HOSTNAME,
  port: process.env.PROD_DB_PORT,
  dialect: "mysql",
  // dialectOptions: {
  //   bigNumberStrings: true,
  //   ssl: {
  //     // Use path.join for safer cross-platform path resolution
  //     ca: fs.readFileSync(path.join(__dirname, 'mysql-ca-main.crt')),
  //   },
  // },
};
