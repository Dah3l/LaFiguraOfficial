import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Shield, Plus, Edit3, Trash2, Calendar, Clock, CheckCircle,
  XCircle, Building, Scissors, Tags, LogIn, FolderOpen
} from 'lucide-react';
import { useStore } from '../hooks/useStore';
import { serviceSchema, categorySchema, businessInfoSchema, type ServiceFormData, type CategoryFormData } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';

type AdminTab = 'appointments' | 'services' | 'categories' | 'business';

const statusConfig = {
  pending: { label: 'Pendiente', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400', icon: Clock },
  confirmed: { label: 'Confirmada', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', icon: CheckCircle },
  completed: { label: 'Completada', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', icon: CheckCircle },
  cancelled: { label: 'Cancelada', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', icon: XCircle },
};

export function AdminPage() {
  const { state, dispatch, addToast } = useStore();
  const [activeTab, setActiveTab] = useState<AdminTab>('appointments');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [editingService, setEditingService] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);

  const handleLogin = () => {
    if (password === 'admin123') {
      setIsAuthenticated(true);
      dispatch({ type: 'SET_ADMIN', isAdmin: true });
      addToast('Sesión de administrador iniciada', 'success');
    } else {
      addToast('Contraseña incorrecta', 'error');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="px-5 pt-12 pb-4">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
            <Shield size={28} className="text-violet-600 dark:text-violet-400" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Panel de Administración</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Ingresa la contraseña de administrador</p>
        </div>
        <div className="max-w-sm mx-auto space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            className="w-full px-4 py-3.5 bg-gray-100 dark:bg-gray-800 border-0 rounded-xl text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-violet-500 outline-none text-base"
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          />
          <button
            onClick={handleLogin}
            className="w-full py-3.5 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 min-h-[48px]"
          >
            <LogIn size={16} />
            Acceder
          </button>
          <p className="text-xs text-center text-gray-400">Demo: contraseña "admin123"</p>
        </div>
      </div>
    );
  }

  const tabs: { id: AdminTab; label: string; icon: typeof Calendar }[] = [
    { id: 'appointments', label: 'Citas', icon: Calendar },
    { id: 'services', label: 'Servicios', icon: Scissors },
    { id: 'categories', label: 'Categorías', icon: Tags },
    { id: 'business', label: 'Negocio', icon: Building },
  ];

  return (
    <div className="pb-4">
      {/* Header */}
      <div className="px-5 pt-6 pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Admin</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">Panel de gestión</p>
        </div>
        <button
          onClick={() => { setIsAuthenticated(false); dispatch({ type: 'SET_ADMIN', isAdmin: false }); addToast('Sesión cerrada', 'info'); }}
          className="text-xs text-red-500 font-medium px-3 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
        >
          Cerrar sesión
        </button>
      </div>

      {/* Tabs */}
      <div className="px-5 mb-4">
        <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-gray-700 text-violet-600 dark:text-violet-400 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              <tab.icon size={14} />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-5">
        <AnimatePresence mode="wait">
          {activeTab === 'appointments' && <AppointmentsTab key="apt" />}
          {activeTab === 'services' && (
            <ServicesTab
              key="svc"
              editingService={editingService}
              setEditingService={setEditingService}
            />
          )}
          {activeTab === 'categories' && (
            <CategoriesTab
              key="cat"
              editingCategory={editingCategory}
              setEditingCategory={setEditingCategory}
            />
          )}
          {activeTab === 'business' && <BusinessTab key="biz" />}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ============ APPOINTMENTS TAB ============ */

function AppointmentsTab() {
  const { state, dispatch, addToast } = useStore();
  const [filter, setFilter] = useState<string>('all');

  const filtered = filter === 'all'
    ? state.appointments
    : state.appointments.filter(a => a.status === filter);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              filter === f
                ? 'bg-violet-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
            }`}
          >
            {f === 'all' ? 'Todas' : statusConfig[f as keyof typeof statusConfig].label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-3xl mb-2">📋</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">No hay citas</p>
        </div>
      ) : (
        filtered.map(apt => {
          const service = state.services.find(s => s.id === apt.service_id);
          const config = statusConfig[apt.status];
          const StatusIcon = config.icon;
          return (
            <div key={apt.id} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">{apt.client_name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{apt.client_phone}</p>
                </div>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
                  <StatusIcon size={10} />
                  {config.label}
                </span>
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-300 space-y-0.5">
                <p>💇 {service?.name || 'Servicio'}</p>
                <p>📅 {apt.date} — 🕐 {apt.time}</p>
                {apt.notes && <p className="text-gray-400 italic">"{apt.notes}"</p>}
              </div>
              {apt.status === 'pending' && (
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => { dispatch({ type: 'UPDATE_APPOINTMENT_STATUS', id: apt.id, status: 'confirmed' }); addToast('Cita confirmada', 'success'); }}
                    className="flex-1 py-2 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-xs font-medium rounded-lg hover:bg-green-100 transition-colors"
                  >
                    Confirmar
                  </button>
                  <button
                    onClick={() => { dispatch({ type: 'UPDATE_APPOINTMENT_STATUS', id: apt.id, status: 'cancelled' }); addToast('Cita cancelada', 'info'); }}
                    className="flex-1 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs font-medium rounded-lg hover:bg-red-100 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              )}
            </div>
          );
        })
      )}
    </motion.div>
  );
}

/* ============ SERVICES TAB ============ */

function ServicesTab({ editingService, setEditingService }: { editingService: string | null; setEditingService: (id: string | null) => void }) {
  const { state, dispatch, addToast } = useStore();

  const getCategoryEmoji = (categoryId: string) => {
    return state.categories.find(c => c.id === categoryId)?.emoji || '✨';
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
      <button
        onClick={() => setEditingService('new')}
        className="w-full py-3 border-2 border-dashed border-violet-300 dark:border-violet-700 text-violet-600 dark:text-violet-400 rounded-xl text-sm font-medium flex items-center justify-center gap-2 hover:bg-violet-50 dark:hover:bg-violet-950/20 transition-colors min-h-[48px]"
      >
        <Plus size={16} />
        Nuevo Servicio
      </button>

      {editingService && (
        <ServiceForm
          service={editingService === 'new' ? null : state.services.find(s => s.id === editingService) || null}
          onClose={() => setEditingService(null)}
        />
      )}

      {state.services.map(service => (
        <div key={service.id} className="flex items-center gap-3 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-3">
          <div className="w-10 h-10 rounded-lg bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center shrink-0">
            <span className="text-lg">{getCategoryEmoji(service.category_id)}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-900 dark:text-white text-sm truncate">{service.name}</p>
            <p className="text-xs text-gray-500">${service.price} CUP · {service.duration} min</p>
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => setEditingService(service.id)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors"
              aria-label="Editar servicio"
            >
              <Edit3 size={14} />
            </button>
            <button
              onClick={() => { dispatch({ type: 'DELETE_SERVICE', id: service.id }); addToast('Servicio eliminado', 'info'); }}
              className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 text-red-500 transition-colors"
              aria-label="Eliminar servicio"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      ))}
    </motion.div>
  );
}

function ServiceForm({ service, onClose }: { service: import('../types').Service | null; onClose: () => void }) {
  const { state, dispatch, addToast } = useStore();
  const activeCategories = state.categories.filter(c => c.active);

  const { register, handleSubmit, formState: { errors } } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema) as never,
    defaultValues: service ? {
      name: service.name,
      description: service.description,
      price: service.price,
      duration: service.duration,
      category_id: service.category_id,
      active: service.active,
    } : {
      name: '',
      description: '',
      price: 0,
      duration: 30,
      category_id: activeCategories[0]?.id || '',
      active: true,
    },
  });

  const onSubmit = (data: ServiceFormData) => {
    if (service) {
      dispatch({ type: 'UPDATE_SERVICE', service: { ...service, ...data } });
      addToast('Servicio actualizado', 'success');
    } else {
      dispatch({
        type: 'ADD_SERVICE',
        service: { ...data, id: uuidv4(), image_url: null, created_at: new Date().toISOString() },
      });
      addToast('Servicio creado', 'success');
    }
    onClose();
  };

  return (
    <motion.form
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      onSubmit={handleSubmit(onSubmit)}
      className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 space-y-3 border border-gray-200 dark:border-gray-700"
    >
      <h3 className="font-semibold text-sm text-gray-900 dark:text-white">
        {service ? 'Editar Servicio' : 'Nuevo Servicio'}
      </h3>
      <input {...register('name')} placeholder="Nombre" className="w-full px-3 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-violet-500 text-base" />
      {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
      <textarea {...register('description')} placeholder="Descripción" rows={2} className="w-full px-3 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-violet-500 resize-none text-base" />
      {errors.description && <p className="text-red-500 text-xs">{errors.description.message}</p>}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <input {...register('price', { valueAsNumber: true })} type="number" placeholder="Precio CUP" className="w-full px-3 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-violet-500 text-base" />
          {errors.price && <p className="text-red-500 text-xs">{errors.price.message}</p>}
        </div>
        <div>
          <input {...register('duration', { valueAsNumber: true })} type="number" placeholder="Duración (min)" className="w-full px-3 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-violet-500 text-base" />
          {errors.duration && <p className="text-red-500 text-xs">{errors.duration.message}</p>}
        </div>
      </div>
      <select {...register('category_id')} className="w-full px-3 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-violet-500 text-base">
        {activeCategories.map(cat => (
          <option key={cat.id} value={cat.id}>{cat.emoji} {cat.name}</option>
        ))}
      </select>
      <div className="flex gap-2">
        <button type="submit" className="flex-1 py-2.5 bg-violet-600 text-white text-sm font-medium rounded-lg hover:bg-violet-700 transition-colors min-h-[40px]">
          {service ? 'Guardar' : 'Crear'}
        </button>
        <button type="button" onClick={onClose} className="px-4 py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors min-h-[40px]">
          Cancelar
        </button>
      </div>
    </motion.form>
  );
}

/* ============ CATEGORIES TAB ============ */

function CategoriesTab({ editingCategory, setEditingCategory }: { editingCategory: string | null; setEditingCategory: (id: string | null) => void }) {
  const { state, dispatch, addToast } = useStore();

  const getServiceCount = (categoryId: string) => {
    return state.services.filter(s => s.category_id === categoryId).length;
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
      <button
        onClick={() => setEditingCategory('new')}
        className="w-full py-3 border-2 border-dashed border-violet-300 dark:border-violet-700 text-violet-600 dark:text-violet-400 rounded-xl text-sm font-medium flex items-center justify-center gap-2 hover:bg-violet-50 dark:hover:bg-violet-950/20 transition-colors min-h-[48px]"
      >
        <Plus size={16} />
        Nueva Categoría
      </button>

      {editingCategory && (
        <CategoryForm
          category={editingCategory === 'new' ? null : state.categories.find(c => c.id === editingCategory) || null}
          onClose={() => setEditingCategory(null)}
        />
      )}

      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
        Las categorías organizan tus servicios. Puedes editar nombre, emoji y descripción.
      </p>

      {state.categories.sort((a, b) => a.order - b.order).map(category => (
        <div key={category.id} className="flex items-center gap-3 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-3">
          <div className="w-10 h-10 rounded-lg bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center shrink-0">
            <span className="text-lg">{category.emoji}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-900 dark:text-white text-sm">{category.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {getServiceCount(category.id)} servicios · {category.active ? 'Activa' : 'Inactiva'}
            </p>
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => setEditingCategory(category.id)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors"
              aria-label="Editar categoría"
            >
              <Edit3 size={14} />
            </button>
            <button
              onClick={() => {
                const count = getServiceCount(category.id);
                if (count > 0) {
                  addToast(`No puedes eliminar: tiene ${count} servicio(s) asignado(s)`, 'error');
                  return;
                }
                dispatch({ type: 'DELETE_CATEGORY', id: category.id });
                addToast('Categoría eliminada', 'info');
              }}
              className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 text-red-500 transition-colors"
              aria-label="Eliminar categoría"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      ))}
    </motion.div>
  );
}

function CategoryForm({ category, onClose }: { category: import('../types').Category | null; onClose: () => void }) {
  const { state, dispatch, addToast } = useStore();

  const { register, handleSubmit, formState: { errors } } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema) as never,
    defaultValues: category ? {
      name: category.name,
      slug: category.slug,
      emoji: category.emoji,
      description: category.description,
      active: category.active,
      order: category.order,
    } : {
      name: '',
      slug: '',
      emoji: '✨',
      description: '',
      active: true,
      order: state.categories.length,
    },
  });

  const onSubmit = (data: CategoryFormData) => {
    if (category) {
      dispatch({ type: 'UPDATE_CATEGORY', category: { ...category, ...data } });
      addToast('Categoría actualizada', 'success');
    } else {
      dispatch({
        type: 'ADD_CATEGORY',
        category: { ...data, id: uuidv4() },
      });
      addToast('Categoría creada', 'success');
    }
    onClose();
  };

  return (
    <motion.form
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      onSubmit={handleSubmit(onSubmit)}
      className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 space-y-3 border border-gray-200 dark:border-gray-700"
    >
      <h3 className="font-semibold text-sm text-gray-900 dark:text-white flex items-center gap-2">
        <FolderOpen size={14} />
        {category ? 'Editar Categoría' : 'Nueva Categoría'}
      </h3>

      <div className="grid grid-cols-3 gap-2">
        <div className="col-span-2">
          <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Nombre</label>
          <input {...register('name')} placeholder="Ej: Barbería" className="w-full px-3 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-violet-500 text-base" />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Emoji</label>
          <input {...register('emoji')} placeholder="💈" className="w-full px-3 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-violet-500 text-base text-center" />
          {errors.emoji && <p className="text-red-500 text-xs mt-1">{errors.emoji.message}</p>}
        </div>
      </div>

      <div>
        <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Slug (identificador único)</label>
        <input {...register('slug')} placeholder="Ej: barberia" className="w-full px-3 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-violet-500 text-base" />
        {errors.slug && <p className="text-red-500 text-xs mt-1">{errors.slug.message}</p>}
      </div>

      <div>
        <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Descripción (opcional)</label>
        <input {...register('description')} placeholder="Breve descripción de la categoría" className="w-full px-3 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-violet-500 text-base" />
      </div>

      <div>
        <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Orden de aparición</label>
        <input {...register('order', { valueAsNumber: true })} type="number" min={0} className="w-full px-3 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-violet-500 text-base" />
      </div>

      <label className="flex items-center gap-2 cursor-pointer">
        <input {...register('active')} type="checkbox" className="w-4 h-4 rounded border-gray-300 text-violet-600 focus:ring-violet-500" />
        <span className="text-sm text-gray-700 dark:text-gray-300">Categoría activa (visible en la web)</span>
      </label>

      <div className="flex gap-2 pt-1">
        <button type="submit" className="flex-1 py-2.5 bg-violet-600 text-white text-sm font-medium rounded-lg hover:bg-violet-700 transition-colors min-h-[40px]">
          {category ? 'Guardar' : 'Crear'}
        </button>
        <button type="button" onClick={onClose} className="px-4 py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors min-h-[40px]">
          Cancelar
        </button>
      </div>
    </motion.form>
  );
}

/* ============ BUSINESS TAB ============ */

function BusinessTab() {
  const { state, dispatch, addToast } = useStore();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const form = useForm<any>({
    resolver: zodResolver(businessInfoSchema) as any,
    defaultValues: state.businessInfo,
  });
  const { register } = form;
  const handleSubmit = form.handleSubmit as (cb: (data: Record<string, string>) => void) => (e?: React.BaseSyntheticEvent) => Promise<void>;

  const onSubmit = (data: Record<string, string>) => {
    dispatch({ type: 'UPDATE_BUSINESS_INFO', info: { ...state.businessInfo, ...data } });
    addToast('Información actualizada', 'success');
  };

  return (
    <motion.form
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-3"
    >
      <div>
        <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">Nombre</label>
        <input {...register('name')} className="w-full px-3 py-2.5 bg-gray-100 dark:bg-gray-800 border-0 rounded-lg text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-violet-500 text-base" />
      </div>
      <div>
        <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">Dirección</label>
        <input {...register('address')} className="w-full px-3 py-2.5 bg-gray-100 dark:bg-gray-800 border-0 rounded-lg text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-violet-500 text-base" />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">Teléfono</label>
          <input {...register('phone')} className="w-full px-3 py-2.5 bg-gray-100 dark:bg-gray-800 border-0 rounded-lg text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-violet-500 text-base" />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">WhatsApp</label>
          <input {...register('whatsapp')} className="w-full px-3 py-2.5 bg-gray-100 dark:bg-gray-800 border-0 rounded-lg text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-violet-500 text-base" />
        </div>
      </div>
      <div>
        <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">Descripción</label>
        <textarea {...register('description')} rows={3} className="w-full px-3 py-2.5 bg-gray-100 dark:bg-gray-800 border-0 rounded-lg text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-violet-500 resize-none text-base" />
      </div>
      <div>
        <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">Horario</label>
        <input {...register('schedule')} className="w-full px-3 py-2.5 bg-gray-100 dark:bg-gray-800 border-0 rounded-lg text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-violet-500 text-base" />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">Instagram</label>
          <input {...register('instagram')} className="w-full px-3 py-2.5 bg-gray-100 dark:bg-gray-800 border-0 rounded-lg text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-violet-500 text-base" />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">Facebook</label>
          <input {...register('facebook')} className="w-full px-3 py-2.5 bg-gray-100 dark:bg-gray-800 border-0 rounded-lg text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-violet-500 text-base" />
        </div>
      </div>
      <button type="submit" className="w-full py-3 bg-violet-600 text-white font-semibold rounded-xl hover:bg-violet-700 transition-colors min-h-[48px]">
        Guardar Cambios
      </button>
    </motion.form>
  );
}
