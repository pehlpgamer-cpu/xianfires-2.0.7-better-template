import 'dotenv/config';
import { drizzle } from "drizzle-orm/mysql2";
import { relations } from '../app/models/relations/relations';

const mysqlUrl =
    `mysql://${process.env.PROD_MYSQL_USER}:` +
    `${process.env.PROD_MYSQL_PASSWORD}@` +
    `${process.env.PROD_MYSQL_HOST}:` +
    `${process.env.PROD_MYSQL_PORT}/` +
    `${process.env.PROD_MYSQL_NAME}`;

const mysqlDb = drizzle(mysqlUrl, {relations});