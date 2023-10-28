
import {
  Entity,
  Column,
  PrimaryColumn,
} from 'typeorm';

@Entity({ name: 'state' })
export class StateEntity {
  @PrimaryColumn({ name: 'cod' })
  cod: number;

  @Column({ name: 'uf', nullable: false })
  uf: string;

  @Column({ name: 'name', nullable: false })
  name: string;
}