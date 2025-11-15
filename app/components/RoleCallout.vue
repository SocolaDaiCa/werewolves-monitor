<template>
  <div class="w-full">
    <!-- Current Role Display -->
    <div class="bg-gradient-to-br from-purple-500 to-purple-700 text-white rounded-3xl p-8 md:p-12 mb-8 shadow-2xl">
      <div class="text-center">
        <!-- Progress -->
        <div class="text-purple-100 mb-4 font-semibold">
          {{ $t('nightZero.progressLabel', { current: currentIndex + 1, total: totalRoles }) }}
        </div>

        <!-- Role Name (Large) -->
        <h2 class="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
          {{ currentRoleName }}
        </h2>

        <!-- Role Description -->
        <p class="text-xl md:text-2xl text-purple-100 mb-8 leading-relaxed">
          {{ currentRoleDescription }}
        </p>

        <!-- Expected vs Acknowledged Count -->
        <div class="grid grid-cols-2 gap-4 max-w-md mx-auto">
          <div class="bg-purple-600 bg-opacity-50 rounded-xl p-4">
            <div class="text-sm text-purple-100 font-semibold">{{ $t('nightZero.expectedCount') }}</div>
            <div class="text-4xl font-bold mt-2">{{ expectedCount }}</div>
          </div>
          <div class="bg-purple-600 bg-opacity-50 rounded-xl p-4">
            <div class="text-sm text-purple-100 font-semibold">{{ $t('nightZero.acknowledgedCount') }}</div>
            <div class="text-4xl font-bold mt-2">{{ acknowledgedCount }}</div>
          </div>
        </div>

        <!-- Status Indicator -->
        <div
          :class="[
            'mt-6 py-3 px-4 rounded-xl font-semibold text-lg transition',
            acknowledgedCount === expectedCount
              ? 'bg-green-400 bg-opacity-30 text-green-100'
              : 'bg-orange-400 bg-opacity-30 text-orange-100'
          ]"
        >
          {{ acknowledgedCount === expectedCount ? '✅ ' : '⏳ ' }}
          {{ acknowledgedCount }}/{{ expectedCount }} {{ $t('nightZero.playerAcknowledgments') }}
        </div>
      </div>
    </div>

    <!-- Player List with Acknowledgment Status -->
    <div class="bg-white rounded-2xl p-6 shadow-md">
      <h3 class="text-xl font-bold text-gray-800 mb-4">{{ $t('nightZero.playerAcknowledgments') }}</h3>
      <div class="space-y-3">
        {{  gameStore.roleAcknowledgments }}
        {{ playersWithRole }}
        <div
          v-for="player in players"
          :key="player.id"
          :class="[
            'flex items-center gap-4 p-4 rounded-lg transition',
            !hasPlayerAcknowledged(player.id)
              ? 'bg-blue-50 border-2 border-blue-300'
              : 'bg-gray-50 border-2 border-gray-200'
          ]"
        >
          <!-- Avatar -->
          <img
            v-if="player.avatar"
            :src="player.avatar"
            :alt="player.name"
            class="w-12 h-12 rounded-full object-cover flex-shrink-0"
          />
          <div v-else class="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold flex-shrink-0">
            {{ player.name.charAt(0).toUpperCase() }}
          </div>

          <!-- Player Info -->
          <div class="flex-1 min-w-0">
            <p class="font-semibold text-gray-800 truncate">{{ player.name }}</p>
            <p
              :class="[
                'text-sm',
                !hasPlayerAcknowledged(player.id) ? 'text-blue-600 font-semibold' : 'text-gray-500'
              ]"
            >
              {{ !hasPlayerAcknowledged(player.id) ? $t('nightZero.thisIsYourRole') : $t('nightZero.noMatchingRole') }}
            </p>
          </div>

          <!-- Action Button -->
          <div class="flex-shrink-0">
            <button
              v-if="!hasPlayerAcknowledged(player.id)"
              @click="acknowledgePlayer(player.id)"
              class="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition"
            >
              ✓ Mark
            </button>
            <div
              v-else-if="hasPlayerAcknowledged(player.id)"
              class="bg-green-100 text-green-700 font-bold py-2 px-4 rounded-lg"
            >
              ✓ Done
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRolesStore, type Role } from '~/stores/roles'
import { usePlayersStore, type Player } from '~/stores/players'
import { useGameStore } from '~/stores/game'

const { locale } = useI18n()

interface Props {
  currentIndex: number
  rolesArray: Role[]
}

const props = defineProps<Props>()

const gameStore = useGameStore()
const rolesStore = useRolesStore()
const playersStore = usePlayersStore()

// Computed properties
const totalRoles = computed(() => props.rolesArray.length)

const players = computed(() => {
  // Get all players from the game store
  return gameStore.players.map(playerId => 
    playersStore.getPlayerById(playerId)
  ).filter((p): p is Player => p !== undefined)
})

const currentRole = computed(() => props.rolesArray[props.currentIndex])

const currentRoleName = computed(() => {
  if (!currentRole.value) return 'No Role'
  return locale.value === 'vi' ? currentRole.value.nameVi : currentRole.value.name
})

const currentRoleDescription = computed(() => {
  if (!currentRole.value) return 'No description'
  return locale.value === 'vi'
    ? currentRole.value.descriptionVi
    : currentRole.value.description
})

const expectedCount = computed(() => {
  const roleId = currentRole.value?.id
  if (!roleId) return 0
  return gameStore.selectedRoles[roleId] || 0
})

// Get all players assigned to this role
const playersWithRole = computed(() => {
  const roleId = currentRole.value?.id
  if (!roleId) return []

  // Get players assigned to this role from game store
  return Object.entries(gameStore.playerRoles)
    .filter(([, assignedRoleId]) => assignedRoleId === roleId)
    .map(([playerId]) => playerId)
})

const acknowledgedCount = computed(() => {
  const roleId = currentRole.value?.id
  if (!roleId) return 0
  return Object.entries(gameStore.roleAcknowledgments)
    .filter(([, ackRoleId]) => ackRoleId === roleId).length
})

// Helper functions
function hasPlayerAcknowledged(playerId: string): boolean {
  const acknowledgedRole = gameStore.roleAcknowledgments[playerId]
  return acknowledgedRole === currentRole.value?.id
}

function acknowledgePlayer(playerId: string) {
  const roleId = currentRole.value?.id
  if (roleId) {
    gameStore.acknowledgeRole(playerId, roleId)
  }
}
</script>

