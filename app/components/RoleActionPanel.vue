<template>
  <div class="space-y-6">
    <!-- Role Progress Navigation -->
    <div class="bg-white rounded-xl p-6 shadow-md">
      <h2 class="text-lg font-bold text-gray-800 mb-4">{{ $t('nightPhase.roleActionPanel') }}</h2>
      
      <!-- Progress Indicator -->
      <div class="mb-4">
        <div class="flex justify-between items-center mb-2">
          <span class="text-sm font-medium text-gray-700">
            {{ $t('nightPhase.roleAction') }} {{ currentRoleIndex + 1 }}/{{ activeRoles.length }}
          </span>
          <span class="text-xs font-medium text-gray-500">
            {{ Math.round((currentRoleIndex / Math.max(activeRoles.length, 1)) * 100) }}%
          </span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            :style="{ width: ((currentRoleIndex + 1) / Math.max(activeRoles.length, 1)) * 100 + '%' }"
            class="bg-gradient-to-r from-blue-500 to-purple-500 h-full transition-all duration-300"
          />
        </div>
      </div>

      <!-- Role List -->
      <div class="space-y-2 max-h-64 overflow-y-auto">
        <button
          v-for="(role, index) in activeRoles"
          :key="role.id"
          @click="selectRole(index)"
          :class="[
            'w-full px-4 py-3 rounded-lg text-left transition-all duration-200 flex items-center justify-between',
            index === currentRoleIndex
              ? 'bg-blue-600 text-white shadow-md'
              : completedRoles.includes(index)
              ? 'bg-green-100 text-green-900 border border-green-300'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          ]"
        >
          <span class="font-medium">{{ getRoleName(role.id) }}</span>
          <span v-if="completedRoles.includes(index)" class="text-sm">✓</span>
          <span v-else-if="index === currentRoleIndex" class="text-sm animate-pulse">◆</span>
        </button>
      </div>

      <!-- No Active Roles Message -->
      <div v-if="activeRoles.length === 0" class="text-center py-8 text-gray-500">
        <p class="text-lg font-medium">{{ $t('nightPhase.noActiveRoles') }}</p>
        <p class="text-sm mt-2">{{ $t('nightPhase.proceedToDay') }}</p>
      </div>
    </div>

    <!-- Current Role Action Component -->
    <div v-if="currentRole && activeRoles.length > 0">
      <!-- Werewolf Role Action Panel -->
      <RoleActionPanelWerewolf
        v-if="isWerewolfRole"
        @confirm="handleActionConfirm"
        @skip="handleActionSkip"
      />
      
      <!-- Other Roles (Generic) -->
      <RoleAction
        v-else
        :role-id="currentRole.id"
        :player-id="currentRolePlayer?.id || ''"
        :action-type="getRoleActionType(currentRole.id)"
        :can-skip="true"
        @confirm="handleActionConfirm"
        @skip="handleActionSkip"
      />
    </div>

    <!-- Navigation Buttons -->
    <div v-if="activeRoles.length > 0" class="flex gap-3">
      <button
        @click="previousRole"
        :disabled="currentRoleIndex === 0"
        class="flex-1 py-3 px-4 rounded-lg font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        ← {{ $t('common.back') }}
      </button>
      <button
        @click="nextRole"
        :disabled="currentRoleIndex === activeRoles.length - 1"
        class="flex-1 py-3 px-4 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {{ $t('common.next') }} →
      </button>
    </div>

    <!-- Phase Complete Action -->
    <div v-if="isNightPhaseComplete && activeRoles.length > 0" class="bg-green-50 border-2 border-green-300 rounded-xl p-6 text-center">
      <p class="text-lg font-bold text-green-900 mb-4">✓ {{ $t('nightPhase.actionCompleted') }}</p>
      <button
        @click="proceedToDay"
        class="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all active:scale-95"
      >
        {{ $t('nightPhase.proceedToDay') }} →
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { RoleActionType } from '~/types/game'
import { useGameStore } from '~/stores/game'
import { useRolesStore } from '~/stores/roles'
import { usePlayersStore } from '~/stores/players'
import RoleAction from './RoleAction.vue'
import RoleActionPanelWerewolf from './RoleActionPanelWerewolf.vue'

interface Props {
  readonly: boolean
}

