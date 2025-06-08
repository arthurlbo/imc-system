import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreatingAssessmentTable1749392631573 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "bmi_assessments",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                        isNullable: false,
                    },
                    {
                        name: "height",
                        type: "decimal",
                        isNullable: false,
                    },
                    {
                        name: "weight",
                        type: "decimal",
                        isNullable: false,
                    },
                    {
                        name: "bmi",
                        type: "decimal",
                        isNullable: false,
                    },
                    {
                        name: "classification",
                        type: "varchar",
                        length: "30",
                        isNullable: false,
                    },
                    {
                        name: "evaluator_id",
                        type: "uuid",
                        isNullable: false,
                    },
                    {
                        name: "student_id",
                        type: "uuid",
                        isNullable: false,
                    },
                    {
                        name: "created_at",
                        type: "datetime",
                        default: "CURRENT_TIMESTAMP",
                        isNullable: false,
                    },
                    {
                        name: "updated_at",
                        type: "datetime",
                        default: "CURRENT_TIMESTAMP",
                        isNullable: false,
                    },
                ],
            }),
        );

        await queryRunner.createForeignKey(
            "bmi_assessments",
            new TableForeignKey({
                columnNames: ["evaluator_id"],
                referencedTableName: "users",
                referencedColumnNames: ["id"],
                onUpdate: "CASCADE",
                onDelete: "NO ACTION",
            }),
        );

        await queryRunner.createForeignKey(
            "bmi_assessments",
            new TableForeignKey({
                columnNames: ["student_id"],
                referencedTableName: "users",
                referencedColumnNames: ["id"],
                onUpdate: "CASCADE",
                onDelete: "NO ACTION",
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable("bmi_assessments");

        if (table) {
            const evaluatorFK = table.foreignKeys.find((fk) => fk.columnNames.includes("evaluator_id"));
            const studentFK = table.foreignKeys.find((fk) => fk.columnNames.includes("student_id"));
            if (evaluatorFK) await queryRunner.dropForeignKey("bmi_assessments", evaluatorFK);
            if (studentFK) await queryRunner.dropForeignKey("bmi_assessments", studentFK);
        }

        await queryRunner.dropTable("bmi_assessments");
    }
}
