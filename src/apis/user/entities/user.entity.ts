// src/apis/user/entities/user.entity.ts
import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

export enum UserStatus {
    PENDING = 'pending',
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    BLOCKED = 'blocked',
}

export enum UserRole {
    USER = 'user',
    ADMIN = 'admin',
}

export enum AadharVerificationStatus {
    PENDING = 'pending',
    VERIFIED = 'verified',
    REJECTED = 'rejected',
}

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    user_id: string;

    @Column({ nullable: true })
    name: string;

    @Column({ unique: true, nullable: false })
    email: string;

    @Column({ nullable: false, select: false })
    password: string;

    @Column({ nullable: true })
    profile_picture_url: string;

    @Column({ unique: true, nullable: true })
    phone_number: string;

    @Column({ unique: true, nullable: true })
    aadhaar_number: string;

    @Column({ default: false })
    aadhaar_verified: boolean;

    @Column({ default: false })
    email_verified: boolean;

    @Column({
        type: 'enum',
        enum: UserStatus,
        default: UserStatus.PENDING,
        nullable: false,
    })
    status: UserStatus;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