const props = withDefaults(defineProps<Props>(), {
  readonly: false,
})

const emit = defineEmits<{
  (e: 'phase-complete'): void
}>()

const gameStore = useGameStore()
const rolesStore = useRolesStore()
const playersStore = usePlayersStore()

const completedRoles = ref<number[]>([])

// Get all roles that need to act this night
const activeRoles = computed(() => {
  return rolesStore.roles.filter(role => {
    if (role.nightly === 'NEVER') return false
    if (role.nightly === 'FIRST_NIGHT' && gameStore.round !== 1) return false
    // Check if any alive player has this role
    return Object.entries(gameStore.playerRoles).some(
      ([playerId, roleId]) => roleId === role.id && gameStore.alivePlayers.includes(playerId)
    )
  })
})

const currentRoleIndex = computed(() => gameStore.currentNightRoleIndex)

const currentRole = computed(() => activeRoles.value[currentRoleIndex.value])

const currentRolePlayer = computed(() => {
  if (!currentRole.value) return null
  const playerId = Object.entries(gameStore.playerRoles).find(
    ([playerId, roleId]) => roleId === currentRole.value?.id && gameStore.alivePlayers.includes(playerId)
  )?.[0]
  return playerId ? playersStore.getPlayerById(playerId) : null
})

const isWerewolfRole = computed(() => {
  return currentRole.value?.id.toLowerCase().includes('werewolf') || false
})

const getRoleName = (roleId: string): string => {
  return rolesStore.getRoleById(roleId)?.name || 'Unknown'
}

const getRoleActionType = (roleId: string): RoleActionType => {
  const roleName = roleId.toLowerCase()
  
  // Roles with single target selection
  if (['werewolf', 'seer', 'hunter', 'bodyguard', 'witch', 'aura-seer', 'priest'].includes(roleName)) {
    return 'SELECT_TARGET'
  }
  
  // Roles with dual selection
  if (['cupid', 'dire-wolf', 'hoodlum'].includes(roleName)) {
    return 'DUAL_SELECT'
  }
  
  // Special cases
  if (['mayor', 'villager'].includes(roleName)) {
    return 'NONE'
  }
  
  return 'SELECT_TARGET'
}

const selectRole = (index: number) => {
  gameStore.setCurrentNightRoleIndex(index)
}

const previousRole = () => {
  if (currentRoleIndex.value > 0) {
    gameStore.setCurrentNightRoleIndex(currentRoleIndex.value - 1)
  }
}

const nextRole = () => {
  if (currentRoleIndex.value < activeRoles.value.length - 1) {
    gameStore.setCurrentNightRoleIndex(currentRoleIndex.value + 1)
  }
}

const handleActionConfirm = (action: { targetPlayerId?: string, secondaryTargetPlayerId?: string }) => {
  console.log('action', action);
  
  if (currentRole.value && currentRolePlayer.value) {
    gameStore.addNightAction({
      roleId: currentRole.value.id,
      playerId: currentRolePlayer.value.id,
      actionType: getRoleActionType(currentRole.value.id),
      targetPlayerId: action.targetPlayerId,
      secondaryTargetPlayerId: action.secondaryTargetPlayerId,
      timestamp: Date.now(),
    })
    
    // Mark this role as completed
    if (!completedRoles.value.includes(currentRoleIndex.value)) {
      completedRoles.value.push(currentRoleIndex.value)
    }
    
    // Move to next role
    if (currentRoleIndex.value < activeRoles.value.length - 1) {
      nextRole()
    }
  }
}

const handleActionSkip = () => {
  if (currentRole.value) {
    gameStore.addNightAction({
      roleId: currentRole.value.id,
      playerId: currentRolePlayer.value?.id || '',
      actionType: 'SKIP',
      timestamp: Date.now(),
    })
    
    // Mark as completed
    if (!completedRoles.value.includes(currentRoleIndex.value)) {
      completedRoles.value.push(currentRoleIndex.value)
    }
    
    // Move to next
    if (currentRoleIndex.value < activeRoles.value.length - 1) {
      nextRole()
    }
  }
}

const isNightPhaseComplete = computed(() => {
  return activeRoles.value.length > 0 && completedRoles.value.length === activeRoles.value.length
})

const proceedToDay = () => {
  emit('phase-complete')
}
</script>

