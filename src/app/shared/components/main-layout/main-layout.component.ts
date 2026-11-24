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
            class="inline-flex items-center justify-center rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 active:scale-95 md:hidden"
            [attr.aria-label]="mobileMenuOpen() ? 'Tutup menu navigasi' : 'Buka menu navigasi'"
            [attr.aria-expanded]="mobileMenuOpen()"
          >
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              @if (mobileMenuOpen() && !menuClosing()) {
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              } @else {
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>

        @if (mobileMenuOpen()) {
          <!-- Backdrop: meredupkan konten agar menu terlihat jelas -->
          <div
            (click)="closeMobileMenu()"
            class="menu-backdrop absolute inset-x-0 top-full h-screen bg-slate-900/40 backdrop-blur-[2px] md:hidden"
            [class.is-closing]="menuClosing()"
            aria-hidden="true"
          ></div>

          <div
            class="menu-panel absolute inset-x-0 top-full border-b border-indigo-100 bg-gradient-to-b from-indigo-50 to-white px-4 pb-4 pt-3 shadow-xl shadow-indigo-900/15 md:hidden"
            [class.is-closing]="menuClosing()"
          >
            <nav class="flex flex-col gap-2">
              <a
                routerLink="/employees"
                (click)="closeMobileMenu()"
                routerLinkActive="!border-indigo-600 !bg-indigo-600 !text-white shadow-md shadow-indigo-600/30"
                [routerLinkActiveOptions]="{ exact: true }"
                style="--i: 0"
                class="menu-item rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition active:scale-[0.98]"
              >
                Employee List
              </a>
              <a
                routerLink="/employees/add"
                (click)="closeMobileMenu()"
                routerLinkActive="!border-indigo-600 !bg-indigo-600 !text-white shadow-md shadow-indigo-600/30"
                style="--i: 1"
                class="menu-item rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition active:scale-[0.98]"
              >
                Add Employee
              </a>
            </nav>
            <div
              class="menu-item mt-3 flex items-center justify-between rounded-xl border border-indigo-100 bg-white/80 px-4 py-3"
              style="--i: 2"
            >
              @if (authService.currentUser(); as user) {
                <div class="text-xs">
                  <p class="font-semibold text-slate-800">{{ user.displayName }}</p>
                  <p class="text-slate-500">{{ user.role }}</p>
                </div>
              }
              <button
                type="button"
                (click)="onLogout()"
                class="rounded-lg bg-red-50 px-3.5 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100 active:scale-95"
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
    styles: [
        `
      .menu-panel {
        transform-origin: top;
        animation: menuFadeDown 220ms cubic-bezier(0.16, 1, 0.3, 1) both;
      }
      .menu-panel.is-closing {
        animation: menuFadeUp 180ms ease-in both;
      }
      .menu-backdrop {
        animation: menuFade 220ms ease-out both;
      }
      .menu-backdrop.is-closing {
        animation: menuFadeOut 180ms ease-in both;
      }
      .menu-item {
        animation: menuItemIn 320ms cubic-bezier(0.16, 1, 0.3, 1) both;
        animation-delay: calc(var(--i, 0) * 60ms + 60ms);
      }
      @keyframes menuFadeDown {
        from { opacity: 0; transform: translateY(-12px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes menuFadeUp {
        from { opacity: 1; transform: translateY(0); }
        to { opacity: 0; transform: translateY(-12px); }
      }
      @keyframes menuFade {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes menuFadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
      }
      @keyframes menuItemIn {
        from { opacity: 0; transform: translateY(-8px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @media (prefers-reduced-motion: reduce) {
        .menu-panel, .menu-backdrop, .menu-item { animation-duration: 1ms; animation-delay: 0ms; }
      }
    `,
    ],
})
export class MainLayoutComponent {
    readonly authService = inject(AuthService);
    private readonly toastService = inject(ToastService);
    private readonly router = inject(Router);

    readonly mobileMenuOpen = signal(false);
    readonly menuClosing = signal(false);
    private closeTimer: ReturnType<typeof setTimeout> | null = null;

    toggleMobileMenu(): void {
        if (this.mobileMenuOpen()) {
            this.closeMobileMenu();
        } else {
            this.mobileMenuOpen.set(true);
        }
    }

    closeMobileMenu(): void {
        if (!this.mobileMenuOpen() || this.menuClosing()) return;
        this.menuClosing.set(true);
        this.closeTimer = setTimeout(() => {
            this.mobileMenuOpen.set(false);
            this.menuClosing.set(false);
            this.closeTimer = null;
        }, 180);
    }

    onLogout(): void {
        if (this.closeTimer) clearTimeout(this.closeTimer);
        this.closeTimer = null;
        this.menuClosing.set(false);
        this.mobileMenuOpen.set(false);
        this.authService.logout();
        this.toastService.show('Logged Out', 'Anda telah keluar dari sistem.', 'success');
        this.router.navigate(['/login']);
    }
}
