import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'countryFlag',
    standalone: true
})
export class CountryFlagPipe implements PipeTransform {
    private cache = new Map<string, string>();

    transform(alpha2: string): string {
        if (!alpha2 || alpha2.length !== 2) return '';

        if (this.cache.has(alpha2)) {
            return this.cache.get(alpha2)!;
        }

        const flag = alpha2
            .toUpperCase()
            .replace(/./g, char =>
                String.fromCodePoint(127397 + char.charCodeAt(0))
            );

        this.cache.set(alpha2, flag);
        return flag;
    }
}