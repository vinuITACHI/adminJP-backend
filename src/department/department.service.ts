import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Department, DepartmentDocument } from './department.schema';
import { CreateDepartmentDto } from './create-department.dto';

@Injectable()
export class DepartmentService {
  constructor(
    @InjectModel(Department.name)
    private departmentModel: Model<DepartmentDocument>,
  ) {}

  async create(createDepartmentDto: CreateDepartmentDto): Promise<Department> {
    // Check for existing department and section combination
    const existingDepartment = await this.departmentModel.findOne({
      department: createDepartmentDto.department,
      section: createDepartmentDto.section,
    });

    if (existingDepartment) {
      throw new ConflictException(
        'Department and section combination already exists',
      );
    }

    const createdDepartment = new this.departmentModel(createDepartmentDto);
    return createdDepartment.save();
  }

  async findAll(): Promise<Department[]> {
    return this.departmentModel.find().exec();
  }

  async findByDepartmentAndSection(
    department: string,
    section: string,
  ): Promise<Department> {
    const departmentRecord = await this.departmentModel
      .findOne({ department, section })
      .exec();
    if (!departmentRecord) {
      throw new NotFoundException(
        `Department ${department} with section ${section} not found`,
      );
    }
    return departmentRecord;
  }

  async update(
    department: string,
    section: string,
    updateDepartmentDto: Partial<CreateDepartmentDto>,
  ): Promise<Department> {
    // Check if department exists
    await this.findByDepartmentAndSection(department, section);

    // Check for conflicts with other departments
    if (updateDepartmentDto.department || updateDepartmentDto.section) {
      const existingDepartment = await this.departmentModel.findOne({
        $and: [
          {
            department: { $ne: department },
            section: { $ne: section },
          },
          {
            department: updateDepartmentDto.department,
            section: updateDepartmentDto.section,
          },
        ],
      });

      if (existingDepartment) {
        throw new ConflictException(
          'Department and section combination already exists',
        );
      }
    }

    return this.departmentModel
      .findOneAndUpdate(
        { department, section },
        { $set: updateDepartmentDto },
        { new: true },
      )
      .exec();
  }

  async remove(department: string, section: string): Promise<Department> {
    const deletedDepartment = await this.departmentModel
      .findOneAndDelete({
        department,
        section,
      })
      .exec();

    if (!deletedDepartment) {
      throw new NotFoundException(
        `Department ${department} with section ${section} not found`,
      );
    }
    return deletedDepartment;
  }
}
