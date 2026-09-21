import { createContext, useContext, useReducer, useCallback, type ReactNode } from 'react';
import type { Service, Appointment, BusinessInfo, Category, Toast, Page } from '../types';
import {
  defaultServices,
  defaultCategories,
  defaultAppointments,
  defaultBusinessInfo,
  getFromStorage,
  saveToStorage,
  STORAGE_KEYS,
} from '../lib/data';

interface State {
  services: Service[];
  categories: Category[];
  appointments: Appointment[];
  businessInfo: BusinessInfo;
  currentPage: Page;
  toasts: Toast[];
  isAdmin: boolean;
}

type Action =
  | { type: 'SET_PAGE'; page: Page }
  | { type: 'ADD_APPOINTMENT'; appointment: Appointment }
  | { type: 'UPDATE_APPOINTMENT_STATUS'; id: string; status: Appointment['status'] }
  | { type: 'ADD_SERVICE'; service: Service }
  | { type: 'UPDATE_SERVICE'; service: Service }
  | { type: 'DELETE_SERVICE'; id: string }
  | { type: 'ADD_CATEGORY'; category: Category }
  | { type: 'UPDATE_CATEGORY'; category: Category }
  | { type: 'DELETE_CATEGORY'; id: string }
  | { type: 'UPDATE_BUSINESS_INFO'; info: BusinessInfo }
  | { type: 'ADD_TOAST'; toast: Toast }
  | { type: 'REMOVE_TOAST'; id: string }
  | { type: 'SET_ADMIN'; isAdmin: boolean };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_PAGE':
      return { ...state, currentPage: action.page };
    case 'ADD_APPOINTMENT': {
      const updated = [action.appointment, ...state.appointments];
      saveToStorage(STORAGE_KEYS.appointments, updated);
      return { ...state, appointments: updated };
    }
    case 'UPDATE_APPOINTMENT_STATUS': {
      const updated = state.appointments.map(a =>
        a.id === action.id ? { ...a, status: action.status } : a
      );
      saveToStorage(STORAGE_KEYS.appointments, updated);
      return { ...state, appointments: updated };
    }
    case 'ADD_SERVICE': {
      const updated = [...state.services, action.service];
      saveToStorage(STORAGE_KEYS.services, updated);
      return { ...state, services: updated };
    }
    case 'UPDATE_SERVICE': {
      const updated = state.services.map(s => s.id === action.service.id ? action.service : s);
      saveToStorage(STORAGE_KEYS.services, updated);
      return { ...state, services: updated };
    }
    case 'DELETE_SERVICE': {
      const updated = state.services.filter(s => s.id !== action.id);
      saveToStorage(STORAGE_KEYS.services, updated);
      return { ...state, services: updated };
    }
    case 'ADD_CATEGORY': {
      const updated = [...state.categories, action.category];
      saveToStorage(STORAGE_KEYS.categories, updated);
      return { ...state, categories: updated };
    }
    case 'UPDATE_CATEGORY': {
      const updated = state.categories.map(c => c.id === action.category.id ? action.category : c);
      saveToStorage(STORAGE_KEYS.categories, updated);
      return { ...state, categories: updated };
    }
    case 'DELETE_CATEGORY': {
      const updated = state.categories.filter(c => c.id !== action.id);
      saveToStorage(STORAGE_KEYS.categories, updated);
      return { ...state, categories: updated };
    }
    case 'UPDATE_BUSINESS_INFO': {
      saveToStorage(STORAGE_KEYS.businessInfo, action.info);
      return { ...state, businessInfo: action.info };
    }
    case 'ADD_TOAST':
      return { ...state, toasts: [...state.toasts, action.toast] };
    case 'REMOVE_TOAST':
      return { ...state, toasts: state.toasts.filter(t => t.id !== action.id) };
    case 'SET_ADMIN':
      return { ...state, isAdmin: action.isAdmin };
    default:
      return state;
  }
}

const initialState: State = {
  services: getFromStorage(STORAGE_KEYS.services, defaultServices),
  categories: getFromStorage(STORAGE_KEYS.categories, defaultCategories),
  appointments: getFromStorage(STORAGE_KEYS.appointments, defaultAppointments),
  businessInfo: getFromStorage(STORAGE_KEYS.businessInfo, defaultBusinessInfo),
  currentPage: 'home',
  toasts: [],
  isAdmin: false,
};

interface StoreContextType {
  state: State;
  dispatch: React.Dispatch<Action>;
  navigate: (page: Page) => void;
  addToast: (message: string, type: Toast['type']) => void;
}

const StoreContext = createContext<StoreContextType | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const navigate = useCallback((page: Page) => {
    dispatch({ type: 'SET_PAGE', page });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const addToast = useCallback((message: string, type: Toast['type']) => {
    const id = Date.now().toString() + Math.random().toString(36).slice(2);
    dispatch({ type: 'ADD_TOAST', toast: { id, message, type } });
    setTimeout(() => dispatch({ type: 'REMOVE_TOAST', id }), 4000);
  }, []);

  return (
    <StoreContext.Provider value={{ state, dispatch, navigate, addToast }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
