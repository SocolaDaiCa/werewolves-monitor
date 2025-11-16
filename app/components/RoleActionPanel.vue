<template>
  <div class="space-y-6">
    <!-- Role Progress Navigation -->
    <div class="bg-white rounded-xl p-6 shadow-md">
      <h2 class="text-lg font-bold text-gray-800 mb-4">{{ $t('nightPhase.roleActionPanel') }}</h2>
      
      <!-- Progress Indicator -->
      <div class="mb-4">
        <div class="flex justify-between items-center mb-2">
          <span class="text-sm font-medium text-gray-700">
            {{ $t('nightPhase.roleAction') }} {{ currentRoleIndex + 1 }}/{{ allRoles.length }}
          </span>
          <span class="text-xs font-medium text-gray-500">
            {{ Math.round((currentRoleIndex / Math.max(allRoles.length, 1)) * 100) }}%
          </span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            :style="{ width: ((currentRoleIndex + 1) / Math.max(allRoles.length, 1)) * 100 + '%' }"
            class="bg-gradient-to-r from-blue-500 to-purple-500 h-full transition-all duration-300"
          />
        </div>
      </div>

      <!-- Role List -->
      <div class="space-y-2 max-h-64 overflow-y-auto">
        <button
          v-for="(role, index) in allRoles"
          :key="role.id"
          @click="selectRole(index)"
          :class="[
            'w-full px-4 py-3 rounded-lg text-left transition-all duration-200 flex items-center justify-between',
            index === currentRoleIndex && !isRoleDisabled.has(role.id)
              ? 'bg-blue-600 text-white shadow-md'
              : index === currentRoleIndex && isRoleDisabled.has(role.id)
              ? 'bg-red-400 text-white shadow-md opacity-60'
              : completedRoles.includes(index)
              ? 'bg-green-100 text-green-900 border border-green-300'
              : isRoleDisabled.has(role.id)
              ? 'bg-gray-300 text-gray-600 border border-gray-400 opacity-50'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          ]"
        >
          <span class="font-medium flex items-center gap-2">
            <span v-if="isRoleDisabled.has(role.id)" class="text-xs">☠️</span>
            {{ getRoleName(role.id) }}
          </span>
          <span v-if="completedRoles.includes(index)" class="text-sm">✓</span>
          <span v-else-if="index === currentRoleIndex" class="text-sm animate-pulse">◆</span>
        </button>
      </div>

      <!-- No Active Roles Message -->
      <div v-if="allRoles.length === 0" class="text-center py-8 text-gray-500">
        <p class="text-lg font-medium">{{ $t('nightPhase.noActiveRoles') }}</p>
        <p class="text-sm mt-2">{{ $t('nightPhase.proceedToDay') }}</p>
      </div>
    </div>

    <!-- Current Role Action Component -->
    <div v-if="currentRole && allRoles.length > 0">
      <!-- Werewolf Role Action Panel -->
      <RoleActionPanelWerewolf
        v-if="isWerewolfRole"
        :is-disabled="isRoleDisabled.has(currentRole.id)"
        @confirm="handleActionConfirm"
        @skip="handleActionSkip"
      />
      
      <!-- Seer Role Action Panel -->
      <RoleActionPanelSeer
        v-else-if="isSeerRole"
        :is-disabled="isRoleDisabled.has(currentRole.id)"
        @confirm="handleActionConfirm"
        @skip="handleActionSkip"
      />
      
      <!-- Witch Role Action Panel -->
      <RoleActionPanelWitch
        v-else-if="isWitchRole"
        :is-disabled="isRoleDisabled.has(currentRole.id)"
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
        :is-disabled="isRoleDisabled.has(currentRole.id)"
        @confirm="handleActionConfirm"
        @skip="handleActionSkip"
      />
    </div>

    <!-- Navigation Buttons -->
    <div v-if="allRoles.length > 0" class="flex gap-3">
      <button
        @click="previousRole"
        :disabled="currentRoleIndex === 0"
        class="flex-1 py-3 px-4 rounded-lg font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        ← {{ $t('common.back') }}
      </button>
      <button
        @click="nextRole"
        :disabled="currentRoleIndex === allRoles.length - 1"
        class="flex-1 py-3 px-4 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {{ $t('common.next') }} →
      </button>
    </div>

    <!-- Phase Complete Action -->
    <div v-if="isNightPhaseComplete && allRoles.length > 0" class="bg-green-50 border-2 border-green-300 rounded-xl p-6 text-center">
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
import RoleActionPanelSeer from './RoleActionPanelSeer.vue'
import RoleActionPanelWitch from './RoleActionPanelWitch.vue'

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

