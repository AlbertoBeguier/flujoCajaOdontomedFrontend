import express from "express";
import Usuario from "../models/Usuario.js";
import { generateToken } from "../config/jwt.js";
import { authMiddleware, isAlberto } from "../middleware/auth.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const usuario = await Usuario.findOne({ username });

    if (!usuario || usuario.password !== password) {
      return res
        .status(401)
        .json({ mensaje: "Usuario o contraseña incorrectos" });
    }

    // Generar token
    const token = generateToken(usuario);

    res.json({
      success: true,
      token,
      username: usuario.username,
      role: usuario.role,
    });
  } catch (err) {
    res.status(500).json({ mensaje: `Error en el servidor: ${err.message}` });
  }
});

router.post("/register", authMiddleware, isAlberto, async (req, res) => {
  try {
    const { username, password, role } = req.body;
    console.log("Intentando crear usuario:", username, "con rol:", role);

    // Verificar si el usuario ya existe
    const usuarioExistente = await Usuario.findOne({ username });
    if (usuarioExistente) {
      console.log("Usuario ya existe:", username);
      return res.status(400).json({ mensaje: "El usuario ya existe" });
    }

    // Crear nuevo usuario con el rol especificado
    const usuario = new Usuario({
      username,
      password,
      role: role || "user",
    });

    const usuarioGuardado = await usuario.save();
    console.log("Usuario creado exitosamente:", {
      username: usuarioGuardado.username,
      role: usuarioGuardado.role,
    });

    res.status(201).json({
      mensaje: "Usuario creado exitosamente",
      usuario: {
        username: usuarioGuardado.username,
        role: usuarioGuardado.role,
      },
    });
  } catch (err) {
    console.error("Error al crear usuario:", err);
    res.status(500).json({ mensaje: `Error al crear usuario: ${err.message}` });
  }
});

export default router;
