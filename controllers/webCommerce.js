const { webModel } = require('../models');
const path = require('path');

//Función para obtener todas las páginas web
const getWebpages = async (req, res) => {
    const data = await webModel.find();
    res.send({ data });
};

//Funcion para buscar una web a traves del id
const getWebpage = async (req, res) => {
    const { id } = req.params; //Asegúrate de que el id se está extrayendo de los parámetro
    const data = await webModel.findById(id);
    res.send({ data });
};

//Funcion para crear la pagina web
const createWebpage = async (req, res) => {
    const { body } = req;
    const data = await webModel.create(body);
    res.status(201).send({ data });
};

//Funcion para actualizar la pagina web
const updateWebpage = async (req, res) => {
    const { body } = req;
    const data = await webModel.findByIdAndUpdate(req.params.id, body, { new: true });
    res.send({ data });
};

//Borrado lógico de una página web
const archiveWebpage = async (req, res) => {
    try {
        const web = await webModel.findByIdAndUpdate(req.params.id, { deleted: true }, { new: true });
        if (!web) return res.status(404).json({ message: 'Página no encontrada' });
        res.status(200).json({ message: 'Página archivada lógicamente', web });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//Borrado físico de una página web
const deleteWebpage = async (req, res) => {
    try {
        const { id } = req.params;
        const { soft } = req.query;

        if (soft === 'true') {
            return archiveWebpage(req, res); //Llama a la función de borrado lógico
        } else {
            const web = await webModel.findByIdAndDelete(id);
            if (!web) return res.status(404).json({ message: 'Página no encontrada' });
            return res.status(200).json({ message: 'Página eliminada físicamente' });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

//Función para subir una imagen y actualizar el array de imágenes
const UploadImage = async (req, res) => {
    try {
        const { id } = req.params; //Obtengo el ID de la página web
        const imageUrl = `/uploads/${req.file.filename}`; //URL de la imagen subida

        //Actualiza la página web, añadiendo la URL de la imagen al array de imágenes
        const updatedWebpage = await webModel.findByIdAndUpdate(
            id,
            { $push: { images: imageUrl } },
            { new: true }
        );

        if (!updatedWebpage) {
            return res.status(404).send({ message: 'Subida Completada' });
        }

        res.send({ data: updatedWebpage });
    } catch (error) {
        res.status(500).send({ message: 'Error en el servidor', error: error.message });
    }
};
  
module.exports = { getWebpages, getWebpage, createWebpage, updateWebpage, archiveWebpage, deleteWebpage, UploadImage  };