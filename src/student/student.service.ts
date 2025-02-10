import {
  Injectable,
  ConflictException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Student, StudentDocument } from './student.schema';
import { CreateStudentDto } from './create-student.dto';

@Injectable()
export class StudentService {
  constructor(
    @InjectModel(Student.name) private studentModel: Model<StudentDocument>,
  ) {}

  async create(createStudentDto: CreateStudentDto): Promise<Student> {
    // Check for existing roll number
    const existingStudent = await this.studentModel.findOne({
      $or: [
        { rollNumber: createStudentDto.rollNumber },
        { email: createStudentDto.email },
        { phoneNumber: createStudentDto.phoneNumber },
      ],
    });

    if (existingStudent) {
      throw new ConflictException(
        'Roll number, email, or phone number already exists',
      );
    }

    const createdStudent = new this.studentModel(createStudentDto);
    return createdStudent.save();
  }

  // async findAll(): Promise<Student[]> {
  //   return this.studentModel.find().exec();
  // }

  // async findAll(userDepartments: string[]): Promise<Student[]> {
  //   // Explicitly filter students by user's departments
  //   return this.studentModel
  //     .find({
  //       department: { $in: userDepartments },
  //     })
  //     .exec();
  // }

  async findAll(userDepartments?: string[]): Promise<Student[]> {
    if (userDepartments && userDepartments.length > 0) {
      return this.studentModel
        .find({ department: { $in: userDepartments } })
        .exec();
    }
    return this.studentModel.find().exec();
  }

  // async findByDepartment(
  //   department: string,
  //   userDepartments: string[],
  // ): Promise<Student[]> {
  //   // Ensure the requested department is in the user's allowed departments
  //   if (!userDepartments.includes(department)) {
  //     throw new ForbiddenException('You do not have access to this department');
  //   }

  //   const students = await this.studentModel.find({ department }).exec();
  //   if (students.length === 0) {
  //     throw new NotFoundException(
  //       `No students found in department: ${department}`,
  //     );
  //   }
  //   return students;
  // }

  async findOne(rollNumber: string): Promise<Student> {
    const student = await this.studentModel.findOne({ rollNumber }).exec();
    if (!student) {
      throw new NotFoundException(
        `Student with roll number ${rollNumber} not found`,
      );
    }
    return student;
  }

  // async findByDepartment(department: string): Promise<Student[]> {
  //   const students = await this.studentModel.find({ department }).exec();

  //   if (students.length === 0) {
  //     throw new NotFoundException(
  //       `No students found in department: ${department}`,
  //     );
  //   }

  //   return students;
  // }

  async update(
    rollNumber: string,
    updateStudentDto: Partial<CreateStudentDto>,
  ): Promise<Student> {
    // Check if student exists
    await this.findOne(rollNumber);

    // Check for conflicts with other students
    if (updateStudentDto.email || updateStudentDto.phoneNumber) {
      const existingStudent = await this.studentModel.findOne({
        $and: [
          { rollNumber: { $ne: rollNumber } },
          {
            $or: [
              { email: updateStudentDto.email },
              { phoneNumber: updateStudentDto.phoneNumber },
            ],
          },
        ],
      });

      if (existingStudent) {
        throw new ConflictException('Email or phone number already exists');
      }
    }

    return this.studentModel
      .findOneAndUpdate(
        { rollNumber },
        { $set: updateStudentDto },
        { new: true },
      )
      .exec();
  }

  async remove(rollNumber: string): Promise<Student> {
    const deletedStudent = await this.studentModel
      .findOneAndDelete({ rollNumber })
      .exec();
    if (!deletedStudent) {
      throw new NotFoundException(
        `Student with roll number ${rollNumber} not found`,
      );
    }
    return deletedStudent;
  }
}
