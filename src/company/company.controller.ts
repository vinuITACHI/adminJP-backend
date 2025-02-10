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
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './create-company.dto';
import { Company } from './company.schema';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CaslAbilityGuard } from '../auth/casl-ability.guard';
import { CheckAbilities } from '../auth/casl-ability.decorator';
import { Action } from '../auth/casl-ability.service';

@ApiTags('companies')
@Controller('companies')
@UseGuards(JwtAuthGuard, CaslAbilityGuard)
@ApiBearerAuth('JWT-auth')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  @CheckAbilities({ action: Action.Create, subject: Company })
  @ApiOperation({ summary: 'Create a new company' })
  @ApiBody({ type: CreateCompanyDto })
  @ApiResponse({
    status: 201,
    description: 'Company created successfully',
    type: Company,
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict with existing company data',
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  create(@Body() createCompanyDto: CreateCompanyDto): Promise<Company> {
    return this.companyService.create(createCompanyDto);
  }

  @Get()
  @CheckAbilities({ action: Action.Read, subject: Company })
  @ApiOperation({ summary: 'Get all companies' })
  @ApiResponse({
    status: 200,
    description: 'List of all companies',
    type: [Company],
  })
  findAll(): Promise<Company[]> {
    return this.companyService.findAll();
  }

  @Get(':email')
  @CheckAbilities({ action: Action.Read, subject: Company })
  @ApiOperation({ summary: 'Get a company by email' })
  @ApiResponse({ status: 200, description: 'Company found', type: Company })
  @ApiResponse({ status: 404, description: 'Company not found' })
  findOne(@Param('email') email: string): Promise<Company> {
    return this.companyService.findOne(email);
  }

  @Put(':email')
  @CheckAbilities({ action: Action.Update, subject: Company })
  @ApiOperation({ summary: 'Update a company' })
  @ApiBody({ type: CreateCompanyDto })
  @ApiResponse({
    status: 200,
    description: 'Company updated successfully',
    type: Company,
  })
  @ApiResponse({ status: 404, description: 'Company not found' })
  @UsePipes(new ValidationPipe({ transform: true }))
  update(
    @Param('email') email: string,
    @Body() updateCompanyDto: Partial<CreateCompanyDto>,
  ): Promise<Company> {
    return this.companyService.update(email, updateCompanyDto);
  }

  @Delete(':email')
  @CheckAbilities({ action: Action.Delete, subject: Company })
  @ApiOperation({ summary: 'Delete a company' })
  @ApiResponse({
    status: 200,
    description: 'Company deleted successfully',
    type: Company,
  })
  @ApiResponse({ status: 404, description: 'Company not found' })
  remove(@Param('email') email: string): Promise<Company> {
    return this.companyService.remove(email);
  }
}
