// // src/auth/user.schema.ts
// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { Document } from 'mongoose';

// export type UserDocument = User & Document;

// export enum UserRole {
//   ADMIN = 'admin',
//   EDITOR = 'editor',
//   VIEWER = 'viewer',
// }

// @Schema()
// export class User {
//   @Prop({ required: true, unique: true })
//   username: string;

//   @Prop({ required: true })
//   password: string;

//   @Prop({ type: String, enum: UserRole, default: UserRole.VIEWER })
//   role: UserRole;

//   @Prop({ type: [String], default: [] })
//   allowedPages: string[];
// }

// export const UserSchema = SchemaFactory.createForClass(User);

// // src/auth/user.schema.ts
// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { Document } from 'mongoose';
// import { ApiProperty } from '@nestjs/swagger';

// export type UserDocument = User & Document;

// export enum UserRole {
//   ADMIN = 'admin',
//   EDITOR = 'editor',
//   VIEWER = 'viewer',
// }

// @Schema()
// export class User {
//   @ApiProperty({
//     example: 'john_doe',
//     description: 'The username of the user'
//   })
//   @Prop({ required: true, unique: true })
//   username: string;

//   @ApiProperty({
//     example: 'hashedPassword',
//     description: 'The hashed password of the user'
//   })
//   @Prop({ required: true })
//   password: string;

//   @ApiProperty({
//     example: 'admin',
//     description: 'The role of the user',
//     enum: UserRole
//   })
//   @Prop({ type: String, enum: UserRole, default: UserRole.VIEWER })
//   role: UserRole;

//   @ApiProperty({
//     example: ['students', 'companies'],
//     description: 'List of pages the user can access'
//   })
//   @Prop({ type: [String], default: [] })
//   allowedPages: string[];
// }

// export const UserSchema = SchemaFactory.createForClass(User);

// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { Document } from 'mongoose';
// import { ApiProperty } from '@nestjs/swagger';

// export type UserDocument = User & Document;

// @Schema()
// export class User {
//   @ApiProperty({ example: 'john_doe', description: 'The username of the user' })
//   @Prop({ required: true, unique: true })
//   username: string;

//   @ApiProperty({
//     example: 'hashedPassword',
//     description: 'The hashed password of the user',
//   })
//   @Prop({ required: true })
//   password: string;

//   @ApiProperty({ example: 'Manager', description: 'The role of the user' })
//   @Prop({ required: true })
//   role: string;

//   @ApiProperty({
//     example: ['students', 'company'],
//     description: 'List of pages the user can access',
//   })
//   @Prop({ type: [String], default: [] })
//   allowedPages: string[];

//   @ApiProperty({
//     example: ['create', 'read'],
//     description: 'Permissions associated with the user',
//   })
//   @Prop({ type: [String], default: [] })
//   permissions: string[];
// }

// export const UserSchema = SchemaFactory.createForClass(User);

// user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type UserDocument = User & Document;

@Schema()
export class User {
  @ApiProperty({ example: 'john_doe', description: 'The username of the user' })
  @Prop({ required: true, unique: true })
  username: string;

  @ApiProperty({ description: 'The hashed password of the user' })
  @Prop({ required: true })
  password: string;

  @ApiProperty({
    example: ['Manager', 'Editor'],
    description: 'The roles of the user',
  })
  @Prop({ type: [String], required: true })
  roles: string[];

  @ApiProperty({
    example: ['students', 'company'],
    description: 'List of pages the user can access',
  })
  @Prop({ type: [String], default: [] })
  allowedPages: string[];

  @ApiProperty({
    example: ['create', 'read'],
    description: 'Permissions associated with the user',
  })
  @Prop({ type: [String], default: [] })
  permissions: string[];

  @Prop({ type: [String], default: [] })
  departments: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
