<template>
    <div class="space-y-6" :class="{ 'opacity-60': isDisabled }">
        <!-- Werewolf Header -->
        <div class="bg-gradient-to-r from-red-700 to-red-900 text-white rounded-xl p-6 shadow-lg" :class="{ 'opacity-75': isDisabled }">
            <div class="flex items-center gap-2 mb-2">
                <h2 class="text-3xl font-bold">🐺 Werewolf Night Action</h2>
                <span v-if="isDisabled" class="text-2xl">☠️</span>
            </div>
            <p class="text-red-50">Choose a player to eliminate during the night</p>
            <p v-if="isDisabled" class="text-sm mt-2 font-semibold bg-red-700 bg-opacity-50 inline-block px-2 py-1 rounded">
                (Player is dead - actions disabled)
            </p>
        </div>

        <!-- Current Status -->
        <div class="bg-white rounded-xl p-6 shadow-md border-2 border-red-200">
            <div class="grid grid-cols-2 gap-4">
                <div class="text-center">
                    <p class="text-sm font-medium text-gray-600">Alive Players</p>
                    <p class="text-2xl font-bold text-red-600">{{ gameStore.alivePlayersWithDetails.length }}</p>
                </div>
                <div class="text-center">
                    <p class="text-sm font-medium text-gray-600">Selected Target</p>
                    <p class="text-2xl font-bold text-green-600">{{ selectedTarget ? '✓' : '-' }}</p>
                </div>
            </div>
        </div>

        <!-- Player Selection Grid -->
        <div class="bg-white rounded-xl p-6 shadow-md border-2 border-gray-200">
            <h3 class="text-lg font-bold text-gray-800 mb-4">Select a player to kill:</h3>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
        </div>

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

