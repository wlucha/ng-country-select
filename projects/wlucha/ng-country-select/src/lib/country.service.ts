// country.service.ts
import { Injectable } from '@angular/core';
import { Country } from './country.interface';
import { countries } from './data/COUNTRIES';

@Injectable({ providedIn: 'root' })
export class CountryService {

  /**
   * Get all countries with translations
   * @returns Array of country objects
   */
  getCountries(): Country[] {
    return countries.slice();
  }
}