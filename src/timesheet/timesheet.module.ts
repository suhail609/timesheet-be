import { Module } from '@nestjs/common';
import { TimesheetService } from './timesheet.service';
import { Timesheet } from './entities/timesheet.entity';
import { SequelizeModule } from '@nestjs/sequelize';
import { TimesheetController } from './timesheet.controller';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [SequelizeModule.forFeature([Timesheet]), UserModule],

  providers: [TimesheetService],

  controllers: [TimesheetController],
})
export class TimesheetModule {}
