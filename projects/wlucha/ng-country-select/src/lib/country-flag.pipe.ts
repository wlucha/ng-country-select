import { Pipe, PipeTransform } from "@angular/core";
import { Country } from "./country.interface";

@Pipe({
    name: 'countryFlag',
    standalone: true
})
export class CountryFlagPipe implements PipeTransform {
    private cache = new Map<string, string>();

    transform(country: Country | null): string {
        if (!country || !country.alpha2) return '';

        if (this.cache.has(country.alpha2)) {
            return this.cache.get(country.alpha2)!;
        }

        const flag = country.alpha2
            .toUpperCase()
            .replace(/./g, char =>
                String.fromCodePoint(127397 + char.charCodeAt(0))
            );

        this.cache.set(country.alpha2, flag);
        return flag;
    }
}