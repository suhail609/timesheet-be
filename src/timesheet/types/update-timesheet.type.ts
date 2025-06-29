import { CreateTimesheet } from './create-timesheet.type';

export type UpdateTimesheet = Partial<CreateTimesheet> & {
  id: string;
  userId: string;
};
export type UpdateTimesheetField = Partial<CreateTimesheet> & {
  id: string;
  userId?: string;
};
