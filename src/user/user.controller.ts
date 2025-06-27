import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { UserRolesGuard } from 'src/auth/guards/user-roles/user-roles.guard';
import { RequestWithUser } from 'src/auth/interface/request-with-user.interface';
import { UserRoles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from './enums/user-role.enum';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  //TODO: user get users having both users and managers instead of only employees
  @Get('employees')
  getAllEmployees() {
    const employees = this.userService.getAllEmployee();
    return employees;
  }

  @UserRoles(UserRole.MANAGER)
  @UseGuards(UserRolesGuard)
  @UseGuards(JwtAuthGuard)
  @Get('subordinates')
  getSubordinates(@Req() req: RequestWithUser) {
    const employees = this.userService.findAllSubordinates({
      managerId: req.user.id,
    });
    return employees;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    const user = this.userService.findOne({ id });
    return user;
  }
}
