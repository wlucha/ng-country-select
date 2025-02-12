import {
  Component, Input, Output, EventEmitter, ChangeDetectionStrategy,
  OnInit
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { map, startWith, debounceTime, tap } from 'rxjs/operators';
import { Country } from './country.interface';
import { CountryFlagPipe } from './country-flag.pipe';
import { MatIconModule } from '@angular/material/icon';
import { ThemePalette } from '@angular/material/core';
import { countries } from './data/COUNTRIES';


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
export class CountrySelectComponent implements OnInit {

  /**
   * Set initial default country
   * @example { alpha2: 'DE', alpha3: 'DEU', translations: { de: 'Deutschland', en: 'Germany' } }
   */
  @Input() defaultCountry: Country | null = null;

  /**
   * Default language for displaying country names
   * Currently supported: 'en', 'de', 'fr', 'es', 'it'
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
   * Set a country programmatically
   */
  @Input() public set selectedCountry(country: Country | null) {
    this.formControl.setValue(country);
  }

  /**
   * Form control for the country select
   */
  @Input() public formControl = new FormControl<Country | null>(null);

  /**
   * Debounce time for search input in milliseconds
   * @default 100
   */
  @Input() public debounceTime = 100;

  /**
   * Appearance style of the form field
   * @default 'fill'
   */
  @Input() public appearance: 'fill' | 'outline' = 'fill';

  /**
   * Angular Material color palette (primary, accent, warn)
   * @default 'primary'
   */
  @Input() public color: ThemePalette = 'primary';

  /**
   * Disables the component
   * @default false
   */
  @Input() public disabled = false;

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
   * List of country alpha2 codes to include in the filter
   * @default []
   */
  @Input() public includeCountries: string[] = [];

  /**
   * List of country alpha2 codes to exclude from the filter
   * @default []
   */
  @Input() public excludeCountries: string[] = [];

  /**
   * Show only alpha2 codes in the results
   * @default false
   */
  @Input() public alpha2Only = false;

  /**
   * Show only alpha3 codes in the results
   * @default false
   */
  @Input() public alpha3Only = false;

  /**
   * Whether the flag should be displayed
   * @default false
   */
  @Input() public showFlag = true;  

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

  public filteredCountries$: Observable<Country[]> | undefined;
  private countries: Country[] = countries.slice();

  ngOnInit(): void {
    this.setupFilter();
    this.filterCountryList();
    if (this.defaultCountry) {
      this.formControl.setValue(this.defaultCountry);
    }
  }

  /**
   * Handle option selection
   */
  public onOptionSelected(country: Country): void {
    this.formControl.setValue(country);
    this.countrySelected.emit(country);
  }

  /**
   * Displays the alpha2- or alpha3 code or country name in selected language
   * @public
   * @param country - Country object or null
   * @returns Display name string
   */
  public displayFn(country: Country | null): string {
    if (this.alpha2Only) {
      return country?.alpha2 || '';
    } else if (this.alpha3Only) {
      return country?.alpha3 || '';
    } else {
      return country?.translations ? country?.translations[this.lang] : '';
    }
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

  /**
   * Initializes the filter stream with debounce
   * @private
   * @returns void
   */
  private setupFilter(): void {
    this.filteredCountries$ = this.formControl.valueChanges.pipe(
      startWith(this.defaultCountry ? this.defaultCountry : ''),
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
   * Filters the list of countries based on include and exclude lists
   * @private
   * @returns void
   */
  private filterCountryList(): void {
    if (this.includeCountries.length > 0) {
      this.countries = this.countries.filter(country =>
        this.includeCountries.includes(country.alpha2)
      );
    }

    if (this.excludeCountries.length > 0) {
      this.countries = this.countries.filter(country =>
        !this.excludeCountries.includes(country.alpha2)
      );
    }
  }

  /**
   * Filters countries based on search value
   * @private
   * @param value - Search value (string or Country object)
   * @returns Filtered array of countries
   */
  private filterCountries(value: string | Country | null): Country[] {
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
}
