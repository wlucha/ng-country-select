// country.service.ts
import { Injectable } from '@angular/core';
import { Country } from './country.interface';
import { countries } from './data/COUNTRIES';

@Injectable({ providedIn: 'root' })
export class CountryService {

  /**
   * Get all countries with translations
   * @param lang Preferred language for sorting
   * @returns Array of country objects
   */
  getCountries(lang: string = 'en'): Country[] {
    return countries.slice(); // Rückgabe einer Kopie
  }

  /**
   * Find country by alpha2 code
   * @param code ISO 3166-1 alpha2 code
   * @returns Country or undefined
   */
  getByAlpha2(code: string): Country | undefined {
    return countries.find(c => c.alpha2 === code.toUpperCase());
  }

  /**
   * Find country by alpha3 code
   * @param code ISO 3166-1 alpha3 code
   * @returns Country or undefined
   */
  getByAlpha3(code: string): Country | undefined {
    return countries.find(c => c.alpha3 === code.toUpperCase());
  }
}