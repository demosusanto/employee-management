import { Injectable, signal } from '@angular/core';
import { ToastMessage, ToastType } from '../models/employee.model';

@Injectable({
    providedIn: 'root',
})
export class ToastService {
    private nextId = 1;
    private readonly toastsSignal = signal<ToastMessage[]>([]);

    readonly toasts = this.toastsSignal.asReadonly();

    show(title: string, message: string, type: ToastType = 'success', durationMs = 3500): void {
        const id = this.nextId++;
        const toast: ToastMessage = { id, title, message, type };

        this.toastsSignal.update((current) => [...current, toast]);

        setTimeout(() => {
            this.dismiss(id);
        }, durationMs);
    }

    dismiss(id: number): void {
        this.toastsSignal.update((current) => current.filter((item) => item.id !== id));
    }
}