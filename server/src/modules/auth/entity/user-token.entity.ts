import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";

import { User } from "@/modules/user/entity/user.entity";

@Entity({
    name: "users_token",
})
export class UserToken {
    @PrimaryGeneratedColumn("uuid")
    id?: string;

    @Column({ type: "varchar", length: 255, name: "refresh_token" })
    refreshToken: string;

    @Column({ type: "uuid", name: "user_id" })
    userId: string;

    @ManyToOne(() => User, { onUpdate: "CASCADE", onDelete: "NO ACTION" })
    @JoinColumn({ name: "user_id" })
    user: User;

    @Column({ name: "expiration_date", type: "datetime" })
    expirationDate: Date;

    @CreateDateColumn({ name: "created_at", type: "datetime" })
    createdAt?: Date;
}
