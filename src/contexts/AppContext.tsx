
import React, { createContext, useContext, useReducer, ReactNode } from 'react';

interface AppState {
  user: {
    id: string;
    name: string;
    role: 'admin' | 'dentist' | 'patient' | 'staff';
    clinicId?: string;
  } | null;
  selectedClinic: string | null;
  theme: 'light' | 'dark' | 'system';
  notifications: Array<{
    id: string;
    type: 'info' | 'success' | 'warning' | 'error';
    message: string;
    timestamp: string;
  }>;
}

type AppAction =
  | { type: 'SET_USER'; payload: AppState['user'] }
  | { type: 'SET_SELECTED_CLINIC'; payload: string | null }
  | { type: 'SET_THEME'; payload: AppState['theme'] }
  | { type: 'ADD_NOTIFICATION'; payload: Omit<AppState['notifications'][0], 'id' | 'timestamp'> }
  | { type: 'REMOVE_NOTIFICATION'; payload: string }
  | { type: 'CLEAR_NOTIFICATIONS' };

const initialState: AppState = {
  user: null,
  selectedClinic: null,
  theme: 'system',
  notifications: []
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    
    case 'SET_SELECTED_CLINIC':
      return { ...state, selectedClinic: action.payload };
    
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [
          ...state.notifications,
          {
            ...action.payload,
            id: Date.now().toString(),
            timestamp: new Date().toISOString()
          }
        ]
      };
    
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload)
      };
    
    case 'CLEAR_NOTIFICATIONS':
      return { ...state, notifications: [] };
    
    default:
      return state;
  }
};

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  actions: {
    setUser: (user: AppState['user']) => void;
    setSelectedClinic: (clinicId: string | null) => void;
    setTheme: (theme: AppState['theme']) => void;
    addNotification: (notification: Omit<AppState['notifications'][0], 'id' | 'timestamp'>) => void;
    removeNotification: (id: string) => void;
    clearNotifications: () => void;
  };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const actions = {
    setUser: (user: AppState['user']) => dispatch({ type: 'SET_USER', payload: user }),
    setSelectedClinic: (clinicId: string | null) => dispatch({ type: 'SET_SELECTED_CLINIC', payload: clinicId }),
    setTheme: (theme: AppState['theme']) => dispatch({ type: 'SET_THEME', payload: theme }),
    addNotification: (notification: Omit<AppState['notifications'][0], 'id' | 'timestamp'>) => 
      dispatch({ type: 'ADD_NOTIFICATION', payload: notification }),
    removeNotification: (id: string) => dispatch({ type: 'REMOVE_NOTIFICATION', payload: id }),
    clearNotifications: () => dispatch({ type: 'CLEAR_NOTIFICATIONS' })
  };

  return (
    <AppContext.Provider value={{ state, dispatch, actions }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
