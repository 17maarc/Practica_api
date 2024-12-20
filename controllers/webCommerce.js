const { webModel, commerceModel, userModel } = require("../models");
const { verifyToken } = require("../middleware/authJWT");

// Obtener todas las páginas web
const getWebpages = async (req, res) => {
  try {
    // Obtener las páginas web desde la base de datos
    const data = await webModel.find().lean();

    // Mapear los datos para que solo se incluya _id
    const mappedData = data.map((webpage) => ({
      ...webpage, // Copia todos los campos de la página web
      _id: webpage._id.toString(), 
    }));

    // Enviar los datos con _id y sin el campo id
    res.send({ data: mappedData });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener las páginas web", error });
  }
};

const getWebpage = async (req, res) => {
  try {
    // Obtener el ID de la URL
    const { id } = req.params;

    // Buscar la página web en la base de datos por su ID
    const webpage = await webModel.findById(id);

    // Verificar si la página web existe
    if (!webpage) {
      return res.status(404).json({ message: "Página web no encontrada" });
    }

    // Responder con los datos completos de la página web, incluyendo el id
    res.status(200).json({
      data: webpage, 
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        message: "Error al obtener la página web",
        error: error.message,
      });
  }
};

const createWebpage = async (req, res) => {
  try {
    const { body } = req;

    // Obtener el token de autorización
    const token = req.headers.authorization?.split(" ")[1];
    const decoded = verifyToken(token); // Decodificar el token

    // Verificar si el token es válido
    if (!decoded) {
      return res.status(401).json({ message: "Token inválido" });
    }

    // Buscar el comercio asociado con el CIF decodificado
    const commerce = await commerceModel.findOne({ cif: decoded.cif });
    if (!commerce) {
      return res.status(404).json({ message: "Comercio no encontrado" });
    }

    // Crear la nueva página web asociada al comercio encontrado
    const data = await webModel.create({
      ...body,
      commerce: commerce._id, // Asignar el ID del comercio al campo commerce
    });

    // Responder con los datos completos de la página web recién creada, incluyendo el _id generado automáticamente por MongoDB
    res.status(201).json({
      message: "Página web creada con éxito",
      data: {
        ...data._doc, // Obtén todos los campos del documento recién creado
        id: data._id.toString(), // Asegúrate de incluir el id (sin el prefijo _)
      },
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error al crear la página web", error: error.message });
  }
};

// Actualizar una página web
const updateWebpage = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({ message: "Token inválido" });
    }

    const commerce = await commerceModel.findOne({ cif: decoded.cif });
    if (!commerce) {
      return res.status(404).json({ message: "Comercio no encontrado" });
    }

    const updatedData = await webModel.findOneAndUpdate(
      { _id: req.params.id, commerce: commerce._id },
      req.body,
      { new: true }
    );

    if (!updatedData) {
      return res
        .status(404)
        .json({
          message: "Página web no encontrada o no pertenece al comercio",
        });
    }

    res.send({ data: updatedData });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al actualizar la página web", error });
  }
};

// Archivado lógico de una página web
const archiveWebpage = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({ message: "Token inválido" });
    }

    const commerce = await commerceModel.findOne({ cif: decoded.cif });
    if (!commerce) {
      return res.status(404).json({ message: "Comercio no encontrado" });
    }

    const web = await webModel.findOneAndUpdate(
      { _id: req.params.id, commerce: commerce._id },
      { deleted: true },
      { new: true }
    );

    if (!web) {
      return res.status(404).json({ message: "Página no encontrada" });
    }

    res.status(200).json({ message: "Página archivada lógicamente", web });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Eliminación física de una página web
