import { Component, Inject, inject } from '@angular/core';
import { MatSnackBarRef } from '@angular/material/snack-bar';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'app-snackbar-message',
  templateUrl: './snackbar-message.component.html',
  styleUrl: './snackbar-message.component.css',
  standalone: false
})
export class SnackbarMessageComponent {
  
  snackBarRef = inject(MatSnackBarRef);

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: string[]) {}
  
}
