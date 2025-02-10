import {
  IsString,
  IsEmail,
  IsNotEmpty,
  Length,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateStudentDto {
  @ApiProperty({ description: 'Unique roll number', example: 'ST12345' })
  @IsString()
  @IsNotEmpty()
  rollNumber: string;

  @ApiProperty({ description: 'Student first name', example: 'John' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z]+$/, {
    message: 'First name must contain only characters',
  })
  firstName: string;

  @ApiProperty({ description: 'Student last name', example: 'Doe' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z]+$/, { message: 'Last name must contain only characters' })
  lastName: string;

  @ApiProperty({ description: 'Student email', example: 'student@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Student phone number', example: '1234567890' })
  @IsString()
  @Length(10, 10, { message: 'Phone number must be exactly 10 digits' })
  @Matches(/^[0-9]{10}$/, { message: 'Phone number must contain only digits' })
  phoneNumber: string;

  @ApiProperty({ description: 'Department name', example: 'Computer Science' })
  @IsString()
  @IsNotEmpty()
  department: string;

  @ApiProperty({ description: 'Course name', example: 'B.Tech' })
  @IsString()
  @IsNotEmpty()
  course: string;

  @ApiProperty({ description: 'Program', example: 'Engineering' })
  @IsString()
  @IsNotEmpty()
  program: string;

  @ApiProperty({ description: 'Batch', example: '2022' })
  @IsString()
  @IsNotEmpty()
  batch: string;

  @ApiProperty({ description: 'Section', example: 'A' })
  @IsString()
  @IsNotEmpty()
  section: string;
}
