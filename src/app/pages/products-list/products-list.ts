import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Header } from "../../components/header/header";
import { MatIcon } from '@angular/material/icon';
import { CartProduct, Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-products-list',
  imports: [Header, MatIcon, FormsModule],
  templateUrl: './products-list.html',
  styleUrl: './products-list.css',
})

export class ProductsList implements OnInit {
  productService = inject(ProductService);
  cartService = inject(CartService);
  products = signal<Product[]>([])
  isLoading = signal<boolean>(false);
  searchInput = signal<string>('');

  filteredProducts = computed(() => {
    let word = this.searchInput().toLowerCase();
    return this.products().filter(product => product.name.toLowerCase().includes(word));
  })

  addToCart(product: Product) {
    let currentCart = this.cartService.cart();
    let editIdx = currentCart.findIndex(p => p._id === product._id)
    if (editIdx !== -1) {
      currentCart[editIdx].qty += 1;
    } else {
      currentCart.push({ ...product, qty: 1 })
    }
    this.cartService.cart.set(currentCart);
    localStorage.setItem('dairy_cart', JSON.stringify(currentCart));
  }

  isAdded(id: string): boolean {
    return false
  }

  getUnit(category: string): any {
    switch (category) {
      case "sweets": return "kg";
      case "milk": return "ltr";
      case "dairy": return "qty";
    }
  }

  ngOnInit(): void {
    this.isLoading.set(true);
    this.productService.getProduct().subscribe({
      next: products => {
        this.products.set(products)
        this.isLoading.set(false);
      },
      error: (err) => {
        console.log(err)
        this.isLoading.set(false);
      }
    })
  }
}
