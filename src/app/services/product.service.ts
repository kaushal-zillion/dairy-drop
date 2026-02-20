import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  http = inject(HttpClient);
  private baseUrl = 'http://localhost:8000/api';

  getProduct() {
    return this.http.get<Product[]>(`${this.baseUrl}/products`);
  }

}
