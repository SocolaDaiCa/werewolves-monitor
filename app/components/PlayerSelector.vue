<template>
    <div class="space-y-6">
        <!-- Header -->
        <div class="space-y-2">
            <h2 class="text-2xl font-bold text-gray-800">{{ $t('gameSetup.selectPlayers') }}</h2>
            <p class="text-sm text-gray-600">
                {{ playersStore.selectedPlayerIds.length }} {{ $t('gameSetup.playersSelected') }}
            </p>
        </div>

        <!-- No Players Message -->
        <div v-if="playersStore.allPlayers.length === 0" class="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6 text-center">
            <p class="text-yellow-800 font-semibold">{{ $t('players.noPlayers') }}</p>
            <p class="text-sm text-yellow-700 mt-2">{{ $t('players.noPlayersDescription') }}</p>
            <NuxtLink to="/players" class="inline-block mt-4 px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition">
                {{ $t('navigation.players') }}
            </NuxtLink>
        </div>

        <!-- Player Cards Grid -->
        <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            <SelectableCard
                v-for="player in playersStore.allPlayers"
                :key="player.id"
                :is-selected="playersStore.selectedPlayerIds.includes(player.id)"
                @toggle="togglePlayer(player.id)"
            >
                <div class="absolute inset-0 flex flex-col items-center justify-center p-3">
                    <img
                        v-if="player.avatar"
                        :src="player.avatar"
                        :alt="player.name"
                        class="w-12 h-12 rounded-full object-cover mb-2"
                    />
                    <div v-else class="w-12 h-12 rounded-full bg-gray-300 mb-2 flex items-center justify-center text-xs font-bold text-gray-600">
                        {{ getInitials(player.name) }}
                    </div>

                    <!-- Player Name -->
                    <p class="font-semibold text-sm text-gray-800 text-center line-clamp-2">
                        {{ player.name }}
                    </p>
                </div>
            </SelectableCard>
        </div>

        <!-- Stats Summary -->
        <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <p class="text-xs text-gray-600 font-semibold uppercase tracking-wider">{{ $t('gameSetup.playersSelected') }}</p>
                    <p class="text-3xl font-bold text-blue-600">{{ playersStore.selectedPlayerIds.length }}</p>
                </div>
                <div>
                    <p class="text-xs text-gray-600 font-semibold uppercase tracking-wider">Total Players</p>
                    <p class="text-3xl font-bold text-gray-600">{{ playersStore.allPlayers.length }}</p>
                </div>
            </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-3 mt-2">
            <button
                @click="selectAllPlayers"
                class="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="playersStore.selectedPlayerIds.length === playersStore.allPlayers.length"
            >
                {{ $t('common.add') }} All
            </button>
            <button
                @click="clearAllPlayers"
                class="flex-1 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="playersStore.selectedPlayerIds.length === 0"
            >
                {{ $t('roles.clearAll') }}
            </button>
        </div>

        <!-- Edit Players Button -->
        <NuxtLink
            to="/players"
        >
            <button class="w-full px-4 py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-lg transition text-center mt-4">
                Edit Players Configuration
            </button>
        </NuxtLink>
    </div>
</template>

<script setup lang="ts">
import { watch, onMounted } from 'vue'
import { usePlayersStore } from '~/stores/players'
import { useGameStore } from '~/stores/game'

const playersStore = usePlayersStore()
const gameStore = useGameStore()

// Get player initials for avatar
function getInitials(name: string): string {
    return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
}

// Toggle player selection
function togglePlayer(playerId: string) {
    const ids = [...playersStore.selectedPlayerIds]
    const index = ids.indexOf(playerId)
    if (index > -1) {
        ids.splice(index, 1)
    } else {
        ids.push(playerId)
    }
    playersStore.setSelectedPlayerIds(ids)
}

// Select all players
function selectAllPlayers() {
    const allIds = playersStore.allPlayers.map(p => p.id)
    const ids = [...new Set([...playersStore.selectedPlayerIds, ...allIds])]
    playersStore.setSelectedPlayerIds(ids)
}

// Clear all selections
function clearAllPlayers() {
    playersStore.setSelectedPlayerIds([])
}
</script>

