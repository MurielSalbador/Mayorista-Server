import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// Registro de usuario
export const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Este email ya se encuentra registrado." });
    }

    const hash = await bcrypt.hash(password, 10);

    // Siempre se registra como 'user'
    const user = await User.create({
      username,
      email,
      password: hash,
      role: "user",
    });

    res.status(201).json({ id: user.id, role: user.role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al registrar el usuario." });
  }
};

// Login de usuario
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "Usuario no encontrado" });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    // Asignar rol automáticamente si el email contiene ciertas palabras
    const adminKeyword = process.env.ADMIN_EMAIL_KEYWORD || "admin@";
    const superadminKeyword = process.env.SUPERADMIN_EMAIL_KEYWORD || "superadmin@";

    let assignedRole = user.role;

    if (email.includes(superadminKeyword)) {
      assignedRole = "superadmin";
    } else if (email.includes(adminKeyword)) {
      assignedRole = "admin";
    }

    // Actualizar el rol solo si cambió
    if (user.role !== assignedRole) {
      user.role = assignedRole;
      await user.save();
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "rubio2025",
      { expiresIn: "8h" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al iniciar sesión." });
  }
};
