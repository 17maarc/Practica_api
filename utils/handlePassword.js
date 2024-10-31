const bcrypt = require("bcryptjs"); // Importa el módulo bcryptjs para la encriptación de contraseñas

// Función para encriptar una contraseña
const encrypt = async (password) => {
    const salt = await bcrypt.genSalt(10); // Genera una sal con 10 rondas
    return await bcrypt.hash(password, salt); // Devuelve la contraseña encriptada usando la sal
};

// Función para comparar una contraseña proporcionada con una contraseña encriptada
const compare = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword); // Devuelve true si las contraseñas coinciden, false si no
};

// Exporta las funciones de encriptación y comparación
module.exports = { encrypt, compare };