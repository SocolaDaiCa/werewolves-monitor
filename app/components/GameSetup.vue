<template>
  <div class="min-h-screen bg-gradient-to-b from-slate-50 to-white">
    <!-- Header -->
    <div class="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-8 rounded-b-3xl shadow-lg sticky top-0 z-10">
      <h1 class="text-3xl md:text-4xl font-bold mb-2">{{ $t('gameSetup.title') }}</h1>
      <p class="text-green-100">{{ $t('gameSetup.selectPlayers') }}</p>
    </div>

    <!-- Content -->
    <div class="px-6 py-8 max-w-7xl mx-auto">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Player Selection Panel -->
        <div class="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
          <PlayerSelector />
        </div>

        <!-- Role Confirmation Panel -->
        <div class="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
          <RoleConfirmation />
        </div>
      </div>

      <!-- Validation Summary (Mobile View) -->
      <div class="lg:hidden mt-8">
        <div
          :class="[
            'rounded-xl p-4 border-2',
            isValid
              ? 'bg-green-50 border-green-300'
              : 'bg-red-50 border-red-300'
          ]"
        >
          <div class="flex gap-3">
            <div class="text-3xl">{{ isValid ? '✅' : '⚠️' }}</div>
            <div>
              <p
                :class="[
                  'font-semibold',
                  isValid ? 'text-green-800' : 'text-red-800'
                ]"
              >
                {{ isValid ? 'Ready to Start!' : 'Fix Mismatches' }}
              </p>
              <p
                class="text-sm mt-1"
                :class="{
                  'text-green-700': (isValid ? 1 : 0),
                  'text-red-700': (isValid ? 0 : 1)
                }"
              >
                {{ validationMessage }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-20">
        <div class="max-w-7xl mx-auto px-6 py-4 flex gap-3 sm:gap-4">
          <NuxtLink
            to="/"
            class="flex-1 px-4 py-3 bg-gray-400 hover:bg-gray-500 text-white font-semibold rounded-lg transition text-center"
          >
            {{ $t('common.back') }}
          </NuxtLink>
          <button
            @click="startGame"
            :disabled="!isValid"
            :class="[
              'flex-1 px-4 py-3 font-semibold rounded-lg transition text-center',
              isValid
                ? 'bg-green-500 hover:bg-green-600 text-white cursor-pointer'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            ]"
            type="button"
          >
            {{ $t('gameSetup.startGameBtn') }}
          </button>
        </div>
      </div>

      <!-- Spacer for Fixed Buttons -->
      <div class="h-20"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useGameStore } from '~/stores/game'
import { useRolesStore } from '~/stores/roles'
import { usePlayersStore } from '~/stores/players'
import PlayerSelector from '~/components/PlayerSelector.vue'
import RoleConfirmation from '~/components/RoleConfirmation.vue'

const gameStore = useGameStore()
const rolesStore = useRolesStore()
const playersStore = usePlayersStore()
const router = useRouter()

// Computed properties
computed(() => gameStore.players.length);
const totalRoles = computed(() => rolesStore.totalRoleCount)

const isValid = computed<boolean>(() => {
  // Ensure we're watching the reactive object and all its properties
  // by accessing Object.keys which forces full object reactivity
  Object.keys(rolesStore.selectedRoles)
  return playersStore.selectedPlayers.length === totalRoles.value && totalRoles.value > 0 && playersStore.selectedPlayers.length >= 2
})

const validationMessage = computed(() => {
  const selectedCount = playersStore.selectedPlayers.length
  if (selectedCount === 0 || totalRoles.value === 0) {
    return 'Please select players and configure roles'
  }
  if (selectedCount !== totalRoles.value) {
    const diff = Math.abs(selectedCount - totalRoles.value)
    return selectedCount > totalRoles.value
      ? `Need ${diff} more role(s)`
      : `Too many role(s) by ${diff}`
  }
  return 'All set! Ready to begin'
})

// Start game handler
async function startGame() {
  if (!isValid.value) return

  try {
    // Initialize game with selected players and roles
    console.log('playersStore.selectedPlayerIds', playersStore.selectedPlayerIds)
    console.log('rolesStore.selectedRoles', rolesStore.selectedRoles)
    gameStore.initializeGame(
      playersStore.selectedPlayerIds,
      rolesStore.selectedRoles
    )

    // Navigate to night zero (role reveal) page
    await router.push('/night-zero')
  } catch (error) {
    console.error('Failed to start game:', error)
  }
}
</script>

