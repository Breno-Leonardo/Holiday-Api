import { Module } from '@nestjs/common';
import { HolidayController } from './holiday.controller';
import { HolidayService } from './holiday.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HolidayEntity } from './entities/holiday.entity';
import { StateModule } from '../state/state.module';
import { CountyModule } from '../county/county.module';

@Module({
  controllers: [HolidayController],
  providers: [HolidayService],
  imports: [TypeOrmModule.forFeature([HolidayEntity]), StateModule, CountyModule],

})
export class HolidayModule {}
