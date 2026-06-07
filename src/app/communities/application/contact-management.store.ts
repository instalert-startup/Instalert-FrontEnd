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

  // Carga los usuarios y filtra para excluir al usuario que inició sesión
  loadContacts(currentUserId: number) {
    this.communityApi.getUsers().subscribe((users) => {
      const filtered = users.filter((u) => u.id !== currentUserId);
      this.contactsSubject.next(filtered);
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
}
