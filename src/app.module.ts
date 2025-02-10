import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StudentModule } from './student/student.module';
import { CompanyModule } from './company/company.module';
import { DepartmentModule } from './department/department.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    //MongooseModule.forRoot('mongodb://localhost:27017/adminjpdb'), this is regular
    MongooseModule.forRoot(
      process.env.MONGO_URI || 'mongodb://localhost:27017/adminjpdb',
    ),
    StudentModule,
    CompanyModule,
    DepartmentModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
