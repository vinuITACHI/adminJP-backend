import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type CompanyDocument = HydratedDocument<Company>;

@Schema({ timestamps: true })
export class Company {
  @ApiProperty({ description: 'Company name' })
  @Prop({
    type: String,
    required: true,
    match: /^[a-zA-Z\s]+$/,
  })
  company: string;

  @ApiProperty({ description: 'Company email' })
  @Prop({
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  })
  email: string;

  @ApiProperty({ description: 'Company phone number' })
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
}

export const CompanySchema = SchemaFactory.createForClass(Company);
