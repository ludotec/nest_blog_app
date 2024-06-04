import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, OneToMany } from "typeorm";
import { UserRole } from "../interfaces/user.interface";
import { BlogEntryEntity } from "src/blog/models/blog-entry.entity";

@Entity()
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    userName: string;
    @Column({unique: true})
    email: string;
    @Column()
    password: string;

    @Column({ nullable: true })
    profileImage: string;

    @Column({ type: 'enum', enum: UserRole, default: UserRole.USER})
    role: UserRole;

    @OneToMany(
        (type) => BlogEntryEntity,
        (blogEntryEntity) => blogEntryEntity.author,
    )
    blogEntries: BlogEntryEntity[];

    @BeforeInsert()
    emailToLowerCase() {
        this.email = this.email.toLowerCase()
    }

}