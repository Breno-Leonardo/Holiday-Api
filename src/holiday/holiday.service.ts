import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { HolidayEntity } from './entities/holiday.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { StateService } from '../state/state.service';
import { CountyService } from '../county/county.service';
import { StateHolidayDto } from './dto/stateHoliday.dto';
import { NationalHolidayDto } from './dto/nationalHoliday.dto copy';
import { CountyHolidayDto } from './dto/countyHoliday.dto';

@Injectable()
export class HolidayService {
  constructor(
    @InjectRepository(HolidayEntity)
    private readonly holidayRepository: Repository<HolidayEntity>,
    private readonly stateService: StateService,
    private readonly countyService: CountyService,
  ) {}

  async getHoliday(
    locationCode,
    date,
  ): Promise<NationalHolidayDto | StateHolidayDto | CountyHolidayDto> {
    await this.validateLocationCode(locationCode);
    await this.validateDateGet(date);

    let place;
    if(locationCode.length==2){
      place= await this.stateService.findState(locationCode);
    }
    if(locationCode.length==7){
       await this.countyService.findCounty(locationCode).then(async (county) => {
        county.state= await this.stateService.findState(locationCode.substring(0,2))
        place=county;

       });
    }
    const year = date.substring(0, 4);
    const originalDate = date;
    date = date.substring(5); // get mounth and day

    let holiday: HolidayEntity = null;
    // search in national holiday first
    holiday = await this.holidayRepository.findOne({
      where: {
        date: date,
        location: 0,
      },
    });
    if (holiday) {
      return {
        date: holiday.date,
        name: holiday.name,
        location: 'National',
      };
    }

    if (locationCode.length == 7) {
      // county holiday
      holiday = await this.holidayRepository.findOne({
        where: {
          date: date,
          location: locationCode,
        },
      });
      if (holiday) {
        let county;

        await this.countyService.findCounty(locationCode).then((result) => {
          county = result;
        });
        return {
          date: date,
          name: holiday.name,
          location: {
            cod: county.cod,
            name: county.name,
            state: await this.stateService.findState(county.state),
          },
        };
      } else {
        // check if there is a state holiday for the municipality
        const stateCod = locationCode.substring(0, 2);
        holiday = await this.holidayRepository.findOne({
          where: {
            date: date,
            location: stateCod,
          },
        });
        if (holiday) {
          return {
            date: date,
            name: holiday.name,
            location: await this.stateService.findState(stateCod),
          };
        }
      }
    } else if (locationCode.length == 2) {
      //locationCode = parseInt(locationCode);
      //state holiday
      holiday = await this.holidayRepository.findOne({
        where: {
          date: date,
          location: locationCode,
        },
      });

      if (holiday) {
        return {
          date: date,
          name: holiday.name,
          location: await this.stateService.findState(locationCode),
        };
      }
    }

    //mobile holidays in couty
    let pascoa = this.getPascoa(year);
    if (
      await this.holidayRepository.findOne({
        where: {
          date: 'carnaval',
          location: locationCode,
        },
      })
    ) {
      const dateAux = new Date(pascoa);
      dateAux.setDate(dateAux.getDate() - 47);
      const dateCarnaval = this.formatDateWithZeros(dateAux);
      if (originalDate == dateCarnaval)
        return {
          date: originalDate,
          name: 'Carnaval',
          location: place,
        };
    }

    if (
      await this.holidayRepository.findOne({
        where: {
          date: 'páscoa',
          location: locationCode,
        },
      })
    ) {
      const dateAux = new Date(pascoa);
      const datePascoa = this.formatDateWithZeros(dateAux);
      if (originalDate == datePascoa)
        return {
          date: originalDate,
          name: 'Páscoa',
          location: place,
        };
    }
    if (
      await this.holidayRepository.findOne({
        where: {
          date: 'corpus-christi',
          location: locationCode,
        },
      })
    ) {
      const dateAux = new Date(pascoa);
      dateAux.setDate(dateAux.getDate() + 60);
      const dateCorpusChristi = this.formatDateWithZeros(dateAux);
      if (originalDate == dateCorpusChristi)
        return {
          date: originalDate,
          name: 'Corpus Christi',
          location: place,
        };
    }
    if (
      await this.holidayRepository.findOne({
        where: {
          date: 'sexta-feira-santa',
          location: 0,
        },
      })
    ) {
      const dateAux = new Date(pascoa);
      dateAux.setDate(dateAux.getDate() - 2);
      const dateSextaSanta = this.formatDateWithZeros(dateAux);
      if (originalDate == dateSextaSanta)
        return {
          date: originalDate,
          name: 'Sexta-Feira Santa',
          location: "National",
        };
    }
    if(locationCode.length==7){
      // check if is holiday in state
      const stateCod=locationCode.substring(0, 2);
      if (
        await this.holidayRepository.findOne({
          where: {
            date: 'carnaval',
            location: stateCod,
          },
        })
      ) {
        const dateAux = new Date(pascoa);
        dateAux.setDate(dateAux.getDate() - 47);
        const dateCarnaval = this.formatDateWithZeros(dateAux);
        if (originalDate == dateCarnaval)
          return {
            date: originalDate,
            name: 'Carnaval',
            location: await this.stateService.findState(stateCod),
          };
      }
  
      if (
        await this.holidayRepository.findOne({
          where: {
            date: 'páscoa',
            location: stateCod,
          },
        })
      ) {
        const dateAux = new Date(pascoa);
        const datePascoa = this.formatDateWithZeros(dateAux);
        if (originalDate == datePascoa)
          return {
            date: originalDate,
            name: 'Páscoa',
            location: await this.stateService.findState(stateCod),
          };
      }
      if (
        await this.holidayRepository.findOne({
          where: {
            date: 'corpus-christi',
            location: stateCod,
          },
        })
      ) {
        const dateAux = new Date(pascoa);
        dateAux.setDate(dateAux.getDate() + 60);
        const dateCorpusChristi = this.formatDateWithZeros(dateAux);
        if (originalDate == dateCorpusChristi)
          return {
            date: originalDate,
            name: 'Corpus Christi',
            location: await this.stateService.findState(stateCod),
          };
      }
      if (
        await this.holidayRepository.findOne({
          where: {
            date: 'sexta-feira-santa',
            location: stateCod,
          },
        })
      ) {
        const dateAux = new Date(pascoa);
        dateAux.setDate(dateAux.getDate() - 2);
        const dateSextaSanta = this.formatDateWithZeros(dateAux);
        if (originalDate == dateSextaSanta)
          return {
            date: originalDate,
            name: 'Sexta-feira Santa',
            location: await this.stateService.findState(stateCod),
          };
      }
    }
    throw new HttpException('Holiday not found', HttpStatus.NOT_FOUND);
  }
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  async existHoliday(locationCode, dateOrName): Promise<HolidayEntity> {
    const holiday = await this.holidayRepository.findOne({
      where: {
        location: locationCode,
        date: dateOrName,
      },
    });

    return holiday;
  }

