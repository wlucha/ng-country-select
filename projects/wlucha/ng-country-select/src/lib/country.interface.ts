export interface Country {
  alpha2: string;
  alpha3: string;
  translations: {
    de: string;
    en: string;
    fr: string;
    it: string;
    es: string;
    ar: string;
    zh: string;
    hi: string;
    bn: string;
    pt: string;
    ru: string;
    [key: string]: string;
  }
}