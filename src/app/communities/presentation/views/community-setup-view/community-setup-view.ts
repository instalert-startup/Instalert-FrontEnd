import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-community-setup-view',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './community-setup-view.html',
  styleUrls: ['./community-setup-view.css'],
})
export class CommunitySetupView implements OnInit {
  communityName: string = '';
  communityDescription: string = '';
  isPrivate: boolean = true;

  misComunidades: any[] = [];

  ngOnInit() {
    const guardadas = localStorage.getItem('instalert_comunidades');
    if (guardadas) {
      this.misComunidades = JSON.parse(guardadas);
    }
  }

  createCommunity() {
    if (!this.communityName.trim()) {
      alert('Por favor, ingresa un nombre para tu comunidad segura.');
      return;
    }

    const nuevaComunidad = {
      id: Date.now(),
      nombre: this.communityName,
      descripcion: this.communityDescription,
      privada: this.isPrivate,
      fechaCreacion: new Date().toISOString(),
    };

    this.misComunidades.unshift(nuevaComunidad);
    localStorage.setItem('instalert_comunidades', JSON.stringify(this.misComunidades));

    this.communityName = '';
    this.communityDescription = '';
    this.isPrivate = true;
  }

  invitar(comunidad: any) {
    localStorage.setItem('instalert_invitacion_activa', JSON.stringify(comunidad));
    alert(
      `¡Enlace copiado! \n\nAhora ve a la pestaña "Simular Invitación" para ver cómo le aparecerá la pantalla a tu vecino.`,
    );
  }
}
