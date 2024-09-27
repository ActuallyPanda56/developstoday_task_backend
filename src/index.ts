import "reflect-metadata";
import * as moduleAlias from "module-alias";

import config from "./config/index";

import logger from "./logger";
import ws from "./web/index";
moduleAlias.addAliases({
  "@src": __dirname
});
const { swaggerDocs: V1SwaggerDocs } = require("./swagger");

require("dotenv").config();

const Server = async () => {
  try {
    await ws.listen(config.web.port, () => {
      V1SwaggerDocs(ws, config.web.port);
    });
    void Promise.resolve();
  } catch (e) {
    void Promise.reject(e);
  }
};

Server()
  .then(() => {
    logger.info(`Backend service initialized in ${performance.now()} ms`);
    logger.info(`Web server started in http://localhost:${config.web.port}/`);
    logger.info("Let's go!, go!, go!");
  })
  .catch((e) => {
    logger.error(e);
    process.exit(1);
  });
