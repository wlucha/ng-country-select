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
});