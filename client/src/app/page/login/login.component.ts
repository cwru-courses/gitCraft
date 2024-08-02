import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { catchError, merge } from 'rxjs';
import { LoginService } from './login.service';
import { AppService } from '../../app.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ForgotComponent } from './forgot/forgot.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatCardModule, MatFormFieldModule, MatIconModule, MatInputModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {

  readonly email = new FormControl('', [Validators.required, Validators.email]);
  readonly password = new FormControl('', [Validators.required, Validators.minLength(8)]);

  hide = signal(true);
  loginBtnDis = signal(true);

  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  errorMessageEmail = signal('');
  errorMessagePassword = signal('');
  userObject: any = null
  constructor(private loginService: LoginService, public appService: AppService, private router: Router) {
    appService.loading = true;
    this.userObject = appService.isAuth()
    if (this.userObject !== null && this.userObject.uid && this.userObject.token) {
      router.navigate(['home'])
    }
    appService.loading = false;


    merge(this.email.statusChanges, this.email.valueChanges, this.password.statusChanges, this.password.valueChanges)
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

    if (this.password.hasError('required')) {
      this.errorMessagePassword.set('You must enter a value');
    } else if (this.password.hasError('minLength')) {
      this.errorMessagePassword.set('has to be at least 8 characters');
    } else {
      this.errorMessagePassword.set('');
    }

    if (this.errorMessageEmail.length === 0 && this.errorMessagePassword.length === 0 && this.email.value !== '' && this.password.value !== '') {
      this.loginBtnDis.set(false);
    } else {
      this.loginBtnDis.set(true);
    }
  }

  toSignup() {
    this.reset()
    this.router.navigate(['signup'])
  }

  login() {
    this.appService.loading = true;
    this.loginService.login(this.email.value, this.password.value).pipe(catchError(async (error) => {
      if (error.status !== 200 && error.error.message) {
        this.appService.openSnackBar(error.error.message, '⛔️');
        this.appService.loading = false;
      }
    })).subscribe((config: any) => {
      if (config) {
        this.appService.openSnackBar(config.message, '✅');
        this.appService.setState(config.token, config.data.name, config.data.email, config.data._id);
        this.router.navigate(['home'], {
          queryParams: { view: 'global' }
        })
        this.reset()
      }
      this.appService.loading = false;
    })
  }

  reset() {
    this.email.setValue('');
    this.password.setValue('');
  }

  readonly dialog = inject(MatDialog);

  openDialog() {
    this.reset()
    this.dialog.open(ForgotComponent);
  }
}
