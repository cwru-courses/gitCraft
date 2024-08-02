import { Component, forwardRef, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { AppService } from '../../../../app.service';
import { PostService } from '../../post.service';
import { catchError, merge } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [MatCardModule, MatIconModule, ReactiveFormsModule, MatButtonModule, MatDialogModule, MatInputModule, MatFormFieldModule, forwardRef(() => CapitalPipe)],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css'
})
export class ModalComponent {

  photoUrl: string = '';
  file: any = undefined;
  currentUserId = '';

  btnEditForkEnabled: boolean = true;

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.file = input.files[0];

      const reader = new FileReader();

      reader.onload = (e: any) => {
        this.photoUrl = e.target.result;
      };

      reader.readAsDataURL(this.file);
    }
  }

  readonly dialogRef = inject(MatDialogRef<ModalComponent>);
  readonly data = inject(MAT_DIALOG_DATA);
  post: any = this.data;
  currentView = 'global';
  actionTitle = '';
  isEditable = signal(false);
  isDisabled: boolean = true;
  owner: boolean = false
  actions = ['create', 'edit', 'view', 'fork']

  ngOnInit() {
    this.owner = this.currentUserId === this.post?.uid;
    if (this.post !== undefined) {
      this.actionTitle = !this.isEditable ? this.actions[1] : this.post ? this.actions[2] : this.actions[0];
      this.photoUrl = this.appService.BASE_URL + this.post.image
      this.file = this.post.image;
      this.title.setValue(this.post.title)
      this.description.setValue(this.post.description)
    } else {
      this.isDisabled = false
      this.actionTitle = this.actions[0]
      this.btnEditForkEnabled = false
    }
  }

  readonly title = new FormControl('', [Validators.required, Validators.maxLength(3)]);
  readonly description = new FormControl('', [Validators.required, Validators.maxLength(25)]);

  errorMessageTitle = signal('');
  errorMessageDescription = signal('');
  currentAction = this.actions[0]
  actionBtnDis = signal(true);
  userObject: any = null
  constructor(private postService: PostService, public appService: AppService, private router: Router) {
    appService.loading = true;
    this.userObject = appService.isAuth()
    if (this.userObject === null) {
      router.navigate(['login'])
      appService.loading = false;
    } else {
      appService.loading = false;
      this.currentUserId = this.userObject.uid
    }

    merge(this.title.statusChanges, this.title.valueChanges, this.description.statusChanges, this.description.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMessage());
  }

  updateErrorMessage() {
    if (this.title.hasError('required')) {
      this.errorMessageTitle.set('You must enter a value');
    } else if (this.title.hasError('minLength')) {
      this.errorMessageTitle.set('not a valid otp');
    } else {
      this.errorMessageTitle.set('');
    }

    if (this.description.hasError('required')) {
      this.errorMessageDescription.set('You must enter a value');
    } else if (this.description.hasError('minLength')) {
      this.errorMessageDescription.set('not a valid otp');
    } else {
      this.errorMessageDescription.set('');
    }

    if (this.errorMessageDescription.length === 0 && this.description.value !== '' && this.errorMessageTitle.length === 0 && this.title.value !== '' && this.photoUrl !== '') {
      this.actionBtnDis.set(false);
    } else {
      this.actionBtnDis.set(true);
    }
  }

  request(draft: boolean) {
    let status: any = 'public'
    if (draft) {
      status = 'private';
    }
    if (this.currentAction === this.actions[0]) {
      this.appService.loading = true;
      this.postService.createPost(this.title.value, this.description.value, this.file, status, this.userObject.token).pipe(catchError(async (error) => {
        if (error.status !== 200 && error.error.message) {
          this.appService.openSnackBar(error.error.message, '⛔️');
          this.appService.loading = false;
        }
      })).subscribe((config: any) => {
        if (config) {
          this.router.navigate(['home'], {
            queryParams: { view: status }
          })
          this.appService.openSnackBar(config.message, '✅');
          this.dialogRef.close();
        }
        this.appService.loading = false;
      })
    } else if (this.currentAction === this.actions[1]) {
      this.appService.loading = true;
      this.postService.editPost(this.title.value, this.description.value, this.file, status, this.post._id, this.userObject.token).pipe(catchError(async (error) => {
        if (error.status !== 200 && error.error.message) {
          this.appService.openSnackBar(error.error.message, '⛔️');
          this.appService.loading = false;
        }
      })).subscribe((config: any) => {
        if (config) {
          this.router.navigate(['home'], {
            queryParams: { view: status }
          })
          this.appService.openSnackBar(config.message, '✅');
          this.dialogRef.close();
        }
        this.appService.loading = false;
      })
    }
  }

  deletePost() {
    this.appService.loading = true;
    this.postService.delPost(this.post._id, this.userObject.token).pipe(catchError(async (error) => {
      if (error.status !== 200 && error.error.message) {
        this.appService.openSnackBar(error.error.message, '⛔️');
        this.appService.loading = false;
      }
    })).subscribe((config: any) => {
      if (config) {
        this.router.navigate(['home'], {
          queryParams: { view: 'public' }
        })
        this.appService.openSnackBar(config.message, '✅');
        this.dialogRef.close();
      }
      this.appService.loading = false;
    });
  }

  onEditForkAction(edit: boolean) {
    this.btnEditForkEnabled = false;
    this.isDisabled = false;
    if (edit) {
      this.actionTitle = this.actions[1]
      this.currentAction = this.actions[1]
    } else {
      this.actionTitle = this.actions[3]
      this.currentAction = this.actions[0]
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}


import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'capitalise',
  standalone: true,
})
export class CapitalPipe implements PipeTransform {
  transform(value: string): string {
    return value.slice(0, 1).toUpperCase() + value.slice(1, value.length).toLowerCase();
  }
}