const deleteWebpage = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({ message: "Token inválido" });
    }

    const commerce = await commerceModel.findOne({ cif: decoded.cif });
    if (!commerce) {
      return res.status(404).json({ message: "Comercio no encontrado" });
    }

    const web = await webModel.findOneAndDelete({
      _id: req.params.id,
      commerce: commerce._id,
    });

    if (!web) {
      return res.status(404).json({ message: "Página no encontrada" });
    }

    res.status(200).json({ message: "Página eliminada físicamente" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const UploadImage = async (req, res) => {
  try {
    // Log para depuración
    console.log("Header Authorization:", req.headers.authorization);

    const token = req.headers.authorization?.split(" ")[1]; // Extraemos el token
    const decoded = verifyToken(token); // Verificamos el token

    if (!decoded) {
      return res.status(401).json({ message: "Token inválido" });
    }

    // Buscamos el comercio utilizando el cif decodificado
    const commerce = await commerceModel.findOne({ cif: decoded.cif });
    if (!commerce) {
      return res.status(404).json({ message: "Comercio no encontrado" });
    }

    // Log para verificar el archivo subido
    console.log("Archivo recibido:", req.file);

    // Aquí generamos la URL para la imagen subida, asegurándonos de codificar el nombre del archivo correctamente
    const imageUrl = `/uploads/${encodeURIComponent(req.file.filename)}`;

    // Log para verificar la URL generada
    console.log("URL generada para la imagen:", imageUrl);

    // Actualizamos la base de datos con la nueva URL de la imagen
    const updatedWebpage = await webModel.findOneAndUpdate(
      { _id: req.params.id, commerce: commerce._id },
      { $push: { images: imageUrl } },
      { new: true }
    );

    // Si no encontramos la página web o no pertenece al comercio
    if (!updatedWebpage) {
      return res
        .status(404)
        .send({
          message: "Página web no encontrada o no pertenece al comercio",
        });
    }

    // Respondemos con la URL de la imagen subida
    res.status(200).send({
      message: "Imagen subida con éxito",
      file: {
        originalname: req.file.originalname,
        filename: req.file.filename,
        url: imageUrl, // Aquí la URL codificada que se puede utilizar en el frontend
      },
    });
  } catch (error) {
    // En caso de error, logueamos y enviamos la respuesta adecuada
    console.error("Error al subir la imagen:", error);
    res
      .status(500)
      .send({ message: "Error en el servidor", error: error.message });
  }
};

// Método para añadir una nueva reseña
const addReview = async (req, res) => {
    try {
      // Obtener el token de usuario
      const token = req.headers.authorization?.split(" ")[1];
      const decoded = verifyToken(token); // Verificar el token del usuario
  
      if (!decoded) {
        return res.status(401).json({ message: "Token inválido" });
      }
  
      // Buscar la página web por ID
      const webpage = await webModel.findById(req.params.id);
      if (!webpage) {
        return res.status(404).json({ message: "Página web no encontrada" });
      }
  
      // Si la página web existe, agregar la reseña
      const { score, reviewText } = req.body;
  
      // Validar el score
      if (score < 1 || score > 5) {
        return res.status(400).json({ message: "La puntuación debe estar entre 1 y 5." });
      }
  
      // Usar el método `addReview` que ya tenemos en el modelo para agregar la reseña
      await webpage.addReview(score, reviewText);
  
      // Retornar la página web actualizada con la nueva reseña
      res.status(201).json({
        message: "Reseña añadida con éxito.",
        reviews: webpage.reviews, // Devolver los detalles de la reseña actualizada
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al añadir la reseña", error });
    }
  };  

const getReviews = async (req, res) => {
  try {
    // Buscar la página web por su ID
    const webpage = await webModel.findById(req.params.id); // req.params.id obtiene el ID de la URL

    // Verificar si la página web existe
    if (!webpage) {
      return res.status(404).json({ error: "Página web no encontrada." });
    }

    // Si existe, devolver las reseñas y el título de la página
    return res.json({
      reviews: webpage.reviews,
      webpageTitle: webpage.title, // Si deseas incluir el título de la página web en la respuesta
    });
  } catch (error) {
    // Manejo de errores
    console.error(error);
    return res.status(500).json({ error: "Error al obtener las reseñas." });
  }
};

const getInterestedUsers = async (req, res) => {
  try {
    const { id } = req.params; 
    console.log("ID de Webcommerce recibido:", id);
    
    // Verificar el token de autorización
    const token = req.headers.authorization?.split(" ")[1];
    console.log("Token recibido:", token);
    const decoded = verifyToken(token);
    console.log("Token decodificado:", decoded);

    if (!decoded) {
      return res.status(401).json({ message: "Token inválido" });
    }

    // Buscar el webcommerce por ID
    const webcommerce = await webModel.findOne({ _id: id });
    console.log("Webcommerce encontrado:", webcommerce);

    if (!webcommerce) {
      return res.status(404).json({ message: "Webcommerce no encontrado" });
    }

    // Buscar usuarios en la misma ciudad y que coincidan con los intereses del comercio
    const usuarios = await userModel.find({
      city: webcommerce.city,  // Verifica si la ciudad coincide
      offers: true,  // Verifica que el usuario quiera recibir ofertas
      interests: { $in: webcommerce.activity }  // Coincide intereses con las actividades del webcommerce
    });

    console.log("Usuarios encontrados:", usuarios);

    if (usuarios.length === 0) {
      return res.status(404).json({ message: "No se encontraron usuarios interesados" });
    }

    // Extraer los correos de los usuarios encontrados
    const correos = usuarios.map(user => user.email);

    res.status(200).json({ correos });
  } catch (error) {
    console.error("Error al obtener usuarios interesados:", error);
    res.status(500).json({ message: "Error al obtener usuarios interesados", error });
  }
};

// Exportar funciones
module.exports = {
  getWebpages,
  getWebpage,
  createWebpage,
  updateWebpage,
  archiveWebpage,
  deleteWebpage,
  UploadImage,
  addReview,
  getReviews,
  getInterestedUsers
};
