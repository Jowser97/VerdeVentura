import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../servicios/auth.service';
import { RouterLink } from '@angular/router';
import { user_VV } from '../../interfaces/verdeventura.interfaces';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  users: user_VV[] = []; // Usar la interfaz User[]

  constructor(public authService: AuthService, private http: HttpClient) {
    this.loadUsers();
  }

  onUsernameChange(value: string) {
    this.username = value;
  }

  loadUsers() {
    this.http.get<user_VV[]>('https://verdeventura-db-default-rtdb.europe-west1.firebasedatabase.app/register.json').subscribe(
      users => {
        this.users = users ? users.filter(user => user !== null && user._id_user_VV !== undefined && user._id_user_VV !== null) : [];
      },
      error => {
        console.error('Error al cargar los usuarios:', error);
        alert('Error al cargar los usuarios');
      }
    );
  }

  onLogin() {
    console.log('onLogin called');
    console.log(`Username: ${this.username}`);
    console.log(`Password: ${this.password}`);
    if (this.authService.login(this.username, this.password)) {
      this.errorMessage = '';
      alert('Inicio de sesión exitoso');
    } else {
      this.errorMessage = 'Usuario o contraseña incorrectos';
      console.error(this.errorMessage);
    }
  }
}
