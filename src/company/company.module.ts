import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';
import { Company, CompanySchema } from './company.schema';
import { AuthModule } from '../auth/auth.module'; // Import AuthModule
import { CaslAbilityFactory } from '../auth/casl-ability.service'; // Import CaslAbilityFactory

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Company.name, schema: CompanySchema }]),
    AuthModule,
  ],
  controllers: [CompanyController],
  providers: [CompanyService, CaslAbilityFactory],
})
export class CompanyModule {}
