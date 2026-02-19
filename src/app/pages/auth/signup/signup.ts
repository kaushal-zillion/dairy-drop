import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-signup',
  imports: [
    RouterLink,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})

export class Signup {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  hide = signal<boolean>(true);
  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);


  signupForm = this.fb.group({
    name: ['', { validators: [Validators.required], nonNullable: true }],
    email: ['', { validators: [Validators.required, Validators.email], nonNullable: true }],
    password: ['', { validators: [Validators.required, Validators.minLength(6)], nonNullable: true }]
  });

  onSubmit(): void {
    if (this.signupForm.valid) {
      this.isLoading.set(true);
      this.errorMessage.set(null);
      let credential = this.signupForm.getRawValue();
      this.authService.signup(credential as User).subscribe({
        next: (response) => {
          // console.log('signup successful', response);
          this.isLoading.set(false);
          this.router.navigate(['/']);
        },
        error: (err) => {
          this.isLoading.set(false);
          this.errorMessage.set(err.error?.message || 'something went wrong !');
        }
      });
    } else {
      this.signupForm.markAllAsTouched();
    }
  }

  toggleVisibility(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.hide.update(prev => !prev);
  }
}