  async createHoliday(locationCode, dateOrName, name): Promise<HolidayEntity> {
    await this.validateLocationCode(locationCode);
    await this.validateDatePutAndDelete(dateOrName);
    if (dateOrName == 'carnaval') {
      name = 'Carnaval';
    } else if (dateOrName == 'corpus-christi') {
      name = 'Corpus Christi';
    } else if (dateOrName == 'páscoa') {
      name = 'Páscoa';
    }

    let holiday = await this.existHoliday(locationCode, dateOrName);
    let existLocation;
    if (locationCode.length == 2) {
      existLocation = await this.stateService.isValidState(locationCode);
    } else if (locationCode.length == 7) {
      existLocation = await this.countyService.isValidCounty(locationCode);
    }
    if (!holiday && existLocation) {
      const newHoliday = await this.holidayRepository.save({
        date: dateOrName,
        name: name,
        location: locationCode,
      });
      throw new HttpException(newHoliday, HttpStatus.CREATED);
    } else {
      //bug with save
      await this.holidayRepository.query(`
       UPDATE holiday
       SET name = '${name}' 
       WHERE date='${dateOrName}' and location='${locationCode}';
       `);
      holiday.name = name;
    }

    return holiday;
  }
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  async deleteHoliday(locationCode, dateOrName): Promise<HolidayEntity> {
    await this.validateLocationCode(locationCode);
    await this.validateDatePutAndDelete(dateOrName);

    let holiday = await this.existHoliday(locationCode, dateOrName);
    if (holiday) {
      await this.holidayRepository.delete({
        date: dateOrName,
        location: locationCode,
      });
      throw new HttpException(holiday, HttpStatus.NO_CONTENT);
    } else {
      const stateCod = locationCode.substring(0, 2);
      let stateHoliday = await this.existHoliday(stateCod, dateOrName);
      let nationalHoliday = await this.existHoliday(0, dateOrName);

      if (locationCode.length == 7) {
        // county
        if (stateHoliday) {
          throw new HttpException('Its state holiday', HttpStatus.FORBIDDEN);
        } else if (nationalHoliday) {
          throw new HttpException(
            'Its natitonal holiday',
            HttpStatus.FORBIDDEN,
          );
        }
      } else if (locationCode.length == 2) {
        // state
        if (nationalHoliday) {
          throw new HttpException(
            'Its natitonal holiday',
            HttpStatus.FORBIDDEN,
          );
        }
      }
    }

    throw new HttpException('The holiday not found', HttpStatus.NOT_FOUND);
  }
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  getPascoa(year): string {
    year = parseInt(year);
    const a = year % 19;
    const b = Math.floor(year / 100);
    const c = year % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const L = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * L) / 451);
    const MÊS = Math.floor((h + L - 7 * m + 114) / 31);
    const DIA = 1 + ((h + L - 7 * m + 114) % 31);
    let finalMes = '';
    let finalDia = '';
    if (MÊS < 10) {
      finalMes = '0' + MÊS;
    }
    if (DIA < 0) {
      finalDia = '0' + DIA;
    }
    let returnString = year + '-';

    if (finalMes != '') {
      returnString += finalMes + '-';
    } else {
      returnString += MÊS + '-';
    }

    if (finalDia != '') {
      returnString += finalDia;
    } else {
      returnString += DIA;
    }

    return returnString;
  }

  formatDateWithZeros(date): string {
    let day = date.getUTCDate().toString();
    let mes = (date.getUTCMonth() + 1).toString();
    let ano = date.getUTCFullYear().toString();
    if (parseInt(mes) < 10) {
      mes = '0' + mes;
    }
    if (parseInt(day) < 10) {
      day = '0' + day;
    }
    return ano + '-' + mes + '-' + day;
  }

  onlyNumbers(string) {
    var numsStr = string.replace(/[^0-9]/g, '');
    return numsStr;
  }

  async validateLocationCode(locationCode): Promise<boolean> {
    if (
      isNaN(locationCode) ||
      locationCode == null ||
      (locationCode.length != 2 && locationCode.length != 7)
    ) {
      throw new HttpException('The code is incorrect', HttpStatus.BAD_REQUEST);
    }
    if (locationCode.length == 2) {
      //state holiday
      const isValid = await this.stateService.isValidState(locationCode);
      if (isValid == false) {
        throw new HttpException('State not exist', HttpStatus.BAD_REQUEST);
      }
    } else if (locationCode.length == 7) {
      // county holiday
      const isValid = await this.countyService.isValidCounty(locationCode);
      if (isValid == false) {
        throw new HttpException('County not exist', HttpStatus.BAD_REQUEST);
      }
    }
    return true;
  }
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  async validateDateGet(recieveDate): Promise<true> {
    if (recieveDate.length == 10) {
      const date = recieveDate.split('-');
      const year = parseInt(date[0]);
      const mounth = parseInt(date[1]);
      const day = parseInt(date[2]);

      if (date.length != 3 || isNaN(year) || isNaN(mounth) || isNaN(day)) {
        throw new HttpException('Incorrect Date', HttpStatus.BAD_REQUEST);
      } else if (
        // case day == 1b day
        this.onlyNumbers(date[0]).length != 4 ||
        this.onlyNumbers(date[1]).length != 2 ||
        this.onlyNumbers(date[2]).length != 2
      ) {
        throw new HttpException('Incorrect Date', HttpStatus.BAD_REQUEST);
      } else if (mounth > 12 || mounth < 1) {
        throw new HttpException('Incorrect mounth', HttpStatus.BAD_REQUEST);
      } else if (day < 1 || day > 31) {
        throw new HttpException('Incorrect day', HttpStatus.BAD_REQUEST);
      } else if (
        (day == 31 && mounth == 4) ||
        (day == 31 && mounth == 6) ||
        (day == 31 && mounth == 9) ||
        (day == 31 && mounth == 11)
      ) {
        throw new HttpException('Incorrect day', HttpStatus.BAD_REQUEST);
      } else if (day > 29 && mounth == 2) {
        throw new HttpException('Incorrect day', HttpStatus.BAD_REQUEST);
      } else if (day == 29 && mounth == 2 && year % 2 != 0) {
        // bissexto
        throw new HttpException('Incorrect day', HttpStatus.BAD_REQUEST);
      }
    } else {
      throw new HttpException('Incorrect Date', HttpStatus.BAD_REQUEST);
    }

    return true;
  }
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  async validateDatePutAndDelete(dateOrName): Promise<boolean> {
    if (
      dateOrName != 'carnaval' &&
      dateOrName != 'páscoa' &&
      dateOrName != 'corpus-christi' &&
      dateOrName.length != 5
    ) {
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
    const date = dateOrName.split('-');

    if (dateOrName.length == 5 && date.length == 2) {
      const mounth = parseInt(date[0]);
      const day = parseInt(date[1]);
      if (isNaN(mounth) || isNaN(day)) {
        throw new HttpException('Bad Request ', HttpStatus.BAD_REQUEST);
      }
      if (
        // case day == 1b day
        this.onlyNumbers(date[0]).length != 2 ||
        this.onlyNumbers(date[1]).length != 2
      ) {
        throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
      } else if (mounth > 12 || mounth < 1) {
        throw new HttpException('Incorrect mounth', HttpStatus.BAD_REQUEST);
      } else if (day < 1 || day > 31) {
        throw new HttpException('Incorrect day', HttpStatus.BAD_REQUEST);
      } else if (
        (day == 31 && mounth == 4) ||
        (day == 31 && mounth == 6) ||
        (day == 31 && mounth == 9) ||
        (day == 31 && mounth == 11)
      ) {
        throw new HttpException('Incorrect day', HttpStatus.BAD_REQUEST);
      } else if (day > 29 && mounth == 2) {
        throw new HttpException('Incorrect day', HttpStatus.BAD_REQUEST);
      }
    }
    return true;
  }
}
