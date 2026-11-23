import { Injectable, signal } from '@angular/core';

interface AuthUser {
    username: string;
    displayName: string;
    role: string;
}

const STORAGE_KEY = 'emp_app_session';

// Kredensial hardcoded untuk keperluan demo & assessment
const HARDCODED_CREDENTIALS = {
    username: 'admin',
    password: 'password123',
    displayName: 'Administrator',
    role: 'HR Backoffice',
};

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private readonly currentUserSignal = signal<AuthUser | null>(this.loadSession());

    readonly currentUser = this.currentUserSignal.asReadonly();

    isAuthenticated(): boolean {
        return this.currentUserSignal() !== null;
    }

    login(username: string, password: string): boolean {
        const isValid =
            username.trim() === HARDCODED_CREDENTIALS.username &&
            password === HARDCODED_CREDENTIALS.password;

        if (!isValid) {
            return false;
        }

        const user: AuthUser = {
            username: HARDCODED_CREDENTIALS.username,
            displayName: HARDCODED_CREDENTIALS.displayName,
            role: HARDCODED_CREDENTIALS.role,
        };

        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
        this.currentUserSignal.set(user);
        return true;
    }

    logout(): void {
        localStorage.removeItem(STORAGE_KEY);
        this.currentUserSignal.set(null);
    }

    private loadSession(): AuthUser | null {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            return raw ? (JSON.parse(raw) as AuthUser) : null;
        } catch {
            return null;
        }
    }
}