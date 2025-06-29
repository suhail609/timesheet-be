import { PartialType } from '@nestjs/mapped-types';
import { CreateTimesheetDto } from './create-timesheet.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { TimesheetStatus } from '../enums/timesheet-status.enum';

export class UpdateTimesheetDto extends PartialType(CreateTimesheetDto) {
  @IsOptional()
  @IsEnum(TimesheetStatus)
  status?: TimesheetStatus;
}
