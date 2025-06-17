
import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { errorTracker } from '@/services/errorTracking';

interface AppState {
  clinics: any[];
  appointments: any[];
  notifications: any[];
  settings: {
    theme: 'light' | 'dark' | 'system';
    language: 'pt' | 'en';
    notifications: boolean;
  };
  ui: {
    isLoading: boolean;
    sidebarOpen: boolean;
    modalOpen: string | null;
  };
}

type AppAction = 
  | { type: 'SET_CLINICS'; payload: any[] }
  | { type: 'SET_APPOINTMENTS'; payload: any[] }
  | { type: 'ADD_APPOINTMENT'; payload: any }
  | { type: 'UPDATE_APPOINTMENT'; payload: { id: string; data: any } }
  | { type: 'DELETE_APPOINTMENT'; payload: string }
  | { type: 'SET_NOTIFICATIONS'; payload: any[] }
  | { type: 'ADD_NOTIFICATION'; payload: any }
  | { type: 'REMOVE_NOTIFICATION'; payload: string }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<AppState['settings']> }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'SET_MODAL'; payload: string | null }
  | { type: 'RESET_STATE' };

const initialState: AppState = {
  clinics: [],
  appointments: [],
  notifications: [],
  settings: {
    theme: 'system',
    language: 'pt',
    notifications: true
  },
  ui: {
    isLoading: false,
    sidebarOpen: false,
    modalOpen: null
  }
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  try {
    switch (action.type) {
      case 'SET_CLINICS':
        return { ...state, clinics: action.payload };
      
      case 'SET_APPOINTMENTS':
        return { ...state, appointments: action.payload };
      
      case 'ADD_APPOINTMENT':
        return { 
          ...state, 
          appointments: [...state.appointments, action.payload] 
        };
      
      case 'UPDATE_APPOINTMENT':
        return {
          ...state,
          appointments: state.appointments.map(apt => 
            apt.id === action.payload.id 
              ? { ...apt, ...action.payload.data }
              : apt
          )
        };
      
      case 'DELETE_APPOINTMENT':
        return {
          ...state,
          appointments: state.appointments.filter(apt => apt.id !== action.payload)
        };
      
      case 'SET_NOTIFICATIONS':
        return { ...state, notifications: action.payload };
      
      case 'ADD_NOTIFICATION':
        return { 
          ...state, 
          notifications: [...state.notifications, action.payload] 
        };
      
      case 'REMOVE_NOTIFICATION':
        return {
          ...state,
          notifications: state.notifications.filter(notif => notif.id !== action.payload)
        };
      
      case 'UPDATE_SETTINGS':
        return { 
          ...state, 
          settings: { ...state.settings, ...action.payload } 
        };
      
      case 'SET_LOADING':
        return { 
          ...state, 
          ui: { ...state.ui, isLoading: action.payload } 
        };
      
      case 'TOGGLE_SIDEBAR':
        return { 
          ...state, 
          ui: { ...state.ui, sidebarOpen: !state.ui.sidebarOpen } 
        };
      
      case 'SET_MODAL':
        return { 
          ...state, 
          ui: { ...state.ui, modalOpen: action.payload } 
        };
      
      case 'RESET_STATE':
        return initialState;
      
      default:
        return state;
    }
  } catch (error) {
    errorTracker.reportError(error as Error, {
      component: 'AppReducer',
      action: action.type
    });
    return state;
  }
};

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};
