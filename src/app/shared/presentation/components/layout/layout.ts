import { Component } from '@angular/core';
import { NgClass } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageSwitcher } from '../language-switcher/language-switcher';

@Component({
  selector: 'app-layout',
  imports: [
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    RouterModule,
    LanguageSwitcher,
    TranslatePipe,
    NgClass,
  ],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
/**
 * Shared presentation component orchestrating the application shell.
 * It contains the sidebar, header, and router outlet.
 */
export class Layout {
  title = '';

  constructor(public router: Router) {}
}
