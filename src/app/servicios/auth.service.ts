import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { user_VV, retos_user_VV } from '../interfaces/verdeventura.interfaces';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private users: user_VV[] = [];
  current_id_retos_VV: any = null;

  constructor(private http: HttpClient, private cookieService: CookieService) {
    this.loadUsers().subscribe(users => {
      this.users = users ? users.filter(user => user !== null && user._id_user_VV !== undefined && user._id_user_VV !== null) : [];
    });
  }

  loadUsers(): Observable<user_VV[]> {
    return this.http.get<user_VV[]>('https://verdeventura-db-default-rtdb.europe-west1.firebasedatabase.app/register.json');
  }

  login(username: string, password: string): boolean {
    const user = this.users.find(user => user.username === username && user.password.toString() === password);
    if (user) {
      this.cookieService.set('username', username, { expires: 2, sameSite: 'Lax' });
      this.cookieService.set('isLoggedIn', 'true', { expires: 2, sameSite: 'Lax' });
      return true;
    }
    return false;
  }

  isLoggedIn(): boolean {
    return this.cookieService.check('isLoggedIn') && this.cookieService.get('isLoggedIn') === 'true';
  }

  getUsername(): string {
    return this.cookieService.get('username');
  }

  logout(): void {
    this.cookieService.delete('username');
    this.cookieService.delete('isLoggedIn');
  }

  loadUsersWithChallenge(): Observable<retos_user_VV[]> {
    return this.http.get<retos_user_VV[]>('https://verdeventura-db-default-rtdb.europe-west1.firebasedatabase.app/retos_user_VV.json');
  }

  
  async getIdChallenge() {
    await this.loadUsersWithChallenge();
    const username = this.getUsername();
    
    if (username != "") {
      const users = await this.http.get<any[]>('https://verdeventura-db-default-rtdb.europe-west1.firebasedatabase.app/retos_user_VV.json').toPromise();

      if (users) {
        const usersCArray = Object.values(users); // Convertir el objeto recibido en un arreglo de usuarios
        const user = usersCArray.find(id => id._username === username);
        
        if (user) {
          this.current_id_retos_VV = user._id_retos_VV; // Asignar el _id_retos_VV específico encontrado por nombre de usuario
        } else {
          console.log("Usuario no encontrado en la base de datos");
        }
      }
      
      return this.current_id_retos_VV;

      /*
      await this.http.get<any[]>('https://verdeventura-db-default-rtdb.europe-west1.firebasedatabase.app/retos_user_VV.json')
        .subscribe(
          users => {
            const usersCArray = Object.values(users); // Convertir el objeto recibido en un arreglo de usuarios
            this.current_id_retos_VV = usersCArray.find(id => id._username === username)._id_retos_VV; // Buscar el _id_retos_VV específico por nombre de usuario
            return this.current_id_retos_VV
          },
          error => {
            console.error('Error al cargar los usuarios:', error);
            alert('Error al cargar los usuarios');
          }
        );*/
    } 
    else
    {
      console.log("No encontre el user")
      return this.current_id_retos_VV
    }
  }
}


