import {
    Employee,
    EMPLOYEE_GROUPS,
    EMPLOYEE_STATUSES,
} from '../models/employee.model';

const FIRST_NAMES = [
    'Adi', 'Budi', 'Citra', 'Dewi', 'Eko', 'Fajar', 'Gita', 'Hendra',
    'Intan', 'Joko', 'Kartika', 'Lukman', 'Maya', 'Nadia', 'Oki', 'Putri',
    'Rizky', 'Siti', 'Taufik', 'Utami', 'Vina', 'Wahyu', 'Yusuf', 'Zahra',
];

const LAST_NAMES = [
    'Pratama', 'Santoso', 'Wijaya', 'Kusuma', 'Saputra', 'Permata',
    'Nugroho', 'Hidayat', 'Rahmawati', 'Setiawan', 'Lestari', 'Maulana',
    'Wibowo', 'Handayani', 'Kurniawan', 'Suryani', 'Hartono', 'Puspita',
];

export function generateDummyEmployees(count = 120): Employee[] {
    const employees: Employee[] = [];

    for (let i = 0; i < count; i++) {
        const firstName = FIRST_NAMES[i % FIRST_NAMES.length];
        const lastName = LAST_NAMES[(i * 7 + Math.floor(i / FIRST_NAMES.length)) % LAST_NAMES.length];
        const seq = String(i + 1).padStart(3, '0');
        const username = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${seq}`;
        const email = `${username}@corpflow.co.id`;

        // Rentang tahun lahir: 1978 - 2001 (selalu di masa lalu)
        const birthYear = 1978 + (i % 24);
        const birthMonth = (i * 3) % 12;
        const birthDay = 1 + ((i * 5) % 28);
        const birthDate = new Date(birthYear, birthMonth, birthDay, 9, 0, 0);

        // Gaji pokok bervariasi antara Rp 5.500.000 s.d. Rp 28.750.000
        const basicSalary = 5_500_000 + ((i * 1_375_000) % 23_500_000) + ((i % 4) * 125_000);

        // Distribusi status realistis (mayoritas Active)
        const status =
            i % 10 === 0
                ? EMPLOYEE_STATUSES[3] // Inactive
                : i % 5 === 0
                    ? EMPLOYEE_STATUSES[2] // Contract
                    : i % 4 === 0
                        ? EMPLOYEE_STATUSES[1] // Probation
                        : EMPLOYEE_STATUSES[0]; // Active

        const group = EMPLOYEE_GROUPS[i % EMPLOYEE_GROUPS.length];

        // Field description bertipe datetime sesuai spesifikasi (mis. tanggal pencatatan/join)
        const descYear = 2021 + (i % 5);
        const descMonth = (i * 2) % 12;
        const descDay = 1 + ((i * 3) % 28);
        const description = new Date(descYear, descMonth, descDay, 8 + (i % 9), (i * 15) % 60);

        employees.push({
            username,
            firstName,
            lastName,
            email,
            birthDate,
            basicSalary,
            status,
            group,
            description,
        });
    }

    return employees;
}