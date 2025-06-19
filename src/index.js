// index.js
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

// db
import { sequelize } from "./db.js"; // DB productos

// rutas
import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/products.routes.js";
import orderRoutes from "./routes/orders.routes.js";
import userRoutes from "./routes/user.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import resetPasswordRoutes from "./routes/resetPassword.routes.js";

// modelos
import { Products } from "./models/products.js";
import { Categories } from "./models/categories.js";
import "./models/user.js";

import { PORT } from "./config.js";

// asociaciones
Categories.hasMany(Products, { foreignKey: "categoryId" });
Products.belongsTo(Categories, { foreignKey: "categoryId" });

console.log("Reset password routes cargadas");

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://glittering-sopapillas-cc0a40.netlify.app",
      "https://68544137deae926d74c4cb8b--glittering-sopapillas-cc0a40.netlify.app",
    ],
    credentials: true,
  })
);

app.use(express.json());

// Rutas existentes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/password", resetPasswordRoutes);

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Conectado base de datos exitosamente.");

    await sequelize.sync({ alter: true });
    console.log("🛠️ Tablas sincronizadas correctamente.");

    app.listen(PORT, () => {
      console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Error al iniciar el servidor:", error);
  }
};

startServer();