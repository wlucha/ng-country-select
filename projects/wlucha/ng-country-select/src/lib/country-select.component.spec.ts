import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CountrySelectComponent } from './country-select.component';
import { Country } from './country.interface';

describe('CountrySelectComponent', () => {
  let component: CountrySelectComponent;
  let fixture: ComponentFixture<CountrySelectComponent>;

  const mockCountry: Country = {
    alpha2: 'DE',
    alpha3: 'DEU',
    translations: {
      de: 'Deutschland',
      en: 'Germany',
      fr: 'Allemagne'
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      imports: [
        ReactiveFormsModule,
        MatAutocompleteModule,
        MatInputModule,
        MatFormFieldModule,
        NoopAnimationsModule,
        CountrySelectComponent
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

  it('should set default country if provided', () => {
    component.defaultCountry = mockCountry;
    component.ngOnInit();
    expect(component.control.value).toEqual(mockCountry);
    expect(component.selectedCountryFlag).toBe('🇩🇪');
  });

  it('should emit countrySelected event when a country is selected', () => {
    jest.spyOn(component.countrySelected, 'emit');
    component.onOptionSelected(mockCountry);
    expect(component.countrySelected.emit).toHaveBeenCalledWith(mockCountry);
  });

  it('should emit inputChanged event when typing', (done) => {
    jest.spyOn(component.inputChanged, 'emit');
    component.control.setValue('Ger');

    setTimeout(() => {
      expect(component.inputChanged.emit).toHaveBeenCalledWith('Ger');
      done();
    }, component.debounceTime + 10); // Wartezeit für debounce
  });

  it('should filter countries based on search term', () => {
    (component as any).countries = [mockCountry];
    const filtered = (component as any).filterCountries('Ger');
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
    expect(trackByResult).toBe('DE');
  });

  it('should update selectedCountryFlag when a country is selected', () => {
    component.onOptionSelected(mockCountry);
    expect(component.selectedCountryFlag).toBe('🇩🇪');
  });

  it('should reset selectedCountryFlag when search term is empty', () => {
    component.selectedCountryFlag = '🇩🇪';
    (component as any).filterCountries('');
    expect(component.selectedCountryFlag).toBe('');
  });
});