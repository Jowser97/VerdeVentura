import { Injectable } from '@angular/core';
import { Storage, ref, uploadBytes, listAll, getDownloadURL } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  latestImageUrl: string | null = null; // Para almacenar la URL de la última imagen subida

  constructor(private storage: Storage) { }

  uploadImage(file: File): Promise<void> {
    const imgRef = ref(this.storage, `images/${file.name}`);
    return new Promise<void>((resolve, reject) => {
      uploadBytes(imgRef, file)
        .then(async uploadTaskSnapshot => {
          const downloadUrl = await getDownloadURL(imgRef);
          this.latestImageUrl = downloadUrl; // Actualiza la URL de la última imagen subida
          console.log('Subida exitosa:', uploadTaskSnapshot);
          console.log('URL de descarga:', downloadUrl); // Mostrar la URL de descarga en la consola
          resolve();
        })
        .catch(error => {
          console.error('Error al subir la imagen:', error);
          reject(error);
        });
    });
  }

  getImages(): Promise<string[]> {
    const imagesRef = ref(this.storage, 'images');
    return listAll(imagesRef)
      .then(async response => {
        const urls = [];
        for (let item of response.items) {
          const url = await getDownloadURL(item);
          urls.push(url);
        }
        return urls;
      })
      .catch(error => {
        console.error('Error al obtener las imágenes:', error);
        throw error;
      });
  }

  getImagesProfile(): Promise<string[]> {
    const imagesRef = ref(this.storage, 'imgUser');
    return listAll(imagesRef)
      .then(async response => {
        const urls = [];
        for (let item of response.items) {
          const url = await getDownloadURL(item);
          urls.push(url);
        }
        return urls;
      })
      .catch(error => {
        console.error('Error al obtener las imágenes:', error);
        throw error;
      });
  }

  getLatestImageUrl(): string | null {
    return this.latestImageUrl;
  }

}