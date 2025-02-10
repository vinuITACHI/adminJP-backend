import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StudentController } from './student.controller';
import { StudentService } from './student.service';
import { Student, StudentSchema } from './student.schema';
import { AuthModule } from '../auth/auth.module'; // Import AuthModule
import { CaslAbilityFactory } from '../auth/casl-ability.service'; // Import CaslAbilityFactory

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Student.name, schema: StudentSchema }]),
    AuthModule,
  ],
  controllers: [StudentController],
  providers: [StudentService, CaslAbilityFactory],
})
export class StudentModule {}
