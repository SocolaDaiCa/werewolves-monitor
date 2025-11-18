<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-back-button default-href="/"></ion-back-button>
                </ion-buttons>
                <ion-title>{{ $t('nightZero.title') }}</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content>
            <div class="min-h-screen pb-24">
                <!-- Header -->
                <!-- Main Content -->
                <div class="px-6 py-8 max-w-7xl mx-auto">
                    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <!-- Left: Main Role Callout (Moderator View) and Player Recognition -->
                        <div class="lg:col-span-2 space-y-6">
                            <!-- Moderator Display -->
                            <RoleCallout
                                :current-index="currentRoleIndex"
                                :roles-array="sortedRoles"
                            />
                        </div>

                        <!-- Right: Role Progress and Status -->
                        <div class="space-y-6">
                            <!-- Role Progress -->
                            <div class="bg-white rounded-2xl p-6 shadow-md h-fit sticky top-24">
                                <h3 class="text-lg font-bold text-gray-800 mb-4">{{ $t('nightZero.roleProgress') }}</h3>
                                <div class="space-y-2 max-h-96 overflow-y-auto">
                                    <button
                                        v-for="(role, index) in sortedRoles"
                                        :key="role.id"
                                        @click="goToRole(index)"
                                        :class="[
                                            'w-full text-left px-4 py-3 rounded-lg transition font-semibold',
                                            index === currentRoleIndex
                                                ? 'bg-purple-500 text-white shadow-md'
                                                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                        ]"
                                    >
                                        <div class="flex items-center justify-between">
                                            <span>{{ getRoleName(role) }}</span>
                                            <span
                                                :class="[
                                                    'text-sm font-bold px-2 py-1 rounded',
                                                    isRoleFullyAcknowledged(role.id)
                                                        ? 'bg-green-200 text-green-800'
                                                        : 'bg-orange-200 text-orange-800'
                                                ]"
                                            >
                                                {{ getAcknowledgedCountForRole(role.id) }}/{{ gameStore.selectedRoles[role.id] || 0 }}
                                            </span>
                                        </div>
                                    </button>
                                </div>
                            </div>

                            <!-- Validation Status -->
                            <div
                                :class="[
                                    'bg-white rounded-2xl p-6 shadow-md',
                                    allRolesAcknowledged
                                        ? 'border-2 border-green-400'
                                        : 'border-2 border-orange-400'
                                ]"
                            >
                                <div class="text-center mb-4">
                                    <div class="text-4xl mb-2">
                                        {{ allRolesAcknowledged ? '✅' : '⏳' }}
                                    </div>
                                    <h4
                                        :class="[
                                            'font-bold text-lg',
                                            allRolesAcknowledged ? 'text-green-700' : 'text-orange-700'
                                        ]"
                                    >
                                        {{ allRolesAcknowledged
                                            ? $t('nightZero.validationSuccess')
                                            : $t('nightZero.validationWarning')
                                        }}
                                    </h4>
                                </div>

                                <!-- Mismatches Detail -->
                                <div v-if="!allRolesAcknowledged" class="text-sm text-gray-600 space-y-2">
                                    <div
                                        v-for="role in sortedRoles"
                                        :key="role.id"
                                        v-show="!isRoleFullyAcknowledged(role.id)"
                                        class="bg-red-50 p-3 rounded border border-red-200"
                                    >
                                        <p class="text-red-700 font-semibold">
                                            {{ getRoleName(role) }}
                                        </p>
                                        <p class="text-red-600">
                                            {{ $t('nightZero.mismatchWarning', {
                                            role: getRoleName(role),
                                            expected: gameStore.selectedRoles[role.id] || 0,
                                            acknowledged: getAcknowledgedCountForRole(role.id)
                                        }) }}
                                        </p>
                                    </div>
                                </div>

                                <!-- Success Message -->
                                <div v-else class="text-sm text-green-700 bg-green-50 p-3 rounded border border-green-200">
                                    {{ $t('nightZero.allPlayersAcknowledged') }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Navigation and Control Buttons -->
                <div class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-20">
                    <div class="max-w-7xl mx-auto px-6 py-4 flex gap-3 sm:gap-4 flex-wrap">
                        <!-- Previous Role -->
                        <button
                            @click="previousRole"
                            :disabled="currentRoleIndex === 0"
                            :class="[
                                'px-4 py-3 font-semibold rounded-lg transition text-center',
                                currentRoleIndex === 0
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-gray-400 hover:bg-gray-500 text-white'
                                ]"
                        >
                            ←
                        </button>

                        <!-- Next Role -->
                        <button
                            @click="nextRole"
                            :disabled="currentRoleIndex === sortedRoles.length - 1"
                            :class="[
                                'px-4 py-3 font-semibold rounded-lg transition text-center',
                                currentRoleIndex === sortedRoles.length - 1
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                            ]"
                        >
                            →
                        </button>

                        <!-- Back to Setup -->
                        <NuxtLink
                            to="/game-setup"
                            class="px-4 py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg transition text-center"
                        >
                            {{ $t('nightZero.backToSetup') }}
                        </NuxtLink>

                        <!-- Force Start (if needed) -->
                        <button
                            v-show="!allRolesAcknowledged"
                            @click="forceStart"
                            class="px-4 py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg transition text-center"
                        >
                            {{ $t('nightZero.forceStart') }}
                        </button>

                        <!-- Start Game -->
                        <button
                            @click="startGame"
                            :disabled="!canStartGame"
                            :class="[
                                'flex-1 px-4 py-3 font-semibold rounded-lg transition text-center',
                                canStartGame
                                    ? 'bg-green-500 hover:bg-green-600 text-white cursor-pointer'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                ]"
                        >
                            {{ $t('nightZero.startGameBtn') }}
                        </button>
                    </div>
                </div>

                <!-- Spacer for Fixed Buttons -->
                <div class="h-20"></div>
            </div>
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useGameStore } from '~/stores/game'
import { useRolesStore } from '~/stores/roles'
import type { Role } from '~/types/role'
import { usePlayersStore } from '~/stores/players'
import RoleCallout from '~/components/RoleCallout.vue'
import { GamePhase, GameStatus } from '~/types/game'

