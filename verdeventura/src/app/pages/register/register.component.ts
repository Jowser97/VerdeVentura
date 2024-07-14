import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { user_VV } from '../../interfaces/verdeventura.interfaces';
import { Timestamp } from '@angular/fire/firestore';
import { RouterLink, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent {
  name: string = '';
  username: string = '';
  password: string = '';
  email: string = '';
  cp: number = 0; 
  cptxt: string = '';
  rol: string = 'USER';
  points: number = 0;
  group: number = 1;
  created: string = this.getCurrentFormattedDate(); // Formatear la fecha al inicializar
  users: user_VV[] = [];

  constructor(private http: HttpClient, private router: Router) {
    this.loadUsers();
  }

  async loadUsers() {
    try {
      const users = await firstValueFrom(this.http.get<user_VV[]>('https://verdeventura-db-default-rtdb.europe-west1.firebasedatabase.app/register.json'));
      this.users = users ? users.filter(user => user !== null && user._id_user_VV !== undefined && user._id_user_VV !== null) : [];
    } catch (error) {
      console.error('Error al cargar los usuarios:', error);
      alert('Error al cargar los usuarios');
    }
  }
  
  getCurrentFormattedDate(): string {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Los meses son indexados desde 0
    const year = now.getFullYear();
    return `${day}/${month}/${year}`;
  }

  async onRegister() {
    const validIds = this.users
      .filter(user => user && user._id_user_VV !== undefined && user._id_user_VV !== null)
      .map(user => user._id_user_VV)
      .sort((a, b) => a - b);

    let newId = 1;
    for (const _id_user_VV of validIds) {
      if (_id_user_VV === newId) {
        newId++;
      } else {
        break;
      }
    }

    if (this.users.some(user => user && user.username === this.username)) {
      alert('El nombre de usuario ya está registrado');
      return;
    }

    if (this.username !== '' && this.password !== '') { 
    
      const newUser: user_VV = { 
        cp: parseInt(this.cptxt, 10),
        _id_user_VV: newId,
        username: this.username,
        password: this.password,
        name: this.name,
        email: this.email,
        cptxt: this.cptxt,
        rol: this.rol,
        points: this.points,
        created: this.created
      };

     

      this.users.push(newUser);

      try {
        await firstValueFrom(this.http.put('https://verdeventura-db-default-rtdb.europe-west1.firebasedatabase.app/register.json', this.users));
        alert('Registro exitoso');
        this.username = '';
        this.password = '';
        this.router.navigate(['/login']);
      } catch (error) {
        console.error('Error al guardar el usuario:', error);
        alert('Error al registrar el usuario');
      }
    } else {
      alert('Rellena los campos vacíos');
    }
  }
}

