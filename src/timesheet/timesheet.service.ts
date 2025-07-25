import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { UserService } from 'src/user/user.service';
import { Timesheet } from './entities/timesheet.entity';
import { TimesheetStatus } from './enums/timesheet-status.enum';
import { CreateTimesheet } from './types/create-timesheet.type';
import {
  UpdateTimesheet,
  UpdateTimesheetField,
} from './types/update-timesheet.type';
import { User } from 'src/user/entities/user.entity';

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

  async replace(updateTimesheet: UpdateTimesheet): Promise<Timesheet> {
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

  async update(updateTimesheet: UpdateTimesheetField): Promise<Timesheet> {
    const { id, userId, ...updateData } = updateTimesheet;

    const whereCondition = { id: id };
    if (userId) whereCondition['userId'] = userId;
    const [count, [updatedTimesheet]] = await this.timesheetModel.update(
      updateData,
      {
        where: whereCondition,
        returning: true,
      },
    );

    if (count === 0) {
      throw new NotFoundException('Timesheet not found');
    }

    return updatedTimesheet;
  }

  async submit({
    userId,
    timesheetIds,
  }: {
    userId: string;
    timesheetIds: string[];
  }): Promise<Timesheet[]> {
    const whereCondition = { userId: userId, id: { [Op.in]: timesheetIds } };
    const [count, updatedTimesheets] = await this.timesheetModel.update(
      { status: TimesheetStatus.SUBMITTED },
      {
        where: whereCondition,
        returning: true,
      },
    );

    if (count === 0) {
      throw new NotFoundException('Timesheet not found');
    }

    return updatedTimesheets;
  }

  async delete(userId: string, id: string): Promise<string> {
    const whereCondition = { userId: userId, id: id };

    const deletedCount = await this.timesheetModel.destroy({
      where: whereCondition,
    });

    if (deletedCount === 0) {
      throw new Error(`Timesheet with id ${id} not found`);
    }

    return `Deleted ${deletedCount} timesheet(s)`;
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
        status: {
          [Op.ne]: TimesheetStatus.DRAFT,
        },
      },
      include: [
        {
          model: User,
          attributes: ['email'],
        },
      ],
    });
    return timesheets;
  }
}
