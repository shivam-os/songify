const swaggerUi = require("swagger-ui-express");
const yamljs = require("yamljs");
const path = require("path");
const file = path.join(process.cwd(), "docs", "apiDocs.yaml");
const swaggerJsDoc = yamljs.load(file);

module.exports = {
  swaggerServe: swaggerUi.serve,
  swaggerSetup: swaggerUi.setup(swaggerJsDoc),
};
