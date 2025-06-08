import { Router } from "express";

import { dataSource } from "@/typeorm/data-source";

import { Profile } from "@/enums/profile.enum";
import { authMiddleware } from "@/middlewares/auth.middleware";
import { profileMiddleware } from "@/middlewares/profile.middleware";

import { User } from "@/modules/user/entity/user.entity";
import { AuthService } from "@/modules/auth/auth.service";
import { UserService } from "@/modules/user/user.service";
import { UserTokens } from "@/modules/auth/entity/user-tokens.entity";

import { Assessment } from "./entity/assessment.entity";
import { AssessmentService } from "./assessment.service";
import { AssessmentController } from "./assessment.controller"; 

const assessmentRouter = Router();

const userRepository = dataSource.getRepository(User);
const userTokensRepository = dataSource.getRepository(UserTokens);
const assessmentRepository = dataSource.getRepository(Assessment);

const userService = new UserService(userRepository);
const authService = new AuthService(userRepository, userTokensRepository, userService);
const assessmentService = new AssessmentService(assessmentRepository);

const authMiddlewareInstance = authMiddleware(authService);

const assessmentController = new AssessmentController(assessmentService);

assessmentRouter.get("/", authMiddlewareInstance, assessmentController.findAllAssessment);
assessmentRouter.get("/:id", authMiddlewareInstance, assessmentController.findOneAssessment);

assessmentRouter.post(
    "/",
    authMiddlewareInstance,
    profileMiddleware([Profile.Admin, Profile.Teacher]),
    assessmentController.createAssessment,
);

assessmentRouter.put(
    "/:id",
    authMiddlewareInstance,
    profileMiddleware([Profile.Admin, Profile.Teacher]),
    assessmentController.updateAssessment,
);

assessmentRouter.delete(
    "/:id",
    authMiddlewareInstance,
    profileMiddleware([Profile.Admin]),
    assessmentController.deleteAssessment,
);

export { assessmentRouter };
