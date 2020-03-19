import { Component } from '@angular/core';
import { NotifElemetntConfig } from './share/utilit/simple.notification.config';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'alexAdmin';
  public notificationInitSettings = NotifElemetntConfig.defaultOption;
}
