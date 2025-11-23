import { useSettingsStore } from '@/stores/settings'

export default defineNuxtPlugin(() => {
    const settings = useSettingsStore()
    const { setLocale } = useNuxtApp().$i18n

    if (settings.locale) {
        setLocale(settings.locale)
    }
})
