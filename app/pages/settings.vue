<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-back-button default-href="/" />
                </ion-buttons>
                <ion-title>{{ $t('settings.title') }}</ion-title>
                <ion-buttons slot="end">
                    <!-- Reset Button -->
                    <IonButton
                        @click="handleResetSettings"
                    >
                        <ion-icon :icon="refreshOutline" slot="start" />
                        Reset
                    </IonButton>
                </ion-buttons>
            </ion-toolbar>
        </ion-header>

        <ion-content>
            <!-- Bodyguard Settings Section -->
            <ion-card>
                <ion-card-header>
                    <ion-card-title>{{ $t('settings.bodyguardRules') }}</ion-card-title>
                    <ion-card-subtitle>{{ $t('settings.bodyguardRulesDescription') }}</ion-card-subtitle>
                </ion-card-header>

                <ion-card-content>
                    <ion-list>
                        <!-- Can Protect Self -->
                        <ion-item>
                            <ion-toggle
                                v-model="canProtectSelf"
                                @ion-change="updateCanProtectSelf"
                                class="mt-3"
                            >
                                <ion-label class="ion-text-wrap">🛡️ {{ $t('settings.canProtectSelf') }}</ion-label>
                                <ion-note color="medium" class="ion-text-wrap">{{ $t('settings.canProtectSelfDescription') }}</ion-note>
                            </ion-toggle>
                        </ion-item>
                        <!-- Can Protect Same Player Or Two Consecutive Nights -->
                        <ion-item>
                            <IonToggle
                                v-model="canProtectSameOrConsecutive"
                                @ion-change="updateCanProtectSameOrConsecutive"
                            >
                                <ion-label color="medium" class="ion-text-wrap">🔄 {{ $t('settings.canProtectSameOrConsecutive') }}</ion-label>
                                <ion-note color="medium" class="ion-text-wrap">
                                    {{ $t('settings.canProtectSameOrConsecutiveDescription') }}
                                </ion-note>
                            </IonToggle>
                        </ion-item>
                    </ion-list>
                </ion-card-content>
            </ion-card>
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import {
    IonPage,
    IonHeader,
    IonContent,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonBackButton,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonToggle,
    IonItemDivider,
    IonButton,
    IonIcon,
} from '@ionic/vue'
import { refreshOutline } from 'ionicons/icons'
import { ref, onMounted } from 'vue'
import { useSettingsStore } from '~/stores/settings'
import {
    SettingBodyguardCanProtectSelf,
    SettingBodyguardCanProtectSamePlayerOrTwoConsecutiveNights,
} from '~/types/setting'

const settingsStore = useSettingsStore()

const canProtectSelf = ref(settingsStore.isBodyguardCanProtectSelf)
const canProtectSameOrConsecutive = ref(
    settingsStore.isBodyguardCanProtectSamePlayerOrTwoConsecutiveNights
)

const updateCanProtectSelf = () => {
    settingsStore.setBodyguardCanProtectSelf(
        canProtectSelf.value ? SettingBodyguardCanProtectSelf.YES : SettingBodyguardCanProtectSelf.NO
    )
}

const updateCanProtectSameOrConsecutive = () => {
    settingsStore.setBodyguardCanProtectSamePlayerOrTwoConsecutiveNights(
        canProtectSameOrConsecutive.value
            ? SettingBodyguardCanProtectSamePlayerOrTwoConsecutiveNights.YES
            : SettingBodyguardCanProtectSamePlayerOrTwoConsecutiveNights.NO
    )
}

const handleResetSettings = () => {
    settingsStore.resetToDefaults()
    canProtectSelf.value = settingsStore.isBodyguardCanProtectSelf
    canProtectSameOrConsecutive.value =
        settingsStore.isBodyguardCanProtectSamePlayerOrTwoConsecutiveNights
}

onMounted(() => {
    // Settings will be automatically loaded from store
    canProtectSelf.value = settingsStore.isBodyguardCanProtectSelf
    canProtectSameOrConsecutive.value =
        settingsStore.isBodyguardCanProtectSamePlayerOrTwoConsecutiveNights
})
</script>

<style scoped>
/* .setting-item {
  padding: 0.5rem 0;
}

.mb-6 {
  margin-bottom: 1.5rem;
}

.mb-2 {
  margin-bottom: 0.5rem;
}

.mb-3 {
  margin-bottom: 0.75rem;
}

.mt-1 {
  margin-top: 0.25rem;
}

.mt-3 {
  margin-top: 0.75rem;
}

.mt-6 {
  margin-top: 1.5rem;
}

.mt-8 {
  margin-top: 2rem;
}

.text-sm {
  font-size: 0.875rem;
}

.text-lg {
  font-size: 1.125rem;
}

.text-gray-600 {
  color: #4b5563;
}

.text-gray-700 {
  color: #2c3e50;
}

.text-gray-800 {
  color: #1a202c;
}

.font-semibold {
  font-weight: 600;
}

.font-bold {
  font-weight: 700;
}

.flex {
  display: flex;
}

.items-center {
  align-items: center;
}

.justify-between {
  justify-content: space-between;
} */
</style>

