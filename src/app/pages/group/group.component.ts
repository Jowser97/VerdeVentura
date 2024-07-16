import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../servicios/auth.service';
import { user_VV } from '../../interfaces/verdeventura.interfaces';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css']
})
export class GroupComponent implements OnInit {
  userHasGroup: boolean = false;
  currentUser: user_VV | undefined;

  constructor(
    private router: Router,
    private http: HttpClient,
    private authService: AuthService
  ) {}

  async ngOnInit() {
    await this.loadCurrentUser();
    if (this.currentUser && this.currentUser._id_grupos_VV !== undefined) {
      this.userHasGroup = true;
      if (this.router.url === '/group') {
        this.router.navigate(['/migrupo']);
      }
    } else {
      this.userHasGroup = false;
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
          break;
        }
      }
    } catch (error) {
      console.error('Error al cargar los usuarios:', error);
      alert('Error al cargar los usuarios');
    }
  }

  navigateTo(route: string) {
    if (route === 'migrupo' && !this.userHasGroup) {
      alert('No perteneces a ningún grupo.');
    } else {
      this.router.navigate([`/${route}`]);
    }
  }
}