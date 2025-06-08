import * as bcrypt from "bcrypt";
import { Repository } from "typeorm";

import { Profile } from "@/enums/profile.enum";
import { ForbiddenException } from "@/commons/http-exception";
import { convertDateToTz } from "@/commons/convert-date-to-tz";

import { User } from "./entity/user.entity";
import { CreateUser } from "./schemas/create-user.schema";
import { UpdateUser } from "./schemas/update-user.schema";
import { AppliedAssessment, ReceivedAssessment, UserReturn } from "./types";

export class UserService {
    constructor(private readonly usersRepository: Repository<User>) {}

    public formatUserToReturn = (user: User): UserReturn => {
        const { appliedAssessments = [], receivedAssessments = [] } = user;

        const formattedAppliedAssessments: AppliedAssessment[] = appliedAssessments.map((assessment) => ({
            id: assessment.id,
            weight: assessment.weight,
            height: assessment.height,
            bmi: assessment.bmi,
            classification: assessment.classification,
            createdAt: convertDateToTz(assessment.createdAt),
            updatedAt: convertDateToTz(assessment.updatedAt),
            student: {
                id: assessment.student.id,
                name: assessment.student.name,
                profile: assessment.student.profile,
            },
        }));

        const formattedReceivedAssessments: ReceivedAssessment[] = receivedAssessments.map((assessment) => ({
            id: assessment.id,
            weight: assessment.weight,
            height: assessment.height,
            bmi: assessment.bmi,
            classification: assessment.classification,
            createdAt: convertDateToTz(assessment.createdAt),
            updatedAt: convertDateToTz(assessment.updatedAt),
            evaluator: {
                id: assessment.evaluator.id,
                name: assessment.evaluator.name,
                profile: assessment.evaluator.profile,
            },
        }));

        return {
            id: user.id,
            name: user.name,
            user: user.user,
            profile: user.profile,
            status: user.status,
            createdAt: convertDateToTz(user.createdAt),
            updatedAt: convertDateToTz(user.updatedAt),
            appliedAssessments: formattedAppliedAssessments,
            receivedAssessments: formattedReceivedAssessments,
        };
    };

    private findAllMyStudents = (loggedUser: User): Promise<User[]> => {
        return this.usersRepository
            .createQueryBuilder("user")
            .innerJoin("user.receivedAssessments", "assessment", "assessment.evaluator_id = :teacherId", {
                teacherId: loggedUser.id,
            })
            .leftJoinAndSelect("user.appliedAssessments", "appliedAssessments")
            .leftJoinAndSelect("user.receivedAssessments", "receivedAssessments")
            .getMany();
    };

    public findAllUsers = async (loggedUser: User): Promise<UserReturn[]> => {
        if (loggedUser.profile === Profile.Teacher) {
            const students = await this.findAllMyStudents(loggedUser);

            const formattedStudents = students.map(this.formatUserToReturn);

            return formattedStudents;
        }

        const users = await this.usersRepository.find({
            relations: [
                "appliedAssessments",
                "receivedAssessments",
                "receivedAssessments.evaluator",
                "appliedAssessments.student",
            ],
        });

        const formattedUsers = users.map(this.formatUserToReturn);

        return formattedUsers;
    };

    private findMyStudent = (id: string, loggedUser: User): Promise<User | null> => {
        return this.usersRepository
            .createQueryBuilder("user")
            .innerJoin("user.receivedAssessments", "assessment", "assessment.evaluator_id = :teacherId", {
                teacherId: loggedUser.id,
            })
            .where("user.id = :id", { id })
            .leftJoinAndSelect("user.appliedAssessments", "appliedAssessments")
            .leftJoinAndSelect("user.receivedAssessments", "receivedAssessments")
            .getOne();
    };

    public findOneUser = async (id: string, loggedUser: User): Promise<UserReturn | null> => {
        if (loggedUser.profile === Profile.Teacher) {
            const student = await this.findMyStudent(id, loggedUser);

            return this.formatUserToReturn(student);
        }

        const user = await this.usersRepository.findOne({
            where: { id },
            relations: ["appliedAssessments", "receivedAssessments"],
        });

        return this.formatUserToReturn(user);
    };

    public createUser = async ({ password, ...rest }: CreateUser): Promise<UserReturn> => {
        const hashedPassword = await bcrypt.hash(password, bcrypt.genSaltSync());

        const user = this.usersRepository.create({
            ...rest,
            password: hashedPassword,
        });

        const createdUser = await this.usersRepository.save(user);

        return this.formatUserToReturn(createdUser);
    };

    public updateUser = async (
        id: string,
        { password, ...rest }: UpdateUser,
        loggedUser: User,
    ): Promise<UserReturn> => {
        const userToUpdate = await this.findOneUser(id, loggedUser);

        if (!userToUpdate) {
            throw new ForbiddenException(
                `User with id ${id} not found or you do not have permission to update this user.`,
            );
        }

        const hashedPassword = await bcrypt.hash(password, bcrypt.genSaltSync());

        await this.usersRepository.update(id, {
            ...rest,
            password: hashedPassword,
        });

        return this.findOneUser(id, loggedUser);
    };

    public deleteUser = async (id: string): Promise<void> => {
        await this.usersRepository.delete(id);
    };
}
