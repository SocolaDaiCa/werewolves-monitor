<template>
    <div class="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-4 md:p-6">
        <div class="max-w-6xl mx-auto">
            <!-- Header -->
            <div class="mb-6">
                <h1 class="text-4xl md:text-5xl font-bold text-white mb-2">
                    {{ $t('gameEnd.title') }}
                </h1>
                <p class="text-gray-300">{{ $t('gameEnd.subtitle') }}</p>
            </div>

            <!-- Main Content -->
            <div class="space-y-6">
                <!-- Result Display -->
                <GameEndResult @play-again="handlePlayAgain" @new-game="handleNewGame" @main-menu="handleMainMenu" />

                <!-- Game Summary / Log -->
                <GameSummary />
            </div>

            <!-- Footer Navigation -->
            <div class="mt-8 text-center text-gray-400 text-sm">
                <p>{{ $t('gameEnd.thankYou') }}</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import GameEndResult from '~/components/GameEndResult.vue'
import GameSummary from '~/components/GameSummary.vue'

const router = useRouter()

function handlePlayAgain() {
    router.push('/game-setup')
}

function handleNewGame() {
    router.push('/game-setup')
}

function handleMainMenu() {
    router.push('/')
}
</script>
