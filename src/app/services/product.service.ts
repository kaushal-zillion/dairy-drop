import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Product } from '../models/product.model';
import { OrderResponse } from '../models/order.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  http = inject(HttpClient);
  baseUrl = 'http://localhost:8000/api';

  getProduct() {
    return this.http.get<Product[]>(`${this.baseUrl}/products`);
  }

  getOrders(token: string) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.get<OrderResponse[]>(`${this.baseUrl}/orders/my`, { headers })
  }
}
