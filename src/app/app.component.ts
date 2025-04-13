import { JsonPipe } from '@angular/common';
import { Component, OnInit, viewChild } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CountrySelectComponent, Country } from '@wlucha/ng-country-select';
import hljs from 'highlight.js';
import { MatRadioModule } from '@angular/material/radio';
import { MatTabsModule } from '@angular/material/tabs';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatRadioModule, MatTabsModule, JsonPipe, CountrySelectComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

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

  countrySelect = viewChild<CountrySelectComponent>;

  ngOnInit(): void {
    this.countrySelect.selectedCountryByAlpha2 = 'de';
  }

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
      hljs.highlightElement(block as any);
    });
  }
}
