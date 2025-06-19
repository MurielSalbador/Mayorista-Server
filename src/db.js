import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const isProduction = process.env.NODE_ENV === "production";

const config = isProduction
  ? {
    
      db: process.env.DB_NAME,
      user: process.env.DB_USER,
      pass: process.env.DB_PASSWORD,
      options: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 3306,
        dialect: "mysql",
      },
    }
  : {
      db: "RubioHnos",
      user: "root",
      pass: "",
      options: {
        dialect: "sqlite",
        storage: "./RubioHnos.sqlite",
      },
    };

export const sequelize = new Sequelize(
  config.db,
  config.user,
  config.pass,
  {
    ...config.options,
    logging: false,
  }
);

console.log("🔗 Usando base de datos:", config.options.dialect);
