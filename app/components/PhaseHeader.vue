<template>
  <div class="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-8 rounded-b-3xl shadow-lg">
    <!-- Main Title -->
    <div class="mb-4">
      <h1 class="text-4xl font-bold mb-2">
        {{ currentPhaseName }} {{ currentRound }}
      </h1>
      <p class="text-blue-100 text-lg">{{ phaseSubtitle }}</p>
    </div>

    <!-- Stats Bar -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
      <!-- Living Players Count -->
      <div class="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
        <p class="text-blue-100 text-sm font-medium mb-1">{{ $t('phaseHeader.alivePlayers', { count: alivePlayers.length }) }}</p>
        <p class="text-3xl font-bold">{{ alivePlayers.length }}</p>
      </div>

      <!-- Round Counter -->
      <div class="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
        <p class="text-blue-100 text-sm font-medium mb-1">{{ $t('game.round') }}</p>
        <p class="text-3xl font-bold">{{ currentRound }}</p>
      </div>

      <!-- Active Roles Count (for Night Phase) -->
      <div v-if="isNightPhase" class="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
        <p class="text-blue-100 text-sm font-medium mb-1">Active Roles</p>
        <p class="text-3xl font-bold">{{ activeRoleCount }}/{{ totalRoleCount }}</p>
      </div>

      <!-- Eliminated Players Count -->
      <div class="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
        <p class="text-blue-100 text-sm font-medium mb-1">Eliminated</p>
        <p class="text-3xl font-bold">{{ eliminatedPlayers.length }}</p>
      </div>
    </div>

    <!-- Progress Bar -->
    <div class="mt-6">
      <div class="bg-white/30 rounded-full h-2 overflow-hidden">
        <div
          :style="{ width: progressPercent + '%' }"
          class="bg-green-400 h-full transition-all duration-500 ease-out"
        />
      </div>
      <p class="text-blue-100 text-xs mt-2">{{ Math.round(progressPercent) }}% complete</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useGameStore } from '~/stores/game'
import { useRolesStore } from '~/stores/roles'
import { usePlayersStore } from '~/stores/players'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const gameStore = useGameStore()
const rolesStore = useRolesStore()
const playersStore = usePlayersStore()

const currentRound = computed(() => gameStore.round)
const currentPhase = computed(() => gameStore.phase)
const alivePlayers = computed(() => gameStore.alivePlayers)
const eliminatedPlayers = computed(() => gameStore.eliminatedPlayers)

const isNightPhase = computed(() => currentPhase.value === 'NIGHT')

const currentPhaseName = computed(() => {
  if (currentPhase.value === 'NIGHT') {
    return t('game.night')
  } else if (currentPhase.value === 'DAY') {
    return t('game.day')
  }
  return t('game.phase')
})

const phaseSubtitle = computed(() => {
  if (isNightPhase.value) {
    const roleCount = activeRoleCount.value
    return roleCount > 0 ? `${roleCount} ${t('nightPhase.roleActionPanel')} waiting` : t('nightPhase.noActiveRoles')
  }
  return t('game.phaseTransition', { phase: currentPhaseName.value })
})

// Calculate active roles that need to act this night
const activeRoleCount = computed(() => {
  // Roles that can act (their nightly property is ALWAYS for this night, or FIRST_NIGHT for night 1)
  const activeRoles = rolesStore.roles.filter(role => {
    if (role.nightly === 'NEVER') return false
    if (role.nightly === 'FIRST_NIGHT' && currentRound.value !== 1) return false
    // Check if any player with this role is alive
    return Object.entries(gameStore.playerRoles).some(
      ([playerId, roleId]) => roleId === role.id && alivePlayers.value.includes(playerId)
    )
  })
  return activeRoles.length
})

const totalRoleCount = computed(() => {
  return Object.values(gameStore.selectedRoles).reduce((sum, count) => sum + count, 0)
})

// Progress calculation: (eliminated count / total players) * 100
const progressPercent = computed(() => {
  const total = gameStore.players.length
  return total > 0 ? (eliminatedPlayers.value.length / total) * 100 : 0
})
</script>

