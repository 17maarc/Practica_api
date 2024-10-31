// Función para manejar errores HTTP
const handleHttpError = (res, message, code = 403) => {
    res.status(code).send(message); // Envía una respuesta con el código de estado y el mensaje proporcionado
};

// Exporta la función para su uso en otras partes de la aplicación
module.exports = { handleHttpError };