import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert } from "typeorm";
import { UserRole } from "../interfaces/user.interface";

@Entity()
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    name: string;
    @Column({unique: true})
    email: string;
    @Column()
    password: string;

    @Column({ nullable: true })
    profileImage: string;

    @Column({ type: 'enum', enum: UserRole, default: UserRole.USER})
    role: UserRole;

    @BeforeInsert()
    emailToLowerCase() {
        this.email = this.email.toLowerCase()
    }

}