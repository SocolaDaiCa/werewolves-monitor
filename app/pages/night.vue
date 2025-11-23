<template>
    <ion-menu content-id="page-night">
        <ion-header>
            <ion-toolbar>
                <ion-title>Roles</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content>
            <ion-list>
                <ion-item
                    v-for="(role, index) in allRoles"
                    :key="role.id"
                    @click="selectRole(index)"
                >
                    <ion-label>
                        <h2>{{ role.nameVi }}</h2>
                        <p>{{ role.descriptionVi }}</p>
                    </ion-label>
                </ion-item>
            </ion-list>
        </ion-content>
    </ion-menu>
    <ion-page id="page-night">
        <ion-header>
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-back-button default-href="/"></ion-back-button>
                </ion-buttons>
                <ion-title>
                    🌙 {{ $t('game.night') }} {{ gameStore.round }}
                </ion-title>
                <ion-buttons slot="end">
                    <ion-menu-button></ion-menu-button>
                </ion-buttons>
            </ion-toolbar>
        </ion-header>
        <ion-content>
            <!-- Main Content -->
            <div class="flex-1">
                <div class="max-w-6xl mx-auto space-y-6">
                    <!-- Role Progress Navigation -->
                    <div class="bg-white rounded-xl p-6 shadow-md ion-hide-sm-down">
                        <h2 class="text-lg font-bold text-gray-800 mb-4">{{ $t('nightPhase.roleActionPanel') }}</h2>

                        <!-- Progress Indicator -->
                        <div class="mb-4">
                            <div class="flex justify-between items-center mb-2">
                                    <span class="text-sm font-medium text-gray-700">
                                        {{ $t('nightPhase.roleAction') }} {{ gameStore.currentNightRoleIndex + 1 }}/{{ allRoles.length }}
                                    </span>
                                <span class="text-xs font-medium text-gray-500">
                                        {{ Math.round((gameStore.currentNightRoleIndex / Math.max(allRoles.length, 1)) * 100) }}%
                                    </span>
                            </div>
                            <div class="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                <div
                                    :style="{ width: ((gameStore.currentNightRoleIndex + 1) / Math.max(allRoles.length, 1)) * 100 + '%' }"
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
                                    index === gameStore.currentNightRoleIndex && !roleIdsDisabled.has(role.id)
                                        ? 'bg-blue-600 text-white shadow-md'
                                        : index === gameStore.currentNightRoleIndex && roleIdsDisabled.has(role.id)
                                            ? 'bg-red-400 text-white shadow-md opacity-60'
                                            : completedRoles.includes(index)
                                            ? 'bg-green-100 text-green-900 border border-green-300'
                                                : roleIdsDisabled.has(role.id)
                                                    ? 'bg-gray-300 text-gray-600 border border-gray-400 opacity-50'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                ]"
                            >
                                <span class="font-medium flex items-center gap-2">
                                    <span v-if="roleIdsDisabled.has(role.id)" class="text-xs">☠️</span>
                                        {{ getRoleName(role.id) }}
                                    </span>
                                <span v-if="completedRoles.includes(index)" class="text-sm">✓</span>
                                <span v-else-if="index === gameStore.currentNightRoleIndex" class="text-sm animate-pulse">◆</span>
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
                            v-if="currentRole.id === RoleId.WEREWOLF"
                            :is-disabled="roleIdsDisabled.has(currentRole.id)"
                            @confirm="handleActionConfirm"
                            @skip="handleActionSkip"
                        />

                        <!-- Seer Role Action Panel -->
                        <RoleActionPanelSeer
                            v-else-if="currentRole.id === RoleId.SEER"
                            :is-disabled="roleIdsDisabled.has(currentRole.id)"
                            @confirm="handleActionConfirm"
                            @skip="handleActionSkip"
                        />

                        <!-- Witch Role Action Panel -->
                        <RoleActionPanelWitch
                            v-else-if="currentRole.id === RoleId.WITCH"
                            :is-disabled="roleIdsDisabled.has(currentRole.id)"
                            @confirm="handleActionConfirm"
                            @skip="handleActionSkip"
                        />

                        <!-- Body Guard Role Action Panel -->
                        <RoleActionPanelBodyguard
                            v-else-if="currentRole.id === RoleId.BODYGUARD"
                            :is-disabled="roleIdsDisabled.has(currentRole.id)"
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
                            :is-disabled="roleIdsDisabled.has(currentRole.id)"
                            @confirm="handleActionConfirm"
                            @skip="handleActionSkip"
                        />
                    </div>

                    <!-- Navigation Buttons -->
                    <div v-if="allRoles.length > 0" class="flex gap-3">
                        <button
                            @click="previousRole"
                            :disabled="gameStore.currentNightRoleIndex === 0"
                            class="flex-1 py-3 px-4 rounded-lg font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            ← {{ $t('common.back') }}
                        </button>
                        <button
                            @click="nextRole"
                            :disabled="gameStore.currentNightRoleIndex === allRoles.length - 1"
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
            </div>

            <!-- Fixed Bottom Buttons -->
            <div class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300 px-6 py-4 shadow-2xl">
                <div class="max-w-6xl mx-auto flex gap-4">
                    <button
                        @click="goToMenu"
                        class="flex-1 py-3 px-4 bg-gray-500 text-white rounded-lg font-medium hover:bg-gray-600 transition-colors"
                    >
                        {{ $t('common.back') }}
                    </button>

                    <button
                        @click="skipToDay"
                        class="flex-1 py-3 px-4 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors"
                    >
                        Skip Night
                    </button>
                </div>
            </div>
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { RoleActionType } from '~/types/game'
import { NightlyActivity, RoleFaction, RoleId } from '~/types/role'
import { useGameStore } from '~/stores/game'
import { useRolesStore } from '~/stores/roles'
import { usePlayersStore } from '~/stores/players'
import RoleAction from '~/components/RoleAction.vue'
import RoleActionPanelWerewolf from '~/components/RoleActionPanelWerewolf.vue'
import RoleActionPanelSeer from '~/components/RoleActionPanelSeer.vue'
import RoleActionPanelWitch from '~/components/RoleActionPanelWitch.vue'
import RoleActionPanelBodyguard from '~/components/RoleActionPanelBodyguard.vue'