const { locale } = useI18n()
const router = useRouter()
const gameStore = useGameStore()
const rolesStore = useRolesStore()
const playersStore = usePlayersStore()

// State
const currentRoleIndex = ref(0)

// Computed properties
const allPlayers = computed(() => playersStore.selectedPlayers)

const sortedRoles = computed(() => {
    // Get roles in the order they appear in the default roles list
    const roles: Role[] = []
    const selectedRoleIds = Object.entries(gameStore.selectedRoles)
        .filter(([, count]) => count > 0)
        .map(([roleId]) => roleId)

    // Get all roles from store and filter to only selected roles, maintaining original order
    rolesStore.allRoles.forEach(role => {
        if (selectedRoleIds.includes(role.id)) {
            roles.push(role)
        }
    })

    return roles
})

const canStartGame = computed(() => {
    return allRolesAcknowledged.value
})

const allRolesAssigned = computed(() => {
    // Check if all expected roles have been assigned
    return sortedRoles.value.every(role => {
        const expectedCount = gameStore.selectedRoles[role.id] || 0
        const assignedCount = Object.values(gameStore.playerRoles).filter(r => r === role.id).length
        return assignedCount === expectedCount
    })
})

const allRolesAcknowledged = computed(() => {
    return sortedRoles.value.every(role => isRoleFullyAcknowledged(role.id))
})

// Helper functions
function getRoleName(role: Role): string {
    return locale.value === 'vi' ? role.nameVi : role.name
}

function isRoleFullyAcknowledged(roleId: string): boolean {
    const expectedCount = gameStore.selectedRoles[roleId] || 0
    const acknowledgedCount = getAcknowledgedCountForRole(roleId)
    return acknowledgedCount === expectedCount && expectedCount > 0
}

function getAcknowledgedCountForRole(roleId: string): number {
    return Object.values(gameStore.roleAcknowledgments).filter(role => role === roleId).length
}

function previousRole() {
    if (currentRoleIndex.value > 0) {
        currentRoleIndex.value--
    }
}

function nextRole() {
    if (currentRoleIndex.value < sortedRoles.value.length - 1) {
        currentRoleIndex.value++
    }
}

function goToRole(index: number) {
    if (index >= 0 && index < sortedRoles.value.length) {
        currentRoleIndex.value = index
    }
}

async function startGame() {
    if (!canStartGame.value) return

    gameStore.copyAcknowledgmentsToPlayerRoles();

    try {
        // Set game phase to first night
        gameStore.setPhase(GamePhase.NIGHT)
        gameStore.setStatus(GameStatus.PLAYING)

        // Navigate to game page
        await router.push('/game')
    } catch (error) {
        console.error('Failed to start game:', error)
    }
}

async function forceStart() {
    try {
        gameStore.setPhase(GamePhase.NIGHT)
        gameStore.setStatus(GameStatus.PLAYING)
        await router.push('/game')
    } catch (error) {
        console.error('Failed to force start game:', error)
    }
}
</script>

