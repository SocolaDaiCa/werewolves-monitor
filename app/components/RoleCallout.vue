<template>
    <div class="w-full">
        <!-- Current Role Display -->
        <div class="bg-gradient-to-br from-purple-500 to-purple-700 text-white rounded-3xl p-8 md:p-12 mb-8 shadow-2xl">
            <div class="text-center">
                <!-- Role Name (Large) -->
                <h2 class="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
                    {{ currentRoleName }}
                </h2>

                <!-- Role Description -->
                <p class="text-xl md:text-2xl text-purple-100">
                    {{ currentRoleDescription }}
                </p>
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
            <h3 class="text-xl font-bold text-gray-800 mb-4">
                {{ $t('nightZero.playerAcknowledgments') }}
                {{ acknowledgedCount === expectedCount ? '✅ ' : '⏳ ' }}
                {{ acknowledgedCount }}/{{ expectedCount }}
            </h3>
            <ion-list class="ion-hide-sm-up">
                <ion-item
                    v-for="player in players"
                    :key="player.id"
                    v-show="!gameStore.isPlayerHasRole(player.id) || hasPlayerAcknowledged(player.id)"
                    lines="none"
                    @click="togglePlayerAcknowledgment(player.id)"
                >
                    <ion-avatar slot="start">
                        <img
                            v-if="player.avatar"
                            :src="player.avatar"
                            :alt="player.name"
                        />
                    </ion-avatar>
                    <ion-checkbox
                        :checked="hasPlayerAcknowledged(player.id)"
                        :disabled="!hasPlayerAcknowledged(player.id) && acknowledgedCount >= expectedCount"
                    >
                        {{ player.name }}
                    </ion-checkbox>
                </ion-item>
            </ion-list>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 ion-hide-sm-down">
                <SelectableCard
                    v-for="player in players"
                    :key="player.id"
                    v-show="!gameStore.isPlayerHasRole(player.id) || hasPlayerAcknowledged(player.id)"
                    :is-selected="hasPlayerAcknowledged(player.id)"
                    @toggle="togglePlayerAcknowledgment(player.id)"
                >
                    <div class="flex flex-col items-center justify-center text-center">
                        <!-- Avatar -->
                        <img
                            v-if="player.avatar"
                            :src="player.avatar"
                            :alt="player.name"
                            class="w-16 h-16 rounded-full object-cover mb-3"
                        />
                        <div v-else class="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold mb-3 text-xl">
                            {{ player.name.charAt(0).toUpperCase() }}
                        </div>

                        <!-- Player Name -->
                        <p class="font-semibold text-gray-800 line-clamp-2">{{ player.name }}</p>

                        <!-- Status Text -->
                        <p
                            :class="[
                                'text-xs mt-2 font-semibold',
                                hasPlayerAcknowledged(player.id)
                                    ? 'text-green-600'
                                    : 'text-blue-600'
                            ]"
                        >
                            {{ hasPlayerAcknowledged(player.id) ? $t('nightZero.acknowledged') : $t('nightZero.thisIsYourRole') }}
                        </p>
                    </div>
                </SelectableCard>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRolesStore } from '~/stores/roles'
import { usePlayersStore } from '~/stores/players'
import type { Role } from '~/types/role'
import type { Player } from '~/types/player'
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
    // Get all players from the game store, excluding those already assigned roles
    return gameStore.players.map(playerId =>
        playersStore.getPlayerById(playerId)
    ).filter((p): p is Player => p !== undefined)
        .filter(p => !gameStore.playerRoles[p.id]) // Hide players with assigned roles
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

function togglePlayerAcknowledgment(playerId: string) {
    const roleId = currentRole.value?.id
    if (!roleId) return

    const isCurrentlyAcknowledged = hasPlayerAcknowledged(playerId)

    if (isCurrentlyAcknowledged) {
        // Deacknowledge by clearing the role for this player
        gameStore.deacknowledgeRole(playerId)
    } else {
        // Acknowledge the role for this player
        gameStore.acknowledgeRole(playerId, roleId)
    }
}
</script>

