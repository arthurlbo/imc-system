import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";

import { Status } from "@/enums/status.enum";
import { Profile } from "@/enums/profile.enum";

import { UserTokens } from "@/modules/auth/entity/user-tokens.entity";
import { Assessment } from "@/modules/assessment/entity/assessment.entity";

@Entity({
    name: "users",
})
export class User {
    @PrimaryGeneratedColumn("uuid")
    id?: string;

    @Column({ type: "varchar", length: 60 })
    name: string;

    @Column({ type: "varchar", length: 60, unique: true })
    user: string;

    @Column({ type: "varchar", length: 255 })
    password: string;

    @Column({
        type: "varchar",
        enum: Profile,
        default: Profile.Student,
    })
    profile: Profile;

    @Column({
        type: "varchar",
        enum: Status,
        default: Status.Active,
    })
    status: Status;

    @CreateDateColumn({ name: "created_at", type: "datetime" })
    createdAt?: Date;

    @UpdateDateColumn({ name: "updated_at", type: "datetime" })
    updatedAt?: Date;

    @OneToMany(() => UserTokens, (token) => token.user)
    tokens?: UserTokens[];

    @OneToMany(() => Assessment, (assessment) => assessment.evaluator)
    appliedAssessments?: Assessment[];

    @OneToMany(() => Assessment, (assessment) => assessment.student)
    receivedAssessments?: Assessment[];
}
