import {
  Component, Input, Output, EventEmitter, inject, ChangeDetectionStrategy
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { map, startWith, debounceTime, tap } from 'rxjs/operators';
import { CountryService } from './country.service';
import { Country } from './country.interface';
import { CountryFlagPipe } from './country-flag.pipe';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'ng-country-select',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    CountryFlagPipe
  ],
  templateUrl: './country-select.component.html',
  styleUrls: ['./country-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CountrySelectComponent {
  /**
   * Default language for displaying country names
   * @default 'en'
   */
  @Input() public lang = 'en';

  /**
   * Search in all available languages or only in the selected language
   * @default false
   */
  @Input() public searchAllLanguages = false;

  /**
   * Placeholder text for the input field
   * @default 'Search country'
   */
  @Input() public placeholder = 'Search country';

  /**
   * Preselected country object
   */
  @Input() public set selectedCountry(country: Country | null) {
    this.control.setValue(country);
  }

  /**
   * Debounce time for search input in milliseconds
   * @default 100
   */
  @Input() public debounceTime = 100;

  /**
   * Disables the component
   * @default false
   */
  @Input() public disabled = false;

  /**
   * Appearance style of the form field
   * @default 'fill'
   */
  @Input() public appearance: 'fill' | 'outline' = 'fill';

  /**
   * Marks the field as required
   * @default false
   */
  @Input() public required = false;

  /**
   * Shows alpha2/alpha3 codes in the results
   * @default false
   */
  @Input() public showCodes = false;

  /**
   * Emits when a country is selected
   * @emits Country - Selected country object
   */
  @Output() public countrySelected = new EventEmitter<Country>();

  /**
   * Emits when the input value changes
   * @emits string - Current search term
   */
  @Output() public inputChanged = new EventEmitter<string>();

  /**
   * Emits when the autocomplete panel is closed
   * @emits void
   */
  @Output() public closed = new EventEmitter<void>();

  public control = new FormControl<Country | string>('');
  public filteredCountries$: Observable<Country[]> | undefined;
  public selectedCountryFlag: string = '';

  private countryService = inject(CountryService);
  private countries: Country[] = [];

  constructor() {
    this.countries = this.countryService.getCountries(this.lang);
    this.setupFilter();
  }

  /**
   * Initializes the filter stream with debounce
   * @private
   * @returns void
   */
  private setupFilter(): void {
    this.filteredCountries$ = this.control.valueChanges.pipe(
      startWith(''),
      debounceTime(this.debounceTime),
      tap(value => {
        if (typeof value === 'string') {
          this.inputChanged.emit(value);
        }
      }),
      map(value => this.filterCountries(value))
    );
  }

  /**
   * Filters countries based on search value
   * @private
   * @param value - Search value (string or Country object)
   * @returns Filtered array of countries
   */
  private filterCountries(value: string | Country | null): Country[] {
    if (!value || typeof value === 'string' && value.trim() === '') {
      this.selectedCountryFlag = '';
    }
    const filterValue = typeof value === 'string' ?
      value.toLowerCase() :
      value?.translations[this.lang]?.toLowerCase() || '';

    return this.countries.filter(country => {
      const matchesCode =
        country.alpha2.toLowerCase().includes(filterValue) ||
        country.alpha3.toLowerCase().includes(filterValue);

      const matchesTranslation = this.searchAllLanguages
        ? Object.values(country.translations).some(t =>
          t.toLowerCase().includes(filterValue)
        )
        : country.translations[this.lang]?.toLowerCase().includes(filterValue);

      return matchesCode || matchesTranslation;
    });
  }

  /**
   * Update form control value when country is selected
   */
  private updateControlValue(country: Country): void {
    this.control.setValue(country);
    this.selectedCountryFlag = this.getFlagEmoji(country.alpha2);
    this.countrySelected.emit(country);
  }

  /**
   * Convert ISO 3166-1 alpha2 code to flag emoji
   */
  private getFlagEmoji(alpha2: string): string {
    return alpha2
      .toUpperCase()
      .replace(/./g, char =>
        String.fromCodePoint(127397 + char.charCodeAt(0))
      );
  }

  /**
   * Handle option selection
   */
  public onOptionSelected(country: Country): void {
    this.updateControlValue(country);
  }

  /**
   * Displays the country name in selected language
   * @public
   * @param country - Country object or null
   * @returns Display name string
   */
  public displayFn(country: Country | null): string {
    return country?.translations[this.lang] || '';
  }

  /**
   * Handles autocomplete panel close event
   * @public
   * @returns void
   */
  public onAutocompleteClosed(): void {
    this.closed.emit();
  }

  /**
   * TrackBy function for country list optimization
   * @public
   * @param index - Array index
   * @param country - Country object
   * @returns Unique alpha2 code
   */
  public trackByAlpha2(index: number, country: Country): string {
    return country.alpha2;
  }
}