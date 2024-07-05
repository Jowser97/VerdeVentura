import { Component } from '@angular/core';
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
export class AppComponent {
  title = 'verdeventura';
}
