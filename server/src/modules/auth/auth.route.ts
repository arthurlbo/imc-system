import { Router } from "express";

import { dataSource } from "@/typeorm/data-source";

import { authMiddleware } from "@/middlewares/auth.middleware";

import { User } from "@/modules/user/entity/user.entity";
import { UserService } from "@/modules/user/user.service";

import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UserTokens } from "./entity/user-tokens.entity";

const authRouter = Router();

const userRepository = dataSource.getRepository(User);
const userTokensRepository = dataSource.getRepository(UserTokens);

const userService = new UserService(userRepository);
const authService = new AuthService(userRepository, userTokensRepository, userService);

const authMiddlewareInstance = authMiddleware(authService);

const authController = new AuthController(authService);

authRouter.get("/me", authMiddlewareInstance, authController.me);
authRouter.post("/refresh", authMiddlewareInstance, authController.refreshAccessToken);

authRouter.post("/register", authController.register);
authRouter.post("/login", authController.login);
authRouter.post("/logout", authMiddlewareInstance, authController.logout);
authRouter.put("/:id", authMiddlewareInstance, authController.update);

export { authRouter };
