import config from ".././config/index";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import morgan from "morgan";
import { Stream } from "stream"; // Import Stream from "stream"

import logger from "../logger";

import v1 from "./v1/router";

// Custom logger stream
class LoggerStream extends Stream.Writable {
  _write(chunk: any, encoding: string, callback: () => void) {
    logger.info(chunk.toString());
    callback();
  }
}

const ws = express();
ws.use(
  cors({
    origin: config.env.isProdEnv ? "*" : ["http://localhost:3000"],
    credentials: true
  })
);

// Use morgan with the custom logger stream
ws.use(morgan("dev", { stream: new LoggerStream() }));

ws.use(cookieParser(config.web.cookieSecret));

ws.use("/v1", v1);

// Rutas
ws.get("/", async (_, res) => {
  res.send("Hello world!");
});

export default ws;
