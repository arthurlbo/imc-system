import * as bcrypt from "bcrypt";
import { Not, Repository } from "typeorm";

import { Profile } from "@/enums/profile.enum";

import { User } from "./entity/user.entity";
import { CreateUserDTO } from "./dto/create-user.dto";
import { UpdateUserDTO } from "./dto/update-user.dto";

export class UserService {
    constructor(private readonly usersRepository: Repository<User>) {}

    private getIsAdmin(loggedUser: User): boolean {
        return loggedUser.profile === Profile.Admin;
    }

    public async findAllUsers(loggedUser: User): Promise<User[]> {
        const isAdmin = this.getIsAdmin(loggedUser);

        return this.usersRepository.find({
            where: isAdmin ? {} : { profile: Not(Profile.Admin) },
        });
    }

    public async findOneUser(id: string, loggedUser: User): Promise<User | null> {
        const isAdmin = this.getIsAdmin(loggedUser);

        return this.usersRepository.findOneBy({ id, profile: isAdmin ? undefined : Not(Profile.Admin) });
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
        const isAdmin = this.getIsAdmin(loggedUser);

        const userToUpdate = await this.usersRepository.findOneBy({
            id,
            profile: isAdmin ? undefined : Not(Profile.Admin),
        });

        if (!userToUpdate) {
            throw new Error(`User with id ${id} not found or you do not have permission to update this user.`);
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
