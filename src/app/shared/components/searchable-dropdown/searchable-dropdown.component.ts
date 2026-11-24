import {
    Component,
    ElementRef,
    computed,
    forwardRef,
    inject,
    input,
    signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
    selector: 'app-searchable-dropdown',
    standalone: true,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SearchableDropdownComponent),
            multi: true,
        },
    ],
    host: {
        '(document:click)': 'onDocumentClick($event)',
        '(document:keydown.escape)': 'closeDropdown()',
    },
    template: `
    <div class="relative">
      <!-- Trigger Button -->
      <button
        type="button"
        [disabled]="isDisabled()"
        (click)="toggleDropdown()"
        class="flex w-full items-center justify-between gap-2 rounded-xl border py-2.5 pl-3.5 pr-4 text-left text-sm outline-none transition focus:ring-2"
        [class]="
          hasError()
            ? 'border-rose-400 bg-rose-50/30 text-slate-900 focus:border-rose-500 focus:ring-rose-200'
            : 'border-slate-300 bg-white text-slate-900 focus:border-indigo-500 focus:ring-indigo-200'
        "
      >
        <span [class]="selectedValue() ? 'text-slate-900' : 'text-slate-400'">
          {{ selectedValue() || placeholder() }}
        </span>
        <svg
          class="h-4 w-4 text-slate-400 transition-transform duration-150"
          [class.rotate-180]="isOpen()"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <!-- Dropdown Panel -->
      @if (isOpen()) {
        <div
          class="absolute z-40 mt-1.5 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg ring-1 ring-black/5"
        >
          <!-- Search Textbox di Atas Daftar Opsi -->
          <div class="border-b border-slate-100 bg-slate-50/70 p-2">
            <input
              type="text"
              [value]="searchText()"
              (input)="onSearchInput($event)"
              placeholder="Cari group..."
              class="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              autofocus
            />
          </div>

          <!-- Daftar Opsi -->
          <ul class="max-h-56 overflow-y-auto py-1 text-sm">
            @for (option of filteredOptions(); track option) {
              <li>
                <button
                  type="button"
                  (click)="selectOption(option)"
                  class="flex w-full items-center justify-between px-3.5 py-2 text-left transition hover:bg-indigo-50 hover:text-indigo-700"
                  [class]="
                    selectedValue() === option
                      ? 'bg-indigo-50/80 font-semibold text-indigo-700'
                      : 'text-slate-700'
                  "
                >
                  <span>{{ option }}</span>
                  @if (selectedValue() === option) {
                    <span class="text-xs font-bold text-indigo-600">✓</span>
                  }
                </button>
              </li>
            } @empty {
              <li class="px-3.5 py-3 text-center text-xs text-slate-500">
                Group "{{ searchText() }}" tidak ditemukan.
              </li>
            }
          </ul>
        </div>
      }
    </div>
  `,
})
export class SearchableDropdownComponent implements ControlValueAccessor {
    private readonly elementRef = inject(ElementRef<HTMLElement>);

    readonly options = input<readonly string[]>([]);
    readonly placeholder = input<string>('Pilih group...');
    readonly hasError = input<boolean>(false);

    readonly isOpen = signal(false);
    readonly searchText = signal('');
    readonly selectedValue = signal('');
    readonly isDisabled = signal(false);

    readonly filteredOptions = computed(() => {
        const query = this.searchText().trim().toLowerCase();
        if (!query) {
            return this.options();
        }
        return this.options().filter((opt) => opt.toLowerCase().includes(query));
    });

    private onChange: (value: string) => void = () => { };
    private onTouched: () => void = () => { };

    writeValue(value: string | null): void {
        this.selectedValue.set(value ?? '');
    }

    registerOnChange(fn: (value: string) => void): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.isDisabled.set(isDisabled);
    }

    toggleDropdown(): void {
        if (this.isDisabled()) {
            return;
        }
        const nextOpen = !this.isOpen();
        this.isOpen.set(nextOpen);
        if (!nextOpen) {
            this.onTouched();
        } else {
            this.searchText.set('');
        }
    }

    closeDropdown(): void {
        if (this.isOpen()) {
            this.isOpen.set(false);
            this.onTouched();
        }
    }

    onSearchInput(event: Event): void {
        const value = (event.target as HTMLInputElement).value;
        this.searchText.set(value);
    }

    selectOption(option: string): void {
        this.selectedValue.set(option);
        this.onChange(option);
        this.onTouched();
        this.searchText.set('');
        this.isOpen.set(false);
    }

    onDocumentClick(event: MouseEvent): void {
        if (!this.elementRef.nativeElement.contains(event.target as Node)) {
            this.closeDropdown();
        }
    }
}