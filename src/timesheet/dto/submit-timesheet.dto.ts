import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class SubmitTimesheetsDto {
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  timesheetIds: string[];
}
