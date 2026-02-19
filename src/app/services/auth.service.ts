import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { LoginCredentials, LoginResponse, User, UserInfo } from '../models/user.model';
import { tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})

export class AuthService {
  http = inject(HttpClient);
  router = inject(Router);

  baseUrl = 'http://localhost:8000/api';

  currentUser = signal<UserInfo | null>(null)

  login(credentials: LoginCredentials) {
    return this.http.post<LoginResponse>(`${this.baseUrl}/auth/login`, credentials).pipe(tap(res => {
      const { token, ...data } = res;
      localStorage.setItem('token', token);
      this.currentUser.set(data)
    }));
  }

  signup(credentials: User) {
    return this.http.post<LoginResponse>(`${this.baseUrl}/auth/register`, credentials).pipe(tap(res => {
      const { token, ...data } = res;
      localStorage.setItem('token', token);
      this.currentUser.set(data)
    }));
  }

  logout(): void {
    localStorage.removeItem('token');
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }
}
