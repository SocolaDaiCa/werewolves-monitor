<template>
    <div :class="{ 'opacity-60': isDisabled }">
        <!-- Werewolf Header -->
        <ion-card class="bg-gradient-to-r from-red-700 to-red-900 text-white rounded-xl p-6 shadow-lg" :class="{ 'opacity-75': isDisabled }">
            <ion-card-title>
                <h2 class="text-white">🐺 {{ $t('roleActions.wolf.title')}}</h2>
            </ion-card-title>
            <ion-card-content class="text-red-50">
                <span v-if="isDisabled" class="text-2xl">☠️</span>
                <ion-text>
                    Choose a player to eliminate during the night
                </ion-text>
                <ion-text
                    v-if="isDisabled"
                    class="text-sm mt-2 font-semibold bg-red-700 bg-opacity-50 inline-block px-2 py-1 rounded"
                >
                    (Player is dead - actions disabled)
                </ion-text>
            </ion-card-content>
        </ion-card>
        <ion-card>
            <ion-card-header>
                <h2>Select a player to kill:</h2>
            </ion-card-header>
            <ion-card-content>
                <!-- Player Selection Grid -->

                <ion-list class="ion-hide-sm-up">
                    <ion-item
                        v-for="player in gameStore.alivePlayersWithDetails"
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
                            :disabled="isDisabled"
                            @ion-change="selectPlayer(player.id)"
                        >
                            {{ player.name }}
                        </ion-checkbox>
                    </ion-item>
                </ion-list>

                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ion-hide-sm-down">
                    <button
                        v-for="player in gameStore.alivePlayersWithDetails"
                        :key="player.id"
                        @click="selectPlayer(player.id)"
                        :disabled="isDisabled"
                        :class="[
                        'p-4 rounded-lg border-2 transition-all duration-200 flex flex-col items-center gap-3',
                        isDisabled
                            ? 'border-gray-300 bg-gray-100 cursor-not-allowed opacity-50'
                            : selectedTarget === player.id
                                ? 'border-red-600 bg-red-50 shadow-lg'
                                : 'border-gray-300 bg-white hover:border-red-400'
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
                            ☠️
                        </div>
                    </button>
                </div>

                <!-- No Players Available -->
                <div v-if="gameStore.alivePlayersWithDetails.length === 0" class="text-center py-8 text-gray-500">
                    <p class="text-lg font-medium">No players available to target</p>
                </div>
            </ion-card-content>
        </ion-card>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useGameStore } from '~/stores/game'
import { usePlayersStore } from '~/stores/players'

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

const selectedTarget = ref<string>(gameStore.currentDayOrNightAction?.werewolfKillToPlayerId || '')

/**
 * Select a player to kill
 */
const selectPlayer = (playerId: string) => {
    selectedTarget.value = selectedTarget.value === playerId ? '' : playerId
}

/**
 * Confirm the kill action
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

