import {  IsString } from 'class-validator';
import { StateEntity } from '../../state/entities/state.entity';

export class StateHolidayDto {
  @IsString()
  date: string;

  @IsString()
  name: string;

  location: StateEntity
}