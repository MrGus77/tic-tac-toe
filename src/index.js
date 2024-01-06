import "dotenv/config";
import express from "express";
import modules from "./modules/index.js";
import routes from "./routes/routes.js";
import { GameController } from "./controllers/index.js";

const app = express();
const game = new GameController();

app.use(express.static("public"));

modules(app);
routes(app, game);
