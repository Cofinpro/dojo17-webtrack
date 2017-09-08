import { Component } from '@angular/core';
import { NetworkService } from './network.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [ NetworkService ]
})

export class AppComponent {
  title = 'Cofinpro Bomberman';
}
