import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { grupos_VV, user_VV } from '../../../interfaces/verdeventura.interfaces';
import { Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../../servicios/auth.service';

@Component({
  selector: 'app-buscar',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './buscar.component.html',
  styleUrls: ['./buscar.component.css']
})
export class BuscarComponent implements OnInit {
  groupName: string = '';
  sizeGroup: number | 'both' = 'both';
  public: boolean | 'both' = 'both';
  groupPasswordInput: string = '';
  grupos: { key: string, data: grupos_VV }[] = [];
  filteredGrupos: { key: string, data: grupos_VV }[] = [];
  selectedGroup: { key: string, data: grupos_VV } | null = null;
  currentUserKey: string | undefined;
  currentUser: user_VV | undefined;

  constructor(private http: HttpClient, private authService: AuthService, private router: Router) {}

  async ngOnInit() {
    await this.loadGrupos();
    await this.loadCurrentUser();
  }

  async loadGrupos() {
    try {
      const grupos = await firstValueFrom(this.http.get<{ [key: string]: grupos_VV }>('https://verdeventura-db-default-rtdb.europe-west1.firebasedatabase.app/grupos_VV.json'));
      this.grupos = grupos ? Object.entries(grupos).map(([key, value]) => ({ key, data: value })) : [];
    } catch (error) {
      console.error('Error al cargar los grupos:', error);
      alert('Error al cargar los grupos');
    }
  }

  async loadCurrentUser() {
    try {
      const users = await firstValueFrom(this.http.get<{ [key: string]: user_VV }>('https://verdeventura-db-default-rtdb.europe-west1.firebasedatabase.app/register.json'));
      const currentUserName = this.authService.getUsername();
      const userEntries = Object.entries(users || {});
      for (const [key, user] of userEntries) {
        if (user.username === currentUserName) {
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

  buscarGrupos() {
    this.filteredGrupos = this.grupos.filter(({ data: grupo }) => {
      const matchesName = !this.groupName || grupo.groupName.toLowerCase().includes(this.groupName.toLowerCase());
      const matchesSize = this.sizeGroup === 'both' || grupo.size === this.sizeGroup;
      const matchesPublic = this.public === 'both' || grupo.public === this.public;
      return matchesName && matchesSize && matchesPublic;
    });
  }

  getMemberCount(grupo: grupos_VV): number {
    return grupo.members ? grupo.members.split(', ').length : 0;
  }

  selectGroup(grupo: { key: string, data: grupos_VV }) {
    this.selectedGroup = grupo;
    const rows = document.querySelectorAll('.table-row');
    rows.forEach(row => row.classList.remove('selected'));
    const row = document.getElementById(grupo.data._id_grupos_VV.toString());
    if (row) {
      row.classList.add('selected');
    }
  }

  async joinGroup() {
    if (!this.selectedGroup) {
      alert('Por favor, selecciona un grupo primero');
      return;
    }

    if (this.currentUser && this.currentUser._id_grupos_VV !== undefined) {
      alert('Ya perteneces a un grupo.');
      return;
    }

    const members = this.selectedGroup.data.members ? this.selectedGroup.data.members.split(', ') : [];
    if (members.length >= this.selectedGroup.data.size) {
      alert('El grupo ya está lleno.');
      return;
    }

    if (!this.selectedGroup.data.public && this.selectedGroup.data.groupPass !== this.groupPasswordInput) {
      alert('Contraseña incorrecta.');
      return;
    }

    try {
      // Actualizar solo el campo _id_grupos_VV del usuario existente
      if (this.currentUserKey && this.currentUser) {
        await firstValueFrom(this.http.patch(`https://verdeventura-db-default-rtdb.europe-west1.firebasedatabase.app/register/${this.currentUserKey}.json`, { _id_grupos_VV: this.selectedGroup.data._id_grupos_VV }));
        this.currentUser._id_grupos_VV = this.selectedGroup.data._id_grupos_VV;

        // Añadir el usuario a los miembros del grupo seleccionado
        members.push(this.currentUser.username);
        await firstValueFrom(this.http.patch(`https://verdeventura-db-default-rtdb.europe-west1.firebasedatabase.app/grupos_VV/${this.selectedGroup.key}.json`, { members: members.join(', ') }));

        alert('Te has unido al grupo exitosamente');

        this.router.navigate(['/migrupo'])

      }
    } catch (error) {
      console.error('Error al unirse al grupo:', error);
      alert('Error al unirse al grupo');
    }
  }

  setSize(size: number | 'both') {
    this.sizeGroup = size;
  }

  setPublic(publicOption: boolean | 'both') {
    this.public = publicOption;
  }
}