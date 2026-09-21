import { CalendarCheck, Clock, Sparkles, ChevronRight, MessageCircle } from 'lucide-react';
import { useStore } from '../hooks/useStore';
import { motion } from 'framer-motion';

export function HomePage() {
  const { state, navigate } = useStore();
  const { businessInfo, services, categories } = state;
  const featuredServices = services.filter(s => s.active).slice(0, 3);

  const getCategoryEmoji = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)?.emoji || '✨';
  };

  return (
    <div className="pb-4">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 dark:from-violet-900 dark:via-purple-900 dark:to-fuchsia-900">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-10 right-10 w-40 h-40 rounded-full bg-white blur-3xl" />
        </div>
        <div className="relative px-5 pt-12 pb-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white/90 text-xs font-medium mb-4">
              <Sparkles size={12} />
              <span>Bienvenido a {businessInfo.name}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3 font-serif">
              Tu Estilo,<br />Nuestra Pasión
            </h1>
            <p className="text-white/80 text-sm sm:text-base max-w-sm mx-auto mb-6">
              {businessInfo.description}
            </p>
            <a
              href={`https://wa.me/${businessInfo.whatsapp}?text=${encodeURIComponent('¡Hola! Quisiera reservar una cita en La Figura.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95 min-h-[48px]"
            >
              <MessageCircle size={18} />
              Reservar por WhatsApp
            </a>
          </motion.div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="px-5 mt-6">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 p-4 grid grid-cols-3 gap-3">
          <div className="text-center">
            <p className="text-xl font-bold text-violet-600 dark:text-violet-400">{services.filter(s => s.active).length}+</p>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">Servicios</p>
          </div>
          <div className="text-center border-x border-gray-100 dark:border-gray-800">
            <p className="text-xl font-bold text-violet-600 dark:text-violet-400">4.9★</p>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">Valoración</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-violet-600 dark:text-violet-400">500+</p>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">Clientes</p>
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="px-5 mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Servicios Destacados</h2>
          <button
            onClick={() => navigate('services')}
            className="text-sm text-violet-600 dark:text-violet-400 font-medium flex items-center gap-0.5"
          >
            Ver todos <ChevronRight size={14} />
          </button>
        </div>
        <div className="grid gap-3">
          {featuredServices.map((service, i) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-4 p-3 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-violet-200 dark:hover:border-violet-800 transition-colors"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/50 dark:to-purple-900/50 flex items-center justify-center shrink-0">
                <span className="text-2xl">{getCategoryEmoji(service.category_id)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm truncate">{service.name}</h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-violet-600 dark:text-violet-400 font-bold text-sm">${service.price} CUP</span>
                  <span className="text-gray-400 dark:text-gray-500 text-xs flex items-center gap-0.5">
                    <Clock size={10} /> {service.duration} min
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 mt-8">
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 dark:from-green-700 dark:to-emerald-800 rounded-2xl p-6 text-center">
          <h3 className="text-white font-bold text-lg mb-2">¿Lista/o para tu cambio?</h3>
          <p className="text-white/80 text-sm mb-4">Reserva ahora por WhatsApp y luce tu mejor versión</p>
          <a
            href={`https://wa.me/${businessInfo.whatsapp}?text=${encodeURIComponent('¡Hola! Quisiera reservar una cita en La Figura.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-3 bg-white text-green-700 font-semibold rounded-full text-sm shadow-lg active:scale-95 transition-transform min-h-[44px]"
          >
            <CalendarCheck size={16} />
            Agendar por WhatsApp
          </a>
        </div>
      </section>
    </div>
  );
}
