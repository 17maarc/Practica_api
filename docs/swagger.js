const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "Commerces and Users API - Express API with Swagger (OpenAPI 3.0)",
      version: "0.1.0",
      description:
        "This is a CRUD API application for managing users and commerce webpages, built with Express and documented with Swagger.",
      license: {
        name: "MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
      contact: {
        name: "u-tad",
        url: "https://u-tad.com",
        email: "ricardo.palacios@u-tad.com",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        // Esquemas de usuarios y comercios
        registerUser: {
          type: "object",
          required: ["name", "email", "password", "city"],
          properties: {
            name: { type: "string", example: "Menganito" },
            email: { type: "string", format: "email", example: "miemail@google.com" },
            password: { type: "string", example: "password123" },
            city: { type: "string", example: "Madrid" },
            interests: { type: "array", items: { type: "string" }, example: ["deporte", "música"] },
          },
        },
        updateUser: {
          type: "object",
          properties: {
            name: { type: "string", example: "Menganito" },
            email: { type: "string", format: "email", example: "miemail@google.com" },
            city: { type: "string", example: "Madrid" },
            interests: { type: "array", items: { type: "string" }, example: ["deporte", "música"] },
          },
        },
        loginUser: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", format: "email", example: "miemail@google.com" },
            password: { type: "string", example: "password123" },
          },
        },
        createCommerce: {
          type: "object",
          required: ["cif", "name", "city"],
          properties: {
            cif: { type: "string", example: "B12345678" },
            name: { type: "string", example: "Comercio de Ejemplo" },
            city: { type: "string", example: "Madrid" },
          },
        },
        updateCommerce: {
          type: "object",
          properties: {
            name: { type: "string", example: "Comercio de Ejemplo Actualizado" },
            city: { type: "string", example: "Barcelona" },
          },
        },
        commerce: {
          type: "object",
          required: ["cif", "name", "city"],
          properties: {
            cif: { type: "string", example: "B12345678" },
            name: { type: "string", example: "Comercio de Ejemplo" },
            city: { type: "string", example: "Madrid" },
          },
        },

        // Esquemas de páginas web
        createWebpage: {
          type: "object",
          required: ["cif", "city", "title", "summary"],
          properties: {
            cif: { type: "string", example: "B12345678" },
            city: { type: "string", example: "Madrid" },
            title: { type: "string", example: "Web del Comercio Ejemplo" },
            summary: { type: "string", example: "Resumen de la actividad del comercio" },
            texts: { type: "array", items: { type: "string" }, example: ["Texto 1", "Texto 2"] },
            images: { type: "array", items: { type: "string" }, example: ["imagen1.jpg", "imagen2.jpg"] },
            reviews: {
              type: "object",
              properties: {
                score: { type: "number", example: 4.5 },
                totalReviews: { type: "number", example: 10 },
                reviewText: { type: "string", example: "Muy buena experiencia" },
              },
            },
          },
        },
        updateWebpage: {
          type: "object",
          properties: {
            title: { type: "string", example: "Web Actualizada" },
            city: { type: "string", example: "Barcelona" },
            summary: { type: "string", example: "Resumen actualizado del comercio" },
            texts: { type: "array", items: { type: "string" }, example: ["Texto actualizado"] },
            images: { type: "array", items: { type: "string" }, example: ["imagen3.jpg"] },
          },
        },
        webpage: {
          type: "object",
          required: ["cif", "city", "title", "summary"],
          properties: {
            cif: { type: "string", example: "B12345678" },
            city: { type: "string", example: "Madrid" },
            title: { type: "string", example: "Web del Comercio Ejemplo" },
            summary: { type: "string", example: "Resumen de la actividad del comercio" },
            texts: { type: "array", items: { type: "string" }, example: ["Texto 1", "Texto 2"] },
            images: { type: "array", items: { type: "string" }, example: ["imagen1.jpg", "imagen2.jpg"] },
            reviews: {
              type: "object",
              properties: {
                score: { type: "number", example: 4.5 },
                totalReviews: { type: "number", example: 10 },
                reviewText: { type: "string", example: "Muy buena experiencia" },
              },
            },
          },
        },
      },
    },
  },
  apis: ["./routes/*.js"], // Ruta a las rutas de comercio y usuarios
};

module.exports = swaggerJsdoc(options);