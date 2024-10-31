const { webModel, commerceModel, userModel } = require('../models'); // Importa los modelos necesarios
const { verifyToken } = require('../middleware/authJWT'); // Importa el middleware para verificar el token

// Función para obtener todas las páginas web del comercio
const getWebpages = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1]; // Extrae el token del encabezado
        const decoded = verifyToken(token); // Verifica el token

        // Comprueba si el token es válido
        if (!decoded) {
            return res.status(401).json({ message: 'Token inválido' });
        }

        // Verifica que el comercio exista
        const commerce = await commerceModel.findOne({ cif: decoded.cif });
        if (!commerce) {
            return res.status(404).json({ message: 'Comercio no encontrado' });
        }

        // Obtiene todas las páginas web del comercio
        const data = await webModel.find({ commerce: commerce._id });
        res.send({ data });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las páginas web', error });
    }
};

// Función para buscar una página web específica
const getWebpage = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        const decoded = verifyToken(token);

        if (!decoded) {
            return res.status(401).json({ message: 'Token inválido' });
        }

        const commerce = await commerceModel.findOne({ cif: decoded.cif });
        if (!commerce) {
            return res.status(404).json({ message: 'Comercio no encontrado' });
        }

        // Busca la página web por ID y comercio
        const data = await webModel.findOne({ commerce: commerce._id, _id: req.params.id });
        if (!data) {
            return res.status(404).json({ message: 'Página web no encontrada' });
        }

        res.send({ data });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener la página web', error });
    }
};

// Función para crear una nueva página web
const createWebpage = async (req, res) => {
    try {
        const { body } = req; // Extrae el cuerpo de la solicitud
        const token = req.headers.authorization?.split(" ")[1];
        const decoded = verifyToken(token);

        if (!decoded) {
            return res.status(401).json({ message: 'Token inválido' });
        }

        const commerce = await commerceModel.findOne({ cif: decoded.cif });
        if (!commerce) {
            return res.status(404).json({ message: 'Comercio no encontrado' });
        }

        // Crea una nueva página web vinculada al comercio
        const data = await webModel.create({ ...body, commerce: commerce._id });
        res.status(201).json({ data });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear la página web', error });
    }
};

// Función para actualizar una página web existente
const updateWebpage = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        const decoded = verifyToken(token);

        if (!decoded) {
            return res.status(401).json({ message: 'Token inválido' });
        }

        const commerce = await commerceModel.findOne({ cif: decoded.cif });
        if (!commerce) {
            return res.status(404).json({ message: 'Comercio no encontrado' });
        }

        // Actualiza la página web buscando por ID y comercio
        const updatedData = await webModel.findOneAndUpdate(
            { _id: req.params.id, commerce: commerce._id }, // Busca por ID y comercio
            req.body,
            { new: true }
        );

        if (!updatedData) {
            return res.status(404).json({ message: 'Página web no encontrada o no pertenece al comercio' });
        }

        res.send({ data: updatedData });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar la página web', error });
    }
};

// Borrado lógico de una página web
const archiveWebpage = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        const decoded = verifyToken(token);

        if (!decoded) {
            return res.status(401).json({ message: 'Token inválido' });
        }

        const commerce = await commerceModel.findOne({ cif: decoded.cif });
        if (!commerce) {
            return res.status(404).json({ message: 'Comercio no encontrado' });
        }

        // Marca la página como eliminada lógicamente
        const web = await webModel.findOneAndUpdate(
            { _id: req.params.id, commerce: commerce._id },
            { deleted: true },
            { new: true }
        );

        if (!web) {
            return res.status(404).json({ message: 'Página no encontrada' });
        }

        res.status(200).json({ message: 'Página archivada lógicamente', web });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Borrado físico de una página web
const deleteWebpage = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        const decoded = verifyToken(token);

        if (!decoded) {
            return res.status(401).json({ message: 'Token inválido' });
        }

        const commerce = await commerceModel.findOne({ cif: decoded.cif });
        if (!commerce) {
            return res.status(404).json({ message: 'Comercio no encontrado' });
        }

        // Elimina la página web físicamente
        const web = await webModel.findOneAndDelete(
            { _id: req.params.id, commerce: commerce._id }
        );

        if (!web) {
            return res.status(404).json({ message: 'Página no encontrada' });
        }

        res.status(200).json({ message: 'Página eliminada físicamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Función para subir una imagen y actualizar el array de imágenes de la página web
const UploadImage = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        const decoded = verifyToken(token);

        if (!decoded) {
            return res.status(401).json({ message: 'Token inválido' });
        }

        const commerce = await commerceModel.findOne({ cif: decoded.cif });
        if (!commerce) {
            return res.status(404).json({ message: 'Comercio no encontrado' });
        }

        const imageUrl = `/uploads/${req.file.filename}`; // URL de la imagen subida

        // Actualiza la página web, añadiendo la URL de la imagen al array de imágenes
        const updatedWebpage = await webModel.findOneAndUpdate(
            { _id: req.params.id, commerce: commerce._id }, // Busca por ID y comercio
            { $push: { images: imageUrl } },
            { new: true }
        );

        if (!updatedWebpage) {
            return res.status(404).send({ message: 'Página web no encontrada o no pertenece al comercio' });
        }

        res.send({ data: updatedWebpage });
    } catch (error) {
        res.status(500).send({ message: 'Error en el servidor', error: error.message });
    }
};

// Función para obtener los correos electrónicos de los usuarios interesados en la actividad
const getEmailsByActivity = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        const decoded = verifyToken(token);

        if (!decoded) {
            return res.status(401).json({ message: 'Token inválido' });
        }

        const commerce = await commerceModel.findOne({ cif: decoded.cif });
        if (!commerce) {
            return res.status(404).json({ message: 'Comercio no encontrado' });
        }

        const activity = req.query.activity; // Obtener actividad desde el query
        const interestedUsers = await userModel.find({
            activity: activity,
            permitirRecibirOfertas: true
        }).select('email'); // Solo seleccionamos el campo de email

        res.send({ emails: interestedUsers });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los emails', error });
    }
};

// Exporta todas las funciones del controlador para su uso en otras partes de la aplicación
module.exports = {
    getWebpages,
    getWebpage,
    createWebpage,
    updateWebpage,
    archiveWebpage,
    deleteWebpage,
    UploadImage,
    getEmailsByActivity
};