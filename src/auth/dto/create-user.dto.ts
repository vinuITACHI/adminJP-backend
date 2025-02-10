// // src/auth/dto/create-user.dto.ts
// import { IsString, IsEnum, IsArray, IsNotEmpty } from 'class-validator';
// import { ApiProperty } from '@nestjs/swagger';
// import { UserRole } from '../user.schema';

// export class CreateUserDto {
//   @ApiProperty({
//     example: 'john_doe',
//     description: 'The username of the user',
//   })
//   @IsString()
//   @IsNotEmpty()
//   username: string;

//   @ApiProperty({
//     example: 'password123',
//     description: 'The password for the user',
//   })
//   @IsString()
//   @IsNotEmpty()
//   password: string;

//   @ApiProperty({
//     example: 'admin',
//     description: 'The role of the user',
//     enum: UserRole,
//   })
//   @IsEnum(UserRole)
//   @IsNotEmpty()
//   role: UserRole;

//   @ApiProperty({
//     example: ['students', 'companies'],
//     description: 'List of pages the user can access',
//     type: [String],
//   })
//   @IsArray()
//   @IsString({ each: true })
//   allowedPages: string[];
// }

// export class CreateUserDto {
//   @ApiProperty({ example: 'john_doe', description: 'The username of the user' })
//   @IsString()
//   @IsNotEmpty()
//   username: string;

//   @ApiProperty({
//     example: 'password123',
//     description: 'The password for the user',
//   })
//   @IsString()
//   @IsNotEmpty()
//   password: string;

//   @ApiProperty({ example: 'Manager', description: 'The role of the user' })
//   @IsString()
//   @IsNotEmpty()
//   role: string;
// }

// create-user.dto.ts
import { IsString, IsNotEmpty, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'john_doe' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ example: ['Manager', 'Editor'] })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  roles: string[];

  // @ApiProperty({ example: ['CSE', 'ECE'] })
  // @IsArray()
  // @IsString({ each: true })
  // @IsNotEmpty()
  // departments: string[];
}
