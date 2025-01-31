export interface Country {
  alpha2: string;
  alpha3: string;
  translations: {
    de: string;
    en: string;
    fr: string;
    [key: string]: string;
  }
}