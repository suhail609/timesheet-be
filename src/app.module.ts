import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AdminModule } from './admin/admin.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MongoDBModule } from './mongodb/mongodb.module';
import { NotificationModule } from './notification/notification.module';
import { SequelizeModule } from './sequelize/sequelize.module';
import { UserModule } from './user/user.module';
import { TimesheetModule } from './timesheet/timesheet.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongoDBModule,
    SequelizeModule,
    AuthModule,
    AdminModule,
    NotificationModule,
    UserModule,
    TimesheetModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
