import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../servicios/auth.service';
import { user_VV, grupos_VV } from '../../interfaces/verdeventura.interfaces';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { ImageService } from '../../servicios/image.service';

@Component({
  selector: 'app-userprofile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.css']
})
export class UserprofileComponent implements OnInit {
  currentUser: user_VV | null = null;
  currentGroupName: string | null = null;
  imageList: { name: string, url: string }[] = [];

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router,
    private imageService: ImageService
  ) {}

  ngOnInit() {
    this.loadCurrentUser();
    this.loadImageGallery();
  }

  async loadCurrentUser() {
    const username = this.authService.getUsername();
    if (username) {
      try {
        const users = await firstValueFrom(this.http.get<{ [key: string]: user_VV }>('https://verdeventura-db-default-rtdb.europe-west1.firebasedatabase.app/register.json'));
        const userEntries = Object.values(users);
        this.currentUser = userEntries.find(user => user.username === username) || null;
        
        if (this.currentUser && this.currentUser._id_grupos_VV !== undefined) {
          await this.loadGroupName(this.currentUser._id_grupos_VV);
        }
      } catch (error) {
        console.error('Error al cargar los usuarios:', error);
        alert('Error al cargar los usuarios');
      }
    }
  }

  async loadGroupName(userGroupId: number) {
    try {
      const grupos = await firstValueFrom(this.http.get<{ [key: string]: grupos_VV }>('https://verdeventura-db-default-rtdb.europe-west1.firebasedatabase.app/grupos_VV.json'));
      const grupoList = grupos ? Object.entries(grupos).map(([key, value]) => ({ key, data: value })) : [];
      const userGroup = grupoList.find(grupo => grupo.data._id_grupos_VV === userGroupId);
      if (userGroup) {
        this.currentGroupName = userGroup.data.groupName;
      }
    } catch (error) {
      console.error('Error al cargar los grupos:', error);
      alert('Error al cargar los grupos');
    }
  }

  async loadImageGallery() {
    try {
      const images = await this.imageService.getImagesProfile();
      this.imageList = images.map(url => ({
        name: url.substring(url.lastIndexOf('/') + 1, url.indexOf('?')),
        url
      }));
    } catch (error) {
      console.error('Error al cargar la galería de imágenes:', error);
    }
  }

  async selectProfileImage(imageUrl: string) {
    if (this.currentUser) {
      this.currentUser.profileImage = imageUrl;
      try {
        const users = await firstValueFrom(this.http.get<{ [key: string]: user_VV }>('https://verdeventura-db-default-rtdb.europe-west1.firebasedatabase.app/register.json'));
        const userEntry = Object.entries(users).find(([key, user]) => user.username === this.authService.getUsername());
        if (userEntry) {
          const [key] = userEntry;
          await firstValueFrom(this.http.patch(`https://verdeventura-db-default-rtdb.europe-west1.firebasedatabase.app/register/${key}.json`, { profileImage: imageUrl }));
          alert('Imagen de perfil actualizada exitosamente');
        }
      } catch (error) {
        console.error('Error al actualizar la imagen de perfil:', error);
        alert('Error al actualizar la imagen de perfil');
      }
    }
  }

  navigateToGroup() {
    if (this.currentGroupName) {
      this.router.navigate(['/migrupo']);
    } else {
      this.router.navigate(['/group']);
    }
  }

  navigateToRetos() {
    this.router.navigate(['/retos']);
  }
}