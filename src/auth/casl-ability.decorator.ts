// // src/auth/casl-ability.decorator.ts
// import { SetMetadata } from '@nestjs/common';
// import { Action } from './casl-ability.service';
// import { Department } from '../department/department.schema';

// export interface RequiredRule {
//   action: Action;
//   subject: typeof Department | 'all';
// }

// export const CHECK_ABILITY_KEY = 'check_ability';
// export const CheckAbilities = (...requirements: RequiredRule[]) =>
//   SetMetadata(CHECK_ABILITY_KEY, requirements);

// src/auth/casl-ability.decorator.ts
import { SetMetadata } from '@nestjs/common';
import { Action } from './casl-ability.service';
import { Department } from '../department/department.schema';
import { Student } from 'src/student/student.schema';
import { Company } from '../company/company.schema';

export interface RequiredRule {
  action: Action;
  subject: typeof Department | typeof Student | typeof Company | 'all';
}

export const CHECK_ABILITY_KEY = 'check_ability';
export const CheckAbilities = (...requirements: RequiredRule[]) =>
  SetMetadata(CHECK_ABILITY_KEY, requirements);
