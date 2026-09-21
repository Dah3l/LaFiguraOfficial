import { supabase } from './supabase';
import type { BusinessInfo, Service, Category, Appointment } from '../types';

// ============ BUSINESS INFO ============

export async function getBusinessInfo(): Promise<BusinessInfo | null> {
  console.log('Fetching business info from Supabase...');
  
  const { data, error } = await supabase
    .from('business_info')
    .select('*')
    .single();
  
  if (error) {
    console.error('Error fetching business info:', error);
    return null;
  }
  
  console.log('Business info loaded:', data);
  return data;
}

export async function updateBusinessInfo(info: Partial<BusinessInfo>): Promise<boolean> {
  console.log('Updating business info:', info);
  
  const { data, error } = await supabase
    .from('business_info')
    .update({ ...info, updated_at: new Date().toISOString() })
    .eq('id', info.id)
    .select();
  
  if (error) {
    console.error('Error updating business info:', error);
    return false;
  }
  
  console.log('Business info updated:', data);
  return true;
}

// ============ CATEGORIES ============

export async function getCategories(): Promise<Category[]> {
  console.log('Fetching categories from Supabase...');
  
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('order', { ascending: true });
  
  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
  
  console.log('Categories loaded:', data);
  return data || [];
}

export async function createCategory(category: Omit<Category, 'id' | 'created_at' | 'updated_at'>): Promise<Category | null> {
  const { data, error } = await supabase
    .from('categories')
    .insert(category)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating category:', error);
    return null;
  }
  return data;
}

export async function updateCategory(category: Category): Promise<boolean> {
  console.log('Updating category:', category);
  
  const { data, error } = await supabase
    .from('categories')
    .update({ ...category, updated_at: new Date().toISOString() })
    .eq('id', category.id)
    .select();
  
  if (error) {
    console.error('Error updating category:', error);
    return false;
  }
  
  console.log('Category updated:', data);
  return true;
}

export async function deleteCategory(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting category:', error);
    return false;
  }
  return true;
}

// ============ SERVICES ============

export async function getServices(): Promise<Service[]> {
  console.log('Fetching services from Supabase...');
  
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching services:', error);
    return [];
  }
  
  console.log('Services loaded:', data);
  return data || [];
}

export async function createService(service: Omit<Service, 'id' | 'created_at' | 'updated_at'>): Promise<Service | null> {
  const { data, error } = await supabase
    .from('services')
    .insert(service)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating service:', error);
    return null;
  }
  return data;
}

export async function updateService(service: Service): Promise<boolean> {
  console.log('Updating service:', service);
  
  const { data, error } = await supabase
    .from('services')
    .update({ ...service, updated_at: new Date().toISOString() })
    .eq('id', service.id)
    .select();
  
  if (error) {
    console.error('Error updating service:', error);
    return false;
  }
  
  console.log('Service updated:', data);
  return true;
}

export async function deleteService(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('services')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting service:', error);
    return false;
  }
  return true;
}

// ============ APPOINTMENTS ============

export async function getAppointments(): Promise<Appointment[]> {
  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching appointments:', error);
    return [];
  }
  return data || [];
}

export async function updateAppointmentStatus(id: string, status: Appointment['status']): Promise<boolean> {
  const { error } = await supabase
    .from('appointments')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id);
  
  if (error) {
    console.error('Error updating appointment:', error);
    return false;
  }
  return true;
}
