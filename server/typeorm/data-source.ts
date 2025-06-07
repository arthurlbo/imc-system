import { DataSource } from "typeorm";

export const dataSource = new DataSource({
    type: "sqlite",
    database: "typeorm/database.sqlite",
    migrations: ["typeorm/migrations/*.ts"],
    entities: ["src/modules/**/entity/*.entity.ts"],
});
