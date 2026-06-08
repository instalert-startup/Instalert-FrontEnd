import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CommunityApi } from '../infrastructure/community-api';
import { TrustedContact, ChatMessage } from '../domain/trusted-contact.entity';

@Injectable({
  providedIn: 'root',
})
export class ContactManagementStore {
  private communityApi = inject(CommunityApi);

  private contactsSubject = new BehaviorSubject<TrustedContact[]>([]);
  contacts$ = this.contactsSubject.asObservable();

  private messagesSubject = new BehaviorSubject<ChatMessage[]>([]);
  messages$ = this.messagesSubject.asObservable();

  constructor() {
    this.loadMessagesFromStorage();
  }

  loadContacts(currentUserId: number) {
    this.communityApi.getUsers().subscribe((users) => {

      const filtered = users.filter((u) => u.id !== currentUserId);


      const keyGruposUsuario = `instalert_grupos_${currentUserId}`;
      const misGrupos = JSON.parse(localStorage.getItem(keyGruposUsuario) || '[]');


      this.contactsSubject.next([...filtered, ...misGrupos]);
    });
  }

  private loadMessagesFromStorage() {
    const stored = localStorage.getItem('instalert_chat_db');
    this.messagesSubject.next(stored ? JSON.parse(stored) : []);
  }

  sendMessage(senderId: number, receiverId: number, content: string) {
    const currentMessages = this.messagesSubject.value;
    const newMsg: ChatMessage = {
      id: currentMessages.length + 1,
      senderId,
      receiverId,
      content,
      timestamp: new Date().toISOString(),
    };

    const updatedMessages = [...currentMessages, newMsg];
    this.messagesSubject.next(updatedMessages);

    localStorage.setItem('instalert_chat_db', JSON.stringify(updatedMessages));
  }

  addCommunityChat(community: any) {
    const currentContacts = this.contactsSubject.value;


    if (currentContacts.find((c) => c.id === community.id)) return;

    const newGroupChat = {
      id: Number(community.id),
      name: `🛡️ ${community.nombre}`,
      role: 'Grupo Vecinal',
      currentLocation: community.privada ? 'Privado' : 'Público',
    } as TrustedContact;


    const updatedContacts = [...currentContacts, newGroupChat];
    this.contactsSubject.next(updatedContacts);


    const currentUser = JSON.parse(localStorage.getItem('instalert_user') || '{}');
    if (currentUser.id) {
      const keyGruposUsuario = `instalert_grupos_${currentUser.id}`;
      const misGruposGuardados = JSON.parse(localStorage.getItem(keyGruposUsuario) || '[]');

      misGruposGuardados.push(newGroupChat);
      localStorage.setItem(keyGruposUsuario, JSON.stringify(misGruposGuardados));
    }
  }
}
