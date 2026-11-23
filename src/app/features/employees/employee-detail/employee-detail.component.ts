import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeStatus } from '../../../core/models/employee.model';
import { EmployeeService } from '../../../core/services/employee.service';
import { RupiahPipe } from '../../../shared/pipes/rupiah.pipe';

@Component({
    selector: 'app-employee-detail',
    standalone: true,
    imports: [RupiahPipe],
    templateUrl: './employee-detail.component.html',
})
export class EmployeeDetailComponent {
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly employeeService = inject(EmployeeService);

    private readonly paramMap = toSignal(this.route.paramMap);

    readonly employee = computed(() => {
        const username = this.paramMap()?.get('username');
        if (!username) {
            return undefined;
        }
        return this.employeeService.getByUsername(username);
    });

    readonly initials = computed(() => {
        const emp = this.employee();
        if (!emp) {
            return '';
        }
        return `${emp.firstName.charAt(0)}${emp.lastName.charAt(0)}`.toUpperCase();
    });

    readonly age = computed(() => {
        const emp = this.employee();
        if (!emp) {
            return null;
        }
        const birth = new Date(emp.birthDate);
        const today = new Date();
        let years = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            years--;
        }
        return Math.max(0, years);
    });

    formatDateTime(value: Date | string): string {
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) {
            return '-';
        }
        return new Intl.DateTimeFormat('id-ID', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(date);
    }

    getStatusBadgeClass(status: EmployeeStatus): string {
        switch (status) {
            case 'Active':
                return 'bg-emerald-50 text-emerald-700 ring-emerald-600/20';
            case 'Probation':
                return 'bg-sky-50 text-sky-700 ring-sky-600/20';
            case 'Contract':
                return 'bg-amber-50 text-amber-700 ring-amber-600/20';
            case 'Inactive':
                return 'bg-slate-100 text-slate-600 ring-slate-500/20';
        }
    }

    // Kembali ke Employee List tanpa mereset filterState di EmployeeService
    onOk(): void {
        this.router.navigate(['/employees']);
    }
}