import { Injectable } from '@nestjs/common';
import { UserService } from './user/user.service';

@Injectable()
export class AppService {
  constructor(private readonly userService: UserService) {}
  getHello(): string {
    return 'Hello World!';
  }
  async getAppData() {
    const managers = await this.userService.getAllManagers();
    return { managers };
  }
}
