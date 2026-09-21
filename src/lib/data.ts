import type { Service, BusinessInfo, Appointment, Schedule } from '../types';

// ============ Mock Data (Demo Mode) ============

export const defaultBusinessInfo: BusinessInfo = {
  id: '1',
  name: 'La Figura',
  address: 'Alamar, La Habana, Cuba',
  phone: '+53 5000 0000',
  whatsapp: '5350000000',
  email: 'lafigura@email.com',
  description: 'Tu espacio de belleza y estilo. Peluquería, barbería y estética profesional con los mejores productos y las últimas tendencias.',
  schedule: 'Lunes a Sábado: 9:00 AM - 7:00 PM',
  logo_url: null,
  instagram: '@lafigura.alamar',
  facebook: 'La Figura Alamar',
  updated_at: new Date().toISOString(),
};

export const defaultServices: Service[] = [
  {
    id: '1',
    name: 'Corte Clásico',
    description: 'Corte de cabello tradicional con tijera y máquina. Incluye lavado y peinado final.',
    price: 300,
    duration: 30,
    category: 'barberia',
    image_url: null,
    active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Corte + Diseño',
    description: 'Corte personalizado con diseño artístico. Incluye consulta de estilo.',
    price: 500,
    duration: 45,
    category: 'barberia',
    image_url: null,
    active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Barba Completa',
    description: 'Perfilado, afeitado con navaja y aplicación de aceites esenciales.',
    price: 200,
    duration: 25,
    category: 'barberia',
    image_url: null,
    active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Tinte Global',
    description: 'Coloración completa del cabello con productos de alta calidad. Incluye diagnóstico capilar.',
    price: 800,
    duration: 90,
    category: 'peluqueria',
    image_url: null,
    active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'Peinado Especial',
    description: 'Peinado para eventos especiales: bodas, quinceañeras, graduaciones.',
    price: 600,
    duration: 60,
    category: 'peluqueria',
    image_url: null,
    active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '6',
    name: 'Tratamiento Capilar',
    description: 'Hidratación profunda, reconstrucción y nutrición del cabello.',
    price: 450,
    duration: 45,
    category: 'peluqueria',
    image_url: null,
    active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '7',
    name: 'Limpieza Facial',
    description: 'Limpieza profunda con extracción, tónico y mascarilla hidratante.',
    price: 500,
    duration: 50,
    category: 'estetica',
    image_url: null,
    active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '8',
    name: 'Manicure + Pedicure',
    description: 'Cuidado completo de manos y pies. Incluye esmaltado.',
    price: 400,
    duration: 60,
    category: 'estetica',
    image_url: null,
    active: true,
    created_at: new Date().toISOString(),
  },
];

export const defaultSchedule: Schedule[] = [
  { id: '1', day_of_week: 0, open_time: '00:00', close_time: '00:00', is_active: false }, // Domingo
  { id: '2', day_of_week: 1, open_time: '09:00', close_time: '19:00', is_active: true }, // Lunes
  { id: '3', day_of_week: 2, open_time: '09:00', close_time: '19:00', is_active: true },
  { id: '4', day_of_week: 3, open_time: '09:00', close_time: '19:00', is_active: true },
  { id: '5', day_of_week: 4, open_time: '09:00', close_time: '19:00', is_active: true },
  { id: '6', day_of_week: 5, open_time: '09:00', close_time: '19:00', is_active: true },
  { id: '7', day_of_week: 6, open_time: '09:00', close_time: '14:00', is_active: true }, // Sábado
];

export const defaultAppointments: Appointment[] = [
  {
    id: '1',
    client_name: 'María García',
    client_phone: '5351234567',
    service_id: '4',
    date: '2026-01-20',
    time: '10:00',
    notes: 'Prefiero tonos cálidos',
    status: 'confirmed',
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    client_name: 'Carlos Rodríguez',
    client_phone: '5359876543',
    service_id: '2',
    date: '2026-01-20',
    time: '14:00',
    notes: '',
    status: 'pending',
    created_at: new Date().toISOString(),
  },
];

// ============ Local Storage Helpers ============

const STORAGE_KEYS = {
  services: 'lafigura_services',
  appointments: 'lafigura_appointments',
  businessInfo: 'lafigura_business_info',
  schedule: 'lafigura_schedule',
  theme: 'lafigura_theme',
};

export function getFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch {
    return defaultValue;
  }
}

export function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Error saving to localStorage:', e);
  }
}

export { STORAGE_KEYS };
