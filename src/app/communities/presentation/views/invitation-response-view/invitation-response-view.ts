import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ContactManagementStore } from '../../../application/contact-management.store';

@Component({
  selector: 'app-invitation-response-view',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './invitation-response-view.html',
  styleUrls: ['./invitation-response-view.css'],
})
export class InvitationResponseView implements OnInit {
  private contactStore = inject(ContactManagementStore);

  comunidadAInvitar: any = null;
  currentUser: any = null;
  respuestaDada: boolean = false;

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('instalert_user') || '{}');
    this.cargarInvitacion();
  }

  cargarInvitacion() {
    const invitacion = localStorage.getItem('instalert_invitacion_activa');
    if (invitacion) {
      this.comunidadAInvitar = JSON.parse(invitacion);
      this.respuestaDada = false;
    } else {
      this.comunidadAInvitar = null;
    }
  }

  aceptar() {
    if (!this.comunidadAInvitar) return;

    this.contactStore.addCommunityChat(this.comunidadAInvitar);
    this.finalizarProceso();
  }

  rechazar() {
    this.finalizarProceso();
  }

  private finalizarProceso() {
    this.respuestaDada = true;

    localStorage.removeItem('instalert_invitacion_activa');

    this.comunidadAInvitar = null;
  }
}
