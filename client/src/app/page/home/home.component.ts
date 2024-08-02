import { Component, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';
import { GridComponent } from "./grid/grid.component";
import { PostService } from './post.service';
import { catchError } from 'rxjs';
import { AppService } from '../../app.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from './grid/modal/modal.component';
import { MatCardModule } from '@angular/material/card';
import { ChangeComponent } from './change/change.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatStepperModule,
    MatIconModule, MatMenuModule, MatCardModule, MatButtonModule, MatTooltipModule, MatIconModule, GridComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  userObject: any = null
  constructor(private postService: PostService, private appService: AppService, private route: ActivatedRoute, private router: Router) {
    appService.loading = true;
    this.userObject = appService.isAuth()
    if (this.userObject === null) {
      router.navigate(['login'])
      appService.loading = false;
    } else {
      appService.loading = false;
      this.userName = this.userObject.username;
      this.avatarUrl = `https://avatar.iran.liara.run/public/boy?username=${this.userObject.email}*`;
    }
  }
  userName: string = '';
  avatarUrl: string = '';

  logout() {
    this.appService.loading = true;
    this.postService.logout(this.userObject.token).pipe(catchError(async (error) => {
      if (error.status !== 200 && error.error.message) {
        this.appService.openSnackBar(error.error.message, '⛔️');
        this.appService.loading = false;
      }
    })).subscribe((config: any) => {
      if (config) {
        this.appService.openSnackBar(config.message, '✅');
        this.appService.resetState();
        this.router.navigate(['login']);
      }
      this.appService.loading = false;
    });
  }

  page: string = ''
  reqBody: any = {};
  count: number = 0

  find(state: number) {
    if (state === 1) {
      this.reqBody = {}
      this.page = 'Community'
    } else if (state === 2) {
      this.reqBody['status'] = 'public';
      this.page = 'Public'
    } else if (state === 3) {
      this.reqBody['status'] = 'private';
      this.page = 'Private'
    }
    this.loadPosts();
  }

  posts: any[] = []

  ngOnInit(): void {
    this.route.queryParams.subscribe(param => {
      if (param['view'] === 'global' || param['view'] === undefined) {
        this.find(1)
      } else if (param['view'] === 'public') {
        this.find(2)
      }
      else if (param['view'] === 'private') {
        this.find(3)
      }
    })
  }

  loadPosts() {
    this.appService.loading = true;
    this.postService.getPost(this.reqBody, this.userObject.token).pipe(catchError(async (error) => {
      if (error.status !== 200 && error.error.message) {
        this.appService.openSnackBar(error.error.message, '⛔️');
        this.appService.loading = false;
        if (error.error.message === 'jwt expired') {
          this.appService.resetState();
          this.router.navigate(['login']);
        }
      }
    })).subscribe((config: any) => {
      if (config) {
        this.appService.openSnackBar(config.message, '✅');
        if (config.data.length > 0)
          config.data.filter((p: any) => {
            p['image'] = String(p['image']).replace('public', '')
          });
        this.posts = config.data;
        this.count = this.posts.length
      }
      this.appService.loading = false;
    })
  }

  readonly dialog = inject(MatDialog);

  modal() {
    this.dialog.open(ModalComponent, {
      data: undefined
    });
  }
  change() {
    this.dialog.open(ChangeComponent);
  }
}
