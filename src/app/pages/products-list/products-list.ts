import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Header } from "../../components/header/header";
import { MatIcon } from '@angular/material/icon';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { ToastrService } from 'ngx-toastr';
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
@Component({
  selector: 'app-products-list',
  imports: [Header, MatIcon, FormsModule, MatPaginatorModule, MatProgressSpinnerModule, MatInputModule, MatSelectModule, MatFormFieldModule],
  templateUrl: './products-list.html',
  styleUrl: './products-list.css',
})

export class ProductsList implements OnInit {
  productService = inject(ProductService);
  cartService = inject(CartService);
  toastr = inject(ToastrService);

  products = signal<Product[]>([])
  isLoading = signal<boolean>(false);
  searchQ = ''
  searchInput = signal<string>('');
  category = signal<string>('all');
  pageSize = signal(8);
  pageIndex = signal(0);

  filteredProducts = computed(() => {
    const word = this.searchInput().toLowerCase();
    const selectedCat = this.category();

    return this.products().filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(word);
      const matchesCategory = selectedCat === 'all' || product.category === selectedCat;
      return matchesSearch && matchesCategory
    })
  })

  visibleProducts = computed(() => {
    const startIndex = this.pageIndex() * this.pageSize();
    const endIndex = startIndex + this.pageSize();
    return this.filteredProducts().slice(startIndex, endIndex);
  });

  handlePageEvent(e: PageEvent) {
    this.pageSize.set(e.pageSize);
    this.pageIndex.set(e.pageIndex);
  }

  setCategory(e: any) {
    this.category.set(e.value);
  }

  onSearchChange() {
    this.searchInput.set(this.searchQ);
    this.pageIndex.set(0);
  }

  addToCart(product: Product) {
    let currentCart = this.cartService.cart();
    currentCart.push({ ...product, qty: 1 })
    this.cartService.cart.set(currentCart);
    this.toastr.success('Added to cart..!', `${product.name.toUpperCase()}`);
    localStorage.setItem('dairy_cart', JSON.stringify(currentCart));
  }

  isAdded(id: string): boolean {
    return this.cartService.cart().find(product => product._id === id) ? true : false
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
