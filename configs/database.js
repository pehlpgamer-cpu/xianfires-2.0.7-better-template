import { Sequelize } from "sequelize";

export const defaultConfig = {
    mysql: {
        name: "xianfire-database",
        user: "root",
        password: "",
        host: "localhost"
    },
    //mongodb: {},
} 

export const mysqlConfig = new Sequelize(
  process.env.MYSQL_NAME || "xianfire-database",
  process.env.MYSQL_USER || "root",
  process.env.MYSQL_PASSWORD || "",
  {
    host: process.env.MYSQL_HOST || "localhost",
    dialect: "mysql",
  },
)