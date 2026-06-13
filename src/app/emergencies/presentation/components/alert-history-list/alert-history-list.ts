import { Component, input } from '@angular/core';
import { AlertHistory } from '../../../domain/entities/emergency-alert.entity';

@Component({
  selector: 'app-alert-history-list',
  standalone: true,
  imports: [],
  templateUrl: './alert-history-list.html',
  styleUrl: './alert-history-list.css',
})
export class AlertHistoryListComponent {
  alerts = input<AlertHistory[]>([]);
}
