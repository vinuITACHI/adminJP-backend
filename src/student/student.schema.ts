import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type StudentDocument = HydratedDocument<Student>;

@Schema({ timestamps: true })
export class Student {
  @ApiProperty({ description: 'Unique roll number' })
  @Prop({
    type: String,
    required: true,
    unique: true,
    index: true,
  })
  rollNumber: string;

  @ApiProperty({ description: 'Student first name' })
  @Prop({
    type: String,
    required: true,
    match: /^[a-zA-Z]+$/,
  })
  firstName: string;

  @ApiProperty({ description: 'Student last name' })
  @Prop({
    type: String,
    required: true,
    match: /^[a-zA-Z]+$/,
  })
  lastName: string;

  @ApiProperty({ description: 'Student email' })
  @Prop({
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  })
  email: string;

  @ApiProperty({ description: 'Student phone number' })
  @Prop({
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (v) {
        return /^[0-9]{10}$/.test(v);
      },
      message: 'Phone number must be 10 digits',
    },
  })
  phoneNumber: string;

  @ApiProperty({ description: 'Department name' })
  @Prop({ type: String, required: true })
  department: string;

  @ApiProperty({ description: 'Course name' })
  @Prop({ type: String, required: true })
  course: string;

  @ApiProperty({ description: 'Program' })
  @Prop({ type: String, required: true })
  program: string;

  @ApiProperty({ description: 'Batch' })
  @Prop({ type: String, required: true })
  batch: string;

  @ApiProperty({ description: 'Section' })
  @Prop({ type: String, required: true })
  section: string;
}

export const StudentSchema = SchemaFactory.createForClass(Student);
