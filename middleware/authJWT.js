const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

// Función para firmar un token
const tokenSign = (user) => {
    const sign = jwt.sign(
        {
            _id: user._id,
            role: user.role,
        },
        JWT_SECRET,
        { expiresIn: "10h" }
    );

    return sign;
};

// Función para verificar un token
const verifyToken = (tokenJwt) => {
    try {
        return jwt.verify(tokenJwt, JWT_SECRET);
    } catch (err) {
        console.log(err);
        return null;
    }
};

// Middleware de autenticación
const authMiddleware = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1]; // Extrae el token del encabezado
        if (!token) {
            return res.status(401).json({ message: "Token no proporcionado" });
        }

        const decoded = verifyToken(token); // Verifica el token
        if (!decoded) {
            return res.status(401).json({ message: "Token inválido" });
        }

        req.user = decoded; // Guarda los datos decodificados del usuario en req.user
        next(); // Continúa al siguiente middleware o controlador
    } catch (error) {
        console.error("Error en authMiddleware:", error);
        return res.status(401).json({ message: "No autorizado" });
    }
};

module.exports = { tokenSign, verifyToken, authMiddleware };