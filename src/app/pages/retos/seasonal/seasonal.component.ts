import { Component, OnInit } from '@angular/core';
import { ImageService } from '../../../servicios/image.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../servicios/auth.service';
import { user_VV, retos_VV, retos_user_VV } from '../../../interfaces/verdeventura.interfaces';
import { HttpClient } from '@angular/common/http';
import { RetosService } from '../../../servicios/retos.service';

@Component({
  selector: 'app-seasonal',
  standalone: true,
  templateUrl: './seasonal.component.html',
  styleUrls: ['./seasonal.component.css'],
  imports: [FormsModule, CommonModule, RouterLink],
})
export class SeasonalComponent implements OnInit {
  latestImageUrl: string | undefined = undefined;
  userUploading: string | null = null;
  users: user_VV[] = [];
  retos_user_VV: retos_user_VV[] = [];
  public challengesList: retos_VV[] = [];
  public retosPorQuincena: { [key: string]: retos_VV[] } = {};
  public quincenaSeleccionada: string = 'seasonq1';

  constructor(
    private imageService: ImageService,
    private authService: AuthService,
    private http: HttpClient,
    private retosService: RetosService
  ) {}

  ngOnInit() {
    this.loadUsers();
    this.loadRetosUserVV();
    this.retosService.getEmployees().subscribe((data) => {
      this.challengesList = data;
      console.log('Challenges List:', this.challengesList);
      this.seasonClasificarRetosPorQuincenas();
      console.log('Retos por Quincena:', this.retosPorQuincena);
    });
  }

  seasonClasificarRetosPorQuincenas() {
    this.retosPorQuincena = { seasonq1: [], seasonq2: [], seasonq3: [], seasonq4: [] };
    this.challengesList.forEach(reto => {
      const id = reto._id_retos_VV;
      if (this.isValidSeasonId(id)) {
        const quincena = id.substring(3, 11);
        console.log('Quincena:', quincena, 'Reto:', reto);
        if (this.retosPorQuincena[quincena]) {
          this.retosPorQuincena[quincena].push(reto);
        } else {
          console.warn(`Reto con id ${id} no sigue el formato esperado.`);
        }
      } else {
        console.warn(`Reto con id ${id} no sigue el formato esperado.`);
      }
    });
  }

  isValidSeasonId(id: string): boolean {
    // Verifica si el id sigue el formato s01seasonqX donde X es un número de 1 a 4
    const regex = /^s01seasonq[1-4]$/;
    return regex.test(id);
  }

  seasonNumeroDeQuincena(id: string): number {
    const quincena = id.length >= 11 ? id.substring(10, 11) : '';
    return parseInt(quincena, 10);
  }

  loadUsers() {
    this.http.get<user_VV[]>(`${this.retosService.baseUrl}register.json`).subscribe(
      (users) => {
        this.users = users;
        console.log('Loaded users:', this.users);
      },
      (error) => {
        console.error('Error al cargar los usuarios:', error);
      }
    );
  }

  loadRetosUserVV() {
    this.retosService.getRetosUserVV().subscribe(
      response => {
        this.retos_user_VV = Object.values(response || {});
        console.log('Loaded retos_user_VV:', this.retos_user_VV);
      },
      error => {
        console.error('Error al cargar los retos de usuario:', error);
      }
    );
  }

  async getImageToStorage($event: any) {
    const file = $event.target.files[0];
    try {
      await this.imageService.uploadImage(file);
      this.latestImageUrl = this.imageService.getLatestImageUrl() || undefined;
      this.userUploading = this.authService.getUsername();
    } catch (error) {
      console.error('Error al subir la imagen:', error);
    }
  }

  async uploadImageToDB($event: any, quincena: string, sufijo: number) {
    await this.getImageToStorage($event);
    const _idGenerated = `s01${quincena}`;
    console.log('uploading id: ' + _idGenerated);

    if (this.userUploading && this.latestImageUrl) {
      const update: retos_user_VV = {
        urlUploaded: this.latestImageUrl,
        _username: this.userUploading,
        _id_retos_VV: _idGenerated
      };

      this.retosService.checkAndAddOrUpdateRetosUserVV(update).subscribe(
        response => {
          console.log('Registro de reto enviado a la base de datos:', response);
          const retoIndex = this.retosPorQuincena[quincena].findIndex(reto => reto._id_retos_VV === _idGenerated);
          if (retoIndex !== -1) {
            this.retosPorQuincena[quincena][retoIndex].urlImgDefault = this.latestImageUrl || undefined;
            const retosUserIndex = this.retos_user_VV.findIndex(r => r._id_retos_VV === _idGenerated && r._username === this.userUploading);
            if (retosUserIndex !== -1) {
              this.retos_user_VV[retosUserIndex].urlUploaded = this.latestImageUrl;
            } else {
              this.retos_user_VV.push(update);
            }
          }
        },
        error => {
          console.error('Error al enviar el registro a la base de datos:', error);
        }
      );
    }
  }



  getImageUrl(reto: retos_VV): string {
    const matchingReto = this.retos_user_VV.find(r => r._id_retos_VV === reto._id_retos_VV && r._username === this.authService.getUsername());
    return matchingReto ? matchingReto.urlUploaded || reto.urlImgDefault || '' : reto.urlImgDefault || '';
  }
}
