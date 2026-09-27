import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './database/migrations',
  schema: './app/models',
  dialect: 'mysql',
  // tablesFilter: [
  //   "users",
  //   "roles",
  // ],
  dbCredentials: {
    host: "localhost",
    port: 3306,
    user: "root",
    password: "mypassword",
    database: "mysql",
  },
  casing: 'snake_case',
  verbose: true,
  strict: true,
});
