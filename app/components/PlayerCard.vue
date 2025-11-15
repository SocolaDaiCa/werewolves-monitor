<template>
  <div class="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow overflow-hidden border border-gray-200">
    <!-- Player Info -->
    <div class="p-6">
      <!-- Avatar -->
      <div class="flex justify-center mb-4">
        <img
          :src="player.avatar"
          :alt="player.name"
          class="w-24 h-24 rounded-full object-cover border-4 border-blue-200"
        />
      </div>

      <!-- Player Name -->
      <h3 class="text-xl font-bold text-center text-gray-800 mb-4">
        {{ player.name }}
      </h3>

      <!-- Stats -->
      <div class="grid grid-cols-2 gap-4 mb-6">
        <!-- Games Played -->
        <div class="bg-blue-50 rounded-lg p-3 text-center">
          <div class="text-2xl font-bold text-blue-600">{{ player.gamesPlayed }}</div>
          <div class="text-xs text-gray-600 mt-1">{{ $t('players.gamesPlayed') }}</div>
        </div>

        <!-- Wins -->
        <div class="bg-green-50 rounded-lg p-3 text-center">
          <div class="text-2xl font-bold text-green-600">{{ player.wins }}</div>
          <div class="text-xs text-gray-600 mt-1">{{ $t('players.wins') }}</div>
        </div>
      </div>

      <!-- Win Rate -->
      <div class="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-3 text-center mb-6">
        <div class="text-sm text-gray-600">{{ $t('players.winRate') }}</div>
        <div class="text-lg font-bold text-purple-600 mt-1">
          {{ winRatePercentage }}%
        </div>
      </div>

      <!-- Joined Date -->
      <div class="text-xs text-gray-500 text-center mb-4">
        {{ $t('players.joinedOn') }}: {{ joinedDateFormatted }}
      </div>

      <!-- Action Buttons -->
      <div class="flex gap-3">
        <!-- Edit Button -->
        <button
          @click="$emit('edit', player)"
          class="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <span>✏️</span>
          <span>{{ $t('common.edit') }}</span>
        </button>

        <!-- Delete Button -->
        <button
          @click="$emit('delete', player.id)"
          class="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <span>🗑️</span>
          <span>{{ $t('common.delete') }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Player } from '~/stores/players'

const props = defineProps<{
  player: Player
}>()

defineEmits<{
  edit: [player: Player]
  delete: [playerId: string]
}>()

// Computed properties
const winRatePercentage = computed(() => {
  if (props.player.gamesPlayed === 0) return 0
  return Math.round((props.player.wins / props.player.gamesPlayed) * 100)
})

const joinedDateFormatted = computed(() => {
  return new Date(props.player.joinedDate).toLocaleDateString()
})
</script>

