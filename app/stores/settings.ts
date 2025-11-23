import { defineStore } from 'pinia'

export interface SettingsState {
  bodyguardCanProtectSelf: boolean
  bodyguardCanProtectSamePlayerOrTwoConsecutiveNights: boolean
}

const defaultSettings: SettingsState = {
  bodyguardCanProtectSelf: false,
  bodyguardCanProtectSamePlayerOrTwoConsecutiveNights: false,
}

export const useSettingsStore = defineStore('settings', {
  state: (): SettingsState => ({ ...defaultSettings }),

  getters: {
  },

  actions: {
    resetToDefaults() {
      Object.assign(this, defaultSettings)
    },
  },

  persist: true,
})

