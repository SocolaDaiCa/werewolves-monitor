<template>
    <ion-page>
        <ion-content class="ion-padding">
            <div class="min-h-screen flex items-center justify-center">
                <div class="text-center">
                    <p class="text-gray-600 mb-4">Redirecting to game...</p>
                </div>
            </div>
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useGameStore } from '~/stores/game'
import { GamePhase } from '~/types/game'
import { onMounted } from 'vue'

const router = useRouter()
const gameStore = useGameStore()

onMounted(() => {
    // Redirect to appropriate phase page
    if (gameStore.phase === GamePhase.NIGHT) {
        router.push('/night')
    } else if (gameStore.phase === GamePhase.DAY) {
        router.push('/day')
    } else {
        router.push('/')
    }
})
</script>
