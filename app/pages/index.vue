<template>
  <div class="min-h-screen bg-gradient-to-b from-slate-50 to-white flex flex-col">
    <!-- Hero Section -->
    <section class="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-amber-600 to-amber-700 text-white">
      <div class="text-6xl mb-4">🐺</div>
      <h1 class="text-4xl font-bold text-center mb-3 leading-tight">{{ $t('home.welcome') }}</h1>
      <!-- <p class="text-base text-amber-100 text-center">{{ $t('home.description') }}</p> -->
    </section>

    <!-- Main Menu Cards - iOS Style -->
    <section class="flex-1 flex flex-col items-center justify-center px-4 py-8 space-y-4 w-full max-w-sm mx-auto">
      <!-- Start Game Button -->
      <NuxtLink 
        to="/game-setup" 
        class="w-full py-4 px-6 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl font-bold text-lg shadow-lg active:scale-95 transition-transform duration-150 flex items-center justify-between hover:shadow-xl"
      >
        <span>{{ $t('home.startGame') }}</span>
        <span class="text-2xl">🎮</span>
      </NuxtLink>

      <!-- Manage Roles Button -->
      <NuxtLink 
        to="/roles" 
        class="w-full py-4 px-6 bg-white border-2 border-gray-200 text-gray-800 rounded-2xl font-bold text-lg shadow-md active:scale-95 transition-transform duration-150 flex items-center justify-between hover:border-amber-600 hover:bg-amber-50"
      >
        <span>{{ $t('home.manageRoles') }}</span>
        <span class="text-2xl">🃏</span>
      </NuxtLink>

      <!-- Manage Players Button -->
      <NuxtLink 
        to="/players" 
        class="w-full py-4 px-6 bg-white border-2 border-gray-200 text-gray-800 rounded-2xl font-bold text-lg shadow-md active:scale-95 transition-transform duration-150 flex items-center justify-between hover:border-blue-600 hover:bg-blue-50"
      >
        <span>{{ $t('home.managePlayers') }}</span>
        <span class="text-2xl">👥</span>
      </NuxtLink>

      <!-- Settings Button (Disabled) -->
      <button 
        disabled
        class="w-full py-4 px-6 bg-gray-100 text-gray-400 rounded-2xl font-bold text-lg opacity-60 cursor-not-allowed flex items-center justify-between"
      >
        <span>{{ $t('home.viewStats') }}</span>
        <span class="text-2xl">⚙️</span>
      </button>
    </section>
  </div>
</template>

<script setup lang="ts">
// Home page - no logic needed for Phase 1
</script>
