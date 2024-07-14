import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { grupos_VV } from '../interfaces/verdeventura.interfaces';

@Injectable({
  providedIn: 'root'
})
export class GruposService {
  private baseUrl = 'https://verdeventura-db-default-rtdb.europe-west1.firebasedatabase.app/';

  constructor(private http: HttpClient) {}

  crearGrupo(grupo: grupos_VV): Observable<any> {
    console.log('Enviando datos a la API:', grupo); // Verificar los datos que se envían a la API
    return this.http.post(`${this.baseUrl}grupos_VV.json`, grupo);
  }

  getGrupos(): Observable<{ [key: string]: grupos_VV }> {
    return this.http.get<{ [key: string]: grupos_VV }>(`${this.baseUrl}grupos_VV.json`);
  }

  actualizarUsuarioGrupo(userId: number, groupId: number): Observable<any> {
    return this.http.patch(`${this.baseUrl}register/${userId}.json`, { _id_grupos_VV: groupId });
  }
}

