import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContactManagementStore } from '../../../application/contact-management.store';
import { TrustedContact, ChatMessage } from '../../../domain/trusted-contact.entity';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-monitoring-panel-view',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './monitoring-panel-view.html',
  styleUrls: ['./monitoring-panel-view.css'],
})
export class MonitoringPanelView implements OnInit {
  private store = inject(ContactManagementStore);

  currentUser: any = null;
  contacts$: Observable<TrustedContact[]> = this.store.contacts$;
  selectedContact: TrustedContact | null = null;
  activeConversation: ChatMessage[] = [];
  newMessageText: string = '';

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('instalert_user') || '{}');

    if (this.currentUser && this.currentUser.id) {
      this.store.loadContacts(this.currentUser.id);

      this.store.messages$.subscribe((allMessages) => {
        this.filterActiveConversation(allMessages);
      });
    }
  }

  selectContact(contact: TrustedContact) {
    this.selectedContact = contact;
    this.store.messages$
      .subscribe((allMessages) => {
        this.filterActiveConversation(allMessages);
      })
      .unsubscribe();
  }

  private filterActiveConversation(allMessages: ChatMessage[]) {
    if (!this.selectedContact || !this.currentUser) return;


    this.activeConversation = allMessages.filter(
      (msg) =>
        (msg.senderId === this.currentUser.id && msg.receiverId === this.selectedContact!.id) ||
        (msg.senderId === this.selectedContact!.id && msg.receiverId === this.currentUser.id),
    );
  }

  sendMessage() {
    if (!this.newMessageText.trim() || !this.selectedContact || !this.currentUser) return;

    this.store.sendMessage(
      this.currentUser.id,
      this.selectedContact.id,
      this.newMessageText.trim(),
    );

    this.newMessageText = '';
  }
}
