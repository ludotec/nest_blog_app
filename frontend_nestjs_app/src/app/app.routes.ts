import { Routes } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { UsersComponent } from './components/users/users.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { authGuard } from './guards/auth.guard';
import { UpdateUserProfileComponent } from './components/update-user-profile/update-user-profile.component';
import { ErrorTestComponent } from './core/errors/component-test/error-test/error-test.component';
import { userAdminGuard } from './guards/user-admin.guard';
import { userIsUserGuard } from './guards/user-is-user.guard';

export const routes: Routes = [
    {
        path: 'admin',
        loadChildren: () => import('./components/admin/admin.routes').then(m => m.ADMIN_ROUTES),
        canActivate: [userAdminGuard],
    },
    {
        path:'register', 
        component: RegisterComponent
    },
    {
        path:'login', 
        component: LoginComponent
    },
    {
        path:'error-test', 
        component: ErrorTestComponent
    },
    {
        path: 'users',
        children: [
            {
                path: '',
                component: UsersComponent,
                canActivate: [userAdminGuard],
            },
            {
                path: ':id',
                component: UserProfileComponent,
                canActivate: [userIsUserGuard]
            }
        ]
    },
    {
        path: 'update-profile',
        component: UpdateUserProfileComponent,
        canActivate: [authGuard]
    },
    {
        path: '',
        redirectTo: '/login',
        pathMatch: 'full',
    },
    {
        path: '**',
        redirectTo: '/login',
        pathMatch: 'full',
    }
];
