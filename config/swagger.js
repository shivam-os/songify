const swaggerUi = require("swagger-ui-express");
const yamljs = require("yamljs");
const path = require("path");
const file = path.join(process.cwd(), "docs", "apiDocs.yaml");
const swaggerJsDoc = yamljs.load(file);

//CSS CDN for vercel
const CSS_URL =
  "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.18.3/swagger-ui.min.css";

module.exports = {
  swaggerServe: swaggerUi.serve,
  swaggerSetup: swaggerUi.setup(swaggerJsDoc, { customCSSUrl: CSS_URL }),
};
