import { Component, OnInit, inject, signal } from '@angular/core';
import {
    AbstractControl,
    FormBuilder,
    ReactiveFormsModule,
    ValidationErrors,
    ValidatorFn,
    Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
    Employee,
    EMPLOYEE_GROUPS,
    EMPLOYEE_STATUSES,
    EmployeeStatus,
} from '../../../core/models/employee.model';
import { EmployeeService } from '../../../core/services/employee.service';
import { ToastService } from '../../../core/services/toast.service';
import { SearchableDropdownComponent } from '../../../shared/components/searchable-dropdown/searchable-dropdown.component';
import { RupiahPipe } from '../../../shared/pipes/rupiah.pipe';

function formatDateTimeLocal(date: Date): string {
    const pad = (n: number) => String(n).padStart(2, '0');
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function noFutureDateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value;
        if (!value) {
            return null;
        }

        const selectedDate = new Date(value);
        if (Number.isNaN(selectedDate.getTime())) {
            return { invalidDate: true };
        }

        const now = new Date();
        return selectedDate.getTime() > now.getTime() ? { futureDate: true } : null;
    };
}

@Component({
    selector: 'app-add-employee',
    standalone: true,
    imports: [ReactiveFormsModule, RouterLink, SearchableDropdownComponent, RupiahPipe],
    templateUrl: './add-employee.component.html',
})
export class AddEmployeeComponent implements OnInit {
    private readonly fb = inject(FormBuilder);
    private readonly route = inject(ActivatedRoute);
    private readonly employeeService = inject(EmployeeService);
    private readonly toastService = inject(ToastService);
    private readonly router = inject(Router);

    readonly groups = EMPLOYEE_GROUPS;
    readonly statuses = EMPLOYEE_STATUSES;
    readonly maxBirthDateTime = formatDateTimeLocal(new Date());

    readonly isEditMode = signal(false);
    private originalUsername: string | null = null;

    readonly employeeForm = this.fb.nonNullable.group({
        username: [
            '',
            [
                Validators.required,
                Validators.pattern(/^[a-zA-Z0-9._-]+$/),
                this.uniqueUsernameValidator(),
            ],
        ],
        firstName: ['', [Validators.required]],
        lastName: ['', [Validators.required]],
        email: [
            '',
            [
                Validators.required,
                Validators.email,
                Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/),
            ],
        ],
        birthDate: ['', [Validators.required, noFutureDateValidator()]],
        basicSalary: [
            '',
            [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/), Validators.min(1)],
        ],
        status: ['' as EmployeeStatus | '', [Validators.required]],
        group: ['', [Validators.required]],
        description: ['', [Validators.required]],
    });

    ngOnInit(): void {
        const usernameParam = this.route.snapshot.paramMap.get('username');
        if (!usernameParam) {
            return;
        }

        const existing = this.employeeService.getByUsername(usernameParam);
        if (!existing) {
            this.toastService.show(
                'Data Tidak Ditemukan',
                `Karyawan @${usernameParam} tidak ditemukan.`,
                'error'
            );
            this.router.navigate(['/employees']);
            return;
        }

        this.isEditMode.set(true);
        this.originalUsername = existing.username;

        this.employeeForm.patchValue({
            username: existing.username,
            firstName: existing.firstName,
            lastName: existing.lastName,
            email: existing.email,
            birthDate: formatDateTimeLocal(new Date(existing.birthDate)),
            basicSalary: String(existing.basicSalary),
            status: existing.status,
            group: existing.group,
            description: formatDateTimeLocal(new Date(existing.description)),
        });
    }

    get salaryPreview(): number | null {
        const control = this.employeeForm.controls.basicSalary;
        if (!control.value || control.invalid) {
            return null;
        }
        const parsed = Number(control.value);
        return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
    }

    isFieldInvalid(controlName: keyof typeof this.employeeForm.controls): boolean {
        const control = this.employeeForm.controls[controlName];
        return control.invalid && (control.touched || control.dirty);
    }

    onSubmit(): void {
        if (this.employeeForm.invalid) {
            this.employeeForm.markAllAsTouched();
            this.toastService.show(
                'Form Belum Valid',
                'Mohon lengkapi seluruh field wajib dengan format yang benar.',
                'error'
            );
            return;
        }

        const raw = this.employeeForm.getRawValue();

        const payload: Employee = {
            username: raw.username.trim(),
            firstName: raw.firstName.trim(),
            lastName: raw.lastName.trim(),
            email: raw.email.trim().toLowerCase(),
            birthDate: new Date(raw.birthDate),
            basicSalary: Number(raw.basicSalary),
            status: raw.status as EmployeeStatus,
            group: raw.group,
            description: new Date(raw.description),
        };

        if (this.isEditMode() && this.originalUsername) {
            this.employeeService.updateEmployee(this.originalUsername, payload);
            this.toastService.show(
                'Employee Updated',
                `Data karyawan ${payload.firstName} ${payload.lastName} berhasil diperbarui.`,
                'edit'
            );
        } else {
            this.employeeService.addEmployee(payload);
            this.toastService.show(
                'Berhasil Disimpan',
                `Data karyawan ${payload.firstName} ${payload.lastName} telah ditambahkan.`,
                'success'
            );
        }

        this.router.navigate(['/employees']);
    }

    onCancel(): void {
        this.router.navigate(['/employees']);
    }

    private uniqueUsernameValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const value = String(control.value ?? '').trim();
            if (!value) {
                return null;
            }
            return this.employeeService.isUsernameTaken(value, this.originalUsername)
                ? { usernameTaken: true }
                : null;
        };
    }
}