import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
} from "typeorm";

import { BmiClassification } from "@/enums/bmi-classification";

import { User } from "@/modules/user/entity/user.entity";

@Entity({
    name: "bmi_assessments",
})
export class Assessment {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "decimal" })
    height: number;

    @Column({ type: "decimal" })
    weight: number;

    @Column({ type: "decimal" })
    bmi: number;

    @Column({
        type: "varchar",
        enum: BmiClassification,
    })
    classification: BmiClassification;

    @ManyToOne(() => User)
    @JoinColumn({ name: "evaluator_id" })
    evaluator: User;

    @ManyToOne(() => User)
    @JoinColumn({ name: "student_id" })
    student: User;

    @CreateDateColumn({ name: "created_at", type: "datetime" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at", type: "datetime" })
    updatedAt: Date;
}
