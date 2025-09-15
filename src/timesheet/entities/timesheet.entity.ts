import {
  Table,
  Column,
  Model,
  ForeignKey,
  BelongsTo,
  DataType,
  PrimaryKey,
  Default,
} from 'sequelize-typescript';
// import { User } from 'src/user/entities/user.entity';
import { TimesheetStatus } from '../enums/timesheet-status.enum';
import { Activity } from '../enums/activity.enum';
import { Project } from '../enums/project.enum';
import { InferAttributes, InferCreationAttributes } from 'sequelize';
import { User } from '../../user/entities/user.entity';

@Table({ tableName: 'timesheets', timestamps: true })
export class Timesheet extends Model<
  InferAttributes<Timesheet>,
  InferCreationAttributes<Timesheet>
> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  declare id?: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false })
  declare userId: string;

  @BelongsTo(() => User)
  declare user?: User;

  @Column({ type: DataType.DATEONLY, allowNull: false })
  declare date: string;

  @Column({ type: DataType.ENUM(...Object.values(Project)), allowNull: true })
  declare project?: Project; // TODO: predefine or create a table and make this reference

  @Column({ type: DataType.ENUM(...Object.values(Activity)), allowNull: true })
  declare activityType?: Activity; // TODO: predefine or create a table and make this reference

  @Column({ type: DataType.TEXT, allowNull: true })
  declare description?: string;

  @Column({ type: DataType.INTEGER, allowNull: true })
  declare timeSpentMinutes?: number;

  @Default(TimesheetStatus.DRAFT)
  @Column({
    type: DataType.ENUM(...Object.values(TimesheetStatus)),
    allowNull: true,
  })
  declare status?: TimesheetStatus;

  @Column({ type: DataType.DATE, allowNull: true })
  declare submittedAt?: Date;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: true })
  declare approvedBy?: string;

  @Column({ type: DataType.DATE, allowNull: true })
  declare approvedAt?: Date;

  @Column({ type: DataType.STRING, allowNull: true })
  declare rejectionReason?: string;
}
