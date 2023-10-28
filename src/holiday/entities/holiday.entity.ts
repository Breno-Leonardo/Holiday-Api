
import {
  Entity,
  Column,
  PrimaryColumn,
  Unique,
} from 'typeorm';



@Entity({ name: 'holiday' })
export class HolidayEntity {
  @Unique('compound-key', ['date', 'location'])
  @PrimaryColumn({ name: 'date' })
  date: string;

  @PrimaryColumn({ name: 'location' })
  location: number;


  @Column({ name: 'name', nullable: false })
  name: string;

  
  
}
