import {  IsString } from 'class-validator';

export class NationalHolidayDto {
  @IsString()
  date: string;

  @IsString()
  name: string;

  @IsString()
  location: string;

}