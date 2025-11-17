<template>
  <div class="bg-white rounded-xl p-6 shadow-md">
    <h2 class="text-2xl font-bold text-gray-800 mb-6">{{ $t('gameEnd.gameLog') }}</h2>

    <div v-if="gameEvents.length > 0" class="space-y-3 max-h-96 overflow-y-auto">
      <div
        v-for="(event, index) in gameEvents"
        :key="index"
        :class="[
          'p-4 rounded-lg border-l-4 transition-all',
          eventColorClass(event),
        ]"
      >
        <div class="flex items-start justify-between gap-2">
          <div class="flex-1">
            <p class="text-sm font-semibold text-gray-700">
              {{ eventPhaseLabel(event) }}
            </p>
            <p class="text-sm text-gray-600 mt-1">{{ event.message }}</p>
          </div>
          <span class="text-xs font-medium text-gray-500 whitespace-nowrap">
            R{{ event.round }}
          </span>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-8 text-gray-500">
      <p>{{ $t('gameEnd.noGameLog') }}</p>
    </div>

    <!-- Additional Stats -->
    <div v-if="hasStats" class="mt-6 pt-6 border-t border-gray-200">
      <h3 class="text-lg font-bold text-gray-800 mb-4">{{ $t('gameEnd.statistics') }}</h3>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="text-center">
          <p class="text-xs text-gray-600 uppercase font-semibold mb-1">
            {{ $t('gameEnd.nightPhases') }}
          </p>
          <p class="text-2xl font-bold text-blue-600">{{ nightPhaseCount }}</p>
        </div>
        <div class="text-center">
          <p class="text-xs text-gray-600 uppercase font-semibold mb-1">
            {{ $t('gameEnd.dayPhases') }}
          </p>
          <p class="text-2xl font-bold text-yellow-600">{{ dayPhaseCount }}</p>
        </div>
        <div class="text-center">
          <p class="text-xs text-gray-600 uppercase font-semibold mb-1">
            {{ $t('gameEnd.totalActions') }}
          </p>
          <p class="text-2xl font-bold text-purple-600">{{ totalActions }}</p>
        </div>
        <div class="text-center">
          <p class="text-xs text-gray-600 uppercase font-semibold mb-1">
            {{ $t('gameEnd.avgRoundTime') }}
          </p>
          <p class="text-2xl font-bold text-green-600">{{ avgRoundTime }}m</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useGameStore } from '~/stores/game'
import type { GameEvent } from '~/types/game'

const gameStore = useGameStore()

const gameEvents = computed(() => gameStore.gameLog)

const nightPhaseCount = computed(
  () => gameEvents.value.filter(e => e.phase === 'NIGHT').length
)

const dayPhaseCount = computed(
  () => gameEvents.value.filter(e => e.phase === 'DAY').length
)

const totalActions = computed(() => gameStore.nightPhaseActions.length)

const avgRoundTime = computed(() => {
  if (gameEvents.value.length === 0) return 0
  const firstEvent = gameEvents.value[0]
  const lastEvent = gameEvents.value[gameEvents.value.length - 1]
  if (!firstEvent || !lastEvent) return 0

  const firstTimestamp = firstEvent.timestamp
  const lastTimestamp = lastEvent.timestamp
  const totalMinutes = Math.floor((lastTimestamp - firstTimestamp) / 60000)
  const avgMinutes = Math.ceil(totalMinutes / gameStore.round)

  return avgMinutes
})

const hasStats = computed(
  () =>
    nightPhaseCount.value > 0 ||
    dayPhaseCount.value > 0 ||
    totalActions.value > 0
)

function eventColorClass(event: GameEvent): string {
  if (event.phase === 'NIGHT') {
    return 'bg-blue-50 border-blue-400'
  }
  if (event.phase === 'DAY') {
    return 'bg-yellow-50 border-yellow-400'
  }
  return 'bg-gray-50 border-gray-400'
}

function eventPhaseLabel(event: GameEvent): string {
  const phaseLabel = event.phase === 'NIGHT' ? '🌙 Night' : '☀️ Day'
  return `${phaseLabel} ${event.round}`
}
</script>
