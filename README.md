# 🌍 Angular Material Country Autocomplete

**A smart, multilingual country search with flags and codes made with Angular**  
✨ *Enhance your Angular forms with this elegant, high-performance autocomplete* ✨

[![GitHub Stars](https://img.shields.io/github/stars/wlucha/ng-country-select?style=for-the-badge&logo=github)](https://github.com/wlucha/ng-country-select/stargazers)
[![Angular Version](https://img.shields.io/badge/Angular-16+-brightgreen?style=for-the-badge&logo=angular)](https://angular.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

## 📢 Features

- **🌍 Fully Compatible with Angular 16-19**  
This library is designed to work seamlessly with the latest Angular versions (16, 17, 18, and 19).  
It leverages modern Angular features while maintaining backward compatibility.

- **🌐 Multi-language Magic**  
  Supports German, English, French + easily extendable to any language

- **🎌 Automatic Flag Emojis**  
  Auto-generated from ISO codes (no image dependencies!)

- **🔍 Smart Search**  
  Find countries by:  
  ✓ Local name ✓ English name ✓ Alpha2/3 codes ✓ Any translation

- **🎨 Material Design Excellence**  
  Seamless integration with Angular Material components

- **⚡ Optimized Performance**  
  RxJS-powered search with debounce & virtual scrolling ready

- **🧩 Standalone Component**  
  Zero boilerplate integration

## 🚀 Demo
https://wlucha.github.io/ng-country-select/

## 🌍 Compatibility

| Angular Version | ✅ Supported |
|----------------|-------------|
| ![Angular 16](https://img.shields.io/badge/Angular-16-red) | ✅ Yes |
| ![Angular 17](https://img.shields.io/badge/Angular-17-orange) | ✅ Yes |
| ![Angular 18](https://img.shields.io/badge/Angular-18-yellow) | ✅ Yes |
| ![Angular 19](https://img.shields.io/badge/Angular-19-green) | ✅ Yes |



## 🛠️ Setup in 60 Seconds
### 1. Install Dependencies
```sh
npm install --save @angular/material @angular/cdk @angular/animations @wlucha/ng-country-select
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

| Parameter           | Type    | Default | Description                          |
|---------------------|---------|---------|--------------------------------------|
| `lang`              | string  | 'en'    | Display language (ISO 639-1) (`en`/`de`/`fr`) |
| `defaultCountry`    | Country | null    | Set an initial default country       |
| `searchAllLanguages`| boolean | false   | Search across all translations       |
| `showCodes`         | boolean | false   | Whether the alpha2 and alpha3 code should be displayed |
| `debounceTime`      | number  | 100     | Input delay before search (ms)       |
| `appearance`        | string  | 'fill'  | Material field style (`fill`/`outline`) |
| `placeholder`       | string  | 'Search country' | Custom placeholder text     |

### 🚨 Outputs

| Event               | Output              | Description                         |
|---------------------|---------------------|-------------------------------------|
| `countrySelected`   | `Country`           | Full country object on selection    |
| `inputChanged`      | `string`            | Live search term updates            |
| `closed`            | `void`              | When dropdown closes                |

## 💻 Power User Setup
```html
<ng-country-select
  [lang]="'en'"
  [searchAllLanguages]="true"
  [showCodes]="true"
  [debounceTime]="200"
  [appearance]="'outline'"
  [placeholder]="'Search country'"
  (countrySelected)="onCountrySelect($event)"
  (inputChanged)="trackSearchTerm($event)"
></ng-country-select>
```

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

## TODO
- ng-add script
- more languages
- unit tests
- HD flags
- custom option template
