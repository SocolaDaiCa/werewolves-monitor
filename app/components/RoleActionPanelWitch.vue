<template>
  <div class="space-y-6" :class="{ 'opacity-60': isDisabled }">
    <!-- Witch Header -->
    <div class="bg-gradient-to-r from-amber-600 to-orange-700 text-white rounded-xl p-6 shadow-lg" :class="{ 'opacity-75': isDisabled }">
      <div class="flex items-center gap-2 mb-2">
        <h2 class="text-3xl font-bold">⚗️ Witch's Potions</h2>
        <span v-if="isDisabled" class="text-2xl">☠️</span>
      </div>
      <p class="text-amber-50">You can heal the player killed by werewolves tonight, poison someone, or skip. Each potion can be used once per game.</p>
      <p v-if="isDisabled" class="text-sm mt-2 font-semibold bg-red-700 bg-opacity-50 inline-block px-2 py-1 rounded">
        (Player is dead - actions disabled)
      </p>
    </div>

    <!-- Potion Status & Killed Player Info -->
    <div class="bg-white rounded-xl p-6 shadow-md border-2 border-amber-200">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Potion Status -->
        <div>
          <p class="text-sm font-medium text-gray-600 mb-4">Potion Status</p>
          <div class="space-y-2">
            <div class="flex justify-between items-center p-2 rounded bg-gray-50">
              <span class="text-sm text-gray-700">Healing Potion</span>
              <span class="text-sm font-bold" :class="gameStore.witchHealUsed ? 'text-red-600' : 'text-green-600'">
                {{ gameStore.witchHealUsed ? '✗ Used' : '✓ Available' }}
              </span>
            </div>
            <div class="flex justify-between items-center p-2 rounded bg-gray-50">
              <span class="text-sm text-gray-700">Poison Potion</span>
              <span class="text-sm font-bold" :class="gameStore.witchPoisonUsed ? 'text-red-600' : 'text-green-600'">
                {{ gameStore.witchPoisonUsed ? '✗ Used' : '✓ Available' }}
              </span>
            </div>
          </div>
        </div>

        <!-- Player Killed Info -->
        <div>
          <p class="text-sm font-medium text-gray-600 mb-4">Tonight's Kill</p>
          <div v-if="killedPlayer" class="p-4 rounded-lg bg-red-50 border-2 border-red-300">
            <p class="text-xs text-red-600 font-semibold mb-2">PLAYER KILLED:</p>
            <p class="text-lg font-bold text-red-900">{{ killedPlayer.name }} 💀</p>
            <p class="text-xs text-red-700 mt-1">You can heal this player</p>
          </div>
          <div v-else class="p-4 rounded-lg bg-blue-50 border-2 border-blue-300">
            <p class="text-xs text-blue-600 font-semibold mb-2">NO KILL DETECTED:</p>
            <p class="text-sm text-blue-900">No one was killed tonight</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Healing Option -->
    <div class="bg-white rounded-xl p-6 shadow-md border-2 border-gray-200">
      <h3 class="text-lg font-bold text-gray-800 mb-4">💚 Healing Potion</h3>
      <p class="text-sm text-gray-600 mb-4">
        {{ gameStore.witchHealUsed ? '❌ Already used' : '✓ Available' }}
      </p>

      <div v-if="!gameStore.witchHealUsed && killedPlayer" class="flex justify-center">
        <button
          @click="selectedHealTarget = selectedHealTarget === killedPlayer.id ? '' : killedPlayer.id"
          :disabled="isDisabled"
          :class="[
            'p-4 rounded-lg border-2 transition-all duration-200 flex flex-col items-center gap-3 w-full max-w-xs',
            isDisabled
              ? 'border-gray-300 bg-gray-100 cursor-not-allowed opacity-50'
              : selectedHealTarget === killedPlayer.id
              ? 'border-green-600 bg-green-50 shadow-lg'
              : 'border-gray-300 bg-white hover:border-green-400'
          ]"
        >
          <!-- Player Avatar -->
          <img
            v-if="killedPlayer.avatar"
            :src="killedPlayer.avatar"
            :alt="killedPlayer.name"
            class="w-16 h-16 rounded-full object-cover"
          />
          <div
            v-else
            class="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-600 text-white flex items-center justify-center font-bold text-2xl"
          >
            {{ killedPlayer.name.charAt(0).toUpperCase() }}
          </div>
          <p class="font-bold text-gray-900 text-center">{{ killedPlayer.name }}</p>
          <div v-if="selectedHealTarget === killedPlayer.id" class="text-2xl animate-pulse">💚</div>
        </button>
      </div>

      <div v-else-if="!killedPlayer" class="text-center p-4 bg-blue-50 rounded-lg">
        <p class="text-sm text-blue-700">No player was killed tonight</p>
      </div>
    </div>

    <!-- Poison Option -->
    <div class="bg-white rounded-xl p-6 shadow-md border-2 border-gray-200">
      <h3 class="text-lg font-bold text-gray-800 mb-4">💜 Poison Potion</h3>
      <p class="text-sm text-gray-600 mb-4">
        {{ gameStore.witchPoisonUsed ? '❌ Already used' : '✓ Available' }}
      </p>

      <div v-if="!gameStore.witchPoisonUsed" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <button
          v-for="player in alivePlayers"
          :key="player.id"
          @click="selectedPoisonTarget = selectedPoisonTarget === player.id ? '' : player.id"
          :disabled="isDisabled"
          :class="[
            'p-4 rounded-lg border-2 transition-all duration-200 flex flex-col items-center gap-3',
            isDisabled
              ? 'border-gray-300 bg-gray-100 cursor-not-allowed opacity-50'
              : selectedPoisonTarget === player.id
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
            class="w-16 h-16 rounded-full bg-gradient-to-br from-red-400 to-red-600 text-white flex items-center justify-center font-bold text-2xl"
          >
            {{ player.name.charAt(0).toUpperCase() }}
          </div>
          <p class="font-bold text-gray-900 text-center">{{ player.name }}</p>
          <div v-if="selectedPoisonTarget === player.id" class="text-2xl animate-pulse">💜</div>
        </button>
      </div>

      <div v-if="alivePlayers.length === 0" class="text-center p-4 bg-gray-100 rounded-lg">
        <p class="text-sm text-gray-600">No players available</p>
      </div>
    </div>

    <!-- Action Confirmation Display -->
    <div class="bg-gradient-to-r from-amber-100 to-orange-50 rounded-xl p-6 shadow-md border-2 border-amber-400">
      <h3 class="text-2xl font-bold mb-4 text-amber-900">📋 Action Summary</h3>

      <div class="space-y-3">
        <!-- Heal Summary -->
        <div v-if="selectedHealTarget" class="p-3 rounded-lg bg-green-50 border border-green-300">
          <p class="text-sm text-green-700">
            <span class="font-bold">💚 Heal:</span> {{ getPlayerName(selectedHealTarget) }}
          </p>
        </div>
        <div v-else class="p-3 rounded-lg bg-gray-100">
          <p class="text-sm text-gray-600">
            <span class="font-bold">💚 Heal:</span> Skipped
          </p>
        </div>

        <!-- Poison Summary -->
        <div v-if="selectedPoisonTarget" class="p-3 rounded-lg bg-red-50 border border-red-300">
          <p class="text-sm text-red-700">
            <span class="font-bold">💜 Poison:</span> {{ getPlayerName(selectedPoisonTarget) }}
          </p>
        </div>
        <div v-else class="p-3 rounded-lg bg-gray-100">
          <p class="text-sm text-gray-600">
            <span class="font-bold">💜 Poison:</span> Skipped
          </p>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex gap-3">
      <button
        @click="skipAction"
        :disabled="isDisabled"
        :class="[
          'flex-1 py-3 px-4 rounded-lg font-medium transition-colors',
          isDisabled
            ? 'bg-gray-400 text-gray-300 cursor-not-allowed'
            : 'bg-gray-500 text-white hover:bg-gray-600'
        ]"
      >
        Skip Action
      </button>
      <button
        @click="confirmAction"
        :disabled="(!selectedHealTarget && !selectedPoisonTarget) || isDisabled"
        :class="[
          'flex-1 py-3 px-4 rounded-lg font-medium transition-all',
          (!selectedHealTarget && !selectedPoisonTarget) || isDisabled
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-gradient-to-r from-amber-600 to-orange-700 text-white hover:from-amber-700 hover:to-orange-800 active:scale-95'
        ]"
      >
        Confirm Action
      </button>
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
  (e: 'confirm', action: { targetPlayerId?: string; secondaryTargetPlayerId?: string }): void
  (e: 'skip'): void
}

