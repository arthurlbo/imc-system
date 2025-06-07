import { DataSource } from "typeorm";

const dataSource = new DataSource({
    type: "sqlite",
    database: "./data/database.sqlite",
    migrations: ["typeorm/migrations/*.ts"],
});

export default dataSource;
