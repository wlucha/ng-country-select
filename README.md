# 🌍 Country Autocomplete Component 🌏

**A smart, multilingual country search with flags and codes**  
✨ *Enhance your Angular forms with this elegant, high-performance autocomplete* ✨

[![GitHub Stars](https://img.shields.io/github/stars/yourusername/country-autocomplete?style=for-the-badge&logo=github)](https://github.com/wlucha/country-select/stargazers)
[![Angular Version](https://img.shields.io/badge/Angular-16+-brightgreen?style=for-the-badge&logo=angular)](https://angular.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

## 🚀 Features

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


## 🛠️ Setup in 60 Seconds
### 1. Install Dependencies
```bash
npm install --save @angular/material @angular/cdk @angular/animations @wlucha/country-select
```

### 2. Import Component
```typescript
import { CountrySelectComponent } from '@wlucha/country-select';

@NgModule({
  imports: [
    CountrySelectComponent,
    // ... other imports
  ]
})
```
### 3. Add Basic Usage
```html
<country-select
  [lang]="'en'"
  (countrySelected)="handleSelection($event)"
></country-select>
```

## 🎛️ Parameters Worth Exploring

### 🎚️ Inputs

| Parameter           | Type    | Default | Description                          |
|---------------------|---------|---------|--------------------------------------|
| `lang`              | string  | 'en'    | Display language (ISO 639-1) (`en`/`de`/`fr`) |
| `searchAllLanguages`| boolean | false   | Search across all translations       |
| `showCodes`         | boolean | false   | Whether the alpha2 and alpha3 code should be displayed |
| `debounceTime`      | number  | 300     | Input delay before search (ms)       |
| `appearance`        | string  | 'fill'  | Material field style (`fill`/`outline`) |
| `placeholder`       | string  | 'Search country' | Custom placeholder text     |

### 🚨 Outputs

| Event               | Output              | Description                         |
|---------------------|---------------------|-------------------------------------|
| `countrySelected`   | `Country`           | Full country object on selection    |
| `inputChanged`      | `string`            | Live search term updates            |
| `closed`            | `void`              | When dropdown closes                |

## Power User Setup
```html
<country-autocomplete
  [lang]="'en'"
  [searchAllLanguages]="true"
  [showCodes]="true"
  [debounceTime]="200"
  [appearance]="'outline'"
  [placeholder]="'Search country'"
  (countrySelected)="onCountrySelect($event)"
  (inputChanged)="trackSearchTerm($event)"
></country-autocomplete>
```

## 🌟 Support the Project

**Love this component? Here's how you can help:**

1. ⭐ **Star the repo** (you're awesome!)  
2. 🐛 **Report bugs** [here](https://github.com/yourusername/country-autocomplete/issues)  
3. 💡 **Suggest features**  
4. 📢 **Share with your network**

```bash
# Your star fuels development! ⭐
# Clone and explore:
git clone https://github.com/wlucha/country-select.git
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
