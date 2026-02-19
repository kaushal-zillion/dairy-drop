import { Routes } from '@angular/router';
import { Login } from './pages/auth/login/login';
import { Signup } from './pages/auth/signup/signup';
import { authGuardGuard } from './gaurd/auth-guard-guard';

export const routes: Routes = [
    { path: 'login', component: Login },
    { path: 'signup', component: Signup },
    { path: '', canActivate: [authGuardGuard], loadComponent: () => import('./pages/products-list/products-list').then(m => m.ProductsList) }
];
