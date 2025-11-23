<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-back-button default-href="/"></ion-back-button>
                </ion-buttons>
                <ion-title>
                    🌙 {{ $t('game.night') }} {{ gameStore.round }}
                </ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content>
            <div class="min-h-screen bg-gradient-to-b from-slate-50 to-white flex flex-col">
                <!-- Phase Header -->
                <PhaseHeader />

                <!-- Main Content -->
                <div class="flex-1 px-6 py-8">
                    <div class="max-w-6xl mx-auto">
                        <RoleActionPanel
                            :readonly="false"
                            @phase-complete="completeNightPhase"
                        />
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
                            @click="skipToDay"
                            class="flex-1 py-3 px-4 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors"
                        >
                            Skip Night
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
import { useRouter } from 'vue-router'
import { useGameStore } from '~/stores/game'
import { GamePhase } from '~/types/game'
import PhaseHeader from '~/components/PhaseHeader.vue'
import RoleActionPanel from '~/components/RoleActionPanel.vue'

const router = useRouter()
const gameStore = useGameStore()

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
    router.push('/day')
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
</script>

