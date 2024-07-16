import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { retos_user_VV, retos_VV } from '../interfaces/verdeventura.interfaces';

@Injectable({
  providedIn: 'root',
})
export class RetosService {

  public baseUrl = 'https://verdeventura-db-default-rtdb.europe-west1.firebasedatabase.app/';

  // URL de nuestra información en la base de datos Real Time Database de Firebase
  private urlRetos: string = `${this.baseUrl}retos_VV.json`;

  constructor(private http: HttpClient) {}

  // Método que devuelve un observable con los datos array de la interfaz (_id, nom, titulo, img...)
  getEmployees(): Observable<retos_VV[]> {
    return this.http.get<retos_VV[]>(this.urlRetos);
  }

  addRetoUser(retoUser: retos_user_VV): Observable<any> {
    return this.http.post(`${this.baseUrl}retos_user_VV.json`, retoUser);
  }

  getRetosUserVV(): Observable<{ [key: string]: retos_user_VV }> {
    return this.http.get<{ [key: string]: retos_user_VV }>(`${this.baseUrl}retos_user_VV.json`);
  }

  checkAndAddOrUpdateRetosUserVV(data: retos_user_VV): Observable<boolean> {
    const { _id_retos_VV, _username } = data;

    return this.getRetosUserVV().pipe(
      map(response => {
        if (!response) {
          return null;
        }

        const retosArray = Object.entries(response).map(([key, value]) => ({
          id: key,
          ...value
        }));

        const existingReto = retosArray.find(reto => reto._id_retos_VV === _id_retos_VV && reto._username === _username);
        return existingReto ? existingReto.id : null;
      }),
      switchMap(existingId => {
        if (existingId) {
          // If the combination exists, update the existing record
          return this.http.patch(`${this.baseUrl}retos_user_VV/${existingId}.json`, { urlUploaded: data.urlUploaded }).pipe(
            map(() => true)
          );
        } else {
          // If the combination does not exist, add the new record
          return this.http.post(`${this.baseUrl}retos_user_VV.json`, data).pipe(
            map(() => true)
          );
        }
      }),
      catchError(error => {
        console.error('Error al verificar o actualizar/agregar el reto:', error);
        throw error;
      })
    );
  }
}
