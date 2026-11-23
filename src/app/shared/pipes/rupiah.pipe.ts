import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'rupiah',
    standalone: true,
})
export class RupiahPipe implements PipeTransform {
    transform(value: number | null | undefined): string {
        if (value === null || value === undefined || Number.isNaN(value)) {
            return 'Rp. 0,00';
        }

        const formatted = new Intl.NumberFormat('id-ID', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(value);

        return `Rp. ${formatted}`;
    }
}