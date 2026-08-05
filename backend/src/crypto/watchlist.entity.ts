import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity('watchlists')
@Unique('UQ_watchlist_user_coin', ['userId', 'coinId'])
export class Watchlist {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column({ length: 100 })
  coinId: string;

  @CreateDateColumn()
  createdAt: Date;
}