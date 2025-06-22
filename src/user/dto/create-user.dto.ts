import { IsEnum, IsNotEmpty, Length, Matches } from 'class-validator';
import { Type } from 'class-transformer';
import { UserRole } from 'src/user/enums/user-role.enum';

export class CreateUserDto {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @Length(8, 100, {
    message: 'Password must be at least 8 characters long',
  })
  @Matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/, {
    message:
      'Password must include at least one uppercase letter, one lowercase letter, one number, and one special character',
  })
  @Type(() => String)
  password: string;

  @IsNotEmpty()
  @IsEnum(UserRole)
  role: UserRole;
}
