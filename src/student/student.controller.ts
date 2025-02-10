import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { StudentService } from './student.service';
import { CreateStudentDto } from './create-student.dto';
import { Student } from './student.schema';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CaslAbilityGuard } from '../auth/casl-ability.guard';
import { CheckAbilities } from '../auth/casl-ability.decorator';
import { Action } from '../auth/casl-ability.service';

@ApiTags('students')
@Controller('students')
@UseGuards(JwtAuthGuard, CaslAbilityGuard)
@ApiBearerAuth('JWT-auth')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post()
  @CheckAbilities({ action: Action.Create, subject: Student })
  @ApiOperation({ summary: 'Create a new student' })
  @ApiBody({ type: CreateStudentDto })
  @ApiResponse({
    status: 201,
    description: 'Student created successfully',
    type: Student,
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict with existing student data',
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  create(@Body() createStudentDto: CreateStudentDto): Promise<Student> {
    return this.studentService.create(createStudentDto);
  }

  @Get()
  @CheckAbilities({ action: Action.Read, subject: Student })
  findAll(@Req() req): Promise<Student[]> {
    const userDepartments = req.user.departments;
    return this.studentService.findAll(userDepartments);
  }

  @Get(':rollNumber')
  @CheckAbilities({ action: Action.Read, subject: Student })
  @ApiOperation({ summary: 'Get a student by roll number' })
  @ApiResponse({ status: 200, description: 'Student found', type: Student })
  @ApiResponse({ status: 404, description: 'Student not found' })
  findOne(@Param('rollNumber') rollNumber: string): Promise<Student> {
    return this.studentService.findOne(rollNumber);
  }

  @Put(':rollNumber')
  @CheckAbilities({ action: Action.Update, subject: Student })
  @ApiOperation({ summary: 'Update a student' })
  @ApiBody({ type: CreateStudentDto })
  @ApiResponse({
    status: 200,
    description: 'Student updated successfully',
    type: Student,
  })
  @ApiResponse({ status: 404, description: 'Student not found' })
  @UsePipes(new ValidationPipe({ transform: true }))
  update(
    @Param('rollNumber') rollNumber: string,
    @Body() updateStudentDto: Partial<CreateStudentDto>,
  ): Promise<Student> {
    return this.studentService.update(rollNumber, updateStudentDto);
  }

  @Delete(':rollNumber')
  @CheckAbilities({ action: Action.Delete, subject: Student })
  @ApiOperation({ summary: 'Delete a student' })
  @ApiResponse({
    status: 200,
    description: 'Student deleted successfully',
    type: Student,
  })
  @ApiResponse({ status: 404, description: 'Student not found' })
  remove(@Param('rollNumber') rollNumber: string): Promise<Student> {
    return this.studentService.remove(rollNumber);
  }
}
