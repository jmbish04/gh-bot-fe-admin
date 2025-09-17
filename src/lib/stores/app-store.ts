import React from 'react';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type {
  UserPreferences,
  NotificationState,
  RepositoryFilters,
  CommandFilters,
  BestPracticeFilters,
  DashboardStats,
} from '@/types/api';

// Hydration state to prevent SSR mismatches
let isHydrated = false;

interface AppState {
  // Hydration state
  _hasHydrated: boolean;
  
  // UI State
  sidebarOpen: boolean;
  theme: 'light' | 'dark' | 'system';
  
  // User Preferences
  preferences: UserPreferences;
  
  // Notifications
  notifications: NotificationState[];
  unreadCount: number;
  
  // Filters
  repositoryFilters: RepositoryFilters;
  commandFilters: CommandFilters;
  bestPracticeFilters: BestPracticeFilters;
  
  // Dashboard State
  dashboardStats: DashboardStats | null;
  lastRefresh: number;
  
  // Loading States
  loading: {
    dashboard: boolean;
    research: boolean;
    commands: boolean;
    practices: boolean;
    operations: boolean;
  };
  
  // Error States
  errors: {
    dashboard: string | null;
    research: string | null;
    commands: string | null;
    practices: string | null;
    operations: string | null;
  };
}

interface AppActions {
  // UI Actions
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  
  // Preferences Actions
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  
  // Notification Actions
  addNotification: (notification: Omit<NotificationState, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  clearNotifications: () => void;
  
  // Filter Actions
  setRepositoryFilters: (filters: Partial<RepositoryFilters>) => void;
  setCommandFilters: (filters: Partial<CommandFilters>) => void;
  setBestPracticeFilters: (filters: Partial<BestPracticeFilters>) => void;
  resetFilters: () => void;
  
  // Dashboard Actions
  setDashboardStats: (stats: DashboardStats) => void;
  setLastRefresh: (timestamp: number) => void;
  
  // Loading Actions
  setLoading: (key: keyof AppState['loading'], loading: boolean) => void;
  setAllLoading: (loading: boolean) => void;
  
  // Error Actions
  setError: (key: keyof AppState['errors'], error: string | null) => void;
  clearErrors: () => void;
  
  // Utility Actions
  reset: () => void;
}

const defaultPreferences: UserPreferences = {
  theme: 'system',
  autoRefresh: true,
  refreshInterval: 30000,
  notifications: true,
  defaultFilters: {
    repositories: {
      minScore: 0.6,
      maxScore: 1.0,
      minStars: 0,
      maxStars: 1000000,
    },
    commands: {
      limit: 50,
    },
    practices: {
      status: 'pending',
    },
  },
};

const defaultFilters: {
  repositoryFilters: RepositoryFilters;
  commandFilters: CommandFilters;
  bestPracticeFilters: BestPracticeFilters;
} = {
  repositoryFilters: {
    minScore: 0.6,
    maxScore: 1.0,
    minStars: 0,
    maxStars: 1000000,
  },
  commandFilters: {
    limit: 50,
  },
  bestPracticeFilters: {
    status: 'pending',
  },
};

const initialState: AppState = {
  _hasHydrated: false,
  sidebarOpen: true,
  theme: 'system',
  preferences: defaultPreferences,
  notifications: [],
  unreadCount: 0,
  repositoryFilters: defaultFilters.repositoryFilters,
  commandFilters: defaultFilters.commandFilters,
  bestPracticeFilters: defaultFilters.bestPracticeFilters,
  dashboardStats: null,
  lastRefresh: 0,
  loading: {
    dashboard: false,
    research: false,
    commands: false,
    practices: false,
    operations: false,
  },
  errors: {
    dashboard: null,
    research: null,
    commands: null,
    practices: null,
    operations: null,
  },
};

export const useAppStore = create<AppState & AppActions>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,
        
        // UI Actions
        setSidebarOpen: (open) => set({ sidebarOpen: open }),
        toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
        setTheme: (theme) => {
          set({ theme });
          // Don't update localStorage here to prevent loops
        },
        
        // Preferences Actions
        updatePreferences: (preferences) =>
          set((state) => ({
            preferences: { ...state.preferences, ...preferences },
          })),
        
        // Notification Actions
        addNotification: (notification) => {
          const newNotification: NotificationState = {
            ...notification,
            id: crypto.randomUUID(),
            timestamp: Date.now(),
          };
          set((state) => ({
            notifications: [newNotification, ...state.notifications],
            unreadCount: state.unreadCount + 1,
          }));
        },
        removeNotification: (id) =>
          set((state) => ({
            notifications: state.notifications.filter((n) => n.id !== id),
            unreadCount: Math.max(0, state.unreadCount - 1),
          })),
        markNotificationAsRead: (id) =>
          set((state) => ({
            notifications: state.notifications.map((n) =>
              n.id === id ? { ...n, read: true } : n
            ),
            unreadCount: Math.max(0, state.unreadCount - 1),
          })),
        markAllNotificationsAsRead: () =>
          set((state) => ({
            notifications: state.notifications.map((n) => ({ ...n, read: true })),
            unreadCount: 0,
          })),
        clearNotifications: () => set({ notifications: [], unreadCount: 0 }),
        
