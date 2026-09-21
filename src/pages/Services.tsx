import { useState } from 'react';
import { Clock, DollarSign, Search } from 'lucide-react';
import { useStore } from '../hooks/useStore';
import { motion, AnimatePresence } from 'framer-motion';

const categories = [
  { id: 'all', label: 'Todos', emoji: '✨' },
  { id: 'barberia', label: 'Barbería', emoji: '💈' },
  { id: 'peluqueria', label: 'Peluquería', emoji: '💇' },
  { id: 'estetica', label: 'Estética', emoji: '🧖' },
];

export function ServicesPage() {
  const { state, navigate } = useStore();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredServices = state.services.filter(s => {
    if (!s.active) return false;
    if (activeCategory !== 'all' && s.category !== activeCategory) return false;
    if (searchQuery && !s.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="pb-4">
      {/* Header */}
      <div className="px-5 pt-6 pb-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Nuestros Servicios</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Elige tu servicio favorito y reserva online
        </p>
      </div>

      {/* Search */}
      <div className="px-5 mb-4">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar servicio..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-3 bg-gray-100 dark:bg-gray-800 border-0 rounded-xl text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-violet-500 focus:bg-white dark:focus:bg-gray-900 transition-all outline-none"
            aria-label="Buscar servicio"
          />
        </div>
      </div>

      {/* Category Filter */}
      <div className="px-5 mb-4">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all min-h-[40px] ${
                activeCategory === cat.id
                  ? 'bg-violet-600 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <span>{cat.emoji}</span>
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Services Grid */}
      <div className="px-5">
        <AnimatePresence mode="popLayout">
          {filteredServices.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <p className="text-4xl mb-3">🔍</p>
              <p className="text-gray-500 dark:text-gray-400 text-sm">No se encontraron servicios</p>
            </motion.div>
          ) : (
            <div className="grid gap-3">
              {filteredServices.map((service, i) => (
                <motion.div
                  key={service.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden hover:border-violet-200 dark:hover:border-violet-800 transition-colors"
                >
                  <div className="flex gap-4 p-4">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/50 dark:to-purple-900/50 flex items-center justify-center shrink-0">
                      <span className="text-3xl">
                        {service.category === 'barberia' ? '💈' : service.category === 'peluqueria' ? '💇' : '✨'}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{service.name}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">{service.description}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="flex items-center gap-1 text-violet-600 dark:text-violet-400 font-bold text-sm">
                          <DollarSign size={12} />
                          {service.price} CUP
                        </span>
                        <span className="flex items-center gap-1 text-gray-400 text-xs">
                          <Clock size={12} />
                          {service.duration} min
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate('booking')}
                    className="w-full py-3 bg-violet-50 dark:bg-violet-950/30 text-violet-600 dark:text-violet-400 text-sm font-semibold hover:bg-violet-100 dark:hover:bg-violet-950/50 transition-colors border-t border-gray-50 dark:border-gray-800"
                  >
                    Reservar este servicio →
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
