import { Test, TestingModule } from '@nestjs/testing';
import { HolidayService } from '../holiday.service';
import { HolidayEntity } from '../entities/holiday.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { StateService } from '../../state/state.service';
import { CountyService } from '../../county/county.service';
import { StateEntity } from '../../state/entities/state.entity';
import { CountyEntity } from '../../county/entities/county.entity';
import { HttpException, HttpStatus, NotFoundException } from '@nestjs/common';

describe('HolidayService', () => {
  let service: HolidayService;
  let holidayRepository: Repository<HolidayEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HolidayService,
        StateService,
        CountyService,
        {
          provide: getRepositoryToken(HolidayEntity),
          useValue: {
            findOne: jest.fn().mockResolvedValue({}),
          },
        },
        {
          provide: getRepositoryToken(StateEntity),
          useValue: {
            findOne: jest.fn().mockResolvedValue({}),
          },
        },
        {
          provide: getRepositoryToken(CountyEntity),
          useValue: {
            findOne: jest.fn().mockResolvedValue({}),
          },
        },
      ],
    }).compile();

    service = module.get<HolidayService>(HolidayService);
    holidayRepository = module.get<Repository<HolidayEntity>>(
      getRepositoryToken(HolidayEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(holidayRepository).toBeDefined();
  });

  it('should be only numbers', () => {
    expect(service.onlyNumbers('1b')).toEqual('1');
  });

  it('pascoa 2020 should be 2023-04-12', () => {
    expect(service.getPascoa(2020)).toEqual('2020-04-12');
  });

  it(' should be correct format date with zeros', () => {
    let dateTest = new Date('2020-4-3');
    expect(service.formatDateWithZeros(dateTest)).toEqual('2020-04-03');
  });

  it(' should be correct location code state', async () => {
    expect(await service.validateLocationCode('11')).toEqual(true);
  });
  it(' should be correct location code county', async () => {
    expect(await service.validateLocationCode('1100015')).toEqual(true);
  });

  it('should be incorrect location code, 3 numbers ', async () => {
    try {
      await service.validateLocationCode('144');
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.message).toEqual('The code is incorrect');
      expect(error.status).toEqual(400);
    }
  });

  it('should be correct date in get ', async () => {
    expect(await service.validateDateGet('2020-01-11')).toEqual(true);
  });

  it('should be incorrect date in get, with 11 chars ', async () => {
    try {
      await service.validateDateGet('2020-01-011');
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.message).toEqual('Incorrect Date');
      expect(error.status).toEqual(400);
    }
  });

  it('should be incorrect date in get, with more "-" ', async () => {
    try {
      await service.validateDateGet('2020-01--1');
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.message).toEqual('Incorrect Date');
      expect(error.status).toEqual(400);
    }
  });

  it('should be incorrect date in get, day > 31 in mounth with 31 days', async () => {
    try {
      await service.validateDateGet('2020-10-32');
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.message).toEqual('Incorrect day');
      expect(error.status).toEqual(400);
    }
  });

  it('should be incorrect date in get, day > 30 in mounth with 30 days', async () => {
    try {
      await service.validateDateGet('2020-09-30');
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.message).toEqual('Incorrect day');
      expect(error.status).toEqual(400);
    }
  });

  it('should be incorrect date in get, day > 29 in april with 29 days', async () => {
    try {
      await service.validateDateGet('2020-09-30');
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.message).toEqual('Incorrect day');
      expect(error.status).toEqual(400);
    }
  });

  it('should be incorrect date in get, day > 28 in april with 28 days', async () => {
    try {
      await service.validateDateGet('2021-09-29');
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.message).toEqual('Incorrect day');
      expect(error.status).toEqual(400);
    }
  });

  it('should be incorrect date in get, day < 1 ', async () => {
    try {
      await service.validateDateGet('2021-09-00');
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.message).toEqual('Incorrect day');
      expect(error.status).toEqual(400);
    }
  });

  it('should be incorrect date in get, mounth < 1 ', async () => {
    try {
      await service.validateDateGet('2021-00-01');
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.message).toEqual('Incorrect mounth');
      expect(error.status).toEqual(400);
    }
  });

  it('should be incorrect date in get, mounth > 12 ', async () => {
    try {
      await service.validateDateGet('2021-14-01');
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.message).toEqual('Incorrect mounth');
      expect(error.status).toEqual(400);
    }
  });

  it('should be incorrect date in put or delete, date with year ', async () => {
    try {
      await service.validateDatePutAndDelete('2021-00-01');
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.message).toEqual('Bad Request');
      expect(error.status).toEqual(400);
    }
  });

  it('should be incorrect date in put or delete, name its not mobile holiday ', async () => {
    try {
      await service.validateDatePutAndDelete('Teste');
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.message).toEqual('Bad Request');
      expect(error.status).toEqual(400);
    }
  });

  ////////////

  it('should be correct date in put or delete ', async () => {
    expect(await service.validateDatePutAndDelete('01-11')).toEqual(true);
  });

  it('should be incorrect date in put or delete, with 6 chars ', async () => {
    try {
      await service.validateDatePutAndDelete('01-011');
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.message).toEqual('Bad Request');
      expect(error.status).toEqual(400);
    }
  });

  it('should be incorrect date in put or delete, with more "-" ', async () => {
    try {
      await service.validateDatePutAndDelete('01--1');
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.message).toEqual('Bad Request');
      expect(error.status).toEqual(400);
    }
  });

  it('should be incorrect date in put or delete, day > 31 in mounth with 31 days', async () => {
    try {
      await service.validateDatePutAndDelete('10-32');
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.message).toEqual('Incorrect day');
      expect(error.status).toEqual(400);
    }
  });

  it('should be incorrect date in put or delete, day > 30 in mounth with 30 days', async () => {
    try {
      await service.validateDatePutAndDelete('09-30');
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.message).toEqual('Incorrect day');
      expect(error.status).toEqual(400);
    }
  });

  it('should be incorrect date in put or delete, day > 29 in april with 29 days', async () => {
    try {
      await service.validateDatePutAndDelete('09-30');
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.message).toEqual('Incorrect day');
      expect(error.status).toEqual(400);
    }
  });

  it('should be incorrect date in put or delete, day > 28 in april with 28 days', async () => {
    try {
      await service.validateDatePutAndDelete('09-29');
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.message).toEqual('Incorrect day');
      expect(error.status).toEqual(400);
    }
  });

  it('should be incorrect date in put or delete, day < 1 ', async () => {
    try {
      await service.validateDatePutAndDelete('09-00');
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.message).toEqual('Incorrect day');
      expect(error.status).toEqual(400);
    }
  });

  it('should be incorrect date in put or delete, mounth < 1 ', async () => {
    try {
      await service.validateDatePutAndDelete('00-01');
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.message).toEqual('Incorrect mounth');
      expect(error.status).toEqual(400);
    }
  });

  it('should be incorrect date in put or delete, mounth > 12 ', async () => {
    try {
      await service.validateDatePutAndDelete('14-01');
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.message).toEqual('Incorrect mounth');
      expect(error.status).toEqual(400);
    }
  });
});
