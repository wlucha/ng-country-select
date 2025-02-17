import { JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { CountrySelectComponent, Country } from '@wlucha/ng-country-select';
import hljs from 'highlight.js';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CountrySelectComponent, JsonPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  // Example preset country for demonstration
  presetCountry: Country = {
    alpha2: 'de',
    alpha3: 'deu',
    translations: {
      de: 'Deutschland',
      en: 'Germany',
      fr: 'Allemagne',
      es: 'Alemania',
      it: 'Germania'
    }
  };

  countryControl = new FormControl<Country>(this.presetCountry);

  // For simple event handling example
  selectedCountry?: Country;

  // Lifecycle hook to highlight code blocks after view initialization
  ngAfterViewInit(): void {
    this.highlightCodeBlocks();
  }

  // Event handlers
  public onCountrySelected(country: Country): void {
    this.selectedCountry = country;
  }

  public onInputChanged(searchTerm: string): void {
    console.log('Search Term:', searchTerm);
  }

  // Method to highlight code blocks
  private highlightCodeBlocks(): void {
    document.querySelectorAll('pre code').forEach((block) => {
      hljs.highlightBlock(block as any);
    });
  }
}
