import { MapPin, Clock, Phone, Instagram, Facebook, MessageCircle } from 'lucide-react';
import { useStore } from '../hooks/useStore';
import { motion } from 'framer-motion';

export function ContactPage() {
  const { state } = useStore();
  const { businessInfo } = state;

  return (
    <div className="pb-4">
      {/* Header */}
      <div className="px-5 pt-6 pb-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Contacto</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Estamos aquí para atenderte
        </p>
      </div>

      {/* Map placeholder */}
      <div className="px-5 mb-6">
        <div className="w-full h-48 bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30 rounded-2xl flex items-center justify-center border border-gray-100 dark:border-gray-800">
          <div className="text-center">
            <MapPin size={32} className="text-violet-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{businessInfo.address}</p>
            <p className="text-xs text-gray-500 mt-1">Alamar, La Habana, Cuba</p>
          </div>
        </div>
      </div>

      {/* Info Cards */}
      <div className="px-5 space-y-3 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800"
        >
          <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center shrink-0">
            <Clock size={18} className="text-violet-600 dark:text-violet-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">Horario</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{businessInfo.schedule}</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-4 p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800"
        >
          <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0">
            <Phone size={18} className="text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">Teléfono</p>
            <a href={`tel:${businessInfo.phone}`} className="text-xs text-violet-600 dark:text-violet-400 hover:underline">
              {businessInfo.phone}
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex items-center gap-4 p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
            <MessageCircle size={18} className="text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">WhatsApp</p>
            <a
              href={`https://wa.me/${businessInfo.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-violet-600 dark:text-violet-400 hover:underline"
            >
              +{businessInfo.whatsapp}
            </a>
          </div>
        </motion.div>
      </div>

      {/* Social */}
      <div className="px-5 mb-6">
        <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Síguenos</h2>
        <div className="flex gap-3">
          <a
            href={`https://instagram.com/${businessInfo.instagram.replace('@', '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity min-h-[44px]"
          >
            <Instagram size={16} />
            {businessInfo.instagram}
          </a>
          <a
            href={`https://facebook.com/${businessInfo.facebook.replace(' ', '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity min-h-[44px]"
          >
            <Facebook size={16} />
            Facebook
          </a>
        </div>
      </div>

      {/* WhatsApp CTA */}
      <div className="px-5 mt-6">
        <a
          href={`https://wa.me/${businessInfo.whatsapp}?text=${encodeURIComponent('¡Hola! Quisiera más información sobre los servicios de La Figura.')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-4 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-colors min-h-[52px]"
        >
          <MessageCircle size={20} />
          Escríbenos por WhatsApp
        </a>
      </div>
    </div>
  );
}
