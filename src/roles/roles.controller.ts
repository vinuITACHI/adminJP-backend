import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { Role } from './role.schema';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('roles')
@Controller('roles')
export class RolesController {
  constructor(private rolesService: RolesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new role' })
  @ApiBody({ type: CreateRoleDto })
  @ApiResponse({
    status: 201,
    description: 'Role successfully created',
    type: Role,
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  async createRole(@Body() createRoleDto: CreateRoleDto): Promise<Role> {
    return this.rolesService.createRole(createRoleDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all roles' })
  @ApiResponse({ status: 200, description: 'List of roles', type: [Role] })
  async getAllRoles(): Promise<Role[]> {
    return this.rolesService.findAllRoles();
  }

  @Get(':roleName')
  @ApiOperation({ summary: 'Get role by name' })
  @ApiResponse({ status: 200, description: 'Role details', type: Role })
  async getRoleByName(@Param('roleName') roleName: string): Promise<Role> {
    return this.rolesService.findRoleByName(roleName);
  }

  @Put(':roleName')
  @ApiOperation({ summary: 'Update role' })
  @ApiBody({ type: CreateRoleDto })
  @ApiResponse({
    status: 200,
    description: 'Role updated successfully',
    type: Role,
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateRole(
    @Param('roleName') roleName: string,
    @Body() updateRoleDto: Partial<CreateRoleDto>,
  ): Promise<Role> {
    return this.rolesService.updateRole(roleName, updateRoleDto);
  }

  @Delete(':roleName')
  @ApiOperation({ summary: 'Delete role' })
  @ApiResponse({ status: 200, description: 'Role deleted successfully' })
  async deleteRole(@Param('roleName') roleName: string): Promise<void> {
    return this.rolesService.deleteRole(roleName);
  }
}
