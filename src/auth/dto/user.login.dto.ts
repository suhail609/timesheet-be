import { IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
export class UserLoginDto {
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @Type(() => String)
  password: string;
}
