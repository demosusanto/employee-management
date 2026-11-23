import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
    Employee,
    EMPLOYEE_GROUPS,
    EMPLOYEE_STATUSES,
    EmployeeStatus,
    SortableColumn,
} from '../../../core/models/employee.model';
import { EmployeeService } from '../../../core/services/employee.service';
import { ToastService } from '../../../core/services/toast.service';
import { RupiahPipe } from '../../../shared/pipes/rupiah.pipe';

@Component({
    selector: 'app-employee-list',
    standalone: true,
    imports: [RouterLink, RupiahPipe],
    templateUrl: './employee-list.component.html',
})
export class EmployeeListComponent {
    private readonly employeeService = inject(EmployeeService);
    private readonly toastService = inject(ToastService);
    private readonly router = inject(Router);

    readonly groups = EMPLOYEE_GROUPS;
    readonly statuses = EMPLOYEE_STATUSES;
    readonly pageSizeOptions = [5, 10, 20, 50];

    readonly filterState = this.employeeService.filterState;
    readonly totalAllEmployees = computed(() => this.employeeService.employees().length);

    // 1. Filtering menggunakan aturan AND (Keyword AND Group AND Status)
    readonly filteredEmployees = computed(() => {
        const employees = this.employeeService.employees();
        const { searchQuery, selectedGroup, selectedStatus } = this.filterState();
        const normalizedQuery = searchQuery.trim().toLowerCase();

        return employees.filter((emp) => {
            const fullName = `${emp.firstName} ${emp.lastName}`.toLowerCase();

            const matchesKeyword =
                !normalizedQuery ||
                emp.username.toLowerCase().includes(normalizedQuery) ||
                fullName.includes(normalizedQuery) ||
                emp.email.toLowerCase().includes(normalizedQuery);

            const matchesGroup = !selectedGroup || emp.group === selectedGroup;
            const matchesStatus = !selectedStatus || emp.status === selectedStatus;

            return matchesKeyword && matchesGroup && matchesStatus;
        });
    });

    // 2. Sorting dari hasil filter
    readonly sortedEmployees = computed(() => {
        const list = [...this.filteredEmployees()];
        const { sortColumn, sortDirection } = this.filterState();

        if (!sortColumn) {
            return list;
        }

        const modifier = sortDirection === 'asc' ? 1 : -1;

        return list.sort((a, b) => {
            if (sortColumn === 'basicSalary') {
                return (a.basicSalary - b.basicSalary) * modifier;
            }

            if (sortColumn === 'firstName') {
                const nameA = `${a.firstName} ${a.lastName}`;
                const nameB = `${b.firstName} ${b.lastName}`;
                return nameA.localeCompare(nameB) * modifier;
            }

            return String(a[sortColumn]).localeCompare(String(b[sortColumn])) * modifier;
        });
    });

    // 3. Pagination
    readonly totalFiltered = computed(() => this.sortedEmployees().length);

    readonly totalPages = computed(() =>
        Math.max(1, Math.ceil(this.totalFiltered() / this.filterState().pageSize))
    );

    readonly safeCurrentPage = computed(() =>
        Math.min(this.filterState().currentPage, this.totalPages())
    );

    readonly paginatedEmployees = computed(() => {
        const page = this.safeCurrentPage();
        const size = this.filterState().pageSize;
        const start = (page - 1) * size;
        return this.sortedEmployees().slice(start, start + size);
    });

    readonly displayRange = computed(() => {
        const total = this.totalFiltered();
        if (total === 0) {
            return { start: 0, end: 0 };
        }
        const page = this.safeCurrentPage();
        const size = this.filterState().pageSize;
        const start = (page - 1) * size + 1;
        const end = Math.min(page * size, total);
        return { start, end };
    });

    // Daftar tombol nomor halaman yang ringkas (dengan elipsis '...')
    readonly visiblePages = computed<(number | '...')[]>(() => {
        const total = this.totalPages();
        const current = this.safeCurrentPage();

        if (total <= 7) {
            return Array.from({ length: total }, (_, idx) => idx + 1);
        }

        const pages: (number | '...')[] = [1];

        if (current > 3) {
            pages.push('...');
        }

        const start = Math.max(2, current - 1);
        const end = Math.min(total - 1, current + 1);

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        if (current < total - 2) {
            pages.push('...');
        }

        pages.push(total);
        return pages;
    });

    readonly hasActiveFilter = computed(() => {
        const state = this.filterState();
        return Boolean(
            state.searchQuery.trim() || state.selectedGroup || state.selectedStatus
        );
    });

    readonly employeeToDelete = signal<Employee | null>(null);

    // Event Handlers Filter & Sort
    onSearchChange(event: Event): void {
        const value = (event.target as HTMLInputElement).value;
        this.employeeService.updateFilter({ searchQuery: value, currentPage: 1 });
    }

    onGroupChange(event: Event): void {
        const value = (event.target as HTMLSelectElement).value;
        this.employeeService.updateFilter({ selectedGroup: value, currentPage: 1 });
    }

    onStatusChange(event: Event): void {
        const value = (event.target as HTMLSelectElement).value;
        this.employeeService.updateFilter({ selectedStatus: value, currentPage: 1 });
    }

    onPageSizeChange(event: Event): void {
        const size = Number((event.target as HTMLSelectElement).value);
        this.employeeService.updateFilter({ pageSize: size, currentPage: 1 });
    }

    onResetFilters(): void {
        this.employeeService.resetFilter();
    }

    onSort(column: SortableColumn): void {
        const current = this.filterState();

        if (current.sortColumn === column) {
            const nextDirection = current.sortDirection === 'asc' ? 'desc' : 'asc';
            this.employeeService.updateFilter({ sortDirection: nextDirection, currentPage: 1 });
        } else {
            this.employeeService.updateFilter({
                sortColumn: column,
                sortDirection: 'asc',
                currentPage: 1,
            });
        }
    }

    goToPage(page: number): void {
        if (page < 1 || page > this.totalPages()) {
            return;
        }
        this.employeeService.updateFilter({ currentPage: page });
    }

    // Navigasi ke Halaman Detail
    onViewDetail(employee: Employee): void {
        this.router.navigate(['/employees/detail', employee.username]);
    }

    // Navigasi ke Halaman Edit
    onEditEmployee(employee: Employee, event: Event): void {
        event.stopPropagation();
        this.router.navigate(['/employees/edit', employee.username]);
    }

    // Buka Modal Konfirmasi Delete
    onDeleteEmployee(employee: Employee, event: Event): void {
        event.stopPropagation();
        this.employeeToDelete.set(employee);
    }

    cancelDelete(): void {
        this.employeeToDelete.set(null);
    }

    confirmDelete(): void {
        const target = this.employeeToDelete();
        if (!target) {
            return;
        }

        this.employeeService.deleteEmployee(target.username);
        this.toastService.show(
            'Employee Deleted',
            `Data karyawan ${target.firstName} ${target.lastName} (@${target.username}) telah dihapus.`,
            'delete'
        );
        this.employeeToDelete.set(null);
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
}