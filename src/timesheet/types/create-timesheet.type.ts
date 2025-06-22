import { CreateTimesheetDto } from '../dto/create-timesheet.dto';

export type CreateTimesheet = CreateTimesheetDto & { userId: string };
