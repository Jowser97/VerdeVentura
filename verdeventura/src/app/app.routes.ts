import { PathLocationStrategy } from '@angular/common';
import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { Err404Component } from './pages/err-404/err-404.component';
import { RetosComponent } from './pages/retos/retos.component';
import { UserprofileComponent } from './pages/userprofile/userprofile.component';

export const routes: Routes = [
  { path: '', component: Err404Component },
  { path: 'retos', component: RetosComponent },
  { path: 'login', component: LoginComponent },
  { path: 'perfil', component: UserprofileComponent },
  { path: '**', component: Err404Component },
];
