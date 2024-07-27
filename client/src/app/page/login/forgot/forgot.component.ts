import { Component, inject, model, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { catchError, merge } from 'rxjs';
import { LoginService } from '../login.service';
import { AppService } from '../../../app.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-forgot',
  standalone: true,
  imports: [MatCardModule, MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle, MatIconModule,
    MatDialogContent, ReactiveFormsModule,
    MatDialogActions,
    MatDialogClose],
  templateUrl: './forgot.component.html',
  styleUrl: './forgot.component.css'
})
export class ForgotComponent {
  readonly dialogRef = inject(MatDialogRef<ForgotComponent>);

  readonly email = new FormControl('', [Validators.required, Validators.email]);
  readonly result = model('')
  errorMessageEmail = signal('');
  otpBtnDis = signal(true);

  constructor(private loginService: LoginService, public appService: AppService) {
    merge(this.email.statusChanges, this.email.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMessage());
  }

  updateErrorMessage() {
    if (this.email.hasError('required')) {
      this.errorMessageEmail.set('You must enter a value');
    } else if (this.email.hasError('email')) {
      this.errorMessageEmail.set('not a valid email');
    } else {
      this.errorMessageEmail.set('');
    }

    if (this.errorMessageEmail.length === 0 && this.email.value !== '') {
      this.otpBtnDis.set(false);
    } else {
      this.otpBtnDis.set(true);
    }
  }

  request() {
    this.appService.loading = true;
    this.loginService.forgot(this.email.value).pipe(catchError(async (error) => {
      if (error.status !== 200 && error.error.message) {
        this.appService.openSnackBar(error.error.message, '⛔️');
        this.appService.loading = false;
      }
    })).subscribe((config: any) => {
      if (config) {
        this.appService.openSnackBar(config.message, '✅');

        this.dialogRef.close();
      }
      this.appService.loading = false;
    })
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
