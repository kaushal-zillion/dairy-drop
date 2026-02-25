import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Header } from "../../components/header/header";
import { RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { OrderResponse } from '../../models/order.model';
import { ProductService } from '../../services/product.service';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-my-order',
  imports: [FormsModule, Header, RouterLink, MatIcon, DatePipe, CurrencyPipe],
  templateUrl: './my-order.html',
  styleUrl: './my-order.css',
})

export class MyOrder implements OnInit {
  orders = signal<OrderResponse[]>([])
  productService = inject(ProductService);

  dateInput = signal<string | null>(null)
  today = new Date().toISOString().split('T')[0];
  updateDate(value: string) {
    this.dateInput.set(value);
    console.log(this.dateInput());
  }

  filteredOrders = computed(() => {
    const date = this.dateInput();
    if (!date) return this.orders();
    return this.orders().filter(order => order.createdAt.startsWith(date));
  });

  totalSpent = computed(() =>
    this.orders().reduce((acc, obj) => (acc + obj.totalAmount), 0)
  );

  ngOnInit(): void {
    const token = localStorage.getItem('token');

    this.productService.getOrders(token as string).subscribe({
      next: orders => {
        // console.log(orders);
        this.orders.set(orders)
      },
      error: err => console.log(err)
    })
  }

}
