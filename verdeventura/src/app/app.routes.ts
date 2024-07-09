import { PathLocationStrategy } from '@angular/common';
import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { Err404Component } from './pages/err-404/err-404.component';
import { RetosComponent } from './pages/retos/retos.component';
import { UserprofileComponent } from './pages/userprofile/userprofile.component';
import { RankingComponent } from './pages/ranking/ranking.component';
import { HomeComponent } from './pages/home/home.component';
import { GuiaodsComponent } from './pages/guiaods/guiaods.component';
import { GroupComponent } from './pages/group/group.component';
import { CrearComponent } from './pages/group/crear/crear.component';
import { BuscarComponent } from './pages/group/buscar/buscar.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'retos', component: RetosComponent },
  { path: 'group', component: GroupComponent },
  { path: 'creargrupo', component: CrearComponent },
  { path: 'buscargrupo', component: BuscarComponent },
  { path: 'login', component: LoginComponent },
  { path: 'perfil', component: UserprofileComponent },
  { path: 'rank', component: RankingComponent },
  { path: 'guiaods', component: GuiaodsComponent },
  { path: '**', component: Err404Component },
];
