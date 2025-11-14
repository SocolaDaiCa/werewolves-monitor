<template>
  <div class="page-game">
    <h1>{{ $t('game.phase') }}: {{ $t(`game.${currentPhase.toLowerCase()}`) }}</h1>
    <!-- Game flow component will be implemented in Phase 5-6 -->
    <div class="placeholder">
      <p>✏️ {{ $t('common.loading') }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useGameStore } from '~/stores/game'

const gameStore = useGameStore()
const currentPhase = computed(() => gameStore.phase)

// Phase 5-6: Game Flow will implement night/day phase logic, role actions, voting, narration, etc.
</script>

<style scoped lang="scss">
.page-game {
  padding: 2rem;

  h1 {
    font-size: 1.8rem;
    margin-bottom: 1rem;
    color: var(--color-primary);
  }
}

.placeholder {
  background-color: #f5f5f5;
  border: 2px dashed #ccc;
  padding: 3rem 2rem;
  border-radius: var(--border-radius);
  text-align: center;
  color: #999;
}
</style>
