
import { StateEntity } from '../../state/entities/state.entity';
import {
  Entity,
  Column,
  ManyToOne,
  PrimaryColumn,
  JoinColumn,
} from 'typeorm';

@Entity({ name: 'county' })
export class CountyEntity {
  @PrimaryColumn({ name: 'cod' })
  cod: number;

  @ManyToOne(
    () => StateEntity,
    (state) => state.cod,
    {
      nullable: false,
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({
    name: 'state',
    referencedColumnName: 'cod',
  })
  @Column({ name: 'state', nullable: false })
  state: StateEntity;

  @Column({ name: 'name', nullable: false })
  name: string;
}