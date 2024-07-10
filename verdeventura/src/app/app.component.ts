import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, Event } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./shared/header/header.component";
import { LoginComponent } from "./pages/login/login.component";
import { RankingComponent } from "./pages/ranking/ranking.component";
import { RetosComponent } from "./pages/retos/retos.component";
import { UserprofileComponent } from "./pages/userprofile/userprofile.component";

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    imports: [RouterOutlet, HeaderComponent, LoginComponent, RankingComponent, RetosComponent, UserprofileComponent]
})
export class AppComponent implements OnInit {

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        window.scrollTo(0, 0);
      }
    });
  }
}