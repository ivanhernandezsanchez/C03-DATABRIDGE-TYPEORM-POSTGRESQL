// restaurante.entity.ts
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('restaurantes')
export class Restaurante {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  tipo: string;

  @Column()
  ciudad: string;

  @Column({ default: 0 })
  precio: number;

  @Column('decimal', { precision: 3, scale: 1 })
  puntuacion: number;}