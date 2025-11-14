<template>
  <div class="page-game-setup">
    <h1>{{ $t('gameSetup.title') }}</h1>
    <p>{{ $t('gameSetup.selectPlayers') }}</p>
    <!-- Game setup component will be implemented in Phase 4 -->
    <div class="placeholder">
      <p>✏️ {{ $t('common.loading') }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
// Phase 4: Game Setup will implement player selection, role validation, smart auto-select, warning messages, etc.
</script>

<style scoped lang="scss">
.page-game-setup {
  padding: 2rem;

  h1 {
    font-size: 1.8rem;
    margin-bottom: 1rem;
    color: var(--color-primary);
  }

  p {
    font-size: 1rem;
    color: #666;
    margin-bottom: 2rem;
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
