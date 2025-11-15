<template>
  <div class="min-h-screen bg-gradient-to-b from-slate-50 to-white flex flex-col">
    <!-- Header -->
    <div class="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-8 rounded-b-3xl shadow-lg">
      <h1 class="text-3xl font-bold mb-2">{{ $t('gameSetup.title') }}</h1>
      <p class="text-green-100">{{ $t('gameSetup.selectPlayers') }}</p>
    </div>

    <!-- Content Area -->
    <div class="flex-1 flex items-center justify-center px-6 py-12">
      <div class="bg-white rounded-3xl border-2 border-dashed border-gray-300 p-12 text-center max-w-sm w-full shadow-md">
        <p class="text-3xl mb-4">✏️</p>
        <p class="text-lg font-semibold text-gray-600 mb-2">{{ $t('common.loading') }}</p>
        <p class="text-sm text-gray-500">Phase 4 implementation coming soon...</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Phase 4: Game Setup will implement player selection, role validation, smart auto-select, warning messages, etc.
</script>
