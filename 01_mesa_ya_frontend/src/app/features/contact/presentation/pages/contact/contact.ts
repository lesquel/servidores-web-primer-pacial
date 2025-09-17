import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class ContactComponent {
  name = '';
  email = '';
  message = '';

  submitting = false;

  async submit() {
    if (!this.name || !this.email || !this.message) {
      alert('Por favor completa todos los campos.');
      return;
    }
    this.submitting = true;
    await new Promise((r) => setTimeout(r, 400)); // simulate
    this.submitting = false;
    alert('¡Gracias por contactarnos! Te responderemos pronto.');
    this.name = this.email = this.message = '';
  }
}
