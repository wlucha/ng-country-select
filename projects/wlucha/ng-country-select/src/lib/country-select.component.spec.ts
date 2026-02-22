import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CountrySelectComponent } from './country-select.component';
import { Country } from './country.interface';
import { provideCountrySelectConfig } from './country-select.config';

@Component({
  standalone: true,
  imports: [CountrySelectComponent, ReactiveFormsModule],
  template: `
    <ng-country-select [formControl]="control" required>
      <span country-error>Test Error</span>
    </ng-country-select>
  `
})
class TestHostComponent {
  control = new FormControl(null, Validators.required);
}

describe('CountrySelectComponent', () => {
  let component: CountrySelectComponent;
  let fixture: ComponentFixture<CountrySelectComponent>;

  const mockCountry: Country = {
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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatAutocompleteModule,
        MatInputModule,
        MatFormFieldModule,
        NoopAnimationsModule,
        CountrySelectComponent,
        TestHostComponent
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CountrySelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.lang).toBe('en');
    expect(component.showCodes).toBe(false);
    expect(component.appearance).toBe('fill');
    expect(component.placeholder).toBe('Search country');
    expect(component.debounceTime).toBe(100);
  });

  it('should emit countrySelected event when a country is selected', () => {
    jest.spyOn(component.countrySelected, 'emit');
    component.onOptionSelected(mockCountry);
    expect(component.countrySelected.emit).toHaveBeenCalledWith(mockCountry);
  });

  it('should filter countries based on search term', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (component as unknown as Record<string, any>)['countries'] = [mockCountry];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filtered = (component as unknown as Record<string, any>)['filterCountries']('Ger') as Country[];
    expect(filtered.length).toBe(1);
    expect(filtered[0]).toEqual(mockCountry);
  });

  it('should display country name using displayFn', () => {
    const displayName = component.displayFn(mockCountry);
    expect(displayName).toBe('Germany');
  });

  it('should return empty string in displayFn if country is null', () => {
    const displayName = component.displayFn(null);
    expect(displayName).toBe('');
  });

  it('should track countries by alpha2 code', () => {
    const trackByResult = component.trackByAlpha2(0, mockCountry);
    expect(trackByResult).toBe('de');
  });

  it('should set label and showLabel inputs', () => {
    component.label = 'Custom Label';
    component.showLabel = false;
    expect(component.label).toBe('Custom Label');
    expect(component.showLabel).toBe(false);
  });

  it('should disable formControl when disabled input is set to true', () => {
    component.disabled = true;
    expect(component.formControl.disabled).toBe(true);
    component.disabled = false;
    expect(component.formControl.enabled).toBe(true);
  });

  it('should implement setDisabledState', () => {
    component.setDisabledState(true);
    expect(component.disabled).toBe(true);
    expect(component.formControl.disabled).toBe(true);
    component.setDisabledState(false);
    expect(component.disabled).toBe(false);
    expect(component.formControl.enabled).toBe(true);
  });

  it('should call onChange when option is selected', () => {
    const onChangeSpy = jest.fn();
    component.registerOnChange(onChangeSpy);
    component.onOptionSelected(mockCountry);
    expect(onChangeSpy).toHaveBeenCalledWith(mockCountry);
  });

  it('should write value to formControl', () => {
    component.writeValue(mockCountry);
    expect(component.formControl.value).toEqual(mockCountry);
  });

  it('should project content with country-error attribute', () => {
    const hostFixture = TestBed.createComponent(TestHostComponent);
    hostFixture.detectChanges();

    // Make the control touched to show the error
    hostFixture.componentInstance.control.markAsTouched();
    hostFixture.detectChanges();

    // MatError is rendered inside mat-form-field -> mat-form-field-subscript-wrapper -> mat-error
    // We can check if the projected content is present in the DOM
    const hostElement = hostFixture.nativeElement;
    const errorElement = hostElement.querySelector('[country-error]');

    expect(errorElement).toBeTruthy();
    expect(errorElement.textContent).toContain('Test Error');

    // Optionally check if it is wrapped in mat-error
    // Dependent on Material implementation details, but we can check if a parent or near ancestor is mat-error
    // Note: Angular Material might project the error elsewhere in the DOM (subscript), but structure is maintained for querySelector
    const matError = hostElement.querySelector('mat-error');
    expect(matError).toBeTruthy();
    expect(matError.contains(errorElement)).toBe(true);
  });

  describe('with custom config', () => {
    it('should use default countries when no config is provided', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const countries = (component as unknown as Record<string, any>)['countries'] as Country[];
      expect(countries.length).toBeGreaterThan(200);
      expect(countries[0].translations['en']).toBeDefined();
    });

    it('should merge extra translations into countries', async () => {
      await TestBed.resetTestingModule();
      await TestBed.configureTestingModule({
        imports: [
          ReactiveFormsModule,
          MatAutocompleteModule,
          MatInputModule,
          MatFormFieldModule,
          NoopAnimationsModule,
          CountrySelectComponent
        ],
        providers: [
          provideCountrySelectConfig({
            extraTranslations: {
              de: { pl: 'Niemcy' },
              at: { pl: 'Austria' }
            }
          })
        ]
      }).compileComponents();

      const f = TestBed.createComponent(CountrySelectComponent);
      const c = f.componentInstance;
      f.detectChanges();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const countries: Country[] = (c as unknown as Record<string, any>)['countries'] as Country[];
      const germany = countries.find((co: Country) => co.alpha2 === 'de');
      const austria = countries.find((co: Country) => co.alpha2 === 'at');
      const france = countries.find((co: Country) => co.alpha2 === 'fr');

      expect(germany?.translations['pl']).toBe('Niemcy');
      expect(germany?.translations['en']).toBe('Germany');
      expect(austria?.translations['pl']).toBe('Austria');
      // Countries without extra translations should remain unchanged
      expect(france?.translations['pl']).toBeUndefined();
      expect(france?.translations['en']).toBe('France');
    });

    it('should replace entire country list when countries config is provided', async () => {
      const customCountries: Country[] = [
        {
          alpha2: 'xx',
          alpha3: 'xxx',
          translations: { de: 'TestLand', en: 'TestCountry', fr: '', it: '', es: '', ar: '', zh: '', hi: '', bn: '', pt: '', ru: '' }
        }
      ];

      await TestBed.resetTestingModule();
      await TestBed.configureTestingModule({
        imports: [
          ReactiveFormsModule,
          MatAutocompleteModule,
          MatInputModule,
          MatFormFieldModule,
          NoopAnimationsModule,
          CountrySelectComponent
        ],
        providers: [
          provideCountrySelectConfig({ countries: customCountries })
        ]
      }).compileComponents();

      const f = TestBed.createComponent(CountrySelectComponent);
      const c = f.componentInstance;
      f.detectChanges();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const countries: Country[] = (c as unknown as Record<string, any>)['countries'] as Country[];
      expect(countries.length).toBe(1);
      expect(countries[0].alpha2).toBe('xx');
      expect(countries[0].translations['en']).toBe('TestCountry');
    });
  });

  describe('includeCountries and excludeCountries', () => {
    it('should only show included countries', () => {
      component.includeCountries = ['de', 'fr'];
      component.ngOnInit();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const countries = (component as unknown as Record<string, any>)['countries'] as Country[];
      expect(countries.length).toBe(2);
      expect(countries.every(c => ['de', 'fr'].includes(c.alpha2))).toBe(true);
    });

    it('should hide excluded countries', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const totalBefore = ((component as unknown as Record<string, any>)['countries'] as Country[]).length;

      component.excludeCountries = ['de', 'fr', 'us'];
      component.ngOnInit();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const countries = (component as unknown as Record<string, any>)['countries'] as Country[];
      expect(countries.length).toBe(totalBefore - 3);
      expect(countries.find(c => c.alpha2 === 'de')).toBeUndefined();
      expect(countries.find(c => c.alpha2 === 'fr')).toBeUndefined();
      expect(countries.find(c => c.alpha2 === 'us')).toBeUndefined();
    });

    it('should return empty list when include contains no valid codes', () => {
      component.includeCountries = ['zz', 'yy'];
      component.ngOnInit();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const countries = (component as unknown as Record<string, any>)['countries'] as Country[];
      expect(countries.length).toBe(0);
    });
  });

  describe('programmatic country selection', () => {
    it('should set country by alpha2 code', () => {
      component.selectedCountryByAlpha2 = 'de';
      expect(component.formControl.value?.alpha2).toBe('de');
      expect(component.formControl.value?.alpha3).toBe('deu');
    });

    it('should set country by alpha3 code', () => {
      component.selectedCountryByAlpha3 = 'deu';
      expect(component.formControl.value?.alpha3).toBe('deu');
      expect(component.formControl.value?.alpha2).toBe('de');
    });

    it('should not change value when alpha2 code is invalid', () => {
      component.formControl.setValue(null);
      component.selectedCountryByAlpha2 = 'zz';
      expect(component.formControl.value).toBeNull();
    });

    it('should not change value when alpha3 code is invalid', () => {
      component.formControl.setValue(null);
      component.selectedCountryByAlpha3 = 'zzz';
      expect(component.formControl.value).toBeNull();
    });

    it('should set country by current translation', () => {
      component.lang = 'en';
      component.selectedCountryByCurrentTranslation = 'Germany';
      expect(component.formControl.value?.alpha2).toBe('de');
    });

    it('should not set country when translation does not match', () => {
      component.formControl.setValue(null);
      component.lang = 'en';
      component.selectedCountryByCurrentTranslation = 'NonExistentCountry';
      expect(component.formControl.value).toBeNull();
    });
  });

  describe('displayFn variants', () => {
    it('should display alpha2 code when alpha2Only is true', () => {
      component.alpha2Only = true;
      const result = component.displayFn(mockCountry);
      expect(result).toBe('DE');
    });

    it('should display alpha3 code when alpha3Only is true', () => {
      component.alpha3Only = true;
      const result = component.displayFn(mockCountry);
      expect(result).toBe('DEU');
    });

    it('should display country name in the selected language', () => {
      component.lang = 'de';
      const result = component.displayFn(mockCountry);
      expect(result).toBe('Deutschland');
    });

    it('should display country name in French when lang is fr', () => {
      component.lang = 'fr';
      const result = component.displayFn(mockCountry);
      expect(result).toBe('Allemagne');
    });

    it('should return empty string for null when alpha2Only is true', () => {
      component.alpha2Only = true;
      expect(component.displayFn(null)).toBe('');
    });

    it('should return empty string for null when alpha3Only is true', () => {
      component.alpha3Only = true;
      expect(component.displayFn(null)).toBe('');
    });
  });

  describe('defaultCountry', () => {
    it('should set formControl value to defaultCountry on init', () => {
      // Create a fresh component so we can set defaultCountry before ngOnInit
      const f = TestBed.createComponent(CountrySelectComponent);
      const c = f.componentInstance;
      c.defaultCountry = mockCountry;
      f.detectChanges(); // triggers ngOnInit

      expect(c.formControl.value).toEqual(mockCountry);
    });

    it('should not set formControl value when defaultCountry is null', () => {
      const f = TestBed.createComponent(CountrySelectComponent);
      const c = f.componentInstance;
      c.defaultCountry = null;
      f.detectChanges();

      expect(c.formControl.value).toBeNull();
    });
  });

  describe('language switching', () => {
    it('should update lang property', () => {
      component.lang = 'de';
      expect(component.lang).toBe('de');
    });

    it('should update filteredCountries$ when language changes', () => {
      component.lang = 'fr';
      expect(component.filteredCountries$).toBeDefined();
    });
  });

  describe('filtering', () => {
    it('should filter by alpha2 code', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (component as unknown as Record<string, any>)['countries'] = [mockCountry];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const filtered = (component as unknown as Record<string, any>)['filterCountries']('de') as Country[];
      expect(filtered.length).toBe(1);
      expect(filtered[0].alpha2).toBe('de');
    });

    it('should filter by alpha3 code', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (component as unknown as Record<string, any>)['countries'] = [mockCountry];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const filtered = (component as unknown as Record<string, any>)['filterCountries']('deu') as Country[];
      expect(filtered.length).toBe(1);
      expect(filtered[0].alpha3).toBe('deu');
    });

    it('should return empty array when no match found', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (component as unknown as Record<string, any>)['countries'] = [mockCountry];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const filtered = (component as unknown as Record<string, any>)['filterCountries']('xyz') as Country[];
      expect(filtered.length).toBe(0);
    });

    it('should filter case-insensitively', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (component as unknown as Record<string, any>)['countries'] = [mockCountry];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const filtered = (component as unknown as Record<string, any>)['filterCountries']('GERMANY') as Country[];
      expect(filtered.length).toBe(1);
    });

    it('should search all languages when searchAllLanguages is true', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (component as unknown as Record<string, any>)['countries'] = [mockCountry];
      component.searchAllLanguages = true;
      component.lang = 'en';
      // Search by the German name while lang is English — should match due to searchAllLanguages
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const filtered = (component as unknown as Record<string, any>)['filterCountries']('Deutschland') as Country[];
      expect(filtered.length).toBe(1);
    });

    it('should not match other languages when searchAllLanguages is false', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (component as unknown as Record<string, any>)['countries'] = [mockCountry];
      component.searchAllLanguages = false;
      component.lang = 'en';
      // Search by German name while lang is English — should NOT match by language name
      // However it may still match via alpha2/alpha3 code matching, so use a name that doesn't overlap
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const filtered = (component as unknown as Record<string, any>)['filterCountries']('Allemagne') as Country[];
      expect(filtered.length).toBe(0);
    });

    it('should filter by Country object value', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (component as unknown as Record<string, any>)['countries'] = [mockCountry];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const filtered = (component as unknown as Record<string, any>)['filterCountries'](mockCountry) as Country[];
      expect(filtered.length).toBe(1);
    });

    it('should set height based on number of filtered results', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (component as unknown as Record<string, any>)['countries'] = [mockCountry];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (component as unknown as Record<string, any>)['filterCountries']('Ger');
      // 1 result * 50px
      expect(component.height).toBe('50px');
    });
  });

  describe('autocomplete panel', () => {
    it('should emit closed event when panel is closed', () => {
      jest.spyOn(component.closed, 'emit');
      component.onAutocompleteClosed();
      expect(component.closed.emit).toHaveBeenCalled();
    });
  });

  describe('required validation', () => {
    it('should set required property', () => {
      component.required = true;
      expect(component.required).toBe(true);
    });

    it('should set requiredErrorMessage', () => {
      component.requiredErrorMessage = 'Custom error';
      expect(component.requiredErrorMessage).toBe('Custom error');
    });

    it('should have default requiredErrorMessage', () => {
      expect(component.requiredErrorMessage).toBe('A country is required');
    });

    it('should report field as invalid when required and empty', () => {
      component.required = true;
      component.formControl.setValue(null);
      component.formControl.setValidators(Validators.required);
      component.formControl.updateValueAndValidity();
      expect(component.isFieldValid()).toBe(false);
    });
  });

  describe('writeValue edge cases', () => {
    it('should not update formControl if value is the same country', () => {
      component.writeValue(mockCountry);
      const spy = jest.spyOn(component.formControl, 'setValue');
      component.writeValue(mockCountry);
      // Should not set again since alpha2 matches
      expect(spy).not.toHaveBeenCalled();
    });

    it('should update formControl when writing a different country', () => {
      component.writeValue(mockCountry);
      const austriaCountry: Country = {
        alpha2: 'at',
        alpha3: 'aut',
        translations: { de: 'Österreich', en: 'Austria', fr: 'Autriche', it: 'Austria', es: 'Austria', ar: 'النمسا', zh: '奥地利', hi: 'ऑस्ट्रिया', bn: 'অস্ট্রিয়া', pt: 'Áustria', ru: 'Австрия' }
      };
      component.writeValue(austriaCountry);
      expect(component.formControl.value).toEqual(austriaCountry);
    });

    it('should handle writing null', () => {
      component.writeValue(mockCountry);
      component.writeValue(null);
      expect(component.formControl.value).toBeNull();
    });
  });

  describe('disabled state', () => {
    it('should not re-disable when already disabled', () => {
      component.disabled = true;
      const disableSpy = jest.spyOn(component.formControl, 'disable');
      component.disabled = true; // set again
      expect(disableSpy).not.toHaveBeenCalled();
    });

    it('should not re-enable when already enabled', () => {
      component.disabled = false;
      const enableSpy = jest.spyOn(component.formControl, 'enable');
      component.disabled = false; // set again
      expect(enableSpy).not.toHaveBeenCalled();
    });
  });

  describe('onTouched registration', () => {
    it('should register onTouched callback', () => {
      const onTouchedSpy = jest.fn();
      component.registerOnTouched(onTouchedSpy);
      // Access the registered onTouched via the private field
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const onTouched = (component as unknown as Record<string, any>)['onTouched'] as () => void;
      onTouched();
      expect(onTouchedSpy).toHaveBeenCalled();
    });
  });

  describe('appearance and color inputs', () => {
    it('should accept outline appearance', () => {
      component.appearance = 'outline';
      expect(component.appearance).toBe('outline');
    });

    it('should accept fill appearance', () => {
      component.appearance = 'fill';
      expect(component.appearance).toBe('fill');
    });

    it('should accept accent color', () => {
      component.color = 'accent';
      expect(component.color).toBe('accent');
    });

    it('should accept warn color', () => {
      component.color = 'warn';
      expect(component.color).toBe('warn');
    });
  });

  describe('showCodes and showFlag inputs', () => {
    it('should toggle showCodes', () => {
      component.showCodes = true;
      expect(component.showCodes).toBe(true);
    });

    it('should toggle showFlag', () => {
      component.showFlag = false;
      expect(component.showFlag).toBe(false);
    });
  });
});