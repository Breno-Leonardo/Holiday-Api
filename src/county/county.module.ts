import { Module } from '@nestjs/common';
import { CountyService } from './county.service';
import { CountyController } from './county.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CountyEntity } from './entities/county.entity';

@Module({
  providers: [CountyService],
  controllers: [CountyController],
  imports: [TypeOrmModule.forFeature([CountyEntity])],
  exports: [CountyService],
})
export class CountyModule {}
