const multer = require('multer'); //Importa el módulo multer para manejar la subida de archivos
const path = require('path'); //Importa el módulo path para trabajar con rutas de archivos

//Configuración de almacenamiento
const storage = multer.diskStorage({
    //Define el destino donde se guardarán los archivos subidos
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); //Ruta donde se guardarán las imágenes
    },
    //Define como se nombrarán los archivos subidos
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

//Crea el middleware de multer con la configuración de almacenamiento
const upload = multer({ storage });

//Exporta el middleware 
module.exports = upload; 