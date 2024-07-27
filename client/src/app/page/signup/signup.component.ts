import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { catchError, merge } from 'rxjs';
import { SignupService } from './signup.service';
import { AppService } from '../../app.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { VerifyComponent } from './verify/verify.component';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [MatCardModule, MatFormFieldModule, MatIconModule, MatInputModule, FormsModule, ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignupComponent {

  readonly name = new FormControl('', [Validators.required, Validators.minLength(3)]);
  readonly email = new FormControl('', [Validators.required, Validators.email]);
  readonly password = new FormControl('', [Validators.required, Validators.minLength(8)]);

  hide = signal(true);
  signupBtnDis = signal(true);

  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  errorMessageName = signal('');
  errorMessageEmail = signal('');
  errorMessagePassword = signal('');
  userObject: any = null
  constructor(private signupService: SignupService, public appService: AppService, private router: Router) {
    merge(this.name.statusChanges, this.name.valueChanges, this.email.statusChanges, this.email.valueChanges, this.password.statusChanges, this.password.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMessage());
  }

  updateErrorMessage() {
    if (this.name.hasError('required')) {
      this.errorMessageName.set('You must enter a value');
    } else if (this.name.hasError('minLength')) {
      this.errorMessageName.set('has to be at least 3 characters');
    } else {
      this.errorMessageName.set('');
    }

    if (this.email.hasError('required')) {
      this.errorMessageEmail.set('You must enter a value');
    } else if (this.email.hasError('email')) {
      this.errorMessageEmail.set('not a valid email');
    } else {
      this.errorMessageEmail.set('');
    }

    if (this.password.hasError('required')) {
      this.errorMessagePassword.set('You must enter a value');
    } else if (this.password.hasError('minLength')) {
      this.errorMessagePassword.set('has to be at least 8 characters');
    } else {
      this.errorMessagePassword.set('');
    }

    if (this.errorMessageEmail.length === 0 && this.errorMessageName.length === 0 && this.errorMessagePassword.length === 0 && this.email.value !== '' && this.name.value !== '' && this.password.value !== '') {
      this.signupBtnDis.set(false);
    } else {
      this.signupBtnDis.set(true);
    }
  }

  toLogin() {
    this.reset()
    this.router.navigate(['login'])
  }

  signup() {
    this.appService.loading = true;
    this.signupService.signup(this.name.value, this.email.value, this.password.value).pipe(catchError(async (error) => {
      if (error.status !== 200 && error.error.message) {
        this.appService.openSnackBar(error.error.message, '⛔️');
        this.appService.loading = false;
      }
    })).subscribe((config: any) => {
      if (config) {
        this.appService.openSnackBar(config.message, '✅');
        this.openDialog()
        this.reset()
      }
      this.appService.loading = false;
    })
  }

  reset() {
    this.name.setValue('');
    this.email.setValue('');
    this.password.setValue('');
  }

  readonly dialog = inject(MatDialog);

  openDialog() {
    this.dialog.open(VerifyComponent, {
      data: { email: this.email.value }
    });
  }
}
