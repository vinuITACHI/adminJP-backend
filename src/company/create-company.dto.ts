import {
  IsString,
  IsEmail,
  IsNotEmpty,
  Length,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCompanyDto {
  @ApiProperty({ description: 'Company name', example: 'TechCorp' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z\s]+$/, {
    message: 'Company name must contain only alphabets',
  })
  company: string;

  @ApiProperty({
    description: 'Company email',
    example: 'contact@techcorp.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Company phone number', example: '1234567890' })
  @IsString()
  @Length(10, 10, { message: 'Phone number must be exactly 10 digits' })
  @Matches(/^[0-9]{10}$/, { message: 'Phone number must contain only digits' })
  phoneNumber: string;
}
