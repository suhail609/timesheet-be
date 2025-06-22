import { IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class ResetPasswordRequestDto {
  @IsNotEmpty()
  @Type(() => String)
  email: string;
}
