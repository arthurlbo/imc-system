import * as bcrypt from "bcrypt";
import { Repository } from "typeorm";

import { Profile } from "@/enums/profile.enum";
import { ForbiddenException } from "@/commons/http-exception";

import { User } from "./entity/user.entity";
import { CreateUserDTO } from "./dto/create-user.dto";
import { UpdateUserDTO } from "./dto/update-user.dto";

export class UserService {
    constructor(private readonly usersRepository: Repository<User>) {}

    private findAllMyStudents(loggedUser: User): Promise<User[]> {
        return this.usersRepository
            .createQueryBuilder("user")
            .innerJoin("user.receivedAssessments", "assessment", "assessment.evaluator_id = :teacherId", {
                teacherId: loggedUser.id,
            })
            .leftJoinAndSelect("user.appliedAssessments", "appliedAssessments")
            .leftJoinAndSelect("user.receivedAssessments", "receivedAssessments")
            .getMany();
    }

    public async findAllUsers(loggedUser: User): Promise<User[]> {
        if (loggedUser.profile === Profile.Teacher) {
            return this.findAllMyStudents(loggedUser);
        }

        return this.usersRepository.find({
            relations: ["appliedAssessments", "receivedAssessments"],
        });
    }

    private findMyStudent(id: string, loggedUser: User): Promise<User | null> {
        return this.usersRepository
            .createQueryBuilder("user")
            .innerJoin("user.receivedAssessments", "assessment", "assessment.evaluator_id = :teacherId", {
                teacherId: loggedUser.id,
            })
            .where("user.id = :id", { id })
            .leftJoinAndSelect("user.appliedAssessments", "appliedAssessments")
            .leftJoinAndSelect("user.receivedAssessments", "receivedAssessments")
            .getOne();
    }

    public async findOneUser(id: string, loggedUser: User): Promise<User | null> {
        if (loggedUser.profile === Profile.Teacher) {
            return this.findMyStudent(id, loggedUser);
        }

        return this.usersRepository.findOne({
            where: { id },
            relations: ["appliedAssessments", "receivedAssessments"],
        });
    }

    public async createUser({ password, ...rest }: CreateUserDTO): Promise<User> {
        const hashedPassword = await bcrypt.hash(password, bcrypt.genSaltSync());

        const user = this.usersRepository.create({
            ...rest,
            password: hashedPassword,
        });

        return this.usersRepository.save(user);
    }

    public async updateUser(id: string, { password, ...rest }: UpdateUserDTO, loggedUser: User): Promise<User> {
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
    }

    public async deleteUser(id: string): Promise<void> {
        await this.usersRepository.delete(id);
    }
}
