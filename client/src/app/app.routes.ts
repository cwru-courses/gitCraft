import { Routes } from '@angular/router';
import { LoginComponent } from './page/login/login.component';
import { HomeComponent } from './page/home/home.component';
import { SignupComponent } from './page/signup/signup.component';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    {
        path: 'login',
        component: LoginComponent,
    },
    {
        path: 'signup',
        component: SignupComponent,
    },
    {
        path: 'home',
        component: HomeComponent,
    }
];
