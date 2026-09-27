import 'dotenv/config';
import { drizzle } from "drizzle-orm/mysql2";
import { relations } from '../app/models/relations/relations';

const mysqlDb = drizzle(process.env.PROD_MYSQL_URL, {relations});