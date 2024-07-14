import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  selectedSlide: number = 1;
  previousSlide: number = 1;
  currentView: number = 1;
  animationClass: string = '';
  contentAnimationClass: string = '';

  selectSlide(slide: number) {
    if (this.selectedSlide !== slide) {
      this.previousSlide = this.selectedSlide;
      this.selectedSlide = slide;

      // Animaciones de fondo
      if (slide > this.previousSlide) {
        this.animationClass = 'animate__animated animate__backInRight';
      } else if (slide < this.previousSlide) {
        this.animationClass = 'animate__animated animate__backInLeft';
      }

      // Animaciones de contenido
      this.contentAnimationClass = 'animate__animated fadeOutCustom';
      
      // Reset animation class for background after animation ends
      setTimeout(() => {
        this.animationClass = '';
      }, 1000); // Duración de la animación

      // Cambiar el contenido después de la animación de salida
      setTimeout(() => {
        this.currentView = slide;
        this.contentAnimationClass = 'animate__animated fadeInCustom';
        
        // Reset animation class for content after animation ends
        setTimeout(() => {
          this.contentAnimationClass = '';
        }, 500); // Duración de la animación de entrada
      }, 500); // Duración de la animación de salida
    }
  }

  getBackgroundClass() {
    return {
      [`background-slide-${this.selectedSlide}`]: true,
      [this.animationClass]: true
    };
  }

  getContentClass() {
    return {
      [this.contentAnimationClass]: true
    };
  }
}