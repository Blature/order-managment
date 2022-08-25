import { IsNotEmpty, IsOptional, MinLength } from 'class-validator';

export class CreateOrderDto {
  @IsNotEmpty()
  @MinLength(3)
  subject: string;

  @IsOptional()
  description: string;
}
