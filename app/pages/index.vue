<template>
  <ion-page>
    <ion-content :fullscreen="true" class="ion-padding">
      <!-- Hero Section -->
      <div class="flex flex-col items-center justify-center py-8 mb-6">
        <div class="text-6xl mb-4">🐺</div>
        <h1 class="text-4xl font-bold text-center mb-3 leading-tight">
          {{ $t('home.welcome') }}
        </h1>
      </div>

      <!-- Main Menu Cards -->
      <div class="flex flex-col gap-4">
        <!-- Start Game Button -->
        <ion-button 
          expand="block"
          router-link="/game-setup"
          class="ion-button-success"
          size="large"
        >
          <ion-icon slot="start" name="gamepad"></ion-icon>
          {{ $t('home.startGame') }}
          <span slot="end" class="text-xl">🎮</span>
        </ion-button>

        <!-- Manage Roles Button -->
        <ion-button 
          expand="block"
          router-link="/roles"
          fill="outline"
          size="large"
        >
          <ion-icon slot="start" name="card"></ion-icon>
          {{ $t('home.manageRoles') }}
          <span slot="end" class="text-xl">🃏</span>
        </ion-button>

        <!-- Manage Players Button -->
        <ion-button 
          expand="block"
          router-link="/players"
          fill="outline"
          size="large"
        >
          <ion-icon slot="start" name="people"></ion-icon>
          {{ $t('home.managePlayers') }}
          <span slot="end" class="text-xl">👥</span>
        </ion-button>

        <!-- Settings Button (Disabled) -->
        <ion-button 
          expand="block"
          disabled
          fill="outline"
          size="large"
        >
          <ion-icon slot="start" name="settings"></ion-icon>
          {{ $t('home.viewStats') }}
          <span slot="end" class="text-xl">⚙️</span>
        </ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
// Home page - no logic needed for Phase 1
</script>
