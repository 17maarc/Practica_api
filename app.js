const express = require("express"); // Importa el módulo Express
const dbConnect = require("./config/mongo.js"); // Conexión a la base de datos
require("dotenv").config(); // Carga las variables de entorno
const swaggerUi = require("swagger-ui-express"); // Configura Swagger UI
const swaggerDocs = require("./docs/swagger.js"); // Documentación de Swagger
const cors = require('cors'); // Middleware para habilitar CORS
const morganBody = require("morgan-body"); // Middleware para logging
const loggerStream = require('./utils/handleLogger'); // Stream para logs
// const handleHttpError = require('./utils/handleError.js'); // Manejo de errores
const app = express(); // Crea una instancia de Express

// Configuración de CORS
app.use(cors());

app.use(express.json()); // Middleware para parsear JSON

// Configuración de morganBody para logging
morganBody(app, {
    noColors: true,
    skip: function (req, res) {
        return res.statusCode < 400; // Solo loguea errores
    },
    stream: loggerStream(process.env.SLACK_WEBHOOK) // Loguea en Slack
});

// Rutas
app.use("/api", require("./routes")); // Carga las rutas definidas

// Archivos estáticos
app.use('/uploads', express.static('uploads')); // Servir archivos estáticos

// Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs)); // Configura la documentación de Swagger

// Manejo de errores
// app.use(handleHttpError); // Asegúrate de que esté habilitado y configurado correctamente

const port = process.env.PORT || 3000; // Establece el puerto

app.listen(port, () => {
    console.log(`Server is running en el puerto ${port}`); // Log para confirmar que el servidor está corriendo
    dbConnect(); // Conectar a la base de datos
});