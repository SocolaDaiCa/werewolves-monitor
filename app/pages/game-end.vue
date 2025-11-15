<template>
  <GameEnd
    @play-again="handlePlayAgain"
    @new-game="handleNewGame"
    @main-menu="handleMainMenu"
  />
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import GameEnd from '~/components/GameEnd.vue'

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
