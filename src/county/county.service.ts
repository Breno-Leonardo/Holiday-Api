import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CountyEntity } from './entities/county.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CountyService {

    constructor(
        @InjectRepository(CountyEntity)
        private readonly countyRepository: Repository<CountyEntity>
      ) {}

      async isValidCounty(cod:number ) :Promise<boolean>{
        const county = await this.countyRepository.findOne({
          where: {
            cod: cod,
          }
        });
        if (!county) {
          return false;
        }
        return true;
      }

      async findCounty(cod:number ) :Promise<CountyEntity>{
        const county = await this.countyRepository.findOne({
          where: {
            cod: cod,
          }
        });
        
        return county;
      }
      
}
