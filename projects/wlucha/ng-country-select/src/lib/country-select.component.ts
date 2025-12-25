import { ScrollingModule } from '@angular/cdk/scrolling';
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, OnInit, forwardRef } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ThemePalette } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Observable } from 'rxjs';
import { map, startWith, debounceTime, tap } from 'rxjs/operators';

import { Country } from './country.interface';
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
    ScrollingModule
  ],
  templateUrl: './country-select.component.html',
  styleUrls: ['./country-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CountrySelectComponent),
      multi: true
    }
  ]
})
export class CountrySelectComponent implements OnInit, ControlValueAccessor {

  /**
   * Set initial default country
   * @example { alpha2: 'de', alpha3: 'deu', translations: { de: 'Deutschland', en: 'Germany', fr: 'Allemagne', es: 'Alemania', it: 'Germania' } }
   */
  @Input() defaultCountry: Country | null = null;

  /**
   * Default language for displaying country names
   * Currently supported: 'en', 'de', 'fr', 'es', 'it', 'ar', 'zh', 'hi', 'bn', 'pt' and 'ru'
   * @default 'en'
   */
  private _lang = 'en';
  @Input()
  set lang(value: string) {
    this._lang = value;
    this.updateLanguage();
  }
  get lang(): string {
    return this._lang;
  }

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
   * Label for the form field
   */
  @Input() public label: string | undefined;

  /**
   * Whether to show the label
   * @default true
   */
  @Input() public showLabel = true;

  /**
   * Set a country programmatically
   */
  @Input() public set selectedCountry(country: Country | null) {
    this.formControl.setValue(country);
  }

  /**
   * Set a country programmatically by its alpha2 code
   */
  @Input() public set selectedCountryByAlpha2(alpha2: string) {
    const country: Country | undefined = countries.find(c => c.alpha2 === alpha2);

    if (country) {
      this.formControl.setValue(country);
    }
  }

  /**
   * Set a country programmatically by its alpha3 code
   */
  @Input() public set selectedCountryByAlpha3(alpha3: string) {
    const country: Country | undefined = countries.find(c => c.alpha3 === alpha3);

    if (country) {
      this.formControl.setValue(country);
    }
  }

  /**
   * Set a country programmatically by its name in the current language
   */
  @Input() public set selectedCountryByCurrentTranslation(name: string) {
    const country: Country | undefined = countries.find((c: Country) => c.translations[this.lang] === name);

    if (country) {
      this.formControl.setValue(country);
    }
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
  @Input() public set disabled(value: boolean) {
    this._disabled = value;
    if (value) {
      this.formControl.disable();
    } else {
      this.formControl.enable();
    }
  }
  public get disabled(): boolean {
    return this._disabled;
  }
  private _disabled = false;

  /**
   * Marks the field as required
   * @default false
   */
  @Input() public required = false;

  /**
   * The error message to show when the field does not have a value and is required
   * @default 'A country is required'
   */
  @Input() public requiredErrorMessage = 'A country is required';

  /**
   * Whether to show an error message when the field does not have a value and is required
   * @default false
   */
  @Input() public showRequiredErrorMessage = false;

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
   * @default true
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
  public height!: string;
  private onChange: any = () => { };
  private onTouched: any = () => { };

  ngOnInit(): void {
    this.setupFilter();
    this.filterCountryList();
    if (this.defaultCountry) {
      this.formControl.setValue(this.defaultCountry);
    }
  }

  public writeValue(country: Country | null): void {
    if (country && !this.formControl.value || country?.alpha2 !== this.formControl.value?.alpha2) {
      this.formControl.setValue(country);
    }
  }

  public registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  /**
   * Handle option selection
   */
  public onOptionSelected(country: Country): void {
    this.formControl.setValue(country);
    this.onChange(country);
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
      return country?.alpha2?.toUpperCase() || '';
    } else if (this.alpha3Only) {
      return country?.alpha3?.toUpperCase() || '';
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

  public isFieldValid(): boolean {
    if (this.formControl.errors?.['required']) {
      return false;
    }

    const value = this.formControl.value;

    return !value || !value.alpha2;
  }

  /**
   * Update the displayed language for countries
   */
  private updateLanguage(): void {
    this.filteredCountries$ = this.formControl.valueChanges.pipe(
      startWith(this.formControl.value || ''),
      debounceTime(this.debounceTime),
      tap(value => {
        if (typeof value === 'string') {
          this.inputChanged.emit(value);
        }
      }),
      map(value => this.filterCountries(value))
    );

    if (this.formControl.value) {
      this.formControl.setValue(this.formControl.value);
    }
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

    const filteredCountries = this.countries.filter(country => {
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

    if (filteredCountries.length < 4) {
      this.height = filteredCountries.length * 50 + 'px';
    } else {
      this.height = '200px';
    }

    return filteredCountries;
  }
}
