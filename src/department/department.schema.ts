import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type DepartmentDocument = HydratedDocument<Department>;

@Schema({ timestamps: true })
export class Department {
  @ApiProperty({ description: 'Department name' })
  @Prop({
    type: String,
    required: true,
    match: /^[a-zA-Z\s]+$/,
  })
  department: string;

  @ApiProperty({ description: 'Section name' })
  @Prop({
    type: String,
    required: true,
    match: /^[a-zA-Z]+$/,
  })
  section: string;
}

export const DepartmentSchema = SchemaFactory.createForClass(Department);

// Add unique compound index for department and section
DepartmentSchema.index({ department: 1, section: 1 }, { unique: true });
