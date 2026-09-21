import { z } from 'zod';

// ============ Database Types ============

export interface BusinessInfo {
  id: string;
  name: string;
  address: string;
  phone: string;
  whatsapp: string;
  description: string;
  schedule: string;
  logo_url: string | null;
  instagram: string;
  facebook: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  emoji: string;
  description: string;
  active: boolean;
  order: number;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // minutes
  category_id: string;
  image_url: string | null;
  active: boolean;
  order: number;
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

// ============ Form Schemas ============

export const categorySchema = z.object({
  name: z.string().min(2, 'Nombre requerido (mín. 2 caracteres)').max(50),
  slug: z.string().min(2, 'Slug requerido').max(30).regex(/^[a-z0-9-]+$/, 'Solo letras minúsculas, números y guiones'),
  emoji: z.string().min(1, 'Emoji requerido').max(4),
  description: z.string().max(200).default(''),
  active: z.boolean().default(true),
  order: z.number().min(0).default(0),
});

export type CategoryFormData = z.infer<typeof categorySchema>;

export const serviceSchema = z.object({
  name: z.string().min(2, 'Nombre requerido').max(100),
  description: z.string().min(5, 'Descripción requerida').max(500),
  price: z.number().min(0, 'Precio inválido'),
  duration: z.number().min(5, 'Mínimo 5 minutos').max(240),
  category_id: z.string().min(1, 'Selecciona una categoría'),
  active: z.boolean().default(true),
  order: z.number().min(0).default(0),
});

export type ServiceFormData = z.infer<typeof serviceSchema>;

export const businessInfoSchema = z.object({
  name: z.string().min(1),
  address: z.string().min(1),
  phone: z.string().min(1),
  whatsapp: z.string().min(1),
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
