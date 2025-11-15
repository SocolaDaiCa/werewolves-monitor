<template>
  <div class="w-full">
    <!-- Already Acknowledged -->
    <div v-if="hasAcknowledged" class="w-full">
      <div class="bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-xl p-4 shadow-lg border-4 border-green-600">
        <div class="text-center">
          <p class="text-base font-semibold">{{ $t('nightZero.acknowledged') }}</p>
          <p class="text-sm text-green-100 mt-2">✓ {{ $t('nightZero.youHaveAcknowledged') }}</p>
        </div>
      </div>
    </div>

    <!-- Player's View: Show if this is their current role -->
    <div v-else-if="isPlayerCurrentRole" class="w-full">
      <div class="bg-gradient-to-r from-yellow-300 to-orange-400 text-white rounded-xl p-4 shadow-lg border-4 border-yellow-500 animate-pulse">
        <div class="text-center">
          <p class="text-base font-semibold mb-2">{{ $t('nightZero.thisIsYourRole') }}</p>
          <p class="text-xs text-yellow-100">{{ $t('nightZero.waitingForAcknowledgment') }}</p>
        </div>
      </div>
    </div>

    <!-- Waiting for Role -->
    <div v-else class="w-full">
      <div class="bg-gray-200 bg-opacity-40 text-gray-100 rounded-xl p-4 border-2 border-gray-300">
        <div class="text-center">
          <p class="text-sm font-semibold">{{ $t('nightZero.noMatchingRole') }}</p>
          <p class="text-xs text-gray-100 mt-1">{{ $t('nightZero.waitForYourRole') }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useGameStore } from '~/stores/game'

interface Props {
  playerId: string
  currentRoleId: string
}

const props = defineProps<Props>()

const gameStore = useGameStore()

// Check if player has ANY acknowledged role (not just current one)
const hasAcknowledged = computed(() => {
  return gameStore.roleAcknowledgments[props.playerId] !== undefined
})

// Check if this is the player's current role being called
const isPlayerCurrentRole = computed(() => {
  const playerAssignedRole = gameStore.playerRoles[props.playerId]
  return playerAssignedRole === props.currentRoleId && !hasAcknowledged.value
})
</script>

