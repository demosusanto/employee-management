import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
    selector: 'app-main-layout',
    standalone: true,
    imports: [RouterOutlet, RouterLink, RouterLinkActive],
    template: `
    <div class="min-h-screen bg-slate-50 text-slate-800">
      <header class="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div class="flex items-center gap-8">
            <a routerLink="/employees" class="flex items-center gap-2.5">
              <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 font-bold text-white shadow-sm">
                CF
              </div>
              <div class="leading-tight">
                <span class="block text-sm font-bold tracking-tight text-slate-900">CorpFlow</span>
                <span class="block text-[11px] text-slate-500">Employee Backoffice</span>
              </div>
            </a>

            <nav class="hidden items-center gap-1 md:flex">
              <a
                routerLink="/employees"
                routerLinkActive="bg-indigo-50 text-indigo-700"
                [routerLinkActiveOptions]="{ exact: true }"
                class="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
              >
                Employee List
              </a>
              <a
                routerLink="/employees/add"
                routerLinkActive="bg-indigo-50 text-indigo-700"
                class="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
              >
                Add Employee
              </a>
            </nav>
          </div>

          <div class="hidden items-center gap-4 md:flex">
            @if (authService.currentUser(); as user) {
              <div class="text-right leading-tight">
                <p class="text-sm font-semibold text-slate-800">{{ user.displayName }}</p>
                <p class="text-xs text-slate-500">{{ user.role }}</p>
              </div>
            }
            <button
              type="button"
              (click)="onLogout()"
              class="rounded-lg border border-slate-200 px-3.5 py-2 text-sm font-medium text-slate-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700"
            >
              Logout
            </button>
          </div>

          <button
            type="button"
            (click)="toggleMobileMenu()"
            class="inline-flex items-center justify-center rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden"
            aria-label="Buka menu navigasi"
          >
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              @if (mobileMenuOpen()) {
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              } @else {
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>

        @if (mobileMenuOpen()) {
          <div class="border-t border-slate-200 bg-white px-4 py-3 md:hidden">
            <nav class="flex flex-col gap-1">
              <a
                routerLink="/employees"
                (click)="closeMobileMenu()"
                routerLinkActive="bg-indigo-50 text-indigo-700"
                [routerLinkActiveOptions]="{ exact: true }"
                class="rounded-lg px-3 py-2 text-sm font-medium text-slate-700"
              >
                Employee List
              </a>
              <a
                routerLink="/employees/add"
                (click)="closeMobileMenu()"
                routerLinkActive="bg-indigo-50 text-indigo-700"
                class="rounded-lg px-3 py-2 text-sm font-medium text-slate-700"
              >
                Add Employee
              </a>
            </nav>
            <div class="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
              @if (authService.currentUser(); as user) {
                <div class="text-xs">
                  <p class="font-semibold text-slate-800">{{ user.displayName }}</p>
                  <p class="text-slate-500">{{ user.role }}</p>
                </div>
              }
              <button
                type="button"
                (click)="onLogout()"
                class="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        }
      </header>

      <main class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <router-outlet />
      </main>
    </div>
  `,
})
export class MainLayoutComponent {
    readonly authService = inject(AuthService);
    private readonly toastService = inject(ToastService);
    private readonly router = inject(Router);

    readonly mobileMenuOpen = signal(false);

    toggleMobileMenu(): void {
        this.mobileMenuOpen.update((open) => !open);
    }

    closeMobileMenu(): void {
        this.mobileMenuOpen.set(false);
    }

    onLogout(): void {
        this.closeMobileMenu();
        this.authService.logout();
        this.toastService.show('Logged Out', 'Anda telah keluar dari sistem.', 'success');
        this.router.navigate(['/login']);
    }
}