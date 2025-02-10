// // src/auth/casl-ability.service.ts
// import { Injectable } from '@nestjs/common';
// import {
//   Ability,
//   AbilityBuilder,
//   AbilityClass,
//   ExtractSubjectType,
//   InferSubjects,
// } from '@casl/ability';
// import { User } from './user.schema';
// import { Department } from '../department/department.schema';

// export enum Action {
//   Manage = 'manage',
//   Create = 'create',
//   Read = 'read',
//   Update = 'update',
//   Delete = 'delete',
// }

// type Subjects = InferSubjects<typeof Department | 'all'>;

// export type AppAbility = Ability<[Action, Subjects]>;

// @Injectable()
// export class CaslAbilityFactory {
//   createForUser(user: User) {
//     const { can, cannot, build } = new AbilityBuilder<
//       Ability<[Action, Subjects]>
//     >(Ability as AbilityClass<AppAbility>);

//     // Check if user has specific permissions
//     if (user.permissions.includes('manage')) {
//       can(Action.Manage, 'all');
//     } else {
//       // Apply granular permissions based on user's specific permissions
//       if (user.permissions.includes(Action.Create)) {
//         can(Action.Create, Department);
//       }
//       if (user.permissions.includes(Action.Read)) {
//         can(Action.Read, Department);
//       }
//       if (user.permissions.includes(Action.Update)) {
//         can(Action.Update, Department);
//       }
//       if (user.permissions.includes(Action.Delete)) {
//         can(Action.Delete, Department);
//       }
//     }

//     return build({
//       detectSubjectType: (item) =>
//         item.constructor as ExtractSubjectType<Subjects>,
//     });
//   }
// }

// // src/auth/casl-ability.service.ts
// import { Injectable } from '@nestjs/common';
// import {
//   Ability,
//   AbilityBuilder,
//   AbilityClass,
//   ExtractSubjectType,
//   InferSubjects,
// } from '@casl/ability';
// import { User } from './user.schema';
// import { Department } from '../department/department.schema';
// import { Student } from 'src/student/student.schema'; // Assuming you have a student schema
// import { Company } from '../company/company.schema'; // Assuming you have a company schema

// export enum Action {
//   Manage = 'manage',
//   Create = 'create',
//   Read = 'read',
//   Update = 'update',
//   Delete = 'delete',
// }

// type Subjects = InferSubjects<
//   typeof Department | typeof Student | typeof Company | 'all'
// >;

// export type AppAbility = Ability<[Action, Subjects]>;

// @Injectable()
// export class CaslAbilityFactory {
//   createForUser(user: User) {
//     const { can, cannot, build } = new AbilityBuilder<
//       Ability<[Action, Subjects]>
//     >(Ability as AbilityClass<AppAbility>);

//     // Check if user has access to specific pages
//     const hasPageAccess = (page: string) =>
//       user.allowedPages.includes(page) || user.allowedPages.includes('all');

//     // Check if user has specific permissions
//     if (user.permissions.includes('manage')) {
//       can(Action.Manage, 'all');
//     } else {
//       // Department Permissions
//       if (hasPageAccess('departments')) {
//         if (user.permissions.includes(Action.Create)) {
//           can(Action.Create, Department);
//         }
//         if (user.permissions.includes(Action.Read)) {
//           can(Action.Read, Department);
//         }
//         if (user.permissions.includes(Action.Update)) {
//           can(Action.Update, Department);
//         }
//         if (user.permissions.includes(Action.Delete)) {
//           can(Action.Delete, Department);
//         }
//       }

//       // Student Permissions
//       if (hasPageAccess('students')) {
//         if (user.permissions.includes(Action.Create)) {
//           can(Action.Create, Student);
//         }
//         if (user.permissions.includes(Action.Read)) {
//           can(Action.Read, Student);
//         }
//         if (user.permissions.includes(Action.Update)) {
//           can(Action.Update, Student);
//         }
//         if (user.permissions.includes(Action.Delete)) {
//           can(Action.Delete, Student);
//         }
//       }

//       // Company Permissions
//       if (hasPageAccess('companies')) {
//         if (user.permissions.includes(Action.Create)) {
//           can(Action.Create, Company);
//         }
//         if (user.permissions.includes(Action.Read)) {
//           can(Action.Read, Company);
//         }
//         if (user.permissions.includes(Action.Update)) {
//           can(Action.Update, Company);
//         }
//         if (user.permissions.includes(Action.Delete)) {
//           can(Action.Delete, Company);
//         }
//       }
//     }

//     return build({
//       detectSubjectType: (item) =>
//         item.constructor as ExtractSubjectType<Subjects>,
//     });
//   }
// }

import { Injectable } from '@nestjs/common';
import {
  Ability,
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
  InferSubjects,
} from '@casl/ability';
import { User } from './user.schema';
import { Department } from '../department/department.schema';
import { Student } from 'src/student/student.schema';
import { Company } from '../company/company.schema';

export enum Action {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}

type Subjects = InferSubjects<
  typeof Department | typeof Student | typeof Company | 'all'
>;

export type AppAbility = Ability<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  private readonly managedActions = [
    Action.Create,
    Action.Read,
    Action.Update,
    Action.Delete,
  ];

  createForUser(user: User) {
    const { can, cannot, build } = new AbilityBuilder<
      Ability<[Action, Subjects]>
    >(Ability as AbilityClass<AppAbility>);

    const hasPageAccess = (page: string) =>
      user.allowedPages.includes(page) || user.allowedPages.includes('all');

    can(Action.Read, Student, { department: { $in: user.departments } });

    if (user.permissions.includes(Action.Manage)) {
      can(Action.Manage, Student, { department: { $in: user.departments } });
    } else {
      user.permissions.forEach((permission) => {
        if (permission !== Action.Manage) {
          can(permission as Action, Student, {
            department: { $in: user.departments },
          });
        }
      });
    }

    if (user.permissions.includes(Action.Manage)) {
      if (hasPageAccess('departments')) {
        this.managedActions.forEach((action) => can(action, Department));
      }

      if (hasPageAccess('students')) {
        this.managedActions.forEach((action) => can(action, Student));
      }

      if (hasPageAccess('companies')) {
        this.managedActions.forEach((action) => can(action, Company));
      }
    } else {
      // Handle individual permissions
      ['departments', 'students', 'companies'].forEach((page) => {
        if (hasPageAccess(page)) {
          const model = this.getModelForPage(page);
          user.permissions.forEach((permission) => {
            if (permission !== Action.Manage) {
              can(permission as Action, model);
            }
          });
        }
      });
    }

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }

  private getModelForPage(page: string) {
    switch (page) {
      case 'departments':
        return Department;
      case 'students':
        return Student;
      case 'companies':
        return Company;
      default:
        return null;
    }
  }
}
