import * as bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';
import { Sequelize } from 'sequelize-typescript';
// import { User } from 'src/user/entities/user.entity';
import { User } from '../user/entities/user.entity';
import { UserRole } from '../user/enums/user-role.enum';
import { Timesheet } from '../timesheet/entities/timesheet.entity';

dotenv.config();
//TODO: change to nestjs way of seeding
async function seedAdmin() {
  // init sequelize
  const sequelize = new Sequelize({
    dialect: 'postgres',
    host: process.env.POSTGRES_DB_HOST,
    port: Number(process.env.POSTGRES_DB_PORT || 5432),
    username: process.env.POSTGRES_DB_USERNAME,
    password: process.env.POSTGRES_DB_PASSWORD,
    database: process.env.POSTGRES_DB_NAME,
    models: [User, Timesheet],
    logging: false,
  });

  try {
    await sequelize.authenticate();

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    const existingAdmin = await User.findOne({ where: { email: adminEmail } });

    if (existingAdmin) {
      console.log('✅ Admin user already exists');
    } else {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);

      await User.create({
        firstName: 'Super',
        lastName: 'Admin',
        email: adminEmail,
        password: hashedPassword,
        role: UserRole.ADMIN,
      });

      console.log(`✅ Admin user created with email: ${adminEmail}`);
    }
  } catch (error) {
    console.error('❌ Error seeding admin:', error);
  } finally {
    await sequelize.close();
  }
}

seedAdmin();
