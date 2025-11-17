<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-back-button default-href="/"></ion-back-button>
                </ion-buttons>
                <ion-title>{{ $t('gameSetup.title') }}</ion-title>
                <ion-buttons slot="end">
                    <ion-button :disabled="!isValid" @click="startGame">
                        {{ $t('gameSetup.startGameBtn') }}
                    </ion-button>
                </ion-buttons>
            </ion-toolbar>
        </ion-header>
        <ion-content>
            <div class="bg-gradient-to-b from-slate-50 to-white">
                <!-- Content -->
                <div class="px-6 py-8 max-w-7xl mx-auto">
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <!-- Player Selection Panel -->
                        <div class="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                            <PlayerSelector />
                        </div>

                        <!-- Role Confirmation Panel -->
                        <div class="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                            <RoleConfirmation />
                        </div>
                    </div>

                    <!-- Validation Summary (Mobile View) -->
                    <div class="lg:hidden mt-8">
                        <div
                            :class="[
                                'rounded-xl p-4 border-2',
                                isValid
                                    ? 'bg-green-50 border-green-300'
                                    : 'bg-red-50 border-red-300'
                            ]"
                        >
                            <div class="flex gap-3">
                                <div class="text-3xl">{{ isValid ? '✅' : '⚠️' }}</div>
                                <div>
                                    <p
                                        :class="[
                                            'font-semibold',
                                            isValid ? 'text-green-800' : 'text-red-800'
                                        ]"
                                    >
                                        {{ isValid ? 'Ready to Start!' : 'Fix Mismatches' }}
                                    </p>
                                    <p
                                        class="text-sm mt-1"
                                        :class="{
                                            'text-green-700': (isValid ? 1 : 0),
                                            'text-red-700': (isValid ? 0 : 1)
                                        }"
                                    >
                                        {{ validationMessage }}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ion-content>
        <ion-footer class="ion-no-border">
            <ion-toolbar>
            </ion-toolbar>
        </ion-footer>
    </ion-page>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useGameStore } from '~/stores/game'
import { useRolesStore } from '~/stores/roles'
import { usePlayersStore } from '~/stores/players'
import PlayerSelector from '~/components/PlayerSelector.vue'
import RoleConfirmation from '~/components/RoleConfirmation.vue'

const gameStore = useGameStore()
const rolesStore = useRolesStore()
const playersStore = usePlayersStore()
const router = useRouter()

// Computed properties
const totalRoles = computed(() => rolesStore.totalRoleCount)

const isValid = computed<boolean>(() => {
    // Ensure we're watching the reactive object and all its properties
    // by accessing Object.keys which forces full object reactivity
    Object.keys(rolesStore.selectedRoles)
    return playersStore.selectedPlayers.length === totalRoles.value && totalRoles.value > 0 && playersStore.selectedPlayers.length >= 2
})

const validationMessage = computed(() => {
    const selectedCount = playersStore.selectedPlayers.length
    if (selectedCount === 0 || totalRoles.value === 0) {
        return 'Please select players and configure roles'
    }
    if (selectedCount !== totalRoles.value) {
        const diff = Math.abs(selectedCount - totalRoles.value)
        return selectedCount > totalRoles.value
            ? `Need ${diff} more role(s)`
            : `Too many role(s) by ${diff}`
    }
    return 'All set! Ready to begin'
})

// Start game handler
async function startGame() {
    if (!isValid.value) return

    try {
        // Initialize game with selected players and roles
        console.log('playersStore.selectedPlayerIds', playersStore.selectedPlayerIds)
        console.log('rolesStore.selectedRoles', rolesStore.selectedRoles)
        gameStore.initializeGame(
            playersStore.selectedPlayerIds,
            rolesStore.selectedRoles
        )

        // Navigate to night zero (role reveal) page
        await router.push('/night-zero')
    } catch (error) {
        console.error('Failed to start game:', error)
    }
}
</script>

