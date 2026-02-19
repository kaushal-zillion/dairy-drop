import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { LoginCredentials } from '../../../models/user.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterLink,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  hide = signal<boolean>(true);
  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);


  loginForm = this.fb.group({
    email: ['', { validators: [Validators.required, Validators.email], nonNullable: true }],
    password: ['', { validators: [Validators.required, Validators.minLength(6)], nonNullable: true }]
  });

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading.set(true);
      this.errorMessage.set(null);
      let credential = this.loginForm.getRawValue();
      this.authService.login(credential as LoginCredentials).subscribe({
        next: (response) => {
          console.log('Login successful', response);
          this.isLoading.set(false);
          this.router.navigate(['/']);
        },
        error: (err) => {
          this.isLoading.set(false);
          this.errorMessage.set(err.error?.message || 'Login failed. Check your credentials.');
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  toggleVisibility(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.hide.update(prev => !prev);
  }
}