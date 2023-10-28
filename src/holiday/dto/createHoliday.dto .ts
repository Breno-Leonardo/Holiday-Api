import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateHolidayDto {
  @ApiProperty({
    description: 'its holiday name',
    example: 'city creation holiday',
  })
  name: string;
}
