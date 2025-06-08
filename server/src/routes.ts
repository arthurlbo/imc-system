import { Router } from "express";

import { userRouter } from "./modules/user/user.route";
import { authRouter } from "./modules/auth/auth.route";

const routes = Router();

routes.use("/user", userRouter);
routes.use("/auth", authRouter);

export { routes };
