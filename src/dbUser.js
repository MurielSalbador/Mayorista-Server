// src/config/database.js
import { Sequelize } from "sequelize";

export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './RubioHnosUsers.sqlite',
  logging: false,
});
