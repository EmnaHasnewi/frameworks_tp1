// src/dtos/update-todo.dto.ts

import { IsOptional, IsString, MinLength, MaxLength, IsEnum } from 'class-validator';
import { ErrorMessages } from '../common/error-messages';
import { StatusEnum } from '../enums/status.enum';

export class UpdateTodoDto {
  @IsOptional()
  @IsString()
  @MinLength(3, { message: ErrorMessages.NAME_MIN_LENGTH })
  @MaxLength(10, { message: ErrorMessages.NAME_MAX_LENGTH })
  name?: string;

  @IsOptional()
  @IsString()
  @MinLength(10, { message: ErrorMessages.DESCRIPTION_MIN_LENGTH })
  description?: string;

  @IsOptional()
  @IsEnum(StatusEnum, { message: ErrorMessages.STATUS_INVALID })
  status?: StatusEnum;
}
