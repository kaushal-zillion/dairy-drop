import { effect, Injectable, signal } from '@angular/core';
import { CartProduct } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  cart = signal<CartProduct[]>([]);
  isLoading = signal<boolean>(false);
  constructor() {
    const storedCart = localStorage.getItem('dairy_cart');
    if (storedCart) {
      try {
        this.cart.set(JSON.parse(storedCart));
      } catch (err) {
        console.error("Could not parse cart data", err);
      }
    }

    effect(() => {
      localStorage.setItem('dairy_cart', JSON.stringify(this.cart()));
    });
  }

}
