import { IsOptional, IsString } from 'class-validator';

export class EditUserDto {
  @IsString()
  @IsOptional()
  login?: string;
}
