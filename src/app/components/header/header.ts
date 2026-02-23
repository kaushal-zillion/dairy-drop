import { Component, computed, inject, signal } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  authService = inject(AuthService);
  cartService = inject(CartService)
  router = inject(Router);

  menuOpen = signal<boolean>(false);
  // currentUser = computed(() => this.authService.currentUser());

  toggleMobileMenu(): void {
    this.menuOpen.update(v => !v);
  }
  closeMobileMenu(): void {
    this.menuOpen.set(false);
  }
  onLogout(): void {
    this.authService.logout();
    this.closeMobileMenu();
    this.router.navigate(['/login']);
  }
}
