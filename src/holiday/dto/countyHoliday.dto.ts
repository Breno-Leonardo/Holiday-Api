import {  IsString } from 'class-validator';
import { CountyEntity } from '../../county/entities/county.entity';

export class CountyHolidayDto {
  @IsString()
  date: string;

  @IsString()
  name: string;

  location: CountyEntity
}