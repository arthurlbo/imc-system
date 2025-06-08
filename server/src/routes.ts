import { Router } from "express";

import { userRouter } from "./modules/user/user.route";
import { authRouter } from "./modules/auth/auth.route";
import { assessmentRouter } from "./modules/assessment/assessment.route";

const routes = Router();

routes.use("/user", userRouter);
routes.use("/auth", authRouter);
routes.use("/assessment", assessmentRouter);

export { routes };
