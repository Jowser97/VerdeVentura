import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { SeasonalComponent } from './seasonal/seasonal.component';
import { QuincenaComponent } from './quincena/quincena.component';

@Component({
  selector: 'app-retos',
  standalone: true,
  imports: [RouterOutlet, RouterLink, SeasonalComponent, QuincenaComponent],
  templateUrl: './retos.component.html',
  styleUrl: './retos.component.css',
})
export class RetosComponent {}
