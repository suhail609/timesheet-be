import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserService } from 'src/user/user.service';
import { Timesheet } from './entities/timesheet.entity';
import { CreateTimesheet } from './types/create-timesheet.type';
import { UpdateTimesheet } from './types/update-timesheet.type';

@Injectable()
export class TimesheetService {
  constructor(
    @InjectModel(Timesheet) private timesheetModel: typeof Timesheet,
    private readonly userService: UserService,
  ) {}

  async create(createTimesheet: CreateTimesheet): Promise<Timesheet> {
    //TODO: make the type of the response to json
    const newTimesheet = await this.timesheetModel.create(createTimesheet);
    return newTimesheet;
  }

  async update(updateTimesheet: UpdateTimesheet): Promise<Timesheet> {
    const { id, userId, ...updateData } = updateTimesheet;

    const [count, [updatedTimesheet]] = await this.timesheetModel.update(
      updateData,
      {
        where: { id: id, userId },
        returning: true,
      },
    );

    if (count === 0) {
      throw new NotFoundException('Timesheet not found');
    }

    return updatedTimesheet;
  }

  async getAllTimesheets({ userId }: { userId: string }): Promise<Timesheet[]> {
    const timesheets = await this.timesheetModel.findAll({ where: { userId } });
    return timesheets;
  }

  async getAllSubordinatesTimesheets({
    managerId,
  }: {
    managerId: string;
  }): Promise<Timesheet[]> {
    const subordinates = await this.userService.findAllSubordinates({
      managerId,
    });

    if (!subordinates || subordinates.length === 0) return [];

    const subordinateIds = subordinates.map((u) => u.id) as string[];

    const timesheets = await this.timesheetModel.findAll({
      where: {
        userId: subordinateIds,
      },
    });
    return timesheets;
  }
}
