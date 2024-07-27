import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppService } from '../../app.service';

@Injectable({
  providedIn: 'root',
})
export class SignupService {

  constructor(private http: HttpClient, private appService: AppService) { }

  signup(name: string | null, email: string | null, password: string | null) {
    return this.http.post(`${this.appService.BASE_URL}/user`, {
      name,
      email,
      password,
    });
  }

  verify(email: string | null, otp: string | null) {
    return this.http.post(`${this.appService.BASE_URL}/user/otp`, {
      email,
      otp,
    });
  }
}