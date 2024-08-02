import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppService } from '../../app.service';

@Injectable({
  providedIn: 'root',
})
export class LoginService {

  constructor(private http: HttpClient, private appService: AppService) { }

  login(email: string | null, password: string | null) {
    return this.http.post(`${this.appService.BASE_URL}/user/login`, {
      email,
      password,
    });
  }

  forgot(email: string | null) {
    return this.http.post(`${this.appService.BASE_URL}/user/forgot`, {
      email,
    });
  }
}
// _khR*HU50NWB