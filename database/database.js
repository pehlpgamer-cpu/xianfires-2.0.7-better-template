import 'dotenv/config';
import { drizzle } from "drizzle-orm/mysql2";
import { relations } from '../app/models/relations/relations';

const mysqlUrl =
    `mysql://${process.env.PROD_MYSQL_USER}:` + 
    `${process.env.MYSQL_PASSWORD}@` +
    `${process.env.MYSQL_HOST}:` +
    `${process.env.MYSQL_PORT}/` +
    `${process.env.MYSQL_NAME}`;

const mysqlDb = drizzle(mysqlUrl, {relations});