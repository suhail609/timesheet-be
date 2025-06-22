import { IsEnum, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { Project } from '../enums/project.enum';
import { Activity } from '../enums/activity.enum';

export class CreateTimesheetDto {
  @IsNotEmpty()
  @IsEnum(Project)
  project: Project;

  @IsNotEmpty()
  @IsEnum(Activity)
  activityType: Activity;

  @IsNotEmpty()
  @Type(() => String)
  description: string;

  @IsNotEmpty()
  @Type(() => Number)
  timeSpentMinutes: number;

  @IsNotEmpty()
  @Type(() => String)
  date: string;
}
