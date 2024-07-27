import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppService } from '../../app.service';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private http: HttpClient, private appService: AppService) { }

  logout(token: any) {
    return this.http.post(`${this.appService.BASE_URL}/user/logout`, {},
      { headers: new HttpHeaders().set('x-access-token', token) });
  }

  getPost(status: any, token: any) {
    let reqBody = {}
    if (status['status'])
      reqBody = status

    return this.http.post(`${this.appService.BASE_URL}/post/get`, reqBody,
      { headers: new HttpHeaders().set('x-access-token', token) });
  }

  createPost(title: any, description: any, file: any, status: any, token: any) {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('status', status);

    return this.http.post(`${this.appService.BASE_URL}/post/`, formData,
      { headers: new HttpHeaders().set('x-access-token', token) });
  }

  change(password: any, token: any) {
    return this.http.put(`${this.appService.BASE_URL}/user/`, { password },
      { headers: new HttpHeaders().set('x-access-token', token) });
  }

  editPost(title: any, description: any, file: any, status: any, id: any, token: any) {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('status', status);

    return this.http.put(`${this.appService.BASE_URL}/post/${id}`, formData,
      { headers: new HttpHeaders().set('x-access-token', token) });
  }

  delPost(id: any, token: any) {
    return this.http.delete(`${this.appService.BASE_URL}/post/${id}`,
      { headers: new HttpHeaders().set('x-access-token', token) });
  }
}
