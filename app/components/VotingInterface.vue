<template>
    <div class="space-y-6">
        <!-- Night Deaths Notification -->
        <div v-if="lastNightDeaths.length > 0" class="bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl p-6 shadow-lg border-2 border-red-800">
            <h3 class="text-2xl font-bold mb-4 flex items-center gap-2">
                <span class="text-3xl">🌙</span> Last Night's Deaths
            </h3>
            <div class="space-y-2">
                <div v-for="death in lastNightDeaths" :key="death.playerId" class="flex items-center gap-3 bg-red-500 bg-opacity-30 rounded-lg p-3 border border-red-300">
                    <span class="text-2xl">☠️</span>
                    <div>
                        <p class="font-bold text-red-50">{{ getPlayerName(death.playerId) }}</p>
                        <p class="text-xs text-red-100">{{ death.description }}</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Voting Title -->
        <div class="bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl p-6 shadow-md">
            <h2 class="text-2xl font-bold text-center mb-2">☀️ {{ votingPhase ? '🗳️ Moderator Vote Control' : '💬 Discussion Time' }}</h2>
            <p class="text-center text-amber-50">
                {{ votingPhase ? 'Set votes and mark players for elimination' : 'Discuss and strategize' }}
            </p>
        </div>

        <!-- Vote Summary & Controls -->
        <div v-if="votingPhase" class="bg-white rounded-xl p-6 shadow-md border-2 border-amber-200">
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div class="text-center">
                    <p class="text-sm font-medium text-gray-600">Total Votes</p>
                    <p class="text-2xl font-bold text-orange-600">{{ totalVotes }}</p>
                </div>
                <div class="text-center">
                    <p class="text-sm font-medium text-gray-600">Alive Players</p>
                    <p class="text-2xl font-bold text-blue-600">{{ alivePlayers.length }}</p>
                </div>
                <div class="text-center">
                    <p class="text-sm font-medium text-gray-600">Marked for Kill</p>
                    <p class="text-2xl font-bold text-red-600">{{ markedForKill.size }}</p>
                </div>
                <div class="text-center">
                    <p class="text-sm font-medium text-gray-600">Remaining Votes</p>
                    <p class="text-2xl font-bold text-green-600">{{ alivePlayers.length - totalVotes }}</p>
                </div>
            </div>
        </div>

        <!-- Player Vote Cards Grid (Moderator Control) -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
                v-for="player in alivePlayers"
                :key="player.id"
                :class="[
          'p-4 rounded-xl border-2 transition-all duration-200 shadow-md',
          markedForKill.has(player.id)
            ? 'border-red-500 bg-red-50'
            : 'border-gray-300 bg-white'
        ]"
            >
                <!-- Player Header -->
                <div class="flex items-center gap-3 mb-4">
                    <!-- Player Avatar -->
                    <img
                        v-if="player.avatar"
                        :src="player.avatar"
                        :alt="player.name"
                        class="w-12 h-12 rounded-full object-cover"
                    />
                    <div
                        v-else
                        class="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-white flex items-center justify-center font-bold text-lg"
                    >
                        {{ player.name.charAt(0).toUpperCase() }}
                    </div>

                    <!-- Player Name -->
                    <div class="flex-1">
                        <p class="font-bold text-gray-900">{{ player.name }}</p>
                        <p class="text-xs text-gray-500">Alive</p>
                    </div>
                </div>

                <!-- Vote Counter -->
                <div class="mb-4">
                    <p class="text-sm font-medium text-gray-700 mb-2">Votes: {{ playerVotes.get(player.id) || 0 }}</p>
                    <div class="flex gap-2">
                        <button
                            @click="decreaseVote(player.id)"
                            :disabled="(playerVotes.get(player.id) || 0) === 0"
                            class="flex-1 py-2 px-2 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-lg"
                        >
                            −
                        </button>
                        <div class="flex-1 py-2 px-2 bg-gray-100 rounded-lg text-center font-bold text-lg text-gray-800">
                            {{ playerVotes.get(player.id) || 0 }}
                        </div>
                        <button
                            @click="increaseVote(player.id)"
                            :disabled="totalVotes >= alivePlayers.length"
                            class="flex-1 py-2 px-2 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-lg"
                        >
                            +
                        </button>
                    </div>
                </div>

                <!-- Kill Toggle Button -->
                <button
                    @click="toggleKill(player.id)"
                    :class="[
            'w-full py-3 px-4 rounded-lg font-bold transition-all duration-200 flex items-center justify-center gap-2',
            markedForKill.has(player.id)
              ? 'bg-red-600 text-white hover:bg-red-700'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          ]"
                >
                    <span class="text-xl">{{ markedForKill.has(player.id) ? '☠️' : '⚔️' }}</span>
                    {{ markedForKill.has(player.id) ? 'Marked for Kill' : 'Mark for Kill' }}
                </button>
            </div>
        </div>

        <!-- Vote Results -->
        <div v-if="showResults" class="bg-white rounded-xl p-6 shadow-lg border-2 border-amber-300">
            <h3 class="text-2xl font-bold text-amber-900 mb-4">✓ Day Phase Results</h3>
            <div class="space-y-3">
                <div v-if="eliminations.length === 0" class="text-center py-4 text-gray-600">
                    No one was eliminated
                </div>
                <div v-for="player in eliminations" :key="player.id" class="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p class="font-bold text-red-900">☠️ {{ player.name }} was eliminated</p>
                    <p class="text-sm text-red-700 mt-2">Received {{ player.votes }} vote{{ player.votes !== 1 ? 's' : '' }}</p>
                </div>
            </div>
            <button
                @click="continueGame"
                class="w-full mt-6 py-3 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
                Continue to Next Phase
            </button>
        </div>

        <!-- Complete Voting Button -->
        <div v-if="votingPhase && !showResults" class="flex gap-3">
            <button
                @click="resetVotes"
                class="flex-1 py-3 px-4 bg-gray-500 text-white rounded-lg font-medium hover:bg-gray-600 transition-colors"
            >
                Reset
            </button>
            <button
                @click="submitVotes"
                class="flex-1 py-4 px-6 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-lg hover:from-orange-600 hover:to-red-600 transition-all active:scale-95 text-lg"
            >
                Finalize & Eliminate
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useGameStore } from '~/stores/game'
import { usePlayersStore } from '~/stores/players'

