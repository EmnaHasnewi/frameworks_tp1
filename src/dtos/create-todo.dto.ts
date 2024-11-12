// src/dtos/create-todo.dto.ts

import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';
import { ErrorMessages } from '../common/error-messages';
import { StatusEnum } from '../enums/status.enum';

export class CreateTodoDto {
  @IsNotEmpty({ message: ErrorMessages.NAME_REQUIRED })
  @IsString()
  @MinLength(3, { message: ErrorMessages.NAME_MIN_LENGTH })
  @MaxLength(10, { message: ErrorMessages.NAME_MAX_LENGTH })
  name: string;

  @IsNotEmpty({ message: ErrorMessages.DESCRIPTION_REQUIRED })
  @IsString()
  @MinLength(10, { message: ErrorMessages.DESCRIPTION_MIN_LENGTH })
  description: string;

  @IsNotEmpty({ message: ErrorMessages.STATUS_INVALID })
  status: StatusEnum;
}
