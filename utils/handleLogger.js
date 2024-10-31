const { IncomingWebhook } = require("@slack/webhook"); // Importa la clase IncomingWebhook del paquete @slack/webhook

// Función que crea un logger para enviar mensajes a un webhook de Slack
const loggerStream = (url) => {
  const webHook = new IncomingWebhook(url); // Crea una instancia de IncomingWebhook usando la URL proporcionada

  return {
    // Método que envía un mensaje al canal de Slack
    write: (message) => {
      webHook.send({
        text: message, // El mensaje se envía como texto
      });
    },
  };
};

// Exporta la función loggerStream para su uso en otras partes de la aplicación
module.exports = loggerStream;