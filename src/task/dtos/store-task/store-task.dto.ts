import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
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

  @IsOptional()
  public due_on: any;
}
