import type { Service, BusinessInfo, Appointment, Category } from '../types';

// ============ Mock Data (Demo Mode) ============

export const defaultCategories: Category[] = [
  { id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', name: 'Barbería', slug: 'barberia', emoji: '💈', description: 'Cortes, barba y estilos masculinos', active: true, order: 0 },
  { id: 'b2c3d4e5-f6a7-8901-bcde-f12345678901', name: 'Peluquería', slug: 'peluqueria', emoji: '💇', description: 'Cortes, tintes y tratamientos capilares', active: true, order: 1 },
  { id: 'c3d4e5f6-a7b8-9012-cdef-123456789012', name: 'Estética', slug: 'estetica', emoji: '✨', description: 'Facial, manicure y cuidado personal', active: true, order: 2 },
];

export const defaultBusinessInfo: BusinessInfo = {
  id: '1',
  name: 'La Figura',
  address: 'Alamar, La Habana, Cuba',
  phone: '+53 5000 0000',
  whatsapp: '5350000000',
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
    category_id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
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
    category_id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
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
    category_id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
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
    category_id: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
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
    category_id: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
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
    category_id: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
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
    category_id: 'c3d4e5f6-a7b8-9012-cdef-123456789012',
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
    category_id: 'c3d4e5f6-a7b8-9012-cdef-123456789012',
    image_url: null,
    active: true,
    created_at: new Date().toISOString(),
  },
];

export const defaultAppointments: Appointment[] = [];

// ============ Local Storage Helpers ============

const STORAGE_KEYS = {
  services: 'lafigura_services',
  categories: 'lafigura_categories',
  appointments: 'lafigura_appointments',
  businessInfo: 'lafigura_business_info',
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
