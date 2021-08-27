import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';

export const skipDueOnValidation = (
  obj: Partial<Record<keyof StoreTaskDto, any>>,
): boolean => {
  if (obj.due_on === undefined || obj.due_on === null || obj.due_on === '') {
    obj.due_on = null;
  }

  return !!obj.due_on;
};

export class StoreTaskDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  public name: string;

  @IsOptional()
  @IsString()
  public description: string | null;

  @ValidateIf(skipDueOnValidation)
  @IsDateString()
  public due_on: null | Date;
}
