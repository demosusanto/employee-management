import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [ReactiveFormsModule],
    templateUrl: 'login.component.html',
})
export class LoginComponent {
    private readonly fb = inject(FormBuilder);
    private readonly authService = inject(AuthService);
    private readonly toastService = inject(ToastService);
    private readonly router = inject(Router);

    readonly showPassword = signal(false);
    readonly errorMessage = signal('');

    readonly loginForm = this.fb.nonNullable.group({
        username: ['', [Validators.required]],
        password: ['', [Validators.required, Validators.minLength(6)]],
    });

    togglePasswordVisibility(): void {
        this.showPassword.update((visible) => !visible);
    }

    fillDemoCredentials(): void {
        this.loginForm.setValue({
            username: 'admin',
            password: 'password123',
        });
        this.errorMessage.set('');
    }

    onSubmit(): void {
        this.errorMessage.set('');

        if (this.loginForm.invalid) {
            this.loginForm.markAllAsTouched();
            return;
        }

        const { username, password } = this.loginForm.getRawValue();
        const isSuccess = this.authService.login(username, password);

        if (!isSuccess) {
            this.errorMessage.set('Username atau password tidak sesuai. Silakan coba lagi.');
            return;
        }

        this.toastService.show('Login Berhasil', `Selamat datang kembali, ${username}!`, 'success');
        this.router.navigate(['/employees']);
    }
}