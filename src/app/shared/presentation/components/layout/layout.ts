import {Component} from '@angular/core';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatListModule} from '@angular/material/list';
import {RouterModule} from '@angular/router';
import { LanguageSwitcher } from '../language-switcher/language-switcher';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-layout',
  imports: [
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    RouterModule,
    LanguageSwitcher,
    TranslatePipe,
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
}
