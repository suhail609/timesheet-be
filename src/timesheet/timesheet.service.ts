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
      { status: TimesheetStatus.SUBMITTED, submittedAt: new Date() },
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

  async getAllTimesheetsOfUser({
    userId,
  }: {
    userId: string;
  }): Promise<Timesheet[]> {
    const timesheets = await this.timesheetModel.findAll({ where: { userId } });
    return timesheets;
  }

  async getAllTimesheets(): Promise<Timesheet[]> {
    const timesheets = await this.timesheetModel.findAll();
    return timesheets;
  }

  async getAllSubordinatesTimesheets({
    managerId,
    filter,
  }: {
    managerId: string;
    filter?: {
      fromDate?: string;
      toDate?: string;
      search?: string;
      project?: string;
      activityType?: string;
    };
  }): Promise<Timesheet[]> {
    const subordinates = await this.userService.findAllSubordinates({
      managerId,
    });

    if (!subordinates || subordinates.length === 0) return [];

    const subordinateIds = subordinates.map((u) => u.id) as string[];

    //TODO: instead of inline find a readable and efficient better method
    const timesheets = await this.timesheetModel.findAll({
      where: {
        userId: subordinateIds,
        ...(filter?.project && { project: filter.project }),
        ...(filter?.activityType && { activityType: filter.activityType }),
        ...(filter?.fromDate || filter?.toDate
          ? {
              date: {
                ...(filter?.fromDate && { [Op.gte]: filter.fromDate }),
                ...(filter?.toDate && { [Op.lte]: filter.toDate }),
              },
            }
          : {}),
        ...(filter?.search && {
          [Op.or]: [
            { description: { [Op.iLike]: `%${filter.search}%` } },
            { '$user.firstName$': { [Op.iLike]: `%${filter.search}%` } },
            { '$user.lastName$': { [Op.iLike]: `%${filter.search}%` } },
            { '$user.email$': { [Op.iLike]: `%${filter.search}%` } },
          ],
        }),
        status: {
          [Op.ne]: TimesheetStatus.DRAFT,
        },
      },
      include: [
        {
          model: User,
          attributes: ['email', 'firstName', 'lastName'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });
    return timesheets;
  }
}
