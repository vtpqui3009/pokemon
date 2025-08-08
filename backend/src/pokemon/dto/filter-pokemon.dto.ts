import { Transform } from 'class-transformer';
import { IsOptional, IsBoolean, IsInt, Min } from 'class-validator';

export class FilterPokemonDto {
  @IsOptional()
  search?: string;

  @IsOptional()
  type?: string;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  legendary?: boolean;

  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @Min(0)
  minSpeed?: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @Min(0)
  maxSpeed?: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  page?: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  limit?: number;
}
