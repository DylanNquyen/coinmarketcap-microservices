import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('watchlists')
export class Watchlist {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number; // ID của user sở hữu (lấy từ Token)

  @Column()
  coinId: string; // Ví dụ: 'bitcoin', 'ethereum'

  @CreateDateColumn()
  createdAt: Date;
}