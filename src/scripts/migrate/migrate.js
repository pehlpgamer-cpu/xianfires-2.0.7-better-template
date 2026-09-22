import { sequelize } from "../../database/database.js";
import { migrationCommand } from "./index.js";

migrationCommand(sequelize, "migrate")