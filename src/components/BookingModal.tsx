import { useState, useEffect } from 'react';
import { X, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Service } from '../types';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  whatsappNumber: string;
  services: Service[];
  preselectedService?: string;
}

export function BookingModal({ isOpen, onClose, whatsappNumber, services, preselectedService }: BookingModalProps) {
  const [clientName, setClientName] = useState('');
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setClientName('');
      setError('');
      
      // Si viene un servicio pre-seleccionado, buscar su ID
      if (preselectedService) {
        const service = services.find(s => s.name === preselectedService);
        if (service) {
          setSelectedServiceId(service.id);
        } else {
          setSelectedServiceId('');
        }
      } else {
        setSelectedServiceId('');
      }
    }
  }, [isOpen, preselectedService, services]);

  const handleSubmit = () => {
    if (!clientName.trim()) {
      setError('Por favor ingresa tu nombre');
      return;
    }
    if (!selectedServiceId) {
      setError('Por favor selecciona un servicio');
      return;
    }

    const service = services.find(s => s.id === selectedServiceId);
    if (!service) {
      setError('Servicio no válido');
      return;
    }

    const message = `¡Hola! Soy ${clientName.trim()}. Me interesa reservar el servicio ${service.name} en La Figura. ¿Tienen disponibilidad?`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
    onClose();
  };

  const handleClose = () => {
    setClientName('');
    setSelectedServiceId('');
    setError('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.3 }}
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 max-w-md mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <MessageCircle size={20} className="text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Reservar por WhatsApp</h2>
              </div>
              <button
                onClick={handleClose}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Cerrar"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nombre del cliente
                </label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => {
                    setClientName(e.target.value);
                    setError('');
                  }}
                  placeholder="Tu nombre completo"
                  className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 border-0 rounded-xl text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-violet-500 outline-none text-base"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tipo de servicio solicitado
                </label>
                <select
                  value={selectedServiceId}
                  onChange={(e) => {
                    setSelectedServiceId(e.target.value);
                    setError('');
                  }}
                  className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 border-0 rounded-xl text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-500 outline-none text-base appearance-none cursor-pointer"
                >
                  <option value="">Selecciona un servicio</option>
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name}
                    </option>
                  ))}
                </select>
              </div>

              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-500 dark:text-red-400 flex items-center gap-1"
                >
                  ⚠️ {error}
                </motion.p>
              )}

              <p className="text-xs text-gray-500 dark:text-gray-400">
                Se abrirá WhatsApp con un mensaje prellenado para completar tu reserva.
              </p>
            </div>

            {/* Footer */}
            <div className="flex gap-3 p-5 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-950/50">
              <button
                onClick={handleClose}
                className="flex-1 py-3 px-4 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors min-h-[48px]"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 py-3 px-4 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 min-h-[48px]"
              >
                <MessageCircle size={18} />
                Aceptar
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
