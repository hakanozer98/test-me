import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { SplashScreen, Stack } from 'expo-router'
import { TamaguiProvider } from 'tamagui'
import tamaguiConfig from '../../tamagui.config'
import { useFonts } from 'expo-font';
import useThemeStore from '../stores/themeStore'
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const { themeType } = useThemeStore();

  const [loaded] = useFonts({
    Inter: require('../assets/fonts/Inter-Medium.otf'),
    InterBold: require('../assets/fonts/Inter-Bold.otf')
  })

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync()
    }
  }, [loaded])

  if (!loaded) {
    return null
  }


  return (
    <TamaguiProvider config={tamaguiConfig} defaultTheme={themeType}>
      <ThemeProvider value={themeType === 'dark' ? DarkTheme : DefaultTheme}>
        <StatusBar style={themeType === 'dark' ? 'light' : 'dark'} />
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="quiz" options={{ headerShown: false }} />
        </Stack>
      </ThemeProvider>
    </TamaguiProvider>
  )
}