import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Company, CompanyDocument } from './company.schema';
import { CreateCompanyDto } from './create-company.dto';

@Injectable()
export class CompanyService {
  constructor(
    @InjectModel(Company.name) private companyModel: Model<CompanyDocument>,
  ) {}

  async create(createCompanyDto: CreateCompanyDto): Promise<Company> {
    // Check for existing email or phone number
    const existingCompany = await this.companyModel.findOne({
      $or: [
        { email: createCompanyDto.email },
        { phoneNumber: createCompanyDto.phoneNumber },
      ],
    });

    if (existingCompany) {
      throw new ConflictException('Email or phone number already exists');
    }

    const createdCompany = new this.companyModel(createCompanyDto);
    return createdCompany.save();
  }

  async findAll(): Promise<Company[]> {
    return this.companyModel.find().exec();
  }

  async findOne(email: string): Promise<Company> {
    const company = await this.companyModel.findOne({ email }).exec();
    if (!company) {
      throw new NotFoundException(`Company with email ${email} not found`);
    }
    return company;
  }

  async update(
    email: string,
    updateCompanyDto: Partial<CreateCompanyDto>,
  ): Promise<Company> {
    // Check for conflicts with other companies
    if (updateCompanyDto.email || updateCompanyDto.phoneNumber) {
      const existingCompany = await this.companyModel.findOne({
        $and: [
          { email: { $ne: email } },
          {
            $or: [
              { email: updateCompanyDto.email },
              { phoneNumber: updateCompanyDto.phoneNumber },
            ],
          },
        ],
      });

      if (existingCompany) {
        throw new ConflictException('Email or phone number already exists');
      }
    }

    return this.companyModel
      .findOneAndUpdate({ email }, { $set: updateCompanyDto }, { new: true })
      .exec();
  }

  async remove(email: string): Promise<Company> {
    const deletedCompany = await this.companyModel
      .findOneAndDelete({ email })
      .exec();
    if (!deletedCompany) {
      throw new NotFoundException(`Company with email ${email} not found`);
    }
    return deletedCompany;
  }
}
