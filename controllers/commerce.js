const { commerceModel } = require('../models');
const jwt = require('jsonwebtoken')
const {matchedData} = require('express-validator')
const { tokenSign, verifyToken } = require("../middleware/authJWT");

//Función para ver todos los comercios que hemos añadido
const getItems = async (req, res) => {
    const data = await commerceModel.find({})
    res.send({ data })
};

//Función para buscar un comercio especifico por su CIF
const getItem = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        const decoded = verifyToken(token);

        if (!decoded) {
            return res.status(401).json({ message: "Token inválido" });
        }

        const commerce = await commerceModel.findOne({ cif: req.params.cif, jwt: token });

        if (!commerce) {
            return res.status(404).json({ message: "Comercio no encontrado" });
        }

        res.status(200).json({ commerce });
    } catch (error) {
        res.status(500).json({ message: "Error al obtener el comercio", error });
    }
};

//Función para añadir un nuevo comercio
const createItem = async (req, res) => {
    try {
        const { name, cif, email, phone, address } = req.body;
        
        // Verifica que el usuario sea un admin
        if (req.user?.role !== 'admin') {
            return res.status(403).json({ message: "Acceso denegado: solo los administradores pueden crear comercios." });
        }

        const token = tokenSign({ cif });  // Crea el token con CIF para el comercio
        const newCommerce = await commerceModel.create({ name, cif, email, phone, address, jwt: token });
        
        res.status(201).json({ commerce: newCommerce, token });
    } catch (error) {
        console.error("Error al crear el comercio:", error); // Agrega un log para depurar
        res.status(500).json({ message: "Error al crear el comercio", error });
    }
};

// Actualizar un comercio
const updateItem = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        const decoded = verifyToken(token);

        if (!decoded) {
            console.error("Token inválido");
            return res.status(401).json({ message: "Token inválido" });
        }

        // Verificar que el CIF está en los parámetros de la solicitud
        const { cif } = req.params;
        console.log("CIF recibido:", cif);
        console.log("Datos a actualizar:", req.body);

        // Actualizar el comercio en la base de datos
        const updatedCommerce = await commerceModel.findOneAndUpdate(
            { cif: cif, jwt: token },  // Asegúrate de que estés utilizando el CIF correcto
            { $set: req.body },  // Aquí puedes establecer los campos que deseas actualizar
            { new: true }  // Devuelve el documento actualizado
        );

        // Si no se encuentra el comercio, devolver un 404
        if (!updatedCommerce) {
            console.error("Comercio no encontrado para el CIF:", cif);
            return res.status(404).json({ message: "Comercio no encontrado" });
        }

        res.status(200).json({ commerce: updatedCommerce });
    } catch (error) {
        console.error("Error al actualizar el comercio:", error); // Imprimir el error en la consola para depuración
        res.status(500).json({ message: "Error al actualizar el comercio", error });
    }
};

// Eliminar un comercio (borrado lógico)
const deleteItem = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        const decoded = verifyToken(token);

        if (!decoded) {
            return res.status(401).json({ message: "Token inválido" });
        }

        const commerce = await commerceModel.findOneAndUpdate(
            { cif: req.params.cif, jwt: token },
            { delete: true },
            { new: true }
        );

        if (!commerce) {
            return res.status(404).json({ message: "Comercio no encontrado" });
        }

        res.status(200).json({ message: "Comercio eliminado", commerce });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar el comercio", error });
    }
};

module.exports = { getItems, getItem, createItem, updateItem, deleteItem }; //Exporto las funciones para que puedan ser utilizadas en otros modulos.