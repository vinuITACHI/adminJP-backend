import { IsString, IsNotEmpty, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDepartmentDto {
  @ApiProperty({ description: 'Department name', example: 'Computer Science' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z\s]+$/, {
    message: 'Department name must contain only alphabets',
  })
  department: string;

  @ApiProperty({ description: 'Section name', example: 'A' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z]+$/, { message: 'Section must contain only alphabets' })
  section: string;
}
