import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API de gestion des recettes inspirées des films et séries",
      version: "1.0.0",
      description:
        "Une API pour gérer des recettes, des utilisateurs, des scores, des commentaires et des catégories.",
    },
    servers: [
      {
        url: "http://localhost:5000/api",
      },
    ],
  },
  // Indiquer l'emplacement de nos fichiers de routes ou de contrôleurs
  apis: ["./src/routes/*.js"], // Chemin vers les fichiers où l'on a annoté nos routes
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);

const setupSwagger = (app) => {
  // Définir la route pour accéder à la documentation Swagger
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};

export default setupSwagger;
