import { Component, inject } from '@angular/core';
import { ToastType } from '../../../core/models/employee.model';
import { ToastService } from '../../../core/services/toast.service';

@Component({
    selector: 'app-toast-container',
    standalone: true,
    template: `
    <div
      class="fixed top-4 right-4 z-50 flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3 sm:w-full"
      aria-live="polite"
    >
      @for (toast of toastService.toasts(); track toast.id) {
        <div
          class="flex items-start gap-3 rounded-xl border-l-4 p-4 shadow-lg ring-1 ring-black/5 transition-all"
          [class]="getToastClasses(toast.type)"
          role="alert"
        >
          <div class="mt-0.5 shrink-0">
            @switch (toast.type) {
              @case ('edit') {
                <span class="flex h-6 w-6 items-center justify-center rounded-full bg-amber-400/30 text-amber-800 text-xs font-bold">
                  !
                </span>
              }
              @case ('delete') {
                <span class="flex h-6 w-6 items-center justify-center rounded-full bg-red-500/20 text-red-800 text-xs font-bold">
                  ✕
                </span>
              }
              @case ('success') {
                <span class="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-800 text-xs font-bold">
                  ✓
                </span>
              }
              @default {
                <span class="flex h-6 w-6 items-center justify-center rounded-full bg-rose-500/20 text-rose-800 text-xs font-bold">
                  !
                </span>
              }
            }
          </div>

          <div class="min-w-0 flex-1">
            <p class="text-sm font-semibold">{{ toast.title }}</p>
            <p class="mt-0.5 text-xs opacity-90">{{ toast.message }}</p>
          </div>

          <button
            type="button"
            (click)="toastService.dismiss(toast.id)"
            class="shrink-0 rounded-md p-1 opacity-60 transition hover:opacity-100"
            aria-label="Tutup notifikasi"
          >
            ✕
          </button>
        </div>
      }
    </div>
  `,
})
export class ToastContainerComponent {
    readonly toastService = inject(ToastService);

    getToastClasses(type: ToastType): string {
        switch (type) {
            case 'edit':
                return 'bg-amber-50 border-amber-400 text-amber-900';
            case 'delete':
                return 'bg-red-50 border-red-600 text-red-900';
            case 'success':
                return 'bg-emerald-50 border-emerald-500 text-emerald-900';
            case 'error':
                return 'bg-rose-50 border-rose-500 text-rose-900';
        }
    }
}