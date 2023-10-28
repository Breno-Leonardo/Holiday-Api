import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StateEntity } from './entities/state.entity';
import { Repository } from 'typeorm';

@Injectable()
export class StateService {

    constructor(
        @InjectRepository(StateEntity)
        private readonly stateRepository: Repository<StateEntity>
      ) {}

      async isValidState(cod:number ) :Promise<boolean>{
        const state = await this.stateRepository.findOne({
          where: {
            cod: cod,
          }
        });
        if (!state) {
          return false;
        }
        return true;
      }

      async findState(cod:number ) :Promise<StateEntity>{
        const state = await this.stateRepository.findOne({
          where: {
            cod: cod,
          }
        });
        
        return state;
      }
}