interface Props {
    votingPhase: boolean
}

interface Emits {
    (e: 'complete'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const gameStore = useGameStore()
const playersStore = usePlayersStore()

const playerVotes = ref<Map<string, number>>(new Map())
const markedForKill = ref<Set<string>>(new Set())
const showResults = ref(false)
const eliminations = ref<Array<{ id: string; name: string; votes: number }>>([])

const alivePlayers = computed(() => {
    return gameStore.alivePlayers
        .map(playerId => playersStore.getPlayerById(playerId))
        .filter((p): p is NonNullable<typeof p> => p !== null && p !== undefined)
})

const totalVotes = computed(() => {
    let total = 0
    playerVotes.value.forEach(count => {
        total += count
    })
    return total
})

const getPlayerName = (playerId: string): string => {
    return playersStore.getPlayerById(playerId)?.name || 'Unknown'
}

/**
 * Get last night's deaths for current round
 */
const lastNightDeaths = computed(() => gameStore.lastNightDeaths)

/**
 * Increase votes for a player
 */
const increaseVote = (playerId: string) => {
    const currentVotes = playerVotes.value.get(playerId) || 0
    if (totalVotes.value < alivePlayers.value.length) {
        playerVotes.value.set(playerId, currentVotes + 1)
    }
}

/**
 * Decrease votes for a player
 */
const decreaseVote = (playerId: string) => {
    const currentVotes = playerVotes.value.get(playerId) || 0
    if (currentVotes > 0) {
        playerVotes.value.set(playerId, currentVotes - 1)
    }
}

/**
 * Toggle kill mark for a player
 */
const toggleKill = (playerId: string) => {
    if (markedForKill.value.has(playerId)) {
        markedForKill.value.delete(playerId)
    } else {
        markedForKill.value.add(playerId)
    }
}

/**
 * Reset all votes
 */
const resetVotes = () => {
    playerVotes.value.clear()
    markedForKill.value.clear()
}

/**
 * Submit votes and eliminate marked players
 */
const submitVotes = () => {
    const eliminated: string[] = []

    // Eliminate players that are marked for kill
    markedForKill.value.forEach(playerId => {
        if (alivePlayers.value.some(p => p.id === playerId)) {
            eliminated.push(playerId)
            const playerName = getPlayerName(playerId)
            const voteCount = playerVotes.value.get(playerId) || 0
            gameStore.eliminatePlayer(
                playerId,
                gameStore.round,
                'VOTE',
                `${playerName} was eliminated by vote (${voteCount} vote${voteCount !== 1 ? 's' : ''})`
            )
        }
    })

    // Create elimination results with vote display
    eliminations.value = eliminated
        .map(playerId => ({
            id: playerId,
            name: getPlayerName(playerId),
            votes: playerVotes.value.get(playerId) || 0,
        }))
        .sort((a, b) => b.votes - a.votes)

    showResults.value = true
}

/**
 * Continue to next phase
 */
const continueGame = () => {
    emit('complete')
}
</script>
