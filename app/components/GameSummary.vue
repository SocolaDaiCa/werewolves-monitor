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
                    <p class="text-2xl font-bold text-blue-600">{{ gameStore.nightPhaseCount }}</p>
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
import {computed} from 'vue'
import {useGameStore} from '~/stores/game'
import type {GameEvent} from '~/types/game'

const gameStore = useGameStore()

const gameEvents = computed(() => gameStore.gameEvents)

const nightPhaseCount = computed(() => gameStore.nightPhaseCount)
const dayPhaseCount = computed(() => gameStore.dayPhaseCount)
const totalActions = computed(() => gameStore.totalActions)

const avgRoundTime = computed(() => gameStore.avgRoundTime)

const hasStats = computed(() => gameStore.hasStats)

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
