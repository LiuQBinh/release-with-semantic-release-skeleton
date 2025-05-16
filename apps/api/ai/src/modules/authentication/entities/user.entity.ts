import { Column, CreateDateColumn, Entity, ObjectIdColumn, ObjectId, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @ObjectIdColumn({
    name: '_id',
  })
  _id: ObjectId;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({ default: false })
  isEmailVerified: boolean;

  @Column({ nullable: true })
  emailVerificationToken: string | null;

  @Column({ nullable: true })
  passwordResetToken: string | null;

  @Column({ nullable: true, type: 'date' })
  passwordResetExpires: Date | null;

  @Column({ nullable: true })
  googleId: string | null;
  
  @Column({ nullable: true })
  firstName: string | null;
  
  @Column({ nullable: true })
  lastName: string | null;
  
  @Column({ nullable: true })
  profilePicture: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 