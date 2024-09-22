import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string; // 이메일 중복 방지를 위해 unique 속성 추가

  @Column()
  password: string;

  @Column({ default: new Date() })
  createdAt: Date;
  favorites: any;
}
