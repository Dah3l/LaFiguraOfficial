import { createContext, useContext, useReducer, useCallback, type ReactNode } from 'react';
import type { Service, Appointment, BusinessInfo, Schedule, Toast, Page } from '../types';
import {
  defaultServices,
  defaultAppointments,
  defaultBusinessInfo,
  defaultSchedule,
  getFromStorage,
  saveToStorage,
  STORAGE_KEYS,
} from '../lib/data';

interface State {
  services: Service[];
  appointments: Appointment[];
  businessInfo: BusinessInfo;
  schedule: Schedule[];
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
  | { type: 'UPDATE_BUSINESS_INFO'; info: BusinessInfo }
  | { type: 'UPDATE_SCHEDULE'; schedule: Schedule[] }
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
    case 'UPDATE_BUSINESS_INFO': {
      saveToStorage(STORAGE_KEYS.businessInfo, action.info);
      return { ...state, businessInfo: action.info };
    }
    case 'UPDATE_SCHEDULE': {
      saveToStorage(STORAGE_KEYS.schedule, action.schedule);
      return { ...state, schedule: action.schedule };
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
  appointments: getFromStorage(STORAGE_KEYS.appointments, defaultAppointments),
  businessInfo: getFromStorage(STORAGE_KEYS.businessInfo, defaultBusinessInfo),
  schedule: getFromStorage(STORAGE_KEYS.schedule, defaultSchedule),
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
