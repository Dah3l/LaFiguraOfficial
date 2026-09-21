import { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarCheck, Clock, User, Phone, MessageSquare, Send } from 'lucide-react';
import { useStore } from '../hooks/useStore';
import { bookingSchema, type BookingFormData } from '../types';
import { motion } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';

function generateTimeSlots(): string[] {
  const slots: string[] = [];
  for (let h = 9; h < 19; h++) {
    slots.push(`${h.toString().padStart(2, '0')}:00`);
    slots.push(`${h.toString().padStart(2, '0')}:30`);
  }
  return slots;
}

function getMinDate(): string {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

function getMaxDate(): string {
  const d = new Date();
  d.setDate(d.getDate() + 30);
  return d.toISOString().split('T')[0];
}

export function BookingPage() {
  const { state, dispatch, addToast, navigate } = useStore();
  const [submitted, setSubmitted] = useState(false);

  const activeServices = state.services.filter(s => s.active);
  const timeSlots = useMemo(() => generateTimeSlots(), []);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema) as any,
    defaultValues: {
      client_name: '',
      client_phone: '',
      service_id: '',
      date: '',
      time: '',
      notes: '',
    },
  });

  const watchedValues = watch();
  const selectedService = activeServices.find(s => s.id === watchedValues.service_id);

  const onSubmit = (data: BookingFormData) => {
    const appointment = {
      id: uuidv4(),
      client_name: data.client_name,
      client_phone: data.client_phone,
      service_id: data.service_id,
      date: data.date,
      time: data.time,
      notes: data.notes || '',
      status: 'pending' as const,
      created_at: new Date().toISOString(),
    };

    dispatch({ type: 'ADD_APPOINTMENT', appointment });
    addToast('¡Cita reservada con éxito! Te contactaremos pronto.', 'success');
    setSubmitted(true);
    reset();
  };

  const generateWhatsAppLink = (): string => {
    const service = selectedService;
    const msg = `¡Hola! Quisiera reservar una cita en *La Figura*:\n\n` +
      `👤 Nombre: ${watchedValues.client_name || '—'}\n` +
      `📞 Teléfono: ${watchedValues.client_phone || '—'}\n` +
      `💇 Servicio: ${service?.name || '—'}\n` +
      `📅 Fecha: ${watchedValues.date || '—'}\n` +
      `🕐 Hora: ${watchedValues.time || '—'}\n` +
      (watchedValues.notes ? `📝 Notas: ${watchedValues.notes}\n` : '') +
      `\n¡Gracias!`;
    const encoded = encodeURIComponent(msg);
    return `https://wa.me/${state.businessInfo.whatsapp}?text=${encoded}`;
  };

  if (submitted) {
    return (
      <div className="px-5 pt-12 pb-4 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center"
        >
          <CalendarCheck size={36} className="text-green-600 dark:text-green-400" />
        </motion.div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">¡Reserva Confirmada!</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Tu cita ha sido registrada. Te contactaremos para confirmar.
        </p>
        <div className="flex flex-col gap-3">
          <a
            href={generateWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-colors min-h-[48px]"
          >
            <Send size={16} />
            Confirmar por WhatsApp
          </a>
          <button
            onClick={() => { setSubmitted(false); navigate('home'); }}
            className="px-5 py-3 text-violet-600 dark:text-violet-400 font-medium text-sm"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-4">
      {/* Header */}
      <div className="px-5 pt-6 pb-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reservar Cita</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Completa el formulario para agendar tu cita
        </p>
      </div>

      <div className="px-5">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Nombre */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              <User size={14} />
              Nombre completo
            </label>
            <input
              {...register('client_name')}
              type="text"
              placeholder="Tu nombre"
              className="w-full px-4 py-3.5 bg-gray-100 dark:bg-gray-800 border-0 rounded-xl text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-violet-500 focus:bg-white dark:focus:bg-gray-900 transition-all outline-none text-base"
              autoComplete="name"
            />
            {errors.client_name && (
              <p className="text-red-500 text-xs mt-1">{errors.client_name.message}</p>
            )}
          </div>

          {/* Teléfono */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              <Phone size={14} />
              Teléfono
            </label>
            <input
              {...register('client_phone')}
              type="tel"
              placeholder="+53 5XXX XXXX"
              className="w-full px-4 py-3.5 bg-gray-100 dark:bg-gray-800 border-0 rounded-xl text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-violet-500 focus:bg-white dark:focus:bg-gray-900 transition-all outline-none text-base"
              autoComplete="tel"
            />
            {errors.client_phone && (
              <p className="text-red-500 text-xs mt-1">{errors.client_phone.message}</p>
            )}
          </div>

          {/* Servicio */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              <CalendarCheck size={14} />
              Servicio
            </label>
            <select
              {...register('service_id')}
              className="w-full px-4 py-3.5 bg-gray-100 dark:bg-gray-800 border-0 rounded-xl text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-500 focus:bg-white dark:focus:bg-gray-900 transition-all outline-none appearance-none text-base"
            >
              <option value="">Selecciona un servicio</option>
              {activeServices.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} — ${s.price} CUP ({s.duration} min)
                </option>
              ))}
            </select>
            {errors.service_id && (
              <p className="text-red-500 text-xs mt-1">{errors.service_id.message}</p>
            )}
          </div>

          {/* Fecha y Hora */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                <CalendarCheck size={14} />
                Fecha
              </label>
              <input
                {...register('date')}
                type="date"
                min={getMinDate()}
                max={getMaxDate()}
                className="w-full px-4 py-3.5 bg-gray-100 dark:bg-gray-800 border-0 rounded-xl text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-500 focus:bg-white dark:focus:bg-gray-900 transition-all outline-none text-base"
              />
              {errors.date && (
                <p className="text-red-500 text-xs mt-1">{errors.date.message}</p>
              )}
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                <Clock size={14} />
                Hora
              </label>
              <select
                {...register('time')}
                className="w-full px-4 py-3.5 bg-gray-100 dark:bg-gray-800 border-0 rounded-xl text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-500 focus:bg-white dark:focus:bg-gray-900 transition-all outline-none appearance-none text-base"
              >
                <option value="">Hora</option>
                {timeSlots.map(slot => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
              </select>
              {errors.time && (
                <p className="text-red-500 text-xs mt-1">{errors.time.message}</p>
              )}
            </div>
          </div>

          {/* Notas */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              <MessageSquare size={14} />
              Notas (opcional)
            </label>
            <textarea
              {...register('notes')}
              placeholder="Alguna preferencia o indicación especial..."
              rows={3}
              className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 border-0 rounded-xl text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-violet-500 focus:bg-white dark:focus:bg-gray-900 transition-all outline-none resize-none text-base"
            />
          </div>

          {/* Live Summary */}
          {(watchedValues.service_id || watchedValues.date || watchedValues.time) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-violet-50 dark:bg-violet-950/20 rounded-xl p-4 border border-violet-100 dark:border-violet-900/50"
            >
              <h3 className="text-sm font-semibold text-violet-700 dark:text-violet-300 mb-2">Resumen de tu cita</h3>
              <div className="space-y-1 text-sm">
                {selectedService && (
                  <p className="text-gray-700 dark:text-gray-300">
                    💇 <span className="font-medium">{selectedService.name}</span> — ${selectedService.price} CUP
                  </p>
                )}
                {watchedValues.date && (
                  <p className="text-gray-700 dark:text-gray-300">
                    📅 {new Date(watchedValues.date + 'T12:00:00').toLocaleDateString('es-CU', { weekday: 'long', day: 'numeric', month: 'long' })}
                  </p>
                )}
                {watchedValues.time && (
                  <p className="text-gray-700 dark:text-gray-300">
                    🕐 {watchedValues.time}
                  </p>
                )}
              </div>
            </motion.div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white font-semibold rounded-xl transition-all shadow-lg shadow-violet-600/25 active:scale-[0.98] min-h-[52px] flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <CalendarCheck size={18} />
                Confirmar Reserva
              </>
            )}
          </button>

          {/* WhatsApp alternative */}
          <div className="text-center">
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-2">O reserva directamente por</p>
            <a
              href={generateWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-xl transition-colors text-sm min-h-[44px]"
            >
              <Send size={14} />
              WhatsApp
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
