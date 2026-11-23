export interface Employee {
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    birthDate: Date;
    basicSalary: number;
    status: EmployeeStatus;
    group: string;
    description: Date;
}

export type EmployeeStatus = 'Active' | 'Probation' | 'Contract' | 'Inactive';

export type SortDirection = 'asc' | 'desc';

export type SortableColumn =
    | 'username'
    | 'firstName'
    | 'email'
    | 'group'
    | 'basicSalary'
    | 'status';

export interface EmployeeFilterState {
    searchQuery: string;   // Parameter 1: nama / username / email
    selectedGroup: string; // Parameter 2: group (digabung dengan rule AND)
    selectedStatus: string; // Parameter 3 (opsional): status (rule AND)
    sortColumn: SortableColumn | '';
    sortDirection: SortDirection;
    pageSize: number;
    currentPage: number;
}

export type ToastType = 'edit' | 'delete' | 'success' | 'error';

export interface ToastMessage {
    id: number;
    title: string;
    message: string;
    type: ToastType;
}

export const EMPLOYEE_GROUPS: readonly string[] = [
    'Engineering',
    'Product Management',
    'Human Resources',
    'Finance & Accounting',
    'Risk & Compliance',
    'Operations',
    'IT Security',
    'Data & Analytics',
    'Marketing & Growth',
    'Customer Experience',
];

export const EMPLOYEE_STATUSES: readonly EmployeeStatus[] = [
    'Active',
    'Probation',
    'Contract',
    'Inactive',
];