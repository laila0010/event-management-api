import { Entity, PrimaryGeneratedColumn, OneToMany, Column } from 'typeorm';
import { Registration } from '../../registrations/entities/registration.entity';

export enum user_role {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password_hash: string;

  @Column({
    type: 'enum',
    enum: user_role,
    default: user_role.USER,
  })
  role: user_role;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

    @OneToMany(() => Registration, (registration) => registration.user)
  registrations: Registration[];
}