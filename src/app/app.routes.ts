import { Routes } from '@angular/router';
import { Login } from './pages/auth/login/login';
import { Signup } from './pages/auth/signup/signup';
import { authGuardGuard } from './gaurd/auth-guard-guard';
import { Home } from './pages/home/home';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'login', component: Login },
    { path: 'signup', component: Signup },
    { path: 'products', canActivate: [authGuardGuard], loadComponent: () => import('./pages/products-list/products-list').then(m => m.ProductsList) },
    { path: 'cart', canActivate: [authGuardGuard], loadComponent: () => import('./pages/cart/cart').then(m => m.Cart) },
    { path: 'my-order', canActivate: [authGuardGuard], loadComponent: () => import('./pages/my-order/my-order').then(m => m.MyOrder) }
];
