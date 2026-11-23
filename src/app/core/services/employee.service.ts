import { Injectable, signal } from '@angular/core';
import { generateDummyEmployees } from '../data/employee.dummy';
import { Employee, EmployeeFilterState } from '../models/employee.model';

const INITIAL_FILTER_STATE: EmployeeFilterState = {
    searchQuery: '',
    selectedGroup: '',
    selectedStatus: '',
    sortColumn: '',
    sortDirection: 'asc',
    pageSize: 10,
    currentPage: 1,
};

@Injectable({
    providedIn: 'root',
})
export class EmployeeService {
    private readonly employeesSignal = signal<Employee[]>(generateDummyEmployees(120));
    private readonly filterStateSignal = signal<EmployeeFilterState>({
        ...INITIAL_FILTER_STATE,
    });

    readonly employees = this.employeesSignal.asReadonly();
    readonly filterState = this.filterStateSignal.asReadonly();

    getByUsername(username: string): Employee | undefined {
        return this.employeesSignal().find(
            (emp) => emp.username.toLowerCase() === username.toLowerCase()
        );
    }

    isUsernameTaken(username: string, excludeUsername?: string | null): boolean {
        const normalized = username.toLowerCase();
        const excluded = excludeUsername?.toLowerCase();

        if (excluded && normalized === excluded) {
            return false;
        }

        return this.getByUsername(username) !== undefined;
    }

    addEmployee(employee: Employee): void {
        this.employeesSignal.update((current) => [employee, ...current]);
        this.updateFilter({ currentPage: 1 });
    }

    updateEmployee(originalUsername: string, updated: Employee): void {
        this.employeesSignal.update((current) =>
            current.map((emp) =>
                emp.username.toLowerCase() === originalUsername.toLowerCase() ? updated : emp
            )
        );
    }

    deleteEmployee(username: string): void {
        this.employeesSignal.update((current) =>
            current.filter((emp) => emp.username.toLowerCase() !== username.toLowerCase())
        );
    }

    updateFilter(partial: Partial<EmployeeFilterState>): void {
        this.filterStateSignal.update((current) => ({
            ...current,
            ...partial,
        }));
    }

    resetFilter(): void {
        this.filterStateSignal.set({ ...INITIAL_FILTER_STATE });
    }
}