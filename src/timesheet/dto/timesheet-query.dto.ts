import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { Project } from '../enums/project.enum';
import { Activity } from '../enums/activity.enum';

export class TimesheetQueryDto {
  @IsOptional()
  @Type(() => String)
  fromDate?: string;

  @IsOptional()
  @Type(() => String)
  toDate?: string;

  @IsOptional()
  @Type(() => String)
  search?: string;

  @IsOptional()
  @IsEnum(Project)
  project?: Project;

  @IsOptional()
  @IsEnum(Activity)
  activityType?: Activity;
}
