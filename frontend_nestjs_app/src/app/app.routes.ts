import { Routes } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { UsersComponent } from './components/users/users.component';

export const routes: Routes = [
    {
        path: 'admin',
        loadChildren: () => import('./components/admin/admin.routes').then(m => m.ADMIN_ROUTES)
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
        path: 'users',
        children: [
            {
                path: '',
                component: UsersComponent
            }
        ]
    }
];
