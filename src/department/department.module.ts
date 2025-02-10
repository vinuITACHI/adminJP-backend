// import { Module } from '@nestjs/common';
// import { MongooseModule } from '@nestjs/mongoose';
// import { DepartmentController } from './department.controller';
// import { DepartmentService } from './department.service';
// import { Department, DepartmentSchema } from './department.schema';

// @Module({
//   imports: [
//     MongooseModule.forFeature([
//       { name: Department.name, schema: DepartmentSchema },
//     ]),
//   ],
//   controllers: [DepartmentController],
//   providers: [DepartmentService],
//   exports: [DepartmentService],
// })
// export class DepartmentModule {}

// src/department/department.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DepartmentService } from './department.service';
import { DepartmentController } from './department.controller';
import { Department, DepartmentSchema } from './department.schema';
import { AuthModule } from '../auth/auth.module'; // Import AuthModule
import { CaslAbilityFactory } from '../auth/casl-ability.service'; // Import CaslAbilityFactory

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Department.name, schema: DepartmentSchema },
    ]),
    AuthModule, // Import AuthModule to get CaslAbilityFactory and other auth-related providers
  ],
  controllers: [DepartmentController],
  providers: [
    DepartmentService,
    CaslAbilityFactory, // Add CaslAbilityFactory to providers
  ],
})
export class DepartmentModule {}
