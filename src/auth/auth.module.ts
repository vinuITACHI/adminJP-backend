// import { Module } from '@nestjs/common';
// import { JwtModule } from '@nestjs/jwt';
// import { MongooseModule } from '@nestjs/mongoose';
// import { PassportModule } from '@nestjs/passport';
// import { AuthController } from './auth.controller';
// import { AuthService } from './auth.service';
// import { User, UserSchema } from './user.schema';
// import { RolesModule } from '../roles/roles.module';

// @Module({
//   imports: [
//     PassportModule,
//     RolesModule,
//     JwtModule.register({
//       secret: process.env.JWT_SECRET || 'fallback_secret_key', // Use environment variable in production
//       signOptions: { expiresIn: '1d' },
//     }),
//     MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
//   ],
//   controllers: [AuthController],
//   providers: [AuthService],
//   exports: [AuthService],

// })
// export class AuthModule {}

// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User, UserSchema } from './user.schema';
import { RolesModule } from '../roles/roles.module';
import { JwtStrategy } from './jwt.strategy';
import { CaslAbilityFactory } from './casl-ability.service';

@Module({
  imports: [
    PassportModule,
    RolesModule,
    JwtModule.register({
      secret:
        '9cd4db0f32b0d496db20242e601ab8e91a12b1c427ee22c838f4a52b35fc8c17',
      signOptions: { expiresIn: '1d' },
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, CaslAbilityFactory],
  exports: [AuthService, CaslAbilityFactory],
})
export class AuthModule {}
