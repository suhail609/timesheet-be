import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserAuthDto } from 'src/auth/dto/user-auth.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UserRole } from './enums/user-role.enum';
import { EmployeeWithReportingManager } from './types/employee.type';

@Injectable()
export class UserService {
  constructor(@InjectModel(User) private userModel: typeof User) {}
  async create(createUserDto: CreateUserDto) {
    const newUser = await this.userModel.create({
      ...createUserDto,
    });

    return newUser.get({ plain: true });
  }

  async findAll() {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return `This action returns all user`;
  }

  async findOne({
    id,
    email,
  }: {
    id?: string;
    email?: string;
  }): Promise<User | null> {
    if (id) {
      const user = await this.userModel.findByPk(id);
      return user;
    }

    if (email) {
      const user = await this.userModel.findOne({ where: { email } });
      return user;
    }

    throw new Error('Either id or email must be provided.');
  }

  async findAllSubordinates({
    managerId,
  }: {
    managerId: string;
  }): Promise<User[] | null> {
    const subordinates = await this.userModel.findAll({
      where: { reportingManagerId: managerId },
      attributes: ['id', 'firstName', 'lastName', 'email', 'role'],
      include: [
        {
          model: this.userModel,
          as: 'reportingManager',
          attributes: ['id', 'firstName', 'email'],
          required: false,
        },
      ],
    });
    return subordinates;
  }

  async findOrCreateUser({
    email,
    firstName,
    lastName,
    password,
    role,
  }: UserAuthDto) {
    const user = await this.userModel.findOne({ where: { email } });

    if (user) {
      await user.update({ firstName, lastName, password, role });
      return user;
    } else {
      const newUser = await this.userModel.create({
        email,
        firstName,
        lastName,
        password,
        role,
      });
      return newUser;
    }
  }

  async getAllManagers() {
    const managers = await this.userModel.findAll({
      where: { role: UserRole.MANAGER },
      attributes: ['id', 'firstName', 'lastName', 'email', 'role'],
    });

    return managers;
  }

  async getAllEmployee(): Promise<EmployeeWithReportingManager[]> {
    const employees = (await this.userModel.findAll({
      where: { role: UserRole.EMPLOYEE },
      attributes: [
        'id',
        'firstName',
        'lastName',
        'email',
        'role',
        'reportingManagerId',
      ],
      include: [
        {
          model: this.userModel,
          as: 'reportingManager',
          attributes: ['id', 'firstName', 'email'],
          required: false,
        },
      ],
    })) as unknown as EmployeeWithReportingManager[];

    return employees;
  }
}