const router = useRouter()
const gameStore = useGameStore()
const rolesStore = useRolesStore()
const playersStore = usePlayersStore()

const completedRoles = ref<number[]>([])

// Get all roles (including dead players for appearance)
const allRoles = computed(() => {
    return rolesStore.roles
        .filter(role => {
            if (role.nightly === NightlyActivity.NEVER) return false
            if (role.nightly === NightlyActivity.FIRST_NIGHT && gameStore.round !== 1) return false
            // Check if any player (alive or dead) has this role
            return Object.entries(gameStore.playerRoles).some(
                ([, roleId]) => roleId === role.id
            )
        })
        .sort((a, b) => (a.nightOrder || 999) - (b.nightOrder || 999))
})

// Check if a role is disabled (all players with this role are dead)
const roleIdsDisabled = computed(() => {
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

const currentRole = computed(() => allRoles.value[gameStore.currentNightRoleIndex])

const currentRolePlayer = computed(() => {
    if (!currentRole.value) return null
    // Get player with this role (alive or dead)
    const playerId = Object.entries(gameStore.playerRoles).find(
        ([, roleId]) => roleId === currentRole.value?.id
    )?.[0]
    return playerId ? playersStore.getPlayerById(playerId) : null
})

const getRoleName = (roleId: string): string => {
    return rolesStore.getRoleById(roleId)?.name || 'Unknown'
}

const getRoleActionType = (roleId: string): RoleActionType => {
    const role = rolesStore.getRoleById(roleId)

    // If role has actionType defined, use it
    if (role?.actionType) {
        return role.actionType as RoleActionType
    }

    // Fallback for roles without actionType (backward compatibility)
    const roleName = roleId.toLowerCase()

    // Roles with single target selection
    if (['werewolf', 'seer', 'hunter', 'bodyguard', 'witch', 'aura-seer', 'priest'].includes(roleName)) {
        return RoleActionType.SELECT_PLAYER
    }

    // Roles with dual selection
    if (['cupid', 'dire-wolf', 'hoodlum'].includes(roleName)) {
        return RoleActionType.DUAL_SELECT
    }

    // Special cases
    if (['mayor', 'villager'].includes(roleName)) {
        return RoleActionType.NONE
    }

    return RoleActionType.SELECT_PLAYER
}

const selectRole = (index: number) => {
    gameStore.setCurrentNightRoleIndex(index)
}

const previousRole = () => {
    if (gameStore.currentNightRoleIndex > 0) {
        gameStore.setCurrentNightRoleIndex(gameStore.currentNightRoleIndex - 1)
    }
}

const nextRole = () => {
    if (gameStore.currentNightRoleIndex < allRoles.value.length - 1) {
        gameStore.setCurrentNightRoleIndex(gameStore.currentNightRoleIndex + 1)
    }
}

const handleActionConfirm = (action: { targetPlayerId?: string, secondaryTargetPlayerId?: string }) => {
    if (currentRole.value && currentRolePlayer.value) {
        // Log the action to game log
        if (action.targetPlayerId) {
            if (currentRole.value.id == RoleId.WEREWOLF) {
                gameStore.currentDayOrNightAction.werewolfKillToPlayerId = action.targetPlayerId
            }
            if (currentRole.value.id == RoleId.WITCH) {
                gameStore.currentDayOrNightAction.witchHealToPlayerId = action.targetPlayerId
                gameStore.currentDayOrNightAction.witchPoisonToPlayerId = action.secondaryTargetPlayerId
            }
            if (currentRole.value.id == RoleId.SEER) {
                gameStore.currentDayOrNightAction.seerInvestigatePlayerId = action.targetPlayerId
            }
            if (currentRole.value.id == RoleId.BODYGUARD) {
                gameStore.currentDayOrNightAction.bodyguardProtectToPlayerId = action.targetPlayerId
                gameStore.yesterdayBodyguardProtectToPlayerId = gameStore.currentDayOrNightAction.bodyguardProtectToPlayerId
            }
        }
        // Mark this role as completed
        if (!completedRoles.value.includes(gameStore.currentNightRoleIndex)) {
            completedRoles.value.push(gameStore.currentNightRoleIndex)
            completedRoles.value = [...(new Set(completedRoles.value))]
        }

        // Move to next role
        if (gameStore.currentNightRoleIndex < allRoles.value.length - 1) {
            nextRole()
        }
    }
}

const handleActionSkip = () => {
    if (currentRole.value) {
        // Mark as completed
        if (!completedRoles.value.includes(gameStore.currentNightRoleIndex)) {
            completedRoles.value.push(gameStore.currentNightRoleIndex)
            completedRoles.value = [...(new Set(completedRoles.value))]
        }

        // Move to next
        if (gameStore.currentNightRoleIndex < allRoles.value.length - 1) {
            nextRole()
        }
    }
}

const isNightPhaseComplete = computed(() => {
    return allRoles.value.length > 0 && completedRoles.value.length === (allRoles.value.length - roleIdsDisabled.value.size)
})

const proceedToDay = () => {
    completeNightPhase()
}

/**
 * Complete night phase and move to day
 */
const completeNightPhase = () => {
    // Update alive players list (remove eliminated players)
    gameStore.updateAlivePlayers()

    // Check win conditions after night phase eliminations
    const winCondition = gameStore.checkWinConditions()

    console.log('winCondition', winCondition)

    if (winCondition) {
        // Game has ended
        gameStore.endGame()
        // Navigate to game end screen with winner info
        router.push({
            name: 'game-end___en',
            params: { winner: winCondition.winner, reason: winCondition.reason },
        })
        return
    }

    gameStore.nextPhase()
    gameStore.clearDayVotes()
    router.push('/day')
}

/**
 * Skip night phase
 */
const skipToDay = () => {
    completeNightPhase()
}

/**
 * Return to menu
 */
const goToMenu = () => {
    gameStore.resetGame()
    router.push('/')
}
</script>

