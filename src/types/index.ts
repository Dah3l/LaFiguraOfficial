import { z } from 'zod';

// ============ Database Types ============

export interface BusinessInfo {
  id: string;
  name: string;
  address: string;
  phone: string;
  whatsapp: string;
  email: string;
  description: string;
  schedule: string;
  logo_url: string | null;
  instagram: string;
  facebook: string;
  updated_at: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // minutes
  category: 'peluqueria' | 'barberia' | 'estetica';
  image_url: string | null;
  active: boolean;
  created_at: string;
}

export interface Appointment {
  id: string;
  client_name: string;
  client_phone: string;
  service_id: string;
  service?: Service;
  date: string;
  time: string;
  notes: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  created_at: string;
}

export interface Schedule {
  id: string;
  day_of_week: number; // 0=Sunday, 6=Saturday
  open_time: string;
  close_time: string;
  is_active: boolean;
}

export interface BlockedSlot {
  id: string;
  date: string;
  time: string;
  reason: string;
}

// ============ Form Schemas ============

export const bookingSchema = z.object({
  client_name: z.string().min(2, 'Nombre requerido (mín. 2 caracteres)').max(100),
  client_phone: z.string().min(8, 'Teléfono requerido').max(20),
  service_id: z.string().min(1, 'Selecciona un servicio'),
  date: z.string().min(1, 'Selecciona una fecha'),
  time: z.string().min(1, 'Selecciona una hora'),
  notes: z.string().max(500).default(''),
});

export type BookingFormData = z.infer<typeof bookingSchema>;

export const serviceSchema = z.object({
  name: z.string().min(2, 'Nombre requerido').max(100),
  description: z.string().min(5, 'Descripción requerida').max(500),
  price: z.number().min(0, 'Precio inválido'),
  duration: z.number().min(5, 'Mínimo 5 minutos').max(240),
  category: z.enum(['peluqueria', 'barberia', 'estetica']),
  active: z.boolean().default(true),
});

export type ServiceFormData = z.infer<typeof serviceSchema>;

export const businessInfoSchema = z.object({
  name: z.string().min(1),
  address: z.string().min(1),
  phone: z.string().min(1),
  whatsapp: z.string().min(1),
  email: z.string().email().optional().or(z.literal('')),
  description: z.string(),
  schedule: z.string(),
  instagram: z.string().optional(),
  facebook: z.string().optional(),
});

// ============ UI Types ============

export type Theme = 'light' | 'dark';
export type Page = 'home' | 'services' | 'booking' | 'admin' | 'contact';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}
