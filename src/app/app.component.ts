import { JsonPipe } from '@angular/common';
import { Component, AfterViewInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CountrySelectComponent, Country } from '@wlucha/ng-country-select';
import hljs from 'highlight.js';
import { MatRadioModule } from '@angular/material/radio';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';




@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatRadioModule, MatTabsModule, MatButtonModule, MatFormFieldModule, JsonPipe, CountrySelectComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements AfterViewInit {

  presetCountry: Country = {
    alpha2: 'de',
    alpha3: 'deu',
    translations: {
      de: 'Deutschland',
      en: 'Germany',
      fr: 'Allemagne',
      it: 'Germania',
      es: 'Alemania',
      ar: 'ألمانيا',
      zh: '德国',
      hi: 'जर्मनी',
      bn: 'জার্মানি',
      pt: 'Alemanha',
      ru: 'Германия'
    }
  };

  placeholderMap: Record<string, string> = {
    'en': 'Search country',
    'de': 'Land suchen',
    'fr': 'Chercher un pays',
    'es': 'Buscar país',
    'zh': '搜索国家',
    'ar': 'بحث عن البلد',
    'hi': 'देश खोजें',
    'bn': 'দেশ অনুসন্ধান',
    'pt': 'Buscar país',
    'ru': 'Поиск страны',
    'pl': 'Szukaj kraju'
  };

  countryControl = new FormControl<Country>(this.presetCountry);
  validatingControl = new FormControl<Country | null>(null, Validators.required);

  selectedCountry?: Country;

  selectedLang = 'en';
  alpha2Country = '';
  alpha3Country = '';

  // Lifecycle hook to highlight code blocks after view initialization
  ngAfterViewInit(): void {
    this.highlightCodeBlocks();
  }

  // Event handlers
  public onCountrySelected(country: Country): void {
    this.selectedCountry = country;
  }

  public setCountryByAlpha2(): void {
    this.alpha2Country = 'de';
  }

  public setCountryByAlpha3(): void {
    this.alpha3Country = 'deu';
  }

  public onInputChanged(searchTerm: string): void {
    console.log('Search Term:', searchTerm);
  }

  public onClosed(): void {
    console.log('Dropdown closed');
  }

  // Method to highlight code blocks
  private highlightCodeBlocks(): void {
    document.querySelectorAll('pre code').forEach((block) => {
      hljs.highlightElement(block as HTMLElement);
    });
  }
}
