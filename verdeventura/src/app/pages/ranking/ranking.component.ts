import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { user_VV, grupos_VV } from '../../interfaces/verdeventura.interfaces';
import { Router } from '@angular/router';
import { AuthService } from '../../servicios/auth.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-ranking',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.css']
})
export class RankingComponent implements OnInit {
  grupoActual: { key: string, data: grupos_VV } | null = null;
  currentUser: user_VV | undefined;
  currentUserKey: string | undefined;
  membersPoints: { [username: string]: number } = {};
  locationPoints: { [username: string]: number } = {};
  cpActual: string | undefined;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {}

  async ngOnInit() {
    await this.loadCurrentUser();
    if (this.currentUser) {
      if (this.currentUser._id_grupos_VV !== undefined) {
        await this.loadUserGroup(this.currentUser._id_grupos_VV);
        await this.loadMembersPoints();
      }
      if (this.currentUser.cp) {
        await this.loadUsersLocationPoints(this.currentUser.cp);
      }
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

  async loadUserGroup(groupId: number) {
    try {
      const grupos = await firstValueFrom(this.http.get<{ [key: string]: grupos_VV }>('https://verdeventura-db-default-rtdb.europe-west1.firebasedatabase.app/grupos_VV.json'));
      const groupEntries = Object.entries(grupos || {});
      for (const [key, group] of groupEntries) {
        if (group._id_grupos_VV === groupId) {
          this.grupoActual = { key, data: group };
          break;
        }
      }
    } catch (error) {
      console.error('Error al cargar el grupo del usuario:', error);
      alert('Error al cargar el grupo del usuario');
    }
  }

  async loadMembersPoints() {
    if (!this.grupoActual || !this.grupoActual.data.members) {
      return;
    }

    const members = this.grupoActual.data.members.split(', ');
    for (const member of members) {
      try {
        const users = await firstValueFrom(this.http.get<{ [key: string]: user_VV }>(`https://verdeventura-db-default-rtdb.europe-west1.firebasedatabase.app/register.json`));
        const userEntries = Object.entries(users || {});
        for (const [key, user] of userEntries) {
          if (user.username === member) {
            this.membersPoints[member] = user.points;
            break;
          }
        }
      } catch (error) {
        console.error(`Error al cargar los puntos del usuario ${member}:`, error);
      }
    }
  }

  async leaveGroup() {
    if (!this.currentUser || !this.currentUserKey || !this.grupoActual) {
      return;
    }

    try {
      // Actualizar el usuario para eliminar _id_grupos_VV
      await firstValueFrom(this.http.patch(`https://verdeventura-db-default-rtdb.europe-west1.firebasedatabase.app/register/${this.currentUserKey}.json`, { _id_grupos_VV: null }));
      this.currentUser._id_grupos_VV = undefined;

      // Actualizar el grupo para eliminar al usuario de los miembros
      const members = this.grupoActual.data.members ? this.grupoActual.data.members.split(', ') : [];
      const updatedMembers = members.filter(member => member !== this.currentUser!.username);
      await firstValueFrom(this.http.patch(`https://verdeventura-db-default-rtdb.europe-west1.firebasedatabase.app/grupos_VV/${this.grupoActual.key}.json`, { members: updatedMembers.join(', ') }));

      alert('Has dejado el grupo exitosamente');
      this.grupoActual = null;
      this.router.navigate(['/group']);
    } catch (error) {
      console.error('Error al dejar el grupo:', error);
      alert('Error al dejar el grupo');
    }
  }

  getUserPoints(username: string): number {
    return this.membersPoints[username] || 0;
  }

  getTotalGroupPoints(): number {
    return Object.values(this.membersPoints).reduce((total, points) => total + points, 0);
  }

  getMaxPoints(): number {
    return Math.max(...Object.values(this.membersPoints));
  }

  getRanking(): string[] {
    return Object.keys(this.membersPoints).sort((a, b) => this.membersPoints[b] - this.membersPoints[a]);
  }

  async loadUsersLocationPoints(cp: string) {
    try {
      const users = await firstValueFrom(this.http.get<{ [key: string]: user_VV }>('https://verdeventura-db-default-rtdb.europe-west1.firebasedatabase.app/register.json'));
      const userEntries = Object.entries(users || {});
      for (const [key, user] of userEntries) {
        if (user.cp === cp) {
          this.locationPoints[user.username] = user.points;
        }
      }
    } catch (error) {
      console.error('Error al cargar los usuarios por CP:', error);
      alert('Error al cargar los usuarios por CP');
    }
  }

  getUserLocPoints(username: string): number {
    return this.locationPoints[username] || 0;
  }

  getTotalLocationPoints(): number {
    return Object.values(this.locationPoints).reduce((total, points) => total + points, 0);
  }

  getMaxLocPoints(): number {
    return Math.max(...Object.values(this.locationPoints));
  }

  getLocRanking(): string[] {
    return Object.keys(this.locationPoints).sort((a, b) => this.locationPoints[b] - this.locationPoints[a]);
  }
}