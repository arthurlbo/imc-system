import * as bcrypt from "bcrypt";

import { dataSource } from "../data-source";

async function seedUsers() {
    const connection = await dataSource.initialize();

    const hashedPassword = await bcrypt.hash("12345", bcrypt.genSaltSync());

    await connection
        .createQueryBuilder()
        .insert()
        .into("users")
        .values([
            {
                name: "Administrador",
                user: "admin",
                password: hashedPassword,
                profile: "admin",
                status: "active",
            },
            {
                name: "Professor",
                user: "teacher1",
                password: hashedPassword,
                profile: "teacher",
                status: "active",
            },
            {
                name: "Estudante",
                user: "student1",
                password: hashedPassword,
                profile: "student",
                status: "active",
            },
        ])
        .execute();

    await connection.destroy();
    console.log("Seed concluída!");
}

seedUsers().catch((error) => console.error(error));
