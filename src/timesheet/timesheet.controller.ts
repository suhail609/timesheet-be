import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserRoles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { UserRolesGuard } from 'src/auth/guards/user-roles/user-roles.guard';
import { RequestWithUser } from 'src/auth/interface/request-with-user.interface';
import { UserRole } from 'src/user/enums/user-role.enum';
import { CreateTimesheetDto } from './dto/create-timesheet.dto';
import { SubmitTimesheetsDto } from './dto/submit-timesheet.dto';
import { TimesheetQueryDto } from './dto/timesheet-query.dto';
import { UpdateTimesheetDto } from './dto/update-timesheet.dto';
import { TimesheetService } from './timesheet.service';

@Controller('timesheet')
export class TimesheetController {
  constructor(private readonly timesheetService: TimesheetService) {}

  @UserRoles(UserRole.EMPLOYEE)
  @UseGuards(UserRolesGuard)
  @UseGuards(JwtAuthGuard)
  @Post('create')
  async createTimesheet(
    @Body() createTimesheetDto: CreateTimesheetDto,
    @Req() req: RequestWithUser,
  ) {
    const createTimesheetData = {
      ...createTimesheetDto,
      userId: req.user.id,
    };

    const timesheet = await this.timesheetService.create(createTimesheetData);
    return timesheet;
  }

  @UserRoles(UserRole.EMPLOYEE)
  @UseGuards(UserRolesGuard)
  @UseGuards(JwtAuthGuard)
  @Put('update/:id')
  async replaceTimesheet(
    @Body() updateTimesheetDto: UpdateTimesheetDto,
    @Param('id') id: string,
    @Req() req: RequestWithUser,
  ) {
    const updatedTimesheet = await this.timesheetService.replace({
      userId: req.user.id,
      id: id,
      ...updateTimesheetDto,
    });

    return updatedTimesheet;
  }

  @UserRoles(UserRole.EMPLOYEE, UserRole.MANAGER, UserRole.ADMIN)
  @UseGuards(UserRolesGuard)
  @UseGuards(JwtAuthGuard)
  @Patch('update/:id')
  async updateTimesheet(
    @Body() updateTimesheetDto: UpdateTimesheetDto,
    @Param('id') id: string,
    @Req() req: RequestWithUser,
  ) {
    const updatedTimesheet = await this.timesheetService.update({
      userId: req.user.role === UserRole.EMPLOYEE ? req.user.id : undefined,
      id: id,
      ...updateTimesheetDto,
    });

    return updatedTimesheet;
  }

  @UserRoles(UserRole.EMPLOYEE)
  @UseGuards(UserRolesGuard)
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteTimesheet(
    // @Body() updateTimesheetDto: UpdateTimesheetDto,
    @Param('id') id: string,
    @Req() req: RequestWithUser,
  ) {
    const response = await this.timesheetService.delete(req.user.id, id);
    return response;
  }

  @UserRoles(UserRole.EMPLOYEE)
  @UseGuards(UserRolesGuard)
  @UseGuards(JwtAuthGuard)
  @Patch('submit')
  async submitTimesheets(
    @Body() submitTimesheetsDto: SubmitTimesheetsDto,
    @Req() req: RequestWithUser,
  ) {
    const updatedTimesheet = await this.timesheetService.submit({
      userId: req.user.id,
      timesheetIds: submitTimesheetsDto.timesheetIds,
    });

    return updatedTimesheet;
  }

  @UserRoles(UserRole.EMPLOYEE)
  @UseGuards(UserRolesGuard)
  @UseGuards(JwtAuthGuard)
  @Get('employee/all')
  async getAllTimesheetsOfEmployee(@Req() req: RequestWithUser) {
    const timesheets = await this.timesheetService.getAllTimesheetsOfUser({
      userId: req.user.id,
    });
    return timesheets;
  }

  @UserRoles(UserRole.ADMIN)
  @UseGuards(UserRolesGuard)
  @UseGuards(JwtAuthGuard)
  @Get('all')
  async getAllTimesheets(@Req() req: RequestWithUser) {
    const timesheets = await this.timesheetService.getAllTimesheets();
    return timesheets;
  }

  @UserRoles(UserRole.MANAGER)
  @UseGuards(UserRolesGuard)
  @UseGuards(JwtAuthGuard)
  @Get('subordinate/all')
  async getAllSubordinateTimesheet(
    @Req() req: RequestWithUser,
    @Query() query: TimesheetQueryDto,
  ) {
    const timesheets = await this.timesheetService.getAllSubordinatesTimesheets(
      {
        managerId: req.user.id,
        filter: query,
      },
    );
    return timesheets;
  }
}
