import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type RoleDocument = Role & Document;

@Schema()
export class Role {
  @ApiProperty({ example: 'Manager', description: 'Name of the role' })
  @Prop({ required: true, unique: true })
  roleName: string;

  @ApiProperty({
    example: ['create', 'read'],
    description: 'Permissions associated with the role',
  })
  @Prop({ type: [String], required: true })
  permissions: string[];

  @ApiProperty({
    example: ['students', 'company'],
    description: 'Pages allowed for this role',
  })
  @Prop({ type: [String], required: true })
  allowedPages: string[];
  @Prop({ type: [String], default: [] })
  @ApiProperty({
    example: ['CSE', 'ECE'],
    description: 'Departments associated with the role',
  })
  departments: string[];
}

export const RoleSchema = SchemaFactory.createForClass(Role);
