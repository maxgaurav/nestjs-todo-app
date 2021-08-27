import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class StoreTaskDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  public name: string;

  @IsOptional()
  @IsString()
  public description: string | null;

  @ValidateIf((obj: StoreTaskDto) => {
    if (
      obj.due_on === undefined ||
      obj.due_on === null ||
      (obj as any).due_on === ''
    ) {
      obj.due_on = null;
    }

    return !!obj.due_on;
  })
  @IsDateString()
  public due_on: null | Date;
}
