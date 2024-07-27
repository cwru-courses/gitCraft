import { Component, inject, model, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { catchError, merge } from 'rxjs';
import { SignupService } from '../signup.service';
import { AppService } from '../../../app.service';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-verify',
  standalone: true,
  imports: [MatCardModule, MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle, MatIconModule,
    MatDialogContent, ReactiveFormsModule,
    MatDialogActions,
    MatDialogClose],
  templateUrl: './verify.component.html',
  styleUrl: './verify.component.css'
})
export class VerifyComponent {
  readonly dialogRef = inject(MatDialogRef<VerifyComponent>);
  readonly data = inject(MAT_DIALOG_DATA);

  readonly otp = new FormControl('', [Validators.required, Validators.maxLength(6), Validators.maxLength(6)]);

  errorMessageOtp = signal('');
  otpBtnDis = signal(true);

  constructor(private signupService: SignupService, public appService: AppService, private router: Router) {
    merge(this.otp.statusChanges, this.otp.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMessage());
  }

  updateErrorMessage() {
    if (this.otp.hasError('required')) {
      this.errorMessageOtp.set('You must enter a value');
    } else if (this.otp.hasError('minLength')) {
      this.errorMessageOtp.set('not a valid otp');
    } else {
      this.errorMessageOtp.set('');
    }

    if (this.errorMessageOtp.length === 0 && this.otp.value !== '') {
      this.otpBtnDis.set(false);
    } else {
      this.otpBtnDis.set(true);
    }
  }

  request() {
    this.appService.loading = true;
    this.signupService.verify(this.data.email, this.otp.value).pipe(catchError(async (error) => {
      if (error.status !== 200 && error.error.message) {
        this.appService.openSnackBar(error.error.message, '⛔️');
        this.appService.loading = false;
      }
    })).subscribe((config: any) => {
      if (config) {
        this.appService.openSnackBar(config.message, '✅');
        this.dialogRef.close();
        this.router.navigate(['login'])
      }
      this.appService.loading = false;
    })
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
