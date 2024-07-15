import { CommonModule } from '@angular/common';
import { Component,HostListener } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-scroll-to-top',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './scroll-to-top.component.html',
  styleUrl: './scroll-to-top.component.css'
})
export class ScrollToTopComponent {
  
  @HostListener('window:scroll', [])
  onWindowScroll() {
    const button = document.getElementById('scrollToTopBtn');
    if (button) {
      if (window.pageYOffset > 20) {
        button.style.display = 'block';
      } else {
        button.style.display = 'none';
      }
    }
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}