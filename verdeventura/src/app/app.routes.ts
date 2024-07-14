// import { PathLocationStrategy } from '@angular/common';
// import { Routes } from '@angular/router';
// import { LoginComponent } from './pages/login/login.component';
// import { Err404Component } from './pages/err-404/err-404.component';
// import { RetosComponent } from './pages/retos/retos.component';
// import { UserprofileComponent } from './pages/userprofile/userprofile.component';
// import { RankingComponent } from './pages/ranking/ranking.component';
// import { HomeComponent } from './pages/home/home.component';
// import { GuiaodsComponent } from './pages/guiaods/guiaods.component';
// import { GroupComponent } from './pages/group/group.component';
// import { CrearComponent } from './pages/group/crear/crear.component';
// import { BuscarComponent } from './pages/group/buscar/buscar.component';
// import { MigrupoComponent } from './pages/group/migrupo/migrupo.component';
// import { Slide1Component } from './pages/home/slide1/slide1.component';
// import { Slide2Component } from './pages/home/slide2/slide2.component';
// import { Slide3Component } from './pages/home/slide3/slide3.component';
// import { QuincenaComponent } from './pages/retos/quincena/quincena.component';
// import { SeasonalComponent } from './pages/retos/seasonal/seasonal.component';

// export const routes: Routes = [
//   {
//     path: '',
//     component: HomeComponent,
//     children: [
//       {
//         path: "",
//         redirectTo: "slide1",
//         pathMatch: "full",
//       },
//       {
//         path: 'slide1',
//         component: Slide1Component,
//       },
//       {
//         path: 'slide2',
//         component: Slide2Component,
//       },
//       {
//         path: 'slide3',
//         component: Slide3Component,
//       },
//     ],
//   },
//   {
//     path: 'retos',
//     component: RetosComponent,
//     children: [
//       {
//         path: '',
//         redirectTo: 'quincena',
//         pathMatch: 'full',
//       },
//       {
//         path: 'quincena',
//         component: QuincenaComponent
//       },
//       {
//         path: 'seasonal',
//         component: SeasonalComponent
//       }
//     ]
//   },
//   { path: 'group', component: GroupComponent },
//   { path: 'creargrupo', component: CrearComponent },
//   { path: 'buscargrupo', component: BuscarComponent },
//   { path: 'migrupo', component: MigrupoComponent },
//   { path: 'login', component: LoginComponent },
//   { path: 'perfil', component: UserprofileComponent },
//   { path: 'rank', component: RankingComponent },
//   { path: 'guiaods', component: GuiaodsComponent },
//   { path: '**', component: Err404Component },
// ];

import { PathLocationStrategy } from '@angular/common';
import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { Err404Component } from './pages/err-404/err-404.component';
import { RetosComponent } from './pages/retos/retos.component';
import { GroupComponent } from './pages/group/group.component';
import { CrearComponent } from './pages/group/crear/crear.component';
import { BuscarComponent } from './pages/group/buscar/buscar.component';
import { UserprofileComponent } from './pages/userprofile/userprofile.component';
import { RankingComponent } from './pages/ranking/ranking.component';
import { HomeComponent } from './pages/home/home.component';
import { GuiaodsComponent } from './pages/guiaods/guiaods.component';

import { DBComponent } from './shared/db/db.component';
import { RegisterComponent } from './pages/register/register.component';
import { MiGrupoComponent } from './pages/group/migrupo/migrupo.component';


export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'retos', component: RetosComponent },
  { path: 'group', component: GroupComponent },
  { path: 'creargrupo', component: CrearComponent },
  { path: 'buscargrupo', component: BuscarComponent },
  { path: 'migrupo', component: MiGrupoComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'perfil', component: UserprofileComponent },
  { path: 'rank', component: RankingComponent },
  { path: 'guiaods', component: GuiaodsComponent },

  { path: 'database', component: DBComponent },
  { path: '**', component: Err404Component },
];
