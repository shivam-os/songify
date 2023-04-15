const swaggerUi = require("swagger-ui-express");
const yamljs = require("yamljs")
const swaggerJsDoc = yamljs.load("./docs/apiDocs.yaml")

module.exports = {
  swaggerServe: swaggerUi.serve,
  swaggerSetup: swaggerUi.setup(swaggerJsDoc),
};
