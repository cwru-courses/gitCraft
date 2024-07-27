import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  BASE_URL = '';
  // BASE_URL = 'http://localhost:8080';

  loading = false;

  constructor(private _snackBar: MatSnackBar) { }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 5 * 1000,
      verticalPosition: 'bottom',
      horizontalPosition: 'left',
    });
  }
}
