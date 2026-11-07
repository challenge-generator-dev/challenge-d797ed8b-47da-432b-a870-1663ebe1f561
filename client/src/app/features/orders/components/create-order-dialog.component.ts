import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-create-order-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule
  ],
  template: `
    <h2 mat-dialog-title>
      <mat-icon>add_shopping_cart</mat-icon>
      Crear Nueva Orden
    </h2>
    <mat-dialog-content>
      <form [formGroup]="orderForm" class="order-form">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>ID de Cliente</mat-label>
          <input matInput formControlName="customerId" placeholder="Ingrese el ID del cliente">
          <mat-icon matSuffix>person</mat-icon>
          <mat-error *ngIf="orderForm.get('customerId')?.hasError('required')">
            El ID de cliente es obligatorio
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Producto</mat-label>
          <mat-select formControlName="productId">
            <mat-option *ngFor="let product of products" [value]="product.id">
              {{ product.name }} - \${{ product.price }}
            </mat-option>
          </mat-select>
          <mat-error *ngIf="orderForm.get('productId')?.hasError('required')">
            Seleccione un producto
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Cantidad</mat-label>
          <input matInput type="number" formControlName="quantity" min="1" max="100">
          <mat-icon matSuffix>numbers</mat-icon>
          <mat-error *ngIf="orderForm.get('quantity')?.hasError('required')">
            La cantidad es obligatoria
          </mat-error>
          <mat-error *ngIf="orderForm.get('quantity')?.hasError('min')">
            Mínimo 1 unidad
          </mat-error>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()" class="cancel-button">
        Cancelar
      </button>
      <button mat-raised-button color="primary" 
              (click)="onSubmit()" 
              [disabled]="!orderForm.valid"
              class="submit-button">
        <mat-icon>check</mat-icon>
        Crear Orden
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .order-form {
      display: flex;
      flex-direction: column;
      gap: 8px;
      min-width: 400px;
      padding-top: 8px;
    }
    .full-width {
      width: 100%;
    }
    h2 {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #1976d2;
    }
    mat-dialog-actions {
      padding: 16px 0;
    }
    .submit-button {
      margin-left: 8px;
    }
  `]
})
export class CreateOrderDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<CreateOrderDialogComponent>);

  readonly orderForm: FormGroup = this.fb.group({
    customerId: ['', [Validators.required, Validators.minLength(3)]],
    productId: ['', Validators.required],
    quantity: [1, [Validators.required, Validators.min(1), Validators.max(100)]]
  });

  readonly products = [
    { id: 'PROD-001', name: 'Laptop Pro 15"', price: 1299.99 },
    { id: 'PROD-002', name: 'Mouse Inalámbrico', price: 49.99 },
    { id: 'PROD-003', name: 'Teclado Mecánico', price: 149.99 },
    { id: 'PROD-004', name: 'Monitor 27" 4K', price: 449.99 },
    { id: 'PROD-005', name: 'Auriculares Bluetooth', price: 199.99 }
  ];

  onSubmit(): void {
    if (this.orderForm.valid) {
      const formValue = this.orderForm.value;
      this.dialogRef.close(formValue);
    } else {
      this.orderForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.dialogRef.close(null);
  }
}