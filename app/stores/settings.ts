import { defineStore, acceptHMRUpdate } from 'pinia'
import { watch } from 'vue'
import { Locale } from '~/types/setting'

export interface SettingsState {
    bodyguardCanProtectSelf: boolean
    bodyguardCanProtectSamePlayerOrTwoConsecutiveNights: boolean
    locale: Locale
}

const defaultSettings: SettingsState = {
    bodyguardCanProtectSelf: false,
    bodyguardCanProtectSamePlayerOrTwoConsecutiveNights: false,
    locale: Locale.VI,
}

export const useSettingsStore = defineStore('settings', {
    state: (): SettingsState => ({ ...defaultSettings }),

    getters: {
    },

    actions: {
        setLocale(newLocale: Locale) {
            this.locale = newLocale
        },

        resetToDefaults() {
            Object.assign(this, defaultSettings)
        },
    },

    persist: true,
})
