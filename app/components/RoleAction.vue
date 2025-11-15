<template>
  <div class="bg-white rounded-2xl shadow-lg border-2 border-gray-200 overflow-hidden">
    <!-- Header -->
    <div :class="`${roleColor} text-white px-6 py-6`">
      <h3 class="text-2xl font-bold mb-2">{{ roleName }}</h3>
      <p class="text-sm opacity-90">{{ roleDescription }}</p>
    </div>

    <!-- Action Content -->
    <div class="p-6">
      <!-- Action Description -->
      <p class="text-gray-700 mb-4 font-medium">
        {{ actionPrompt }}
      </p>

      <!-- Player Selection -->
      <div v-if="actionType === 'SELECT_PLAYER' || actionType === 'SELECT_TARGET'" class="space-y-3">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-48 overflow-y-auto">
          <button
            v-for="player in selectablePlayers"
            :key="player.id"
            @click="selectPlayer(player.id)"
            :class="[
              'p-3 rounded-lg border-2 transition-all duration-200 flex items-center gap-2',
              selectedPlayerId === player.id
                ? 'border-green-500 bg-green-50'
                : 'border-gray-300 bg-gray-50 hover:border-gray-400'
            ]"
          >
            <img v-if="player.avatar" :src="player.avatar" :alt="player.name" class="w-8 h-8 rounded-full object-cover" />
            <span v-else class="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-white text-xs flex items-center justify-center font-bold">
              {{ player.name.charAt(0).toUpperCase() }}
            </span>
            <span class="font-medium text-gray-800">{{ player.name }}</span>
            <span v-if="selectedPlayerId === player.id" class="ml-auto text-green-500">✓</span>
          </button>
        </div>
      </div>

      <!-- Dual Selection (for Cupid, etc.) -->
      <div v-if="actionType === 'DUAL_SELECT'" class="space-y-3">
        <p class="text-sm text-gray-600 mb-3">Select 2 different players</p>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-48 overflow-y-auto">
          <button
            v-for="player in selectablePlayers"
            :key="player.id"
            @click="toggleSecondarySelect(player.id)"
            :class="[
              'p-3 rounded-lg border-2 transition-all duration-200 flex items-center gap-2',
              isSecondarySelected(player.id)
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 bg-gray-50 hover:border-gray-400'
            ]"
          >
            <img v-if="player.avatar" :src="player.avatar" :alt="player.name" class="w-8 h-8 rounded-full object-cover" />
            <span v-else class="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-white text-xs flex items-center justify-center font-bold">
              {{ player.name.charAt(0).toUpperCase() }}
            </span>
            <span class="font-medium text-gray-800">{{ player.name }}</span>
          </button>
        </div>
        <p class="text-xs text-gray-500 mt-2">
          Selected: {{ [selectedPlayerId, secondarySelectedPlayerId].filter(Boolean).length }}/2
        </p>
      </div>

      <!-- Skip Option -->
      <div v-if="canSkip" class="mt-4 pt-4 border-t border-gray-200">
        <button
          @click="skipAction"
          class="w-full py-2 px-4 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          {{ $t('nightPhase.skipAction') }}
        </button>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex gap-3 px-6 py-4 bg-gray-50 border-t border-gray-200">
      <button
        @click="confirmAction"
        :disabled="!isActionValid"
        :class="[
          'flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200',
          isActionValid
            ? 'bg-green-500 text-white hover:bg-green-600 active:scale-95'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        ]"
      >
        {{ $t('nightPhase.confirmAction') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { RoleActionType } from '~/types/game'
import { usePlayersStore } from '~/stores/players'
import { useRolesStore } from '~/stores/roles'
import { useGameStore } from '~/stores/game'

interface Props {
  roleId: string
  playerId: string
  actionType: RoleActionType
  canSkip?: boolean
}

interface Emits {
  (e: 'confirm', action: { targetPlayerId?: string, secondaryTargetPlayerId?: string }): void
  (e: 'skip'): void
}

const props = withDefaults(defineProps<Props>(), {
  canSkip: true,
})

const emit = defineEmits<Emits>()

const playersStore = usePlayersStore()
const rolesStore = useRolesStore()
const gameStore = useGameStore()

const selectedPlayerId = ref<string>()
const secondarySelectedPlayerId = ref<string>()

const role = computed(() => rolesStore.getRoleById(props.roleId))

const roleName = computed(() => {
  const currentRole = role.value
  return currentRole?.name || 'Unknown Role'
})

const roleDescription = computed(() => {
  const currentRole = role.value
  return currentRole?.description || ''
})

const roleColor = computed(() => {
  const currentRole = role.value
  if (!currentRole) return 'bg-gray-500'
  switch (currentRole.faction) {
    case 'WEREWOLF':
      return 'bg-red-600'
    case 'CULT':
      return 'bg-orange-600'
    case 'VAMPIRE':
      return 'bg-purple-600'
    case 'VILLAGER':
    case 'SPECIAL':
    default:
      return 'bg-blue-600'
  }
})

const actionPrompt = computed(() => {
  switch (props.actionType) {
    case 'SELECT_PLAYER':
      return 'Select a player:'
    case 'SELECT_TARGET':
      return 'Select your target:'
    case 'DUAL_SELECT':
      return 'Select two different players:'
    case 'SKIP':
      return 'This role has no action this night.'
    default:
      return 'Awaiting action...'
  }
})

const selectablePlayers = computed(() => {
  return gameStore.alivePlayers
    .map(playerId => playersStore.getPlayerById(playerId))
    .filter(Boolean) as typeof playersStore.allPlayers
})

const isActionValid = computed(() => {
  if (props.actionType === 'SELECT_PLAYER' || props.actionType === 'SELECT_TARGET') {
    return !!selectedPlayerId.value
  }
  if (props.actionType === 'DUAL_SELECT') {
    return !!selectedPlayerId.value && !!secondarySelectedPlayerId.value && selectedPlayerId.value !== secondarySelectedPlayerId.value
  }
  return true
})

const selectPlayer = (playerId: string) => {
  selectedPlayerId.value = selectedPlayerId.value === playerId ? undefined : playerId
}

const toggleSecondarySelect = (playerId: string) => {
  if (selectedPlayerId.value === playerId) {
    selectedPlayerId.value = secondarySelectedPlayerId.value
    secondarySelectedPlayerId.value = undefined
  } else if (secondarySelectedPlayerId.value === playerId) {
    secondarySelectedPlayerId.value = undefined
  } else if (!selectedPlayerId.value) {
    selectedPlayerId.value = playerId
  } else if (!secondarySelectedPlayerId.value) {
    secondarySelectedPlayerId.value = playerId
  } else {
    // Replace one (prefer replacing secondary)
    secondarySelectedPlayerId.value = playerId
  }
}

const isSecondarySelected = (playerId: string) => {
  return selectedPlayerId.value === playerId || secondarySelectedPlayerId.value === playerId
}

const confirmAction = () => {
  if (isActionValid.value) {
    emit('confirm', {
      targetPlayerId: selectedPlayerId.value,
      secondaryTargetPlayerId: secondarySelectedPlayerId.value,
    })
  }
}

const skipAction = () => {
  emit('skip')
}
</script>

