import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { CountrySelectComponent, Country } from '@wlucha/ng-country-select';
import hljs from 'highlight.js';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CountrySelectComponent, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  // Example preset country for demonstration
  presetCountry: Country = {
    alpha2: 'DE',
    alpha3: 'DEU',
    translations: {
      de: 'Deutschland',
      en: 'Germany',
      fr: 'Allemagne'
    }
  };

  // For simple event handling example
  selectedCountry?: Country;

  // Lifecycle hook to highlight code blocks after view initialization
  ngAfterViewInit(): void {
    this.highlightCodeBlocks();
  }

  // Method to highlight code blocks
  private highlightCodeBlocks(): void {
    document.querySelectorAll('pre code').forEach((block) => {
      hljs.highlightBlock(block as any);
    });
  }

  // Event handlers
  onCountrySelected(country: Country): void {
    this.selectedCountry = country;
  }

  onInputChanged(searchTerm: string): void {
    console.log('Search Term:', searchTerm);
  }
}
