import { IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class ResetPasswordDto {
  @IsNotEmpty()
  @Type(() => String)
  token: string;

  @IsNotEmpty()
  @Type(() => String)
  newPassword: string;
}
