<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-back-button default-href="/"></ion-back-button>
                </ion-buttons>
                <ion-title>{{ $t('gameSetup.title') }}</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content>
            <div class="min-h-screen bg-gradient-to-b from-slate-50 to-white flex flex-col">
                <!-- Phase Header -->
                <PhaseHeader />

                <!-- Main Content -->
                <div class="flex-1 px-6 py-8">
                    <div class="max-w-6xl mx-auto">
                        <!-- Night Phase -->
                        <div v-if="currentPhase === GamePhase.NIGHT">
                            <RoleActionPanel
                                :readonly="false"
                                @phase-complete="completeNightPhase"
                            />
                        </div>

                        <!-- Day Phase -->
                        <div v-else-if="currentPhase === GamePhase.DAY" class="space-y-6">
                            <!-- Day Discussion Timer -->
                            <div class="bg-white rounded-2xl shadow-lg p-8">
                                <h2 class="text-3xl font-bold text-center mb-6 text-amber-700">☀️ {{ $t('game.day') }} {{ gameStore.round }}</h2>

                                <!-- Timer -->
                                <div class="text-center mb-8">
                                    <div class="text-6xl font-bold text-amber-600 font-mono mb-2">{{ formatTime(discussionTimeRemaining) }}</div>
                                    <p class="text-gray-600">{{ discussionTimeRemaining > 0 ? 'Discussion Time' : 'Time to Vote' }}</p>
                                </div>

                                <!-- Timer Bar -->
                                <div class="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                    <div
                                        :style="{ width: timerProgress + '%' }"
                                        class="bg-gradient-to-r from-amber-400 to-amber-600 h-full transition-all duration-1000"
                                    />
                                </div>
                            </div>

                            <!-- Voting Interface -->
                            <VotingInterface
                                :voting-phase="discussionTimeRemaining <= 0"
                                @vote="handleVote"
                                @complete="completeDayPhase"
                            />
                        </div>

                        <!-- Night Results Display -->
                        <div v-if="showNightResults" class="bg-white rounded-2xl shadow-lg p-8 border-2 border-red-300">
                            <h3 class="text-2xl font-bold mb-6 text-red-700">🌙 {{ $t('nightPhase.nightResults') }}</h3>
                            <div class="space-y-3">
                                <div v-if="nightResults.length === 0" class="text-gray-600 text-center py-4">
                                    {{ $t('nightPhase.noElimination') }}
                                </div>
                                <div v-for="result in nightResults" :key="result.playerId" class="bg-red-50 border border-red-200 rounded-lg p-4">
                                    <p class="font-bold text-red-900">{{ $t('nightPhase.playerDied', { player: getPlayerName(result.playerId) }) }}</p>
                                    <p class="text-sm text-red-700 mt-2">Killed at {{ formatTime(Date.now()) }} on Night {{ currentRound }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Fixed Bottom Buttons -->
                <div class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300 px-6 py-4 shadow-2xl">
                    <div class="max-w-6xl mx-auto flex gap-4">
                        <button
                            @click="goToMenu"
                            class="flex-1 py-3 px-4 bg-gray-500 text-white rounded-lg font-medium hover:bg-gray-600 transition-colors"
                        >
                            {{ $t('common.back') }}
                        </button>

                        <button
                            v-if="currentPhase === GamePhase.NIGHT"
                            @click="skipToDay"
                            class="flex-1 py-3 px-4 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors"
                        >
                            Skip Night
                        </button>

                        <button
                            v-if="currentPhase === GamePhase.DAY && discussionTimeRemaining > 0"
                            @click="skipDiscussion"
                            class="flex-1 py-3 px-4 bg-amber-500 text-white rounded-lg font-medium hover:bg-amber-600 transition-colors"
                        >
                            Skip Discussion
                        </button>
                    </div>
                </div>

                <!-- Safe area padding for fixed buttons -->
                <div class="h-20" />
            </div>
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '~/stores/game'
import { usePlayersStore } from '~/stores/players'
import type { DayPhaseVote } from '~/types/game'
import { GamePhase } from '~/types/game'
import PhaseHeader from '~/components/PhaseHeader.vue'
import RoleActionPanel from '~/components/RoleActionPanel.vue'
import VotingInterface from '~/components/VotingInterface.vue'

const router = useRouter()
const gameStore = useGameStore()
const playersStore = usePlayersStore()

const currentPhase = computed(() => gameStore.phase)
const currentRound = computed(() => gameStore.round)

// Day phase timer
const DISCUSSION_TIME = 10 * 60 * 1000 // 10 minutes in milliseconds
const discussionStartTime = ref<number>(0)
const discussionTimeRemaining = ref<number>(DISCUSSION_TIME)
let discussionTimer: number | null = null

const timerProgress = computed(() => {
    return Math.max(0, (discussionTimeRemaining.value / DISCUSSION_TIME) * 100)
})

// Night results
const showNightResults = ref(false)
const nightResults = ref<Array<{ playerId: string, reason: string }>>([])

/**
 * Format milliseconds to MM:SS
 */
const formatTime = (ms: number): string => {
    const totalSeconds = Math.floor(ms / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

/**
 * Get player name by ID
 */
const getPlayerName = (playerId: string): string => {
    return playersStore.getPlayerById(playerId)?.name || 'Unknown Player'
}

/**
 * Start day phase timer
 */
const startDayPhaseTimer = () => {
    discussionStartTime.value = Date.now()
    discussionTimeRemaining.value = DISCUSSION_TIME

    discussionTimer = window.setInterval(() => {
        const elapsed = Date.now() - discussionStartTime.value
        discussionTimeRemaining.value = Math.max(0, DISCUSSION_TIME - elapsed)

        if (discussionTimeRemaining.value === 0) {
            clearInterval(discussionTimer!)
        }
    }, 100)
}

/**
 * Complete night phase and move to day
 */
const completeNightPhase = () => {
    // Update alive players list (remove eliminated players)
    gameStore.updateAlivePlayers()

    // Check win conditions after night phase eliminations
    const winCondition = gameStore.checkWinConditions()

    console.log('winCondition', winCondition)

    if (winCondition) {
        // Game has ended
        gameStore.endGame()
        // Navigate to game end screen with winner info
        router.push({
            name: 'game-end___en',
            params: { winner: winCondition.winner, reason: winCondition.reason },
        })
        return
    }

    gameStore.nextPhase()
    gameStore.clearDayVotes()
    startDayPhaseTimer()
}

/**
 * Complete day phase and move to night
 */
const completeDayPhase = () => {
    // Update alive players list (remove eliminated players from day phase voting)
    gameStore.updateAlivePlayers()

    // Check win conditions after day phase eliminations
    const winCondition = gameStore.checkWinConditions()

    clearInterval(discussionTimer!)

    if (winCondition) {
        // Game has ended
        gameStore.endGame()
        // Navigate to game end screen with winner info
        router.push({
            name: 'game-end___en',
            params: { winner: winCondition.winner, reason: winCondition.reason },
        })
    } else {
        // Continue to next night
        gameStore.nextPhase()
        gameStore.startNightPhase()
        showNightResults.value = false
    }
}

/**
 * Handle player vote
 */
const handleVote = (vote: DayPhaseVote) => {
    gameStore.addDayVote(vote)
}

/**
 * Skip discussion timer
 */
const skipDiscussion = () => {
    discussionTimeRemaining.value = 0
    clearInterval(discussionTimer!)
}

/**
 * Skip night phase
 */
const skipToDay = () => {
    completeNightPhase()
}

/**
 * Return to menu
 */
const goToMenu = () => {
    gameStore.resetGame()
    router.push('/')
}

onMounted(() => {
    // Initialize night phase
    if (currentPhase.value === GamePhase.NIGHT) {
        gameStore.startNightPhase()
    } else if (currentPhase.value === GamePhase.DAY) {
        startDayPhaseTimer()
    }
})

onUnmounted(() => {
    if (discussionTimer) {
        clearInterval(discussionTimer)
    }
})
</script>