withDefaults(defineProps<Props>(), {
  isDisabled: false,
})

const emit = defineEmits<Emits>()

const gameStore = useGameStore()
const playersStore = usePlayersStore()

const selectedHealTarget = ref<string>('')
const selectedPoisonTarget = ref<string>('')

// Get all alive players
const alivePlayers = computed(() => {
  return gameStore.alivePlayers
    .map(playerId => playersStore.getPlayerById(playerId))
    .filter((p): p is NonNullable<typeof p> => p !== null && p !== undefined)
})

// Get the player killed by werewolves (determined from kill targets)
const killedPlayer = computed(() => {
  // Look for werewolf kill targets in the night actions
  const killAction = gameStore.nightPhaseActions.find(action =>
    action.roleId.toLowerCase().includes('werewolf') && action.targetPlayerId
  )

  if (killAction && killAction.targetPlayerId) {
    return playersStore.getPlayerById(killAction.targetPlayerId)
  }

  return null
})

/**
 * Get player name by ID
 */
const getPlayerName = (playerId: string): string => {
  return playersStore.getPlayerById(playerId)?.name || 'Unknown'
}

/**
 * Skip the action - emit skip event
 */
const skipAction = () => {
  selectedHealTarget.value = ''
  selectedPoisonTarget.value = ''
  emit('skip')
}

/**
 * Confirm the action - emit both heal and poison targets
 */
const confirmAction = () => {
  if (selectedHealTarget.value || selectedPoisonTarget.value) {
    emit('confirm', {
      targetPlayerId: selectedHealTarget.value, // heal target
      secondaryTargetPlayerId: selectedPoisonTarget.value, // poison target
    })

    selectedHealTarget.value = ''
    selectedPoisonTarget.value = ''
  }
}
</script>

