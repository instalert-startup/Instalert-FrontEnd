import { Component, output, input, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-active-alert-status',
  standalone: true,
  imports: [],
  templateUrl: './active-alert-status.html',
  styleUrl: './active-alert-status.css',
})
export class ActiveAlertStatusComponent implements OnInit, OnDestroy {
  onCancelAlert = output<void>();

  currentTime = '';
  elapsedTime = '0:00';
  startTimeStr = '';
  fullDurationStr = '0 segundos';
  showCancelModal = false;

  private timer: any;
  private seconds = 0;

  ngOnInit() {
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const date = now.toLocaleDateString('en-GB');

    this.currentTime = `${time} — ${date}`;
    this.startTimeStr = now.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    this.timer = setInterval(() => {
      this.seconds++;
      const m = Math.floor(this.seconds / 60);
      const s = this.seconds % 60;
      this.elapsedTime = `${m}:${s < 10 ? '0' : ''}${s}`;

      if (m === 0) {
        this.fullDurationStr = `${s} segundos`;
      } else {
        this.fullDurationStr = `${m} minuto${m !== 1 ? 's' : ''} ${s} segundo${s !== 1 ? 's' : ''}`;
      }
    }, 1000);
  }

  ngOnDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  promptCancel() {
    this.showCancelModal = true;
  }

  abortCancel() {
    this.showCancelModal = false;
  }

  confirmCancel() {
    this.showCancelModal = false;
    this.onCancelAlert.emit();
  }
}
