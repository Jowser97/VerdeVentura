import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { grupos_VV, user_VV } from '../../../interfaces/verdeventura.interfaces';
import { Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../../servicios/auth.service';

@Component({
  selector: 'app-crear',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './crear.component.html',
  styleUrls: ['./crear.component.css']
})
export class CrearComponent {
  groupName: string = '';
  public: boolean = true; // Valor por defecto (true para público, false para privado)
  sizeGroup: number = 10; // Valor por defecto
  contrasena: string = '';
  grupos: grupos_VV[] = [];
  users: { [key: string]: user_VV } = {};
  userName: string = '';
  currentUserKey: string | undefined;
  currentUser: user_VV | undefined;

  constructor(private http: HttpClient, private authService: AuthService,
    private router: Router
  ) {
    this.loadGrupos();
    this.loadUsers();
    this.userName = this.authService.getUsername();
  }

  async loadGrupos() {
    try {
      const grupos = await firstValueFrom(this.http.get<{ [key: string]: grupos_VV }>('https://verdeventura-db-default-rtdb.europe-west1.firebasedatabase.app/grupos_VV.json'));
      this.grupos = grupos ? Object.values(grupos).filter(grupo => grupo !== null && grupo._id_grupos_VV !== undefined && grupo._id_grupos_VV !== null) : [];
    } catch (error) {
      console.error('Error al cargar los grupos:', error);
      alert('Error al cargar los grupos');
    }
  }

  async loadUsers() {
    try {
      const users = await firstValueFrom(this.http.get<{ [key: string]: user_VV }>('https://verdeventura-db-default-rtdb.europe-west1.firebasedatabase.app/register.json'));
      this.users = users || {};
      const userEntries = Object.entries(this.users);
      for (const [key, user] of userEntries) {
        if (user.username === this.userName) {
          this.currentUser = user;
          this.currentUserKey = key;
          break;
        }
      }
    } catch (error) {
      console.error('Error al cargar los usuarios:', error);
      alert('Error al cargar los usuarios');
    }
  }

  async crearGrupo() {
    if (!this.groupName) {
      alert('El nombre del grupo es obligatorio');
      return;
    }

    if (!this.public && !this.contrasena) {
      alert('La contraseña es obligatoria para grupos privados');
      return;
    }

    if (this.currentUser && this.currentUser._id_grupos_VV !== undefined) {
      alert('Ya perteneces a un grupo.');
      return;
    }

    const validIds = this.grupos
      .filter(grupo => grupo && grupo._id_grupos_VV !== undefined && grupo._id_grupos_VV !== null)
      .map(grupo => grupo._id_grupos_VV)
      .sort((a, b) => a - b);

    let newId = 1;
    for (const _id_grupos_VV of validIds) {
      if (_id_grupos_VV === newId) {
        newId++;
      } else {
        break;
      }
    }

    const newGroup: grupos_VV = {
      _id_grupos_VV: newId,
      groupName: this.groupName,
      size: this.sizeGroup,
      public: this.public,
      groupPass: this.public ? undefined : this.contrasena,
      members: this.userName
    };

    this.grupos.push(newGroup);

    try {
      // Guardar el nuevo grupo
      await firstValueFrom(this.http.put('https://verdeventura-db-default-rtdb.europe-west1.firebasedatabase.app/grupos_VV.json', this.grupos));

      // Verificar si currentUserKey no es undefined antes de intentar actualizar
      if (this.currentUserKey && this.currentUser) {
        // Actualizar solo el campo _id_grupos_VV del usuario existente
        await firstValueFrom(this.http.patch(`https://verdeventura-db-default-rtdb.europe-west1.firebasedatabase.app/register/${this.currentUserKey}.json`, { _id_grupos_VV: newId }));
        // Actualizar la referencia local del usuario
        this.currentUser._id_grupos_VV = newId;
      }

      alert('Grupo creado exitosamente');
      this.groupName = '';
      this.contrasena = '';
      const route = '/migrupo';
        this.router.navigate([`/${route}`]);
    } catch (error) {
      console.error('Error al guardar el grupo:', error);
      alert('Error al crear el grupo');
    }
  }
}