// Get all roles that need to act this night (alive players only)
const activeRoles = computed(() => {
  return rolesStore.roles
    .filter(role => {
      if (role.nightly === 'NEVER') return false
      if (role.nightly === 'FIRST_NIGHT' && gameStore.round !== 1) return false
      // Check if any alive player has this role
      return Object.entries(gameStore.playerRoles).some(
        ([playerId, roleId]) => roleId === role.id && gameStore.alivePlayers.includes(playerId)
      )
    })
    .sort((a, b) => (a.nightOrder || 999) - (b.nightOrder || 999))
})

// Get all roles (including dead players for appearance)
const allRoles = computed(() => {
  return rolesStore.roles
    .filter(role => {
      if (role.nightly === 'NEVER') return false
      if (role.nightly === 'FIRST_NIGHT' && gameStore.round !== 1) return false
      // Check if any player (alive or dead) has this role
      return Object.entries(gameStore.playerRoles).some(
        ([playerId, roleId]) => roleId === role.id
      )
    })
    .sort((a, b) => (a.nightOrder || 999) - (b.nightOrder || 999))
})

// Check if a role is disabled (all players with this role are dead)
const isRoleDisabled = computed(() => {
  const disabled = new Set<string>()
  
  allRoles.value.forEach(role => {
    // Check if there's at least one alive player with this role
    const hasAlivePlayers = Object.entries(gameStore.playerRoles).some(
      ([playerId, roleId]) => 
        roleId === role.id && gameStore.alivePlayers.includes(playerId)
    )
    
    // If no alive players have this role, it's disabled
    if (!hasAlivePlayers) {
      disabled.add(role.id)
    }
  })
  
  return disabled
})

const currentRoleIndex = computed(() => gameStore.currentNightRoleIndex)

const currentRole = computed(() => allRoles.value[currentRoleIndex.value])

const currentRolePlayer = computed(() => {
  if (!currentRole.value) return null
  // Get player with this role (alive or dead)
  const playerId = Object.entries(gameStore.playerRoles).find(
    ([playerId, roleId]) => roleId === currentRole.value?.id
  )?.[0]
  return playerId ? playersStore.getPlayerById(playerId) : null
})

const isWerewolfRole = computed(() => {
  return currentRole.value?.id.toLowerCase().includes('werewolf') || false
})

const isSeerRole = computed(() => {
  return currentRole.value?.id.toLowerCase() === 'seer'
})

const isWitchRole = computed(() => {
  return currentRole.value?.id.toLowerCase() === 'witch'
})

const getRoleName = (roleId: string): string => {
  return rolesStore.getRoleById(roleId)?.name || 'Unknown'
}

const getRoleActionType = (roleId: string): RoleActionType => {
  const role = rolesStore.getRoleById(roleId)
  
  // If role has actionType defined, use it
  if (role?.actionType) {
    return role.actionType
  }
  
  // Fallback for roles without actionType (backward compatibility)
  const roleName = roleId.toLowerCase()
  
  // Roles with single target selection
  if (['werewolf', 'seer', 'hunter', 'bodyguard', 'witch', 'aura-seer', 'priest'].includes(roleName)) {
    return 'SELECT_PLAYER'
  }
  
  // Roles with dual selection
  if (['cupid', 'dire-wolf', 'hoodlum'].includes(roleName)) {
    return 'DUAL_SELECT'
  }
  
  // Special cases
  if (['mayor', 'villager'].includes(roleName)) {
    return 'NONE'
  }
  
  return 'SELECT_PLAYER'
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
  if (currentRoleIndex.value < allRoles.value.length - 1) {
    gameStore.setCurrentNightRoleIndex(currentRoleIndex.value + 1)
  }
}

/**
 * Format action log message based on role and action
 */
