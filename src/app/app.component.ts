import { JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CountrySelectComponent, Country } from '@wlucha/ng-country-select';
import hljs from 'highlight.js';
import { MatRadioModule } from '@angular/material/radio';
import { MatTabsModule } from '@angular/material/tabs';
import {MatButtonModule} from '@angular/material/button';




@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatRadioModule, MatTabsModule, MatButtonModule, JsonPipe, CountrySelectComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

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

  placeholderMap: any = {
    'en': 'Search country',
    'de': 'Land suchen',
    'fr': 'Chercher un pays',
    'es': 'Buscar país',
    'zh': '搜索国家',
    'ar': 'بحث عن البلد',
    'hi': 'देश खोजें',
    'bn': 'দেশ অনুসন্ধান',
    'pt': 'Buscar país',
    'ru': 'Поиск страны'
  };

  countryControl = new FormControl<Country>(this.presetCountry);

  selectedCountry?: Country;

  selectedLang: string = 'en';
  alpha2Country: string = '';
  alpha3Country: string = '';

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

  // Method to highlight code blocks
  private highlightCodeBlocks(): void {
    document.querySelectorAll('pre code').forEach((block) => {
      hljs.highlightElement(block as any);
    });
  }
}
