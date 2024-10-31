const authRole = (req, res, next) => {
  // Verifica si req.user existe y si el rol es 'admin'
  if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: "Acceso denegado: solo los administradores pueden realizar esta acción." });
  }
  next(); // Si el usuario es admin, continúa al siguiente middleware o controlador
};

module.exports = authRole;