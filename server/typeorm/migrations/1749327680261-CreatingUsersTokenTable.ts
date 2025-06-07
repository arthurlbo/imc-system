import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreatingUserTokenTable1749327680261 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "users_token",
                columns: [
                    {
                        name: "id",
                        type: "varchar",
                        length: "36",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "uuid",
                    },
                    {
                        name: "refresh_token",
                        type: "varchar",
                        length: "255",
                        isNullable: false,
                    },
                    {
                        name: "user_id",
                        type: "varchar",
                        length: "36",
                        isNullable: false,
                    },
                    {
                        name: "expiration_date",
                        type: "datetime",
                        isNullable: false,
                    },
                    {
                        name: "created_at",
                        type: "datetime",
                        default: "CURRENT_TIMESTAMP",
                    },
                    {
                        name: "updated_at",
                        type: "datetime",
                        default: "CURRENT_TIMESTAMP",
                    },
                ],
            }),
        );

        await queryRunner.createForeignKey(
            "users_token",
            new TableForeignKey({
                columnNames: ["user_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "users",
                onDelete: "NO ACTION",
                onUpdate: "CASCADE",
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable("users_token");
        const foreignKey = table.foreignKeys.find((fk) => fk.columnNames.indexOf("user_id") !== -1);
        await queryRunner.dropForeignKey("users_token", foreignKey);

        await queryRunner.dropTable("users_token");
    }
}