const formatActionLog = (
  roleId: string,
  playerId: string,
  action: { targetPlayerId?: string; secondaryTargetPlayerId?: string }
): string => {
  const player = playersStore.getPlayerById(playerId)
  const playerName = player?.name || 'Unknown'
  const roleName = rolesStore.getRoleById(roleId)?.name || 'Unknown'

  if (!action.targetPlayerId) return ''

  const targetPlayer = playersStore.getPlayerById(action.targetPlayerId)
  const targetName = targetPlayer?.name || 'Unknown'

  switch (roleId.toLowerCase()) {
    case 'seer':
      if (!action.targetPlayerId) return ''
      const targetRole = gameStore.playerRoles[action.targetPlayerId]
      const targetRoleObj = rolesStore.getRoleById(targetRole || '')
      const isWerewolf = targetRoleObj?.faction === 'WEREWOLF'
      return `🔮 ${roleName} (${playerName}) kiểm tra ${targetName} là ${isWerewolf ? 'sói 🐺' : 'không phải sói 👤'}`

    case 'werewolf':
    case 'wolf-cub':
    case 'dire-wolf':
      return `🐺 ${roleName} (${playerName}) đã cắn ${targetName}`

    case 'witch': {
      // targetPlayerId = heal target, secondaryTargetPlayerId = poison target
      const actions: string[] = []
      
      // Handle HEAL
      if (action.targetPlayerId) {
        const healPlayer = playersStore.getPlayerById(action.targetPlayerId)
        const healRoleId = gameStore.playerRoles[action.targetPlayerId]
        const healRoleObj = rolesStore.getRoleById(healRoleId || '')
        const healRoleName = healRoleObj?.name || 'Unknown'
        const healName = healPlayer?.name || 'Unknown'
        actions.push(`chữa ${healName} (${healRoleName})`)
      }
      
      // Handle POISON
      if (action.secondaryTargetPlayerId) {
        const poisonPlayer = playersStore.getPlayerById(action.secondaryTargetPlayerId)
        const poisonRoleId = gameStore.playerRoles[action.secondaryTargetPlayerId]
        const poisonRoleObj = rolesStore.getRoleById(poisonRoleId || '')
        const poisonRoleName = poisonRoleObj?.name || 'Unknown'
        const poisonName = poisonPlayer?.name || 'Unknown'
        actions.push(`độc ${poisonName} (${poisonRoleName})`)
      }
      
      if (actions.length === 0) return ''
      return `🧙 ${roleName} (${playerName}) đã ${actions.join(' và ')}`
    }

    case 'bodyguard':
    case 'priest':
      return `🛡️ ${roleName} (${playerName}) bảo vệ ${targetName}`

    case 'cupid':
      const secondaryPlayer = playersStore.getPlayerById(action.secondaryTargetPlayerId || '')
      const secondaryName = secondaryPlayer?.name || 'Unknown'
      return `💕 ${roleName} (${playerName}) ghép đôi ${targetName} và ${secondaryName}`

    case 'old-hag':
      return `👵 ${roleName} (${playerName}) nguyền rủa ${targetName}`

    case 'minion':
      return `⚫ ${roleName} (${playerName}) được tiết lộ`

    case 'mason':
      return `🧱 ${roleName} (${playerName}) nhận biết ${targetName}`

    case 'drunk':
      return `🍷 ${roleName} (${playerName}) đổi vai trò với ${targetName}`

    case 'doppelganger':
      return `👥 ${roleName} (${playerName}) chọn ${targetName} để sao chép`

    case 'aura-seer':
      if (!action.targetPlayerId) return ''
      const targetRole2 = gameStore.playerRoles[action.targetPlayerId]
      const targetRoleObj2 = rolesStore.getRoleById(targetRole2 || '')
      const isSpecial = targetRole2 && !['villager', 'werewolf'].includes(targetRole2)
      return `✨ ${roleName} (${playerName}) cảm nhận ${targetName} có vai trò đặc biệt: ${isSpecial ? 'Có' : 'Không'}`

    default:
      return `${roleName} (${playerName}) thực hiện hành động trên ${targetName}`
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

    // Log the action to game log
    const logMessage = formatActionLog(currentRole.value.id, currentRolePlayer.value.id, action)
    if (logMessage) {
      gameStore.addGameEvent(logMessage)
    }
    
    // Mark this role as completed
    if (!completedRoles.value.includes(currentRoleIndex.value)) {
      completedRoles.value.push(currentRoleIndex.value)
    }
    
    // Move to next role
    if (currentRoleIndex.value < allRoles.value.length - 1) {
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
    if (currentRoleIndex.value < allRoles.value.length - 1) {
      nextRole()
    }
  }
}

const isNightPhaseComplete = computed(() => {
  return allRoles.value.length > 0 && completedRoles.value.length === allRoles.value.length
})

const proceedToDay = () => {
  emit('phase-complete')
}
</script>

