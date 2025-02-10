import {
  Controller,
  Post,
  Body,
  Get,
  Put,
  Delete,
  Param,
  UseGuards,
  ValidationPipe,
  UsePipes,
  UnauthorizedException,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBasicAuth,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { BasicAuthGuard } from '../basic-auth.guard';
import { User } from './user.schema';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @UseGuards(BasicAuthGuard)
  @ApiBasicAuth('basic')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: 'User successfully created',
    type: User,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid input data',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - Username already exists',
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  async register(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.authService.createUser(
      createUserDto.username,
      createUserDto.password,
      createUserDto.roles,
    );
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'User successfully logged in',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid credentials',
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.authService.validateUser(
      loginDto.username,
      loginDto.password,
    );

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.authService.login(user);
  }

  @Get('users')
  @UseGuards(BasicAuthGuard)
  @ApiBasicAuth('basic')
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'List of users',
    type: [User],
  })
  async getAllUsers(@Request() req): Promise<User[]> {
    return this.authService.getAllUsers();
  }

  @Get('users/:id')
  @UseGuards(BasicAuthGuard)
  @ApiBasicAuth('basic')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({
    status: 200,
    description: 'User details',
    type: User,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async getUserById(@Param('id') userId: string): Promise<User> {
    return this.authService.getUserById(userId);
  }

  @Put('users/:id')
  @UseGuards(BasicAuthGuard)
  @ApiBasicAuth('basic')
  @ApiOperation({ summary: 'Update user' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        username: { type: 'string' },
        password: { type: 'string' },
        role: { type: 'string' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
    type: User,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async updateUser(
    @Param('id') userId: string,
    @Body()
    updateData: {
      password?: string;
      role?: string;
    },
  ): Promise<User> {
    return this.authService.updateUser(userId, updateData);
  }

  @Delete('users/:id')
  @UseGuards(BasicAuthGuard)
  @ApiBasicAuth('basic')
  @ApiOperation({ summary: 'Delete user' })
  @ApiResponse({
    status: 200,
    description: 'User deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async deleteUser(@Param('id') userId: string): Promise<any> {
    return this.authService.deleteUser(userId);
  }
}
