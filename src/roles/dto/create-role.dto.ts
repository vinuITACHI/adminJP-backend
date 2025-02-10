import { IsString, IsArray, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleDto {
  @ApiProperty({ example: 'Manager', description: 'Name of the role' })
  @IsString()
  @IsNotEmpty()
  roleName: string;

  @ApiProperty({
    example: ['create', 'read'],
    description: 'Permissions associated with the role',
  })
  @IsArray()
  @IsString({ each: true })
  permissions: string[];

  @ApiProperty({
    example: ['students', 'company'],
    description: 'Pages allowed for this role',
  })
  @IsArray()
  @IsString({ each: true })
  allowedPages: string[];
  @ApiProperty({
    example: ['CSE', 'ECE'],
    description: 'Departments associated with the role',
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  departments: string[];
}
