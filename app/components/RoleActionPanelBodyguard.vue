<template>
    <div :class="{ 'opacity-60': isDisabled }">
        <!-- Body Guard Header -->
        <ion-card class="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-xl p-6 shadow-lg" :class="{ 'opacity-75': isDisabled }">
            <ion-card-title>
                <h2 class="text-white">🛡️ {{ $t('roleActions.bodyguard.title')}}</h2>
            </ion-card-title>
            <ion-card-content class="text-blue-50">
                <span v-if="isDisabled" class="text-2xl">☠️</span>
                <ion-text>
                    Choose a player to protect from death during the night
                </ion-text>
                <ion-text
                    v-if="!settingsStore.bodyguardCanProtectSelf"
                    class="font-semibold"
                    color="danger"
                >
                    (cannot protect yourself)
                </ion-text>
                <ion-text
                    v-if="isDisabled"
                    class="text-sm mt-2 font-semibold bg-red-700 bg-opacity-50 inline-block px-2 py-1 rounded"
                >
                    (Player is dead - actions disabled)
                </ion-text>
            </ion-card-content>
        </ion-card>

        <!-- Protection Info -->
        <ion-card v-if="selectedTarget" class="bg-gradient-to-r from-blue-100 to-blue-50 rounded-xl p-6 shadow-md border-2 border-blue-400">
            <ion-card-header>
                <ion-text>
                    <h2 class="text-xl font-bold text-blue-900">
                        🛡️ Protection Plan
                    </h2>
                </ion-text>
            </ion-card-header>
            <ion-card-content class="text-blue-800">
                <ion-text>
                    <ion-text class="font-bold">{{ getPlayerName(selectedTarget) }}</ion-text>
                    will be protected from death tonight
                </ion-text>
                <br>
                <ion-text class="text-blue-700">
                    If this player is targeted by werewolves, they will survive
                </ion-text>
            </ion-card-content>
        </ion-card>

        <ion-card>
            <ion-card-header>

            </ion-card-header>
            <ion-card-content>
                <!-- Player Selection Grid -->
                <ion-list class="ion-hide-sm-up">
                    <ion-item
                        v-for="player in availablePlayers"
                        :key="player.id"
                        lines="none"
                    >
                        <ion-avatar slot="start">
                            <img
                                v-if="player.avatar"
                                :src="player.avatar"
                                :alt="player.name"
                            />
                        </ion-avatar>
                        <ion-checkbox
                            :checked="selectedTarget === player.id"
                            :disabled="isDisabled || player.id === gameStore.yesterdayBodyguardProtectToPlayerId"
                            @ion-change="selectPlayer(player.id)"
                        >
                            {{ player.name }}
                        </ion-checkbox>
                    </ion-item>
                </ion-list>
                <div class="bg-white rounded-xl p-6 shadow-md border-2 border-gray-200 ion-hide-sm-down">
                    <h3 class="text-lg font-bold text-gray-800 mb-4">Select a player to protect:</h3>

                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <button
                            v-for="player in availablePlayers"
                            :key="player.id"
                            @click="selectPlayer(player.id)"
                            :disabled="isDisabled || player.id === gameStore.yesterdayBodyguardProtectToPlayerId"
                            :class="[
                                'p-4 rounded-lg border-2 transition-all duration-200 flex flex-col items-center gap-3',
                                isDisabled
                                    ? 'border-gray-300 bg-gray-100 cursor-not-allowed opacity-50'
                                    : selectedTarget === player.id
                                        ? 'border-blue-600 bg-blue-50 shadow-lg'
                                        : 'border-gray-300 bg-white hover:border-blue-400'
                            ]"
                        >
                            <!-- Player Avatar -->
                            <img
                                v-if="player.avatar"
                                :src="player.avatar"
                                :alt="player.name"
                                class="w-16 h-16 rounded-full object-cover"
                            />
                            <div
                                v-else
                                class="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-white flex items-center justify-center font-bold text-2xl"
                            >
                                {{ player.name.charAt(0).toUpperCase() }}
                            </div>

                            <!-- Player Name -->
                            <p class="font-bold text-gray-900 text-center">{{ player.name }}</p>

                            <!-- Selection Indicator -->
                            <div v-if="selectedTarget === player.id" class="text-2xl animate-pulse">
                                🛡️
                            </div>
                        </button>
                    </div>

                    <!-- No Players Available -->
                    <div v-if="availablePlayers.length === 0" class="text-center py-8 text-gray-500">
                        <p class="text-lg font-medium">No other players available to protect</p>
                    </div>
                </div>
            </ion-card-content>
        </ion-card>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useGameStore } from '~/stores/game'
import { usePlayersStore } from '~/stores/players'
import type { Player } from "~/types";
import { useSettingsStore } from "~/stores/settings";

interface Props {
    isDisabled?: boolean
}

interface Emits {
    (e: 'confirm', action: { targetPlayerId: string }): void
    (e: 'skip'): void
}

withDefaults(defineProps<Props>(), {
    isDisabled: false,
})

const emit = defineEmits<Emits>()

const gameStore = useGameStore()
const playersStore = usePlayersStore()
const settingsStore = useSettingsStore()

const selectedTarget = ref<string>('')

// Get current Body Guard player
const currentBodyGuard = computed(() => {
    const bodyguardId = Object.entries(gameStore.playerRoles).find(
        ([, roleId]) => roleId === 'bodyguard'
    )?.[0]
    return bodyguardId
})

// Available players (alive + cannot be self)
const availablePlayers = computed(() => {
    return gameStore.alivePlayersWithDetails.filter((player: Player) => {
        if (
            !settingsStore.bodyguardCanProtectSelf
            && player.id == currentBodyGuard.value
        ) {
            return false
        }

        if (
            !settingsStore.bodyguardCanProtectSamePlayerOrTwoConsecutiveNights
            && player.id === gameStore.yesterdayBodyguardProtectToPlayerId
        ) {
            return false
        }

        return true
    })
})

/**
 * Get player name by ID
 */
const getPlayerName = (playerId: string): string => {
    return playersStore.getPlayerById(playerId)?.name || 'Unknown'
}

/**
 * Select a player to protect
 */
const selectPlayer = (playerId: string) => {
    selectedTarget.value = selectedTarget.value === playerId ? '' : playerId
}

/**
 * Confirm the protection action
 */
const confirmAction = () => {
    if (selectedTarget.value) {
        emit('confirm', {
            targetPlayerId: selectedTarget.value,
        })
        selectedTarget.value = ''
    }
}

/**
 * Skip the action
 */
const skipAction = () => {
    emit('skip')
    selectedTarget.value = ''
}

/**
 * Exposed method for parent component to submit action
 */
const submitAction = () => {
    confirmAction()
}

/**
 * Exposed method for parent component to skip action
 */
const skipActionExposed = () => {
    skipAction()
}

// Expose methods to parent
defineExpose({
    submitAction,
    skipActionExposed,
})
</script>

