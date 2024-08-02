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

  setState(tok: string, uname: string, umail: string, uid: string) {
    localStorage.setItem('username', uname);
    localStorage.setItem('email', umail);
    localStorage.setItem('uid', uid);
    localStorage.setItem('token', tok);
  }

  isAuth() {
    let username = localStorage.getItem('username');
    let email = localStorage.getItem('email');
    let uid = localStorage.getItem('uid');
    let token = localStorage.getItem('token');

    if (username && email && uid && token) {
      return { username, email, uid, token }
    }
    return null;
  }

  resetState() {
    localStorage.clear();
  }
}
