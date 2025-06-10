import * as bcrypt from "bcrypt";

import { dataSource } from "../data-source";

import { Profile } from "@/enums/profile.enum";

async function usersSeed() {
    const connection = await dataSource.initialize();

    const hashedPassword = await bcrypt.hash("12345", bcrypt.genSaltSync());

    await connection
        .createQueryBuilder()
        .insert()
        .into("users")
        .values([
            {
                id: "29d07e8e-285c-422c-b1e7-39d32685b72c",
                name: "Administrador",
                user: Profile.Admin,
                password: hashedPassword,
                profile: Profile.Admin,
                status: "active",
            },
            {
                id: "446bc200-1b78-47ba-880d-0c3b75b22071",
                name: "Professor",
                user: Profile.Teacher,
                password: hashedPassword,
                profile: Profile.Teacher,
                status: "active",
            },
            {
                id: "2d89e987-5995-42fd-a41e-3bf76d354d00",
                name: "Aluno",
                user: Profile.Student,
                password: hashedPassword,
                profile: Profile.Student,
                status: "active",
            },
            {
                name: "Aluno 2",
                user: "student2",
                password: hashedPassword,
                profile: Profile.Student,
                status: "active",
            },
        ])
        .execute();

    await connection.destroy();
    console.log("Seed concluída!");
}

usersSeed().catch((error) => console.error(error));
