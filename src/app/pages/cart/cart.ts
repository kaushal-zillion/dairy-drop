import { Component, computed, inject, signal } from '@angular/core';
import { CartProduct } from '../../models/product.model';
import { Header } from "../../components/header/header";
import { RouterLink } from '@angular/router';
import { MatIcon } from "@angular/material/icon";
import { CartService } from '../../services/cart.service';
import { CurrencyPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { OrderResponse } from '../../models/order.model';

@Component({
  selector: 'app-cart',
  imports: [Header, RouterLink, MatIcon, CurrencyPipe],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})

export class Cart {
  // cartItems = signal<CartProduct[]>([]);
  cartService = inject(CartService);
  private http = inject(HttpClient);
  toastr = inject(ToastrService);

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
    this.toastr.warning('Product removed..!')
  }

  async onCheckout() {

    const amount = this.totalAmount();

    const order: any = await firstValueFrom(
      this.http.post('http://localhost:8000/create-order', { amount })
    );

    // load script safely
    if (!(window as any).Razorpay) {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      document.body.appendChild(script);

      await new Promise<void>((resolve) => {
        script.onload = () => resolve();
      });
    }

    // 3️⃣ Open checkout
    const options = {
      key: 'rzp_test_M6oi5oO1L17CmQ',
      amount: order.amount,
      currency: 'INR',
      name: 'Dairy Drop',
      description: 'Test Payment',
      order_id: order.id,

      handler: (response: any) => {
        const resProducts = this.cartService.cart().map(p => ({ product: p._id, quantity: p.qty }))
        const token = localStorage.getItem('token');

        this.http.post('http://localhost:8000/api/orders', { products: resProducts, totalAmount: this.totalAmount() }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }).subscribe({
          next: () => {
            this.toastr.success('Order placed');
            this.cartService.cart.set([]);
          },
          error: (err) => {
            this.toastr.error(err.error?.message)
            console.log(err);
          }
        })

        // console.log('Payment success:', response);
      },

      theme: { color: '#3399cc' }
    };
    const Razorpay = (window as any).Razorpay;
    const rzp = new Razorpay(options);

    rzp.on('payment.failed', (response: any) => {
      console.log(response);
      this.toastr.error('Payment failed ❌');
    });
    rzp.open();
  }

}
