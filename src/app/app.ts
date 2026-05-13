import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import{ReportesComponent} from './incidents/presentation/views/report-views/report-views';
import { Layout } from './shared/presentation/components/layout/layout';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ReportesComponent, Layout],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
/**
 * Root component hosting the shared layout shell.
 */
export class App {}
