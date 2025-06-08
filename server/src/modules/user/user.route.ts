import { Router } from "express";

import { dataSource } from "@/typeorm/data-source";

import { User } from "./entity/user.entity";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { AuthService } from "../auth/auth.service";
import { UserTokens } from "../auth/entity/user-tokens.entity";
import { authMiddleware } from "@/middlewares/auth.middleware";
import { profileMiddleware } from "@/middlewares/profile.middleware";
import { Profile } from "@/enums/profile.enum";

const userRouter = Router();

const userRepository = dataSource.getRepository(User);
const userTokensRepository = dataSource.getRepository(UserTokens);

const userService = new UserService(userRepository);
const authService = new AuthService(userRepository, userTokensRepository, userService);

const authMiddlewareInstance = authMiddleware(authService);

const userController = new UserController(userService);

userRouter.post("/", authMiddlewareInstance, profileMiddleware([Profile.Admin]), userController.createUser);
userRouter.delete("/:id", authMiddlewareInstance, profileMiddleware([Profile.Admin]), userController.deleteUser);

userRouter.get(
    "/",
    authMiddlewareInstance,
    profileMiddleware([Profile.Admin, Profile.Teacher]),
    userController.findAllUsers,
);

userRouter.get(
    "/:id",
    authMiddlewareInstance,
    profileMiddleware([Profile.Admin, Profile.Teacher]),
    userController.findOneUser,
);

userRouter.put(
    "/:id",
    authMiddlewareInstance,
    profileMiddleware([Profile.Admin, Profile.Teacher]),
    userController.updateUser,
);

export { userRouter };
