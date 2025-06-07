import { Router } from "express";

const routes = Router();

routes.use("/", () => "Hello World! 🌍");

export { routes };
