import { Home, Scissors, Shield, Phone, Sun, Moon } from 'lucide-react';
import { useStore } from '../hooks/useStore';
import { useTheme } from '../hooks/useTheme';
import type { Page } from '../types';

const navItems: { page: Page; icon: typeof Home; label: string }[] = [
  { page: 'home', icon: Home, label: 'Inicio' },
  { page: 'services', icon: Scissors, label: 'Servicios' },
  { page: 'admin', icon: Shield, label: 'Admin' },
  { page: 'contact', icon: Phone, label: 'Contacto' },
];

export function BottomNav() {
  const { state, navigate } = useStore();
  const { theme, toggleTheme } = useTheme();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-950/95 backdrop-blur-lg safe-area-pb"
      role="navigation"
      aria-label="Navegación principal"
    >
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {navItems.map(({ page, icon: Icon, label }) => {
          const isActive = state.currentPage === page;
          return (
            <button
              key={page}
              onClick={() => navigate(page)}
              className={`flex flex-col items-center justify-center py-2 px-3 min-h-[52px] min-w-[52px] transition-colors duration-200 ${
                isActive
                  ? 'text-violet-600 dark:text-violet-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
              aria-label={label}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
              <span className={`text-[10px] mt-0.5 font-medium ${isActive ? 'font-semibold' : ''}`}>
                {label}
              </span>
            </button>
          );
        })}
        <button
          onClick={toggleTheme}
          className="flex flex-col items-center justify-center py-2 px-3 min-h-[52px] min-w-[52px] text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          aria-label={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
        >
          {theme === 'dark' ? <Sun size={22} /> : <Moon size={22} />}
          <span className="text-[10px] mt-0.5 font-medium">
            {theme === 'dark' ? 'Claro' : 'Oscuro'}
          </span>
        </button>
      </div>
    </nav>
  );
}
