import { dataSource } from "../data-source";

import { BmiClassification } from "@/enums/bmi-classification";

async function assessmentsSeed() {
    const connection = await dataSource.initialize();

    await connection
        .createQueryBuilder()
        .insert()
        .into("bmi_assessments")
        .values([
            {
                height: 1.7,
                weight: 70,
                bmi: 24.2,
                classification: BmiClassification.Normal,
                evaluator: { id: "446bc200-1b78-47ba-880d-0c3b75b22071" },
                student: { id: "2d89e987-5995-42fd-a41e-3bf76d354d00" },
            },
        ])
        .execute();

    await connection.destroy();
    console.log("Seed concluída!");
}

assessmentsSeed().catch((error) => console.error(error));
