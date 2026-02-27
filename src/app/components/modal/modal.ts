import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CurrencyPipe } from '@angular/common';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [MatIconModule, CurrencyPipe],
  templateUrl: './modal.html',
  styleUrl: './modal.css',
})
export class Modal {
  @Input() product!: any;
  @Input() isAdded!: boolean;

  @Output() close = new EventEmitter<void>();
  @Output() add = new EventEmitter<void>();

  closeModal() {
    this.close.emit();
  }
  addToCart() {
    this.add.emit();
  }
}
