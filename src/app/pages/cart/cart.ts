import { Component, computed, inject, signal } from '@angular/core';
import { CartProduct } from '../../models/product.model';
import { Header } from "../../components/header/header";
import { RouterLink } from '@angular/router';
import { MatIcon } from "@angular/material/icon";
import { CartService } from '../../services/cart.service';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-cart',
  imports: [Header, RouterLink, MatIcon, CurrencyPipe],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart {
  // cartItems = signal<CartProduct[]>([]);
  cartService = inject(CartService);

  increase(item: CartProduct): void {
    this.cartService.cart.update(items =>
      items.map(i => i._id === item._id ? { ...i, qty: i.qty + 1 } : i)
    );
  }

  decrease(item: CartProduct): void {
    this.cartService.cart.update(items =>
      items.map(i => i._id === item._id && i.qty > 1 ? { ...i, qty: i.qty - 1 } : i)
    );
  }

  getProductSubTotal(price: string, qty: number): number {
    return parseInt(price) * qty;
  }

  subtotal = computed(() =>
    this.cartService.cart().reduce((sum, i) => sum + parseInt(i.price) * i.qty, 0)
  );

  totalAmount = computed(() =>
    this.subtotal() + this.deliveryCharge()
  )

  deliveryCharge = computed(() =>
    this.subtotal() >= 299 ? 0 : 40
  );

  removeItem(id: string) {
    this.cartService.cart.update(products => products.filter(p => p._id !== id));
  }


  // ── Checkout
  checkout(): void { }

}
