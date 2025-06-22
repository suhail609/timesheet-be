import { InferAttributes, InferCreationAttributes } from 'sequelize';
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { UserRole } from 'src/user/enums/user-role.enum';
import { Timesheet } from 'src/timesheet/entities/timesheet.entity';

@Table({ tableName: 'users', timestamps: true })
export class User extends Model<
  InferAttributes<User>,
  InferCreationAttributes<User>
> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id?: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare firstName: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare lastName: string;

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  declare email: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare password: string;

  @Column({ type: DataType.ENUM(...Object.values(UserRole)), allowNull: false })
  declare role: UserRole;

  @Column({ type: DataType.DATEONLY, allowNull: true })
  declare joinDate?: Date;

  @Column({ type: DataType.STRING, unique: true, allowNull: true })
  declare employeeCode?: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: true })
  declare reportingManagerId?: string;

  @BelongsTo(() => User, 'reportingManagerId')
  declare reportingManager?: User;

  @HasMany(() => User, 'reportingManagerId')
  declare subordinates?: User[];

  @HasMany(() => Timesheet)
  declare timesheets?: Timesheet[];
}
