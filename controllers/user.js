const {userModel } = require('../models')
const { matchedData } = require("express-validator");
const { tokenSign } = require("../middleware/authJWT");
const { encrypt, compare } = require("../utils/handlePassword");
const { handleHttpError } = require("../utils/handleError");
require('dotenv').config();

//REGISTER
const registerUser = async (req, res) => {
    try {
      req = matchedData(req); 
  
      const password = await encrypt(req.password); 
      const body = { ...req, password }; 
      const dataUser = await userModel.create(body); 
  
      // No devolver la contraseña en la respuesta
      dataUser.set("password", undefined, { strict: false });
  
      const data = {
        token: await tokenSign(dataUser), // Generar un token JWT
        user: dataUser,
      };
      res.send(data); // Enviar respuesta
    } catch (err) {
      console.log(err); // Log de error en consola
      handleHttpError(res, "EL USUARIO YA ESTÁ REGISTRADO");
    }
  };
  
//LOGIN
const loginUser = async (req, res) => {
    try {
        req = matchedData(req);
        const user = await userModel.findOne({ email: req.email }).select("password name role email city interests");
        console.log("Email ingresado:", req.email);

        if (!user) {
            console.log("Usuario no encontrado:", req.email);
            return handleHttpError(res, "EL USUARIO NO EXISTE", 404);
        }

        const check = await compare(req.password, user.password);
        if (!check) {
            console.log("Contraseña incorrecta para el usuario:", req.email);
            return handleHttpError(res, "CONTRASEÑA INCORRECTA", 401);
        }

        user.set("password", undefined, { strict: false });
        const data = {
            token: await tokenSign(user),
            user: {
                name: user.name,
                email: user.email,
                city: user.city,
                interests: user.interests,
                role: user.role // Incluye el rol aquí
            },
        };

        res.send(data);
    } catch (err) {
        console.log("Error en loginUser:", err);
        handleHttpError(res, "ERROR AL INICIAR SESIÓN");
    }
};
  
const updateUser = async (req, res) => {
    try {
        const userData = matchedData(req); // Extraer datos validados de la solicitud
        const userId = req.user._id; // Suponiendo que estás utilizando un middleware de autenticación que establece req.user

        // Busca el usuario y actualiza sus datos
        const updatedUser = await userModel.findByIdAndUpdate(userId, userData, { new: true });

        if (!updatedUser) {
            return handleHttpError(res, "USUARIO NO ENCONTRADO", 404);
        }

        updatedUser.set("password", undefined, { strict: false });

        // Respuesta con el usuario actualizado
        res.send(updatedUser);
    } catch (err) {
        console.log("Error en updateUser:", err);
        handleHttpError(res, "ERROR AL ACTUALIZAR USUARIO");
    }
};

// Borrado de usuario
const deleteUser = async (req, res) => {
    try {
        const userId = req.user._id; // Obtén el ID del usuario autenticado desde el token
        const userDeleted = await userModel.findByIdAndDelete(userId);

        if (!userDeleted) {
            return res.status(404).json({ error: "USUARIO NO ENCONTRADO" });
        }

        res.status(200).json({ message: "USUARIO ELIMINADO EXITOSAMENTE" });
    } catch (error) {
        console.error("Error en deleteUser:", error);
        res.status(500).json({ error: "ERROR AL ELIMINAR EL USUARIO" });
    }
};

module.exports = { registerUser, loginUser, updateUser, deleteUser };