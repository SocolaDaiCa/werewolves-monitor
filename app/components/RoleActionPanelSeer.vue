<template>
    <div :class="{ 'opacity-60': isDisabled }">
        <!-- Seer Header -->
        <ion-card class="bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-xl p-6 shadow-lg" :class="{ 'opacity-75': isDisabled }">
            <ion-card-title>
                <h2 class="text-white">🔮 {{ $t('roleActions.seer.title')}}</h2>
            </ion-card-title>
            <ion-card-content class="text-purple-50">
                <span v-if="isDisabled" class="text-2xl">☠️</span>
                <ion-text>
                    Choose a player to investigate - are they a werewolf or a villager?
                </ion-text>
                <ion-text
                    v-if="isDisabled"
                    class="text-sm mt-2 font-semibold bg-red-700 bg-opacity-50 inline-block px-2 py-1 rounded"
                >
                    (Player is dead - actions disabled)
                </ion-text>
            </ion-card-content>
        </ion-card>

        <!-- Investigation Result Display -->
        <ion-card
            class="bg-gradient-to-r border-2"
            :class="investigationResult?.isWerewolf ? 'from-red-100 to-red-50 border-red-400' : 'from-green-100 to-green-50 border-green-400'"
        >
            <ion-card-header>
                <h2 :class="investigationResult?.isWerewolf ? 'text-red-900' : 'text-green-900'">
                    🔍 Investigation Complete
                </h2>
            </ion-card-header>
            <ion-card-content>
                <p class="text-lg mb-2" :class="investigationResult.isWerewolf ? 'text-red-800' : 'text-green-800'">
                    <span class="font-bold">{{ getPlayerName(selectedTarget) }}</span> is a
                    <span class="font-bold">{{ investigationResult.isWerewolf ? 'WEREWOLF 🐺' : 'VILLAGER 👤' }}</span>
                </p>
                <p class="text-sm" :class="investigationResult.isWerewolf ? 'text-red-700' : 'text-green-700'">
                    {{ investigationResult.isWerewolf ? 'Be careful, this player is dangerous!' : 'This player is safe.' }}
                </p>
            </ion-card-content>
        </ion-card>
        <ion-card>
            <ion-card-header>
                <h2>Select a player to investigate:</h2>
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
                                ? 'border-purple-600 bg-purple-50 shadow-lg'
                                : 'border-gray-300 bg-white hover:border-purple-400'
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
                            class="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 text-white flex items-center justify-center font-bold text-2xl"
                        >
                            {{ player.name.charAt(0).toUpperCase() }}
                        </div>

                        <!-- Player Name -->
                        <p class="font-bold text-gray-900 text-center">{{ player.name }}</p>

                        <!-- Selection Indicator -->
                        <div v-if="selectedTarget === player.id" class="text-2xl animate-pulse">
                            🔮
                        </div>
                    </button>
                </div>

                <!-- No Players Available -->
                <div v-if="gameStore.alivePlayersWithDetails.length === 0" class="text-center py-8 text-gray-500">
                    <p class="text-lg font-medium">No players available to investigate</p>
                </div>
            </ion-card-content>
        </ion-card>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useGameStore } from '~/stores/game'
import { usePlayersStore } from '~/stores/players'
import { useRolesStore } from '~/stores/roles'
import { RoleFaction } from '~/types/role'

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
const rolesStore = useRolesStore()

const selectedTarget = ref<string>('')
const investigationResult = ref<{ isWerewolf: boolean } | null>(null)

/**
 * Get player name by ID
 */
const getPlayerName = (playerId: string): string => {
    return playersStore.getPlayerById(playerId)?.name || 'Unknown'
}

/**
 * Select a player to investigate
 */
const selectPlayer = (playerId: string) => {
    selectedTarget.value = selectedTarget.value === playerId ? '' : playerId

    // Simulate investigation result
    if (selectedTarget.value) {
        const targetRole = gameStore.playerRoles[selectedTarget.value] || ''
        const targetRoleObj = rolesStore.getRoleById(targetRole)
        const isWerewolf = targetRoleObj?.faction === RoleFaction.WEREWOLF

        investigationResult.value = { isWerewolf }
    } else {
        investigationResult.value = null
    }
}

/**
 * Confirm the investigation action
 */
const confirmAction = () => {
    if (selectedTarget.value) {
        emit('confirm', {
            targetPlayerId: selectedTarget.value,
        })
        selectedTarget.value = ''
        investigationResult.value = null
    }
}

/**
 * Skip the action
 */
const skipAction = () => {
    emit('skip')
    selectedTarget.value = ''
    investigationResult.value = null
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

