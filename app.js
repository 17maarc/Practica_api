const express = require("express"); //Importa el framework Express
const dbConnect = require("./config/mongo.js"); //Importa la función de conexión a MongoDB
require("dotenv").config(); //Carga variables de entorno desde el archivo .env

const app = express(); //Inicializa la aplicación de Express

app.use(express.json()); //Middleware para manejar datos en formato JSON

//Define las rutas de la api que están en el archivo ./routes bajo el prefijo /api
app.use("/api", require("./routes"));

//Sirve archivos estáticos desde el directorio uploads
app.use('/uploads', express.static('uploads'));

const port = process.env.PORT || 3000;

//Inicia el servidor y hace la conexion a la base de datos
app.listen(port, () => {
    console.log(`Server is running en el puerto ${port}`);
    dbConnect(); //Conecta a la base de datos MongoDB
});