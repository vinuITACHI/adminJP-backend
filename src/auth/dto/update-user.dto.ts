// src/auth/dto/update-user.dto.ts
import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiPropertyOptional({
    example: 'newpassword123',
    description: 'New password for the user',
  })
  @IsOptional()
  @IsString()
  username: string;

  @IsOptional()
  @IsString()
  password?: string;

  @ApiPropertyOptional({
    example: 'admin',
    description: 'Updated role of the user',
  })
  @IsOptional()
  @IsString()
  role?: string;
}
