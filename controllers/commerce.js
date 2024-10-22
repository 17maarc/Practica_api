const { commerceModel } = require('../models');

//Función para ver todos los comercios que hemos añadido
const getItems = async (req, res) => {
    const data = await commerceModel.find({})
    res.send({ data })
};

//Función para buscar un comercio especifico por su CIF
const getItem = async (req, res) => {
    const { cif } = req.params;
    const data = await commerceModel.findOne({ cif });
    res.send({ data });
  };  

//Función para añadir un nuevo comercio
const createItem = async (req, res) => {
    const { body } = req
    const data = await commerceModel.create(body);
    res.send({ data })
};

//Función para modificar un comercio que hemos añadido antes
const updateItem = async (req, res) => {
    const cif = req.params.cif
    const { body } = req
    const data = await commerceModel.findOneAndUpdate({ cif }, body, { new: true });
    res.send({ data })
};

//Función para eliminar un comercio
const deleteItem = async (req, res) => {
    const { cif } = req.params
    const {body} = req
    const data = await commerceModel.findOneAndDelete(cif, body)

    res.send({data})
};

module.exports = { getItems, getItem, createItem, updateItem, deleteItem }; //Exporto las funciones para que puedan ser utilizadas en otros modulos.