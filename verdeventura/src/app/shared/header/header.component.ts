import { Component } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../servicios/auth.service';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  currentUser: any = null

  constructor(private http: HttpClient, public authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.loadCurrentUser();
  }

  loadCurrentUser() {
    const username = this.authService.getUsername(); // Obtener el nombre de usuario desde la cookie
  }

  logOut() {
    this.authService.logout();
    alert('Sesión cerrada');
    this.router.navigate(['/hastapronto']); // Redirigir a la página de login
  }
}
