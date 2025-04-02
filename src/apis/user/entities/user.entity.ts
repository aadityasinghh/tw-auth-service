// // src/apis/user/entities/user.entity.ts
// import {
//   Entity,
//   Column,
//   PrimaryGeneratedColumn,
//   CreateDateColumn,
//   UpdateDateColumn,
// } from 'typeorm';
// import { Exclude } from 'class-transformer';

// export enum UserStatus {
//   ACTIVE = 'active',
//   INACTIVE = 'inactive',
//   SUSPENDED = 'suspended',
// }

// @Entity('users')
// export class User {
//   @PrimaryGeneratedColumn('uuid')
//   id: string;

//   @Column({ length: 100 })
//   firstName: string;

//   @Column({ length: 100 })
//   lastName: string;

//   @Column({ unique: true })
//   email: string;

//   @Column({ unique: true, length: 15 })
//   phone: string;

//   @Exclude()
//   @Column()
//   password: string;

//   @Column({
//     type: 'enum',
//     enum: UserRole,
//     default: UserRole.USER,
//   })
//   role: UserRole;

//   @Column({
//     type: 'enum',
//     enum: UserStatus,
//     default: UserStatus.ACTIVE,
//   })
//   status: UserStatus;

//   @Column({ nullable: true, length: 12 })
//   aadharNumber: string;

//   @Column({
//     type: 'enum',
//     enum: AadharVerificationStatus,
//     default: AadharVerificationStatus.PENDING,
//     nullable: true,
//   })
//   aadharVerificationStatus: AadharVerificationStatus;

//   @Column({ nullable: true })
//   profilePicture: string;

//   @CreateDateColumn()
//   createdAt: Date;

//   @UpdateDateColumn()
//   updatedAt: Date;

//   @Column({ nullable: true })
//   lastLogin: Date;

//   @Column({ default: false })
//   isEmailVerified: boolean;

//   @Column({ default: false })
//   isPhoneVerified: boolean;

//   @Column({ nullable: true })
//   refreshToken: string;
// }

import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum UserStatus {
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

  @Column({ unique: true, nullable: false })
  phone_number: string;

  @Column({ unique: true, nullable: true })
  aadhaar_number: string;

  @Column({ default: false })
  aadhaar_verified: boolean;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.ACTIVE,
    nullable: false,
  })
  status: UserStatus;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
