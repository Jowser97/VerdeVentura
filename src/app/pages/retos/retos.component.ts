import { Component, OnInit } from '@angular/core';
import { ImageService } from '../../servicios/image.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../servicios/auth.service';
import { user_VV, retos_VV, retos_user_VV } from '../../interfaces/verdeventura.interfaces';
import { HttpClient } from '@angular/common/http';
import { RetosService } from '../../servicios/retos.service';

@Component({
  selector: 'app-retos',
  standalone: true,
  templateUrl: './retos.component.html',
  styleUrls: ['./retos.component.css'],
  imports: [FormsModule, CommonModule, RouterLink],
})
export class RetosComponent implements OnInit {
  latestImageUrl: string | undefined = undefined; // Cambiar null a undefined
  userUploading: string | null = null;
  username: string | undefined;
  password: string | undefined;
  users: user_VV[] = [];
  retos_user_VV: retos_user_VV[] = [];
  uploadingId!: string;

  public challengesList: retos_VV[] = [];
  public retosPorQuincena: { [key: string]: retos_VV[] } = {};
  public quincenaSeleccionada: string = 'q1'; // Inicializamos la quincena seleccionada en q1
  private _id_retos_VV: any;
  private _idGenerated: any;

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
      this.clasificarRetosPorQuincenas();
    });
  }

  clasificarRetosPorQuincenas() {
    this.retosPorQuincena = { q1: [], q2: [], q3: [], q4: [] }; // Reiniciar retosPorQuincena
    this.challengesList.forEach(reto => {
      const quincena = reto._id_retos_VV.substring(3, 5);
      if (this.retosPorQuincena[quincena]) {
        this.retosPorQuincena[quincena].push(reto);
      }
    });
  }

  numeroDeReto(id: string): number {
    const sufijo = id.substring(6, 7); // Obtener el último carácter del sufijo (r1, r2, r3, r4, etc.)
    return parseInt(sufijo); // Convertir a número
  }

  loadUsers() {
    this.http
      .get<user_VV[]>(`${this.retosService.baseUrl}register.json`)
      .subscribe(
        (users) => {
          this.users = users;
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
      },
      error => {
        console.error('Error al cargar los retos de usuario:', error);
      }
    );
  }

  async getImageToStorage($event: any) {
    const file = $event.target.files[0];
    console.log(file);
    try {
      await this.imageService.uploadImage(file);
      this.latestImageUrl = this.imageService.getLatestImageUrl() || undefined; // Cambiar null a undefined
      console.log('URL de la imagen:', this.latestImageUrl);
      this.userUploading = this.authService.getUsername();
      console.log('Usuario subiendo la imagen:', this.userUploading);
    } catch (error) {
      console.error('Error al subir la imagen:', error);
    }
  }

  async uploadImageToDB($event: any, quincena: string, sufijo: number) {
    await this.getImageToStorage($event);
    const uploadingId = await this.authService.getIdChallenge();
    const _idGenerated = `s01${quincena}r${sufijo}`;
    console.log('uploading id: ' + uploadingId);
    console.log('_idGenerated: ' + _idGenerated);

    if (this.userUploading && this.latestImageUrl) {
      const update: retos_user_VV = {
        urlUploaded: this.latestImageUrl,
        _username: this.userUploading,
        _id_retos_VV: _idGenerated
      };

      this.retosService.checkAndAddOrUpdateRetosUserVV(update).subscribe(
        response => {
          console.log('Registro de reto enviado a la base de datos:', response);
          // Actualizar la URL de la imagen en la lista local de retos_user_VV
          const retoIndex = this.retosPorQuincena[quincena].findIndex(reto => reto._id_retos_VV === _idGenerated);
          if (retoIndex !== -1) {
            this.retosPorQuincena[quincena][retoIndex].urlImgDefault = this.latestImageUrl || undefined; // Manejar posible valor null
            // Actualizar la imagen en la lista de retos_user_VV
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



