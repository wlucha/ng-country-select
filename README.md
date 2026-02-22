# 🌍 Angular Material Country Autocomplete

**A smart, multilingual country search with flags and codes made with Angular**  
✨ *Enhance your Angular forms with this elegant, high-performance autocomplete* ✨

[![GitHub Stars](https://img.shields.io/github/stars/wlucha/ng-country-select?style=for-the-badge&logo=github)](https://github.com/wlucha/ng-country-select/stargazers)
[![Angular Version](https://img.shields.io/badge/Angular-16+-brightgreen?style=for-the-badge&logo=angular)](https://angular.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

<p align="center">
<img src="https://github.com/user-attachments/assets/e7946ea0-14ea-414c-8f48-c11dd257bfd1">
</p>


## 📢 Features

- **🅰️ Fully Compatible with Angular 16-21**  
This library is designed to work seamlessly with the latest Angular versions (16, 17, 18, 19, 20, 21).  
It leverages modern Angular features while maintaining backward compatibility.

- **🌍 Multi-language Magic**  
  Supports English, French, Spanish, Italian, German, Arabic, Chinese, Hindi, Bengali, Portuguese, Russian — plus easily extendable to **any custom language** via `provideCountrySelectConfig()`

- **🎌 Flag Images** 🇺🇸 🇩🇪 🇫🇷 🇪🇸 🇮🇹  
  OS & Browser independent flag images

- **⚡ Optimized Performance**  
  RxJS-powered search with debounce & virtual scrolling

- **🔍 Smart Search**  
  Search countries by: ✓ Localized name  ✓ Any translation  ✓ Alpha2/3 codes  

- **🎨 Material Design Excellence**  
  Seamless integration with Angular Material components

- **🧩 Standalone Component**  
  Zero boilerplate integration

## 🚀 Demo
Live Demo: [**https://wlucha.github.io/ng-country-select**](https://wlucha.github.io/ng-country-select)

Stackblitz: [https://stackblitz.com/~/github.com/wlucha/ng-country-select](https://stackblitz.com/~/github.com/wlucha/ng-country-select)

## 🌍 Compatibility

| Angular Version                                                   | ✅ Supported |
|-------------------------------------------------------------------|--------------|
| ![Angular 21](https://img.shields.io/badge/Angular-21-lightgreen) | ✅ Yes       |
| ![Angular 20](https://img.shields.io/badge/Angular-20-green)      | ✅ Yes       |
| ![Angular 19](https://img.shields.io/badge/Angular-19-yellow)     | ✅ Yes       |
| ![Angular 18](https://img.shields.io/badge/Angular-18-orange)     | ✅ Yes       |
| ![Angular 17](https://img.shields.io/badge/Angular-17-red)        | ✅ Yes       |
| ![Angular 16](https://img.shields.io/badge/Angular-16-darkred)    | ✅ Yes       |

## 🛠️ Setup in 60 Seconds
## 1. Install Dependencies
### Quick Installation (`ng add`)
```sh
ng add @wlucha/ng-country-select
```

This command will install the `@wlucha/ng-country-select` library + all required dependencies.  

#### (Alternative) Install Dependencies manually & update Angular.json styles
```sh
# Install dependencies
npm install --save @angular/material @angular/cdk @angular/animations flag-icons @wlucha/ng-country-select

# Add the flag icon styles to Angular.json "styles" array
"architect": {
   "build": {
      "options": {
        ...,
        "styles": [
          ...,
          "flag-icons/css/flag-icons.min.css"
        ]
      }
    }
  }
}    
```


### 2. Import Component
```typescript
import { CountrySelectComponent } from '@wlucha/ng-country-select';

@NgModule({
  imports: [
    CountrySelectComponent,
    // ... other imports
  ]
})
```

### 3. Add Basic Usage
```html
<ng-country-select
  [lang]="'en'"
  (countrySelected)="handleSelection($event)"
></ng-country-select>
```

## 🎛️ Parameters Worth Exploring

### 🎚️ Inputs

| Parameter                             | Type                         | Default               | Description                                                                              |
|---------------------------------------|------------------------------|-----------------------|------------------------------------------------------------------------------------------|
| `defaultCountry`                      | `Country \| null`            | `null`                | Sets an initial preselected country                                                      |
| `formControl`                         | `FormControl<Country \| null>` | `new FormControl(null)` | Reactive form control for the country select                                           |
| `selectedCountry`                     | `Country \| null`            | -                     | Sets a country programmatically (after init)                                             |
| `selectedCountryByAlpha2`             | `string`                     | -                     | Set a country programmatically by its alpha2 code                                        |
| `selectedCountryByAlpha3`             | `string`                     | -                     | Set a country programmatically by its alpha3 code                                        |
| `selectedCountryByCurrentTranslation` | `string`                     | -                     | Set a country programmatically by its name in the current language                        |
| `lang`                                | `string`                     | `'en'`                | Language for displaying country names — supports built-in and custom languages            |
| `searchAllLanguages`                  | `boolean`                    | `false`               | If `true`, searching will match in **all** available translations                        |
| `placeholder`                         | `string`                     | `'Search country'`    | Placeholder text for the input field                                                     |
| `label`                               | `string \| undefined`        | `undefined`           | Custom label for the form field                                                          |
| `showLabel`                           | `boolean`                    | `true`                | Whether to show the label (uses `label` or `placeholder` as fallback)                    |
| `debounceTime`                        | `number`                     | `100`                 | Debounce time in milliseconds for the search input                                       |
| `disabled`                            | `boolean`                    | `false`               | Disables the component if `true`                                                         |
| `appearance`                          | `'fill' \| 'outline'`        | `'fill'`              | Appearance style of the form field                                                       |
| `required`                            | `boolean`                    | `false`               | Marks the field as required if `true`                                                    |
| `requiredErrorMessage`                | `string`                     | `'A country is required'` | Error message shown when the field is required and empty                              |
| `showRequiredErrorMessage`            | `boolean`                    | `false`               | Whether to show the built-in required error message                                      |
| `showCodes`                           | `boolean`                    | `false`               | If `true`, shows alpha2/alpha3 codes in the autocomplete results                         |
| `color`                               | `ThemePalette`               | `'primary'`           | Angular Material color palette (`'primary'`, `'accent'`, `'warn'`)                       |
| `includeCountries`                    | `string[]`                   | `[]`                  | List of alpha2 country codes to include (e.g., `['us', 'de', 'fr']`)                     |
| `excludeCountries`                    | `string[]`                   | `[]`                  | List of alpha2 country codes to exclude (e.g., `['us', 'de', 'fr']`)                     |
| `alpha2Only`                          | `boolean`                    | `false`               | Show only alpha2 codes in the results                                                    |
| `alpha3Only`                          | `boolean`                    | `false`               | Show only alpha3 codes in the results                                                    |
| `showFlag`                            | `boolean`                    | `true`                | Whether the flag should be displayed                                                     |

### 🚨 Outputs

| Event               | Type              | Description                                |
|---------------------|-------------------|--------------------------------------------|
| `countrySelected`   | `Country`         | Emits the full country object on selection |
| `inputChanged`      | `string`          | Emits the current search term on change    |
| `closed`            | `void`            | Emits when the autocomplete panel closes   |

## 💻 Power User Setup
```html
<ng-country-select
  [lang]="'en'"
  [formControl]="countryControl"
  [searchAllLanguages]="true"
  [showCodes]="true"
  [debounceTime]="200"
  [required]="true"
  [requiredErrorMessage]="'A country is required'"
  [showRequiredErrorMessage]="true"
  [disabled]="false"
  [appearance]="'outline'"
  [placeholder]="'Search country'"
  [color]="primary"
  [alpha2Only]="false"
  [alpha3Only]="false"
  [showFlag]="true"
  [excludeCountries]="['US', 'DE', 'FR']"
  (countrySelected)="onCountrySelect($event)"
  (inputChanged)="trackSearchTerm($event)"
></ng-country-select>
```

## 🌐 Custom Language Support

You can add custom translations or override existing ones using `provideCountrySelectConfig()`.

### Adding extra translations (e.g. Polish)

```typescript
// app.config.ts
import { provideCountrySelectConfig } from '@wlucha/ng-country-select';

export const appConfig: ApplicationConfig = {
  providers: [
    provideCountrySelectConfig({
      extraTranslations: {
        de: { pl: 'Niemcy', ja: 'ドイツ' },
        at: { pl: 'Austria', ja: 'オーストリア' },
        fr: { pl: 'Francja', ja: 'フランス' },
        // ... add translations for all countries
      }
    })
  ]
};
```

Then use the custom language in your template:

```html
<ng-country-select
  [lang]="'pl'"
  [placeholder]="'Szukaj kraju'"
></ng-country-select>
```

### Replacing the entire country list

For full control, you can replace the built-in country list entirely:

```typescript
provideCountrySelectConfig({
  countries: [
    {
      alpha2: 'de',
      alpha3: 'deu',
      translations: { en: 'Germany', pl: 'Niemcy', ja: 'ドイツ' }
    },
    // ... your custom list
  ]
})
```

### Exported symbols

| Symbol                        | Type              | Description                              |
|-------------------------------|-------------------|------------------------------------------|
| `provideCountrySelectConfig`  | `function`        | Provider helper for app config           |
| `COUNTRY_SELECT_CONFIG`       | `InjectionToken`  | Token for advanced DI scenarios          |
| `CountrySelectConfig`         | `interface`       | Configuration type                       |

## 🌟 Support the Project

**Love this component? Here's how you can help:**

1. ⭐ **Star the repo** (you're awesome!)  
2. 🐛 **Report bugs** [here](https://github.com/wlucha/ng-country-select/issues)  
3. 💡 **Suggest features**  
4. 📢 **Share with your network**

```bash
# Your star fuels development! ⭐
# Clone and explore:
git clone https://github.com/wlucha/ng-country-select.git
````

---

📄 License: MIT  
👨💻 Maintainer: Wilfried Lucha

Made with ❤️ & ☕ by Open Source Contributors

