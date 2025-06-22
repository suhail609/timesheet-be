import { PartialType } from '@nestjs/mapped-types';
import { UserSignupDto } from './user-signup.dto';

export class UpdateAuthDto extends PartialType(UserSignupDto) {}
