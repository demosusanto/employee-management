import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/guards/auth.guard';
import { MainLayoutComponent } from './shared/components/main-layout/main-layout.component';

export const routes: Routes = [
    {
        path: 'login',
        title: 'Login - CorpFlow Backoffice',
        canActivate: [guestGuard],
        loadComponent: () =>
            import('./features/auth/login/login.component').then((m) => m.LoginComponent),
    },
    {
        path: '',
        component: MainLayoutComponent,
        canActivate: [authGuard],
        children: [
            {
                path: '',
                redirectTo: 'employees',
                pathMatch: 'full',
            },
            {
                path: 'employees',
                title: 'Employee List - CorpFlow Backoffice',
                loadComponent: () =>
                    import('./features/employees/employee-list/employee-list.component').then(
                        (m) => m.EmployeeListComponent
                    ),
            },
            {
                path: 'employees/add',
                title: 'Add Employee - CorpFlow Backoffice',
                loadComponent: () =>
                    import('./features/employees/add-employee/add-employee.component').then(
                        (m) => m.AddEmployeeComponent
                    ),
            },
            {
                path: 'employees/edit/:username',
                title: 'Edit Employee - CorpFlow Backoffice',
                loadComponent: () =>
                    import('./features/employees/add-employee/add-employee.component').then(
                        (m) => m.AddEmployeeComponent
                    ),
            },
            {
                path: 'employees/detail/:username',
                title: 'Employee Detail - CorpFlow Backoffice',
                loadComponent: () =>
                    import('./features/employees/employee-detail/employee-detail.component').then(
                        (m) => m.EmployeeDetailComponent
                    ),
            },
        ],
    },
    {
        path: '**',
        redirectTo: 'employees',
    },
];