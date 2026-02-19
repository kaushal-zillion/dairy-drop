import { Component, computed, inject, signal } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
   authService = inject(AuthService);
  // private cartService = inject(CartService);
  private router = inject(Router);

  // ── Signals
  menuOpen = signal<boolean>(false);

  // ── From services (expose as signals / computed)
  // Replace these with your actual service calls:
  currentUser = computed(() => this.authService.currentUser());   // signal<User|null>
  // cartCount = computed(() => this.cartService.itemCount());     // signal<number>

  // ── Mobile menu
  toggleMobileMenu(): void {
    this.menuOpen.update(v => !v);
  }

  closeMobileMenu(): void {
    this.menuOpen.set(false);
  }

  // ── Logout
  onLogout(): void {
    this.authService.logout();          // clears token / user state
    this.closeMobileMenu();
    this.router.navigate(['/login']);
  }
}
