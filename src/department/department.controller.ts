// import {
//   Controller,
//   Get,
//   Post,
//   Body,
//   Param,
//   Delete,
//   Put,
//   UsePipes,
//   ValidationPipe,
// } from '@nestjs/common';
// import {
//   ApiTags,
//   ApiOperation,
//   ApiResponse,
//   ApiBody,
//   ApiParam,
// } from '@nestjs/swagger';
// import { DepartmentService } from './department.service';
// import { CreateDepartmentDto } from './create-department.dto';
// import { Department } from './department.schema';

// @ApiTags('departments')
// @Controller('departments')
// export class DepartmentController {
//   constructor(private readonly departmentService: DepartmentService) {}

//   @Post()
//   @ApiOperation({ summary: 'Create a new department' })
//   @ApiBody({ type: CreateDepartmentDto })
//   @ApiResponse({
//     status: 201,
//     description: 'Department created successfully',
//     type: Department,
//   })
//   @ApiResponse({
//     status: 409,
//     description: 'Conflict with existing department data',
//   })
//   @UsePipes(new ValidationPipe({ transform: true }))
//   create(
//     @Body() createDepartmentDto: CreateDepartmentDto,
//   ): Promise<Department> {
//     return this.departmentService.create(createDepartmentDto);
//   }

//   @Get()
//   @ApiOperation({ summary: 'Get all departments' })
//   @ApiResponse({
//     status: 200,
//     description: 'List of all departments',
//     type: [Department],
//   })
//   findAll(): Promise<Department[]> {
//     return this.departmentService.findAll();
//   }

//   @Get(':department/:section')
//   @ApiOperation({ summary: 'Get a department by department and section' })
//   @ApiParam({ name: 'department', description: 'Department name' })
//   @ApiParam({ name: 'section', description: 'Section name' })
//   @ApiResponse({
//     status: 200,
//     description: 'Department found',
//     type: Department,
//   })
//   @ApiResponse({ status: 404, description: 'Department not found' })
//   findOne(
//     @Param('department') department: string,
//     @Param('section') section: string,
//   ): Promise<Department> {
//     return this.departmentService.findByDepartmentAndSection(
//       department,
//       section,
//     );
//   }

//   @Put(':department/:section')
//   @ApiOperation({ summary: 'Update a department' })
//   @ApiBody({ type: CreateDepartmentDto })
//   @ApiParam({ name: 'department', description: 'Department name' })
//   @ApiParam({ name: 'section', description: 'Section name' })
//   @ApiResponse({
//     status: 200,
//     description: 'Department updated successfully',
//     type: Department,
//   })
//   @ApiResponse({ status: 404, description: 'Department not found' })
//   @UsePipes(new ValidationPipe({ transform: true }))
//   update(
//     @Param('department') department: string,
//     @Param('section') section: string,
//     @Body() updateDepartmentDto: Partial<CreateDepartmentDto>,
//   ): Promise<Department> {
//     return this.departmentService.update(
//       department,
//       section,
//       updateDepartmentDto,
//     );
//   }

//   @Delete(':department/:section')
//   @ApiOperation({ summary: 'Delete a department' })
//   @ApiParam({ name: 'department', description: 'Department name' })
//   @ApiParam({ name: 'section', description: 'Section name' })
//   @ApiResponse({
//     status: 200,
//     description: 'Department deleted successfully',
//     type: Department,
//   })
//   @ApiResponse({ status: 404, description: 'Department not found' })
//   remove(
//     @Param('department') department: string,
//     @Param('section') section: string,
//   ): Promise<Department> {
//     return this.departmentService.remove(department, section);
//   }
// }

// src/department/department.controller.ts
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
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { DepartmentService } from './department.service';
import { CreateDepartmentDto } from './create-department.dto';
import { Department } from './department.schema';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CaslAbilityGuard } from '../auth/casl-ability.guard';
import { CheckAbilities } from '../auth/casl-ability.decorator';
import { Action } from '../auth/casl-ability.service';

@ApiTags('departments')
@Controller('departments')
@UseGuards(JwtAuthGuard, CaslAbilityGuard)
@ApiBearerAuth('JWT-auth')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @Post()
  @CheckAbilities({ action: Action.Create, subject: Department })
  @ApiOperation({ summary: 'Create a new department' })
  @ApiBody({ type: CreateDepartmentDto })
  @ApiResponse({
    status: 201,
    description: 'Department created successfully',
    type: Department,
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict with existing department data',
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  create(
    @Body() createDepartmentDto: CreateDepartmentDto,
    @Request() req,
  ): Promise<Department> {
    return this.departmentService.create(createDepartmentDto);
  }

  @Get()
  @CheckAbilities({ action: Action.Read, subject: Department })
  @ApiOperation({ summary: 'Get all departments' })
  @ApiResponse({
    status: 200,
    description: 'List of all departments',
    type: [Department],
  })
  findAll(): Promise<Department[]> {
    return this.departmentService.findAll();
  }

  @Get(':department/:section')
  @CheckAbilities({ action: Action.Read, subject: Department })
  @ApiOperation({ summary: 'Get a department by department and section' })
  @ApiParam({ name: 'department', description: 'Department name' })
  @ApiParam({ name: 'section', description: 'Section name' })
  @ApiResponse({
    status: 200,
    description: 'Department found',
    type: Department,
  })
  @ApiResponse({ status: 404, description: 'Department not found' })
  findOne(
    @Param('department') department: string,
    @Param('section') section: string,
  ): Promise<Department> {
    return this.departmentService.findByDepartmentAndSection(
      department,
      section,
    );
  }

  @Put(':department/:section')
  @CheckAbilities({ action: Action.Update, subject: Department })
  @ApiOperation({ summary: 'Update a department' })
  @ApiBody({ type: CreateDepartmentDto })
  @ApiParam({ name: 'department', description: 'Department name' })
  @ApiParam({ name: 'section', description: 'Section name' })
  @ApiResponse({
    status: 200,
    description: 'Department updated successfully',
    type: Department,
  })
  @ApiResponse({ status: 404, description: 'Department not found' })
  @UsePipes(new ValidationPipe({ transform: true }))
  update(
    @Param('department') department: string,
    @Param('section') section: string,
    @Body() updateDepartmentDto: Partial<CreateDepartmentDto>,
  ): Promise<Department> {
    return this.departmentService.update(
      department,
      section,
      updateDepartmentDto,
    );
  }

  @Delete(':department/:section')
  @CheckAbilities({ action: Action.Delete, subject: Department })
  @ApiOperation({ summary: 'Delete a department' })
  @ApiParam({ name: 'department', description: 'Department name' })
  @ApiParam({ name: 'section', description: 'Section name' })
  @ApiResponse({
    status: 200,
    description: 'Department deleted successfully',
    type: Department,
  })
  @ApiResponse({ status: 404, description: 'Department not found' })
  remove(
    @Param('department') department: string,
    @Param('section') section: string,
  ): Promise<Department> {
    return this.departmentService.remove(department, section);
  }
}