        // Filter Actions
        setRepositoryFilters: (filters) =>
          set((state) => ({
            repositoryFilters: { ...state.repositoryFilters, ...filters },
          })),
        setCommandFilters: (filters) =>
          set((state) => ({
            commandFilters: { ...state.commandFilters, ...filters },
          })),
        setBestPracticeFilters: (filters) =>
          set((state) => ({
            bestPracticeFilters: { ...state.bestPracticeFilters, ...filters },
          })),
        resetFilters: () =>
          set({
            repositoryFilters: defaultFilters.repositoryFilters,
            commandFilters: defaultFilters.commandFilters,
            bestPracticeFilters: defaultFilters.bestPracticeFilters,
          }),
        
        // Dashboard Actions
        setDashboardStats: (stats) => set({ dashboardStats: stats }),
        setLastRefresh: (timestamp) => set({ lastRefresh: timestamp }),
        
        // Loading Actions
        setLoading: (key, loading) =>
          set((state) => ({
            loading: { ...state.loading, [key]: loading },
          })),
        setAllLoading: (loading) =>
          set((state) => ({
            loading: Object.keys(state.loading).reduce(
              (acc, key) => ({ ...acc, [key]: loading }),
              {} as AppState['loading']
            ),
          })),
        
        // Error Actions
        setError: (key, error) =>
          set((state) => ({
            errors: { ...state.errors, [key]: error },
          })),
        clearErrors: () =>
          set({
            errors: {
              dashboard: null,
              research: null,
              commands: null,
              practices: null,
              operations: null,
            },
          }),
        
        // Utility Actions
        reset: () => set(initialState),
      }),
      {
        name: 'github-bot-app-store',
        partialize: (state) => ({
          theme: state.theme,
          preferences: state.preferences,
          sidebarOpen: state.sidebarOpen,
        }),
        onRehydrateStorage: () => (state, error) => {
          if (error) {
            console.warn('Zustand rehydration error:', error);
          }
          if (state) {
            state._hasHydrated = true;
          }
        },
        // Add storage configuration to prevent SSR issues
        storage: typeof window !== 'undefined' ? {
          getItem: (name) => {
            const value = localStorage.getItem(name);
            return value ? JSON.parse(value) : null;
          },
          setItem: (name, value) => {
            localStorage.setItem(name, JSON.stringify(value));
          },
          removeItem: (name) => {
            localStorage.removeItem(name);
          },
        } : {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        },
      }
    ),
    {
      name: 'github-bot-app-store',
    }
  )
);

// Hydration hook with fallback
export const useHydration = () => {
  const hasHydrated = useAppStore((state) => state._hasHydrated);
  const [mounted, setMounted] = React.useState(false);
  
  React.useEffect(() => {
    setMounted(true);
  }, []);
  
  // Return true only if we're mounted on the client and Zustand has hydrated
  return mounted && hasHydrated;
};

// Selectors for common state access patterns
export const useSidebar = () => useAppStore((state) => ({
  isOpen: state.sidebarOpen,
  toggle: state.toggleSidebar,
  setOpen: state.setSidebarOpen,
}));

export const useTheme = () => useAppStore((state) => ({
  theme: state.theme,
  setTheme: state.setTheme,
}));

export const useNotifications = () => {
  return useAppStore((state) => ({
    notifications: state.notifications || [],
    unreadCount: state.unreadCount || 0,
    addNotification: state.addNotification,
    removeNotification: state.removeNotification,
    markAsRead: state.markNotificationAsRead,
    markAllAsRead: state.markAllNotificationsAsRead,
    clearNotifications: state.clearNotifications,
  }));
};

export const useFilters = () => useAppStore((state) => ({
  repository: {
    filters: state.repositoryFilters,
    setFilters: state.setRepositoryFilters,
  },
  command: {
    filters: state.commandFilters,
    setFilters: state.setCommandFilters,
  },
  bestPractice: {
    filters: state.bestPracticeFilters,
    setFilters: state.setBestPracticeFilters,
  },
  reset: state.resetFilters,
}));

export const useLoading = () => useAppStore((state) => ({
  loading: state.loading,
  setLoading: state.setLoading,
  setAllLoading: state.setAllLoading,
}));

export const useErrors = () => useAppStore((state) => ({
  errors: state.errors,
  setError: state.setError,
  clearErrors: state.clearErrors,
}));
