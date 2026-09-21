import { createContext, useContext, useReducer, useCallback, useEffect, type ReactNode } from 'react';
import type { Service, Appointment, BusinessInfo, Category, Toast, Page } from '../types';
import { defaultServices, defaultCategories, defaultAppointments, defaultBusinessInfo } from '../lib/data';
import * as supabaseServices from '../lib/supabase-services';
import { isSupabaseConfigured } from '../lib/supabase';

interface State {
  services: Service[];
  categories: Category[];
  appointments: Appointment[];
  businessInfo: BusinessInfo;
  currentPage: Page;
  toasts: Toast[];
  isAdmin: boolean;
  isLoading: boolean;
}

type Action =
  | { type: 'SET_PAGE'; page: Page }
  | { type: 'SET_SERVICES'; services: Service[] }
  | { type: 'SET_CATEGORIES'; categories: Category[] }
  | { type: 'SET_APPOINTMENTS'; appointments: Appointment[] }
  | { type: 'SET_BUSINESS_INFO'; info: BusinessInfo }
  | { type: 'ADD_SERVICE'; service: Service }
  | { type: 'UPDATE_SERVICE'; service: Service }
  | { type: 'DELETE_SERVICE'; id: string }
  | { type: 'ADD_CATEGORY'; category: Category }
  | { type: 'UPDATE_CATEGORY'; category: Category }
  | { type: 'DELETE_CATEGORY'; id: string }
  | { type: 'UPDATE_BUSINESS_INFO'; info: BusinessInfo }
  | { type: 'ADD_TOAST'; toast: Toast }
  | { type: 'REMOVE_TOAST'; id: string }
  | { type: 'SET_ADMIN'; isAdmin: boolean }
  | { type: 'SET_LOADING'; isLoading: boolean };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_PAGE':
      return { ...state, currentPage: action.page };
    case 'SET_SERVICES':
      return { ...state, services: action.services };
    case 'SET_CATEGORIES':
      return { ...state, categories: action.categories };
    case 'SET_APPOINTMENTS':
      return { ...state, appointments: action.appointments };
    case 'SET_BUSINESS_INFO':
      return { ...state, businessInfo: action.info };
    case 'ADD_SERVICE':
      return { ...state, services: [action.service, ...state.services] };
    case 'UPDATE_SERVICE':
      return { ...state, services: state.services.map(s => s.id === action.service.id ? action.service : s) };
    case 'DELETE_SERVICE':
      return { ...state, services: state.services.filter(s => s.id !== action.id) };
    case 'ADD_CATEGORY':
      return { ...state, categories: [...state.categories, action.category] };
    case 'UPDATE_CATEGORY':
      return { ...state, categories: state.categories.map(c => c.id === action.category.id ? action.category : c) };
    case 'DELETE_CATEGORY':
      return { ...state, categories: state.categories.filter(c => c.id !== action.id) };
    case 'UPDATE_BUSINESS_INFO':
      return { ...state, businessInfo: action.info };
    case 'ADD_TOAST':
      return { ...state, toasts: [...state.toasts, action.toast] };
    case 'REMOVE_TOAST':
      return { ...state, toasts: state.toasts.filter(t => t.id !== action.id) };
    case 'SET_ADMIN':
      return { ...state, isAdmin: action.isAdmin };
    case 'SET_LOADING':
      return { ...state, isLoading: action.isLoading };
    default:
      return state;
  }
}

const initialState: State = {
  services: defaultServices,
  categories: defaultCategories,
  appointments: defaultAppointments,
  businessInfo: defaultBusinessInfo,
  currentPage: 'home',
  toasts: [],
  isAdmin: false,
  isLoading: true,
};

interface StoreContextType {
  state: State;
  dispatch: React.Dispatch<Action>;
  navigate: (page: Page) => void;
  addToast: (message: string, type: Toast['type']) => void;
  loadData: () => Promise<void>;
}

const StoreContext = createContext<StoreContextType | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const loadData = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      console.log('Supabase not configured, using default data');
      dispatch({ type: 'SET_LOADING', isLoading: false });
      return;
    }

    dispatch({ type: 'SET_LOADING', isLoading: true });

    try {
      const [businessInfo, categories, services, appointments] = await Promise.all([
        supabaseServices.getBusinessInfo(),
        supabaseServices.getCategories(),
        supabaseServices.getServices(),
        supabaseServices.getAppointments(),
      ]);

      if (businessInfo) {
        dispatch({ type: 'SET_BUSINESS_INFO', info: businessInfo });
      }
      if (categories.length > 0) {
        dispatch({ type: 'SET_CATEGORIES', categories });
      }
      if (services.length > 0) {
        dispatch({ type: 'SET_SERVICES', services });
      }
      if (appointments.length > 0) {
        dispatch({ type: 'SET_APPOINTMENTS', appointments });
      }
    } catch (error) {
      console.error('Error loading data from Supabase:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', isLoading: false });
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

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
    <StoreContext.Provider value={{ state, dispatch, navigate, addToast, loadData }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
