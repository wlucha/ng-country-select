import { Component } from '@angular/core';
import { CountrySelectComponent } from '@wlucha/ng-country-select';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CountrySelectComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
}
