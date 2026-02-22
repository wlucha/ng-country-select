import { InjectionToken, Provider } from '@angular/core';
import { Country } from './country.interface';

/**
 * Configuration for customizing the country select component.
 */
export interface CountrySelectConfig {
    /**
     * Completely replace the built-in country list with a custom one.
     * When provided, `extraTranslations` is ignored.
     */
    countries?: Country[];

    /**
     * Merge additional translations into the built-in country data.
     * Keyed by alpha2 country code, each value is a map of language code → translation.
     *
     * @example
     * {
     *   de: { pl: 'Niemcy', ja: 'ドイツ' },
     *   at: { pl: 'Austria', ja: 'オーストリア' }
     * }
     */
    extraTranslations?: Record<string, Record<string, string>>;
}

/**
 * Injection token for providing custom country select configuration.
 *
 * @example
 * // In your app config or module:
 * providers: [
 *   provideCountrySelectConfig({
 *     extraTranslations: {
 *       de: { pl: 'Niemcy' },
 *       at: { pl: 'Austria' }
 *     }
 *   })
 * ]
 */
export const COUNTRY_SELECT_CONFIG = new InjectionToken<CountrySelectConfig>('COUNTRY_SELECT_CONFIG');

/**
 * Provides the country select configuration.
 *
 * @param config - The configuration to provide
 * @returns A Provider for the country select configuration
 *
 * @example
 * provideCountrySelectConfig({
 *   extraTranslations: {
 *     de: { pl: 'Niemcy' },
 *     at: { pl: 'Austria' }
 *   }
 * })
 */
export function provideCountrySelectConfig(config: CountrySelectConfig): Provider {
    return { provide: COUNTRY_SELECT_CONFIG, useValue: config };
}
