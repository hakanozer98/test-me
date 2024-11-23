import { config } from '@tamagui/config/v3'
import { createTamagui } from 'tamagui'
import * as themes from './src/themes/theme-output'
import { tokens } from '@tamagui/config/v3'

const appConfig = createTamagui({
  tokens,
  themes,
  config
})

export type AppConfig = typeof appConfig

declare module 'tamagui' {
  // or '@tamagui/core'
  // overrides TamaguiCustomConfig so your custom types
  // work everywhere you import `tamagui`
  interface TamaguiCustomConfig extends AppConfig {}
}

export default appConfig