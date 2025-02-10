import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './user.schema';
import { RolesService } from '../roles/roles.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private rolesService: RolesService,
  ) {}

  async createUser(
    username: string,
    password: string,
    roleNames: string[],
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);

    // Get all roles and combine their properties
    const roles = await Promise.all(
      roleNames.map((name) => this.rolesService.findRoleByName(name)),
    );

    const allowedPages = [
      ...new Set(roles.flatMap((role) => role.allowedPages)),
    ];

    const permissions = [...new Set(roles.flatMap((role) => role.permissions))];

    const departments = [...new Set(roles.flatMap((role) => role.departments))];

    const user = new this.userModel({
      username,
      password: hashedPassword,
      roles: roleNames,
      allowedPages,
      permissions,
      departments,
    });

    return user.save();
  }

  async validateUser(username: string, password: string) {
    const user = await this.userModel.findOne({ username });
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user.toObject();
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = {
      username: user.username,
      sub: user._id,
      roles: user.roles,
      allowedPages: user.allowedPages,
      permissions: user.permissions,
      departments: user.departments, // Add this line
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  // New CRUD methods
  async getAllUsers() {
    return this.userModel.find().select('-password');
  }

  async getUserById(userId: string) {
    const user = await this.userModel.findById(userId).select('-password');
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updateUser(
    userId: string,
    updateData: {
      password?: string;
      roles?: string[];
      allowedPages?: string[];
      permissions?: string[];
      // other fields
    },
  ): Promise<User> {
    if (updateData.roles) {
      const roles = await Promise.all(
        updateData.roles.map((name) => this.rolesService.findRoleByName(name)),
      );

      updateData.allowedPages = [
        ...new Set(roles.flatMap((role) => role.allowedPages)),
      ];

      updateData.permissions = [
        ...new Set(roles.flatMap((role) => role.permissions)),
      ];

      // Automatically assign departments based on roles
      updateData['departments'] = [
        ...new Set(roles.flatMap((role) => role.departments)),
      ];
    }
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const updatedUser = await this.userModel
      .findByIdAndUpdate(userId, updateData, { new: true })
      .select('-password');

    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }

    return updatedUser;
  }

  async deleteUser(userId: string) {
    const deletedUser = await this.userModel.findByIdAndDelete(userId);
    if (!deletedUser) {
      throw new NotFoundException('User not found');
    }
    return { message: 'User successfully deleted' };
  }
}
