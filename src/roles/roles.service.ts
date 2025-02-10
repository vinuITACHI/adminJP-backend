// import {
//   Injectable,
//   ConflictException,
//   NotFoundException,
// } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import { Role, RoleDocument } from './role.schema';
// import { User, UserDocument } from '../auth/user.schema';
// import { CreateRoleDto } from './dto/create-role.dto';

// @Injectable()
// export class RolesService {
//   constructor(
//     @InjectModel(Role.name) private roleModel: Model<RoleDocument>,
//     @InjectModel(User.name) private userModel: Model<UserDocument>,
//   ) {}

//   async createRole(createRoleDto: CreateRoleDto): Promise<Role> {
//     // Check if role already exists
//     const existingRole = await this.roleModel.findOne({
//       roleName: createRoleDto.roleName,
//     });

//     if (existingRole) {
//       throw new ConflictException('Role already exists');
//     }

//     const role = new this.roleModel(createRoleDto);
//     return role.save();
//   }

//   async findAllRoles(): Promise<Role[]> {
//     return this.roleModel.find();
//   }

//   async findRoleByName(roleName: string): Promise<Role> {
//     const role = await this.roleModel.findOne({ roleName });
//     if (!role) {
//       throw new NotFoundException(`Role ${roleName} not found`);
//     }
//     return role;
//   }

//   async updateRole(
//     roleName: string,
//     updateRoleDto: Partial<CreateRoleDto>,
//   ): Promise<Role> {
//     // Find and update the role
//     const role = await this.roleModel.findOneAndUpdate(
//       { roleName },
//       updateRoleDto,
//       { new: true },
//     );

//     if (!role) {
//       throw new NotFoundException(`Role ${roleName} not found`);
//     }

//     // Synchronize users with the updated role
//     await this.userModel.updateMany(
//       { role: roleName },
//       {
//         allowedPages: role.allowedPages,
//         permissions: role.permissions,
//       },
//     );

//     return role;
//   }

//   async deleteRole(roleName: string): Promise<void> {
//     const result = await this.roleModel.deleteOne({ roleName });
//     if (result.deletedCount === 0) {
//       throw new NotFoundException(`Role ${roleName} not found`);
//     }
//   }
// }

import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role, RoleDocument } from './role.schema';
import { User, UserDocument } from '../auth/user.schema';
import { CreateRoleDto } from './dto/create-role.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Role.name) private roleModel: Model<RoleDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async createRole(createRoleDto: CreateRoleDto): Promise<Role> {
    const existingRole = await this.roleModel.findOne({
      roleName: createRoleDto.roleName,
    });

    if (existingRole) {
      throw new ConflictException('Role already exists');
    }

    const role = new this.roleModel({
      roleName: createRoleDto.roleName,
      permissions: createRoleDto.permissions,
      allowedPages: createRoleDto.allowedPages,
      departments: createRoleDto.departments || [], // Add departments
    });

    return role.save();
  }

  async findAllRoles(): Promise<Role[]> {
    return this.roleModel.find();
  }

  async findRoleByName(roleName: string): Promise<Role> {
    const role = await this.roleModel.findOne({ roleName });
    if (!role) {
      throw new NotFoundException(`Role ${roleName} not found`);
    }
    return role;
  }

  async updateRole(
    roleName: string,
    updateRoleDto: Partial<CreateRoleDto>,
  ): Promise<Role> {
    const role = await this.roleModel.findOneAndUpdate(
      { roleName },
      updateRoleDto,
      { new: true },
    );

    if (!role) {
      throw new NotFoundException(`Role ${roleName} not found`);
    }

    // Update users with this role to reflect new departments
    await this.userModel.updateMany(
      { roles: roleName },
      {
        $set: {
          departments: role.departments,
          allowedPages: role.allowedPages,
          permissions: role.permissions,
        },
      },
    );

    return role;
  }

  async deleteRole(roleName: string): Promise<void> {
    const users = await this.userModel.find({ roles: roleName });

    for (const user of users) {
      const newRoles = user.roles.filter((role) => role !== roleName);

      if (newRoles.length > 0) {
        const updatedRoles = await Promise.all(
          newRoles.map((name) => this.roleModel.findOne({ roleName: name })),
        );

        const allowedPages = [
          ...new Set(updatedRoles.flatMap((role) => role.allowedPages)),
        ];
        const permissions = [
          ...new Set(updatedRoles.flatMap((role) => role.permissions)),
        ];

        await this.userModel.updateOne(
          { _id: user._id },
          { roles: newRoles, allowedPages, permissions },
        );
      } else {
        await this.userModel.updateOne(
          { _id: user._id },
          { roles: [], allowedPages: [], permissions: [] },
        );
      }
    }

    const result = await this.roleModel.deleteOne({ roleName });
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Role ${roleName} not found`);
    }
  }
}
