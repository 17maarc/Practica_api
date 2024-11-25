const multer = require('multer');
const fs = require('fs'); // Para comprobar si el archivo ya existe

// Configuración del almacenamiento de archivos
const storage = multer.diskStorage({
    // Carpeta donde se guardarán las imágenes
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Directorio donde se almacenarán los archivos
    },
    filename: (req, file, cb) => {
        const originalName = file.originalname.split('.')[0]; // Nombre original del archivo sin extensión
        const ext = file.originalname.split('.').pop(); // Extensión del archivo
        let filename = `${originalName}.${ext}`; // Nombre base (sin sufijo)

        // Verificamos si el archivo ya existe en la carpeta uploads/
        let counter = 1;
        while (fs.existsSync(`uploads/${filename}`)) {
            filename = `${originalName}(${counter}).${ext}`; 
            counter++;
        }

        // Guardar el archivo con el nombre generado
        cb(null, filename);
    }
});

// Crea el middleware de Multer con la configuración de almacenamiento
const upload = multer({ storage });

// Exporta el middleware para usarlo en las rutas
module.exports = upload;