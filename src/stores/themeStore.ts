import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

type ThemeType = 'light' | 'dark' | 'system';

interface ThemeState {
    themeType: ThemeType;
    setTheme: (themeType: ThemeType) => void;
}

const useThemeStore = create<ThemeState>()(
    persist(
        (set) => ({
            themeType: 'system',
            setTheme: (themeType: ThemeType) => {
                set({ themeType });
            },
        }),
        {
            name: 'language',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);

export default useThemeStore;