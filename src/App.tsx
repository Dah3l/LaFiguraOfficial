import { StoreProvider, useStore } from './hooks/useStore';
import { BottomNav } from './components/BottomNav';
import { ToastContainer } from './components/ToastContainer';
import { HomePage } from './pages/Home';
import { ServicesPage } from './pages/Services';
import { AdminPage } from './pages/Admin';
import { ContactPage } from './pages/Contact';
import { useTheme } from './hooks/useTheme';

function AppContent() {
  const { state } = useStore();
  useTheme();

  const renderPage = () => {
    switch (state.currentPage) {
      case 'home': return <HomePage />;
      case 'services': return <ServicesPage />;
      case 'admin': return <AdminPage />;
      case 'contact': return <ContactPage />;
      default: return <HomePage />;
    }
  };

  return (
    <div className="min-h-dvh bg-white dark:bg-gray-950 text-gray-900 dark:text-white transition-colors duration-200">
      <main className="max-w-lg mx-auto pb-20">
        {renderPage()}
      </main>
      <BottomNav />
      <ToastContainer />
    </div>
  );
}

function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}

export default App;
