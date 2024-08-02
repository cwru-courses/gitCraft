import { Component, inject, model, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { catchError, merge } from 'rxjs';
import { AppService } from '../../../app.service';
import { MatIconModule } from '@angular/material/icon';
import { PostService } from '../post.service';

@Component({
  selector: 'app-change',
  standalone: true,
  imports: [MatCardModule, MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle, MatIconModule,
    MatDialogContent, ReactiveFormsModule,
    MatDialogActions,
    MatDialogClose],
  templateUrl: './change.component.html',
  styleUrl: './change.component.css'
})
export class ChangeComponent {
  readonly dialogRef = inject(MatDialogRef<ChangeComponent>);

  readonly password = new FormControl('', [Validators.required, Validators.minLength(8)]);
  readonly result = model('')
  errorMessagePassword = signal('');
  pwdBtnDis = signal(true);
  userObject: any = null
  constructor(private postService: PostService, public appService: AppService) {
    this.userObject = appService.isAuth()

    merge(this.password.statusChanges, this.password.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMessage());
  }

  updateErrorMessage() {
    if (this.password.hasError('required')) {
      this.errorMessagePassword.set('You must enter a value');
    } else if (this.password.hasError('minLength')) {
      this.errorMessagePassword.set('not a valid email');
    } else {
      this.errorMessagePassword.set('');
    }

    if (this.errorMessagePassword.length === 0 && this.password.value !== '') {
      this.pwdBtnDis.set(false);
    } else {
      this.pwdBtnDis.set(true);
    }
  }

  hide = signal(true);

  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  request() {
    this.appService.loading = true;
    this.postService.change(this.password.value, this.userObject.token).pipe(catchError(async (error) => {
      if (error.status !== 200 && error.error.message) {
        this.appService.openSnackBar(error.error.message, '⛔️');
        this.appService.loading = false;
      }
    })).subscribe((config: any) => {
      if (config) {
        this.appService.openSnackBar('Password updated', '✅');
        this.dialogRef.close();
      }
      this.appService.loading = false;
    })
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
