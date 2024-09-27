import logger from "./logger";
import { components } from "./constants/components";
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const path = require("path");

// Obtén la ruta completa del directorio de rutas
const routesPath = path.join(__dirname, "web", "modules");

// Patrón de búsqueda de archivos para seleccionar automáticamente los archivos de rutas
const routesPattern = path.join(routesPath, "**/*.{ts,js}");

// Basic Meta Informations about our API
const options = {
  definition: {
    openapi: "3.0.0",
    info: { title: "Crossfit WOD API", version: "1.0.0" },
    components
  },
  apis: [routesPattern]
};

// Docs in JSON format
const swaggerSpec = swaggerJSDoc(options);

// Function to setup our docs
const swaggerDocs = (app: any, port: any) => {
  // Route-Handler to visit our docs
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  // Make our docs in JSON format available
  app.get("/docs.json", (req: any, res: any) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });
  logger.info(`Version 1 Docs are available on http://localhost:${port}/docs`);
};

module.exports = { swaggerDocs };
