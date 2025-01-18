import { verifyToken } from "../config/jwt.js";

export const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ mensaje: "No hay token de autenticación" });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ mensaje: "Token inválido" });
    }

    // Guardar la información del usuario en el request
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({
      mensaje: `Error de autenticación: ${err.message}`,
    });
  }
};

// Middleware específico para alberto
export const isAlberto = (req, res, next) => {
  if (req.user.username !== "alberto") {
    return res.status(403).json({
      mensaje: "Solo el usuario administrador puede realizar esta acción",
    });
  }
  next();
};
