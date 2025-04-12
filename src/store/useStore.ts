// stores/themeStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type ThemeState = {
  mode: 'light' | 'dark';
  toggleTheme: () => void;
  hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      mode: 'light',
      toggleTheme: () =>
        set((state) => ({
          mode: state.mode === 'light' ? 'dark' : 'light',
        })),
      hasHydrated: false,
      setHasHydrated: (state) => set({ hasHydrated: state }),
    }),
    {
      name: 'theme-mode',
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true); 
      },
    }
  )
);
