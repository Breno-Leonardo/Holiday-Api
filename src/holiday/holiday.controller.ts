import { Body, Controller, Delete, Get, Param, Put } from '@nestjs/common';
import { HolidayService } from './holiday.service';
import { CreateHolidayDto } from './dto/createHoliday.dto ';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('holiday')
@Controller('feriados')
export class HolidayController {
  constructor(private readonly holidayService: HolidayService) {}

  @Get(':code/:date')
  @ApiParam({name: 'code', required: true, description: 'State or municipality code'})
  @ApiParam({name: 'date', required: true, description: 'Holiday date in AAAA-MM-DD format'})
  @ApiOperation({ summary: 'Search for a holiday by entering the location code and holiday date' })
  @ApiResponse({
    status: 200,
    description: 'Found Holiday',
  })
  @ApiResponse({
    status: 400,
    description: 'Error in the requisition, incorrect date or location code ',
  })
  @ApiResponse({
    status: 404,
    description: 'Holiday not found',
  })
  async getAllRequestsByID(@Param('code') code, @Param('date') date) {
    return this.holidayService.getHoliday(code, date);
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////
  @ApiResponse({
    status: 200,
    description: 'Existing holiday, name changed',
  })
  @ApiResponse({
    status: 201,
    description: 'Holiday did not exist, it was created',
  })
  @ApiResponse({
    status: 400,
    description: 'Error in the requisition, incorrect date or location code',
  })
  @ApiParam({name: 'code', required: true, description: 'State or municipality code'})
  @ApiParam({name: 'nameOrDate', required: true, description: 'Date of the holiday in the format MM-DD or the name of the mobile holiday ( carnaval, páscoa ou corpus-christi) '})
  @ApiOperation({ summary: 'Register a holiday by informing the location code, the date of the holiday and the name of the holiday' })
  @Put(':code/:nameOrDate')
  async updateRequest(
    @Param('code') code,
    @Param('nameOrDate') nameOrDate,
    @Body() body: CreateHolidayDto,
  ) {
    return this.holidayService.createHoliday(code, nameOrDate, body.name);
  }

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
  @ApiResponse({
    status: 204,
    description: 'Existing holiday, it was removed',
  })
  @ApiResponse({
    status: 400,
    description: 'Error in the requisition, incorrect date or location code',
  })
  @ApiResponse({
    status: 403,
    description: 'An attempt to remove a state holiday in a municipality, remove a national holiday in a municipality or in a federative unit.',
  })
  @ApiResponse({
    status: 404,
    description: 'Holiday not found',
  })
  @ApiParam({name: 'code', required: true, description: 'State or municipality code'})
  @ApiParam({name: 'nameOrDate', required: true, description: 'Date of the holiday in the format MM-DD or the name of the mobile holiday ( carnaval, páscoa ou corpus-christi) '})
  @ApiOperation({ summary: 'Deletes a holiday by entering the location code and date of the holiday' })
  @Delete(':code/:nameOrDate')
  async deleteRequest(@Param('code') code, @Param('nameOrDate') nameOrDate) {
    return this.holidayService.deleteHoliday(code, nameOrDate);
  }
}
