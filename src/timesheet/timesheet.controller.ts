import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { RequestWithUser } from 'src/auth/interface/request-with-user.interface';
import { CreateTimesheetDto } from './dto/create-timesheet.dto';
import { TimesheetService } from './timesheet.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { UserRolesGuard } from 'src/auth/guards/user-roles/user-roles.guard';
import { UserRole } from 'src/user/enums/user-role.enum';
import { UserRoles } from 'src/auth/decorators/roles.decorator';
import { UpdateTimesheetDto } from './dto/update-timesheet.dto';

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
  @Patch('update/:id')
  async updateTimesheet(
    @Body() updateTimesheetDto: UpdateTimesheetDto,
    @Param('id') id: string,
    @Req() req: RequestWithUser,
  ) {
    const updatedTimesheet = await this.timesheetService.update({
      userId: req.user.id,
      id: id,
      ...updateTimesheetDto,
    });

    return updatedTimesheet;
  }

  @UserRoles(UserRole.EMPLOYEE)
  @UseGuards(UserRolesGuard)
  @UseGuards(JwtAuthGuard)
  @Get('all')
  async getAllTimesheets(@Req() req: RequestWithUser) {
    const timesheets = await this.timesheetService.getAllTimesheets({
      userId: req.user.id,
    });
    return timesheets;
  }

  @UserRoles(UserRole.MANAGER)
  @UseGuards(UserRolesGuard)
  @UseGuards(JwtAuthGuard)
  @Get('subordinate/all')
  async getAllSubordinateTimesheet(@Req() req: RequestWithUser) {
    const timesheets = await this.timesheetService.getAllSubordinatesTimesheets(
      {
        managerId: req.user.id,
      },
    );
    return timesheets;
  }
}
