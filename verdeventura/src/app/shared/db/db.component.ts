import { Component, OnInit } from '@angular/core';
import { ImageService } from '../../servicios/image.service';

@Component({
  selector: 'app-root',
  templateUrl: './db.component.html',
  styleUrls: ['./db.component.css']
})
export class DBComponent implements OnInit {

  images: string[];

  constructor(private imageService: ImageService) {
    this.images = [];
  }

  ngOnInit() {
    this.getImages();
  }

  uploadImage($event: any) {
    const file = $event.target.files[0];
    console.log(file);
    this.imageService.uploadImage(file)
      .then(() => this.getImages())
      .catch(error => console.error('Error al subir la imagen:', error));
  }

  getImages() {
    this.imageService.getImages()
      .then(images => this.images = images)
      .catch(error => console.error('Error al obtener las imágenes:', error));
  }

}
