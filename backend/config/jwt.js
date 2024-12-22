import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "clave_secreta_muy_segura";

export const generateToken = (usuario) => {
  return jwt.sign(
    {
      id: usuario._id,
      username: usuario.username,
    },
    JWT_SECRET,
    { expiresIn: "24h" }
  );
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    console.log(`Error al verificar token: ${err.message}`);
    return null;
  }
};
