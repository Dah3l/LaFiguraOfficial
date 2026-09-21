import { MessageCircle, Clock, DollarSign, ArrowRight } from 'lucide-react';
import { useStore } from '../hooks/useStore';
import { motion } from 'framer-motion';

export function BookingPage() {
  const { state } = useStore();
  const { businessInfo, services, categories } = state;
  const activeServices = services.filter(s => s.active);
  const activeCategories = categories.filter(c => c.active).sort((a, b) => a.order - b.order);

  const getCategoryEmoji = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)?.emoji || '✨';
  };

  const getCategoryName = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)?.name || 'General';
  };

  const buildWhatsAppLink = (serviceName: string) => {
    const msg = `¡Hola! 👋 Me interesa reservar el servicio *${serviceName}* en *La Figura*. ¿Tienen disponibilidad próximamente?`;
    return `https://wa.me/${businessInfo.whatsapp}?text=${encodeURIComponent(msg)}`;
  };

  const buildGeneralWhatsAppLink = () => {
    const msg = `¡Hola! 👋 Quisiera reservar una cita en *La Figura*. ¿Me pueden ayudar?`;
    return `https://wa.me/${businessInfo.whatsapp}?text=${encodeURIComponent(msg)}`;
  };

  // Group services by category
  const groupedServices = activeCategories.map(cat => ({
    category: cat,
    services: activeServices.filter(s => s.category_id === cat.id),
  })).filter(group => group.services.length > 0);

  return (
    <div className="pb-4">
      {/* Header */}
      <div className="px-5 pt-6 pb-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reservar Cita</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Selecciona un servicio y reserva directamente por WhatsApp
        </p>
      </div>

      {/* Quick WhatsApp CTA */}
      <div className="px-5 mb-6">
        <a
          href={buildGeneralWhatsAppLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4 p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800/50 rounded-2xl hover:bg-green-100 dark:hover:bg-green-950/30 transition-colors min-h-[64px]"
        >
          <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center shrink-0">
            <MessageCircle size={22} className="text-white" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-green-800 dark:text-green-200 text-sm">¿No sabes qué elegir?</p>
            <p className="text-xs text-green-600 dark:text-green-400">Escríbenos y te asesoramos</p>
          </div>
          <ArrowRight size={18} className="text-green-500 shrink-0" />
        </a>
      </div>

      {/* Services by Category */}
      <div className="px-5 space-y-6">
        {groupedServices.map((group, gi) => (
          <motion.div
            key={group.category.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: gi * 0.1 }}
          >
            <h2 className="text-base font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <span className="text-xl">{group.category.emoji}</span>
              {group.category.name}
            </h2>
            <div className="space-y-2">
              {group.services.map(service => (
                <div
                  key={service.id}
                  className="flex items-center gap-3 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-3 hover:border-green-200 dark:hover:border-green-800 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 dark:text-white text-sm truncate">{service.name}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="flex items-center gap-0.5 text-violet-600 dark:text-violet-400 font-bold text-xs">
                        <DollarSign size={10} />
                        {service.price} CUP
                      </span>
                      <span className="flex items-center gap-0.5 text-gray-400 text-xs">
                        <Clock size={10} />
                        {service.duration} min
                      </span>
                    </div>
                  </div>
                  <a
                    href={buildWhatsAppLink(service.name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 flex items-center gap-1.5 px-3 py-2.5 bg-green-500 hover:bg-green-600 text-white text-xs font-semibold rounded-xl transition-colors min-h-[40px] active:scale-95"
                    aria-label={`Reservar ${service.name} por WhatsApp`}
                  >
                    <MessageCircle size={14} />
                    <span className="hidden sm:inline">Reservar</span>
                  </a>
                </div>
              ))}
            </div>
          </motion.div>
        ))}

        {groupedServices.length === 0 && (
          <div className="text-center py-12">
            <p className="text-4xl mb-3">📋</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm">No hay servicios disponibles</p>
          </div>
        )}
      </div>

    </div>
  );
}
