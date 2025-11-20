<template>
    <div :class="['bg-white rounded-2xl shadow-lg border-2 border-gray-200 overflow-hidden', isDisabled && 'opacity-60']">
        <!-- Header -->
        <div :class="[`${roleColor} text-white px-6 py-6`, isDisabled && 'opacity-75']">
            <div class="flex items-center gap-2 mb-2">
                <h3 class="text-2xl font-bold">{{ roleName }}</h3>
                <span v-if="isDisabled" class="text-lg">☠️</span>
            </div>
            <p class="text-sm opacity-90">{{ roleDescription }}</p>
            <p v-if="isDisabled" class="text-sm mt-2 font-semibold bg-red-700 bg-opacity-50 inline-block px-2 py-1 rounded">
                (Player is dead - actions disabled)
            </p>
        </div>

        <!-- Action Content -->
        <div class="p-6">
            <!-- Action Description -->
            <p class="text-gray-700 mb-4 font-medium">
                {{ actionPrompt }}
            </p>

            <!-- Player Selection -->
            <div v-if="actionType === RoleActionType.SELECT_PLAYER || actionType === RoleActionType.SELECT_TARGET" class="space-y-3">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-48 overflow-y-auto">
                    <button
                        v-for="player in selectablePlayers"
                        :key="player.id"
                        @click="selectPlayer(player.id)"
                        :disabled="isDisabled"
                        :class="[
                            'p-3 rounded-lg border-2 transition-all duration-200 flex items-center gap-2',
                            isDisabled
                                ? 'border-gray-300 bg-gray-100 cursor-not-allowed opacity-50'
                                : selectedPlayerId === player.id
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
            <div v-if="actionType === RoleActionType.DUAL_SELECT" class="space-y-3">
                <p class="text-sm text-gray-600 mb-3">Select 2 different players</p>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-48 overflow-y-auto">
                    <button
                        v-for="player in selectablePlayers"
                        :key="player.id"
                        @click="toggleSecondarySelect(player.id)"
                        :disabled="isDisabled"
                        :class="[
                        'p-3 rounded-lg border-2 transition-all duration-200 flex items-center gap-2',
                        isDisabled
                            ? 'border-gray-300 bg-gray-100 cursor-not-allowed opacity-50'
                            : isSecondarySelected(player.id)
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
                    :disabled="isDisabled"
                    :class="[
                        'w-full py-2 px-4 text-sm font-medium rounded-lg transition-colors',
                        isDisabled
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
                    ]"
                >
                    {{ $t('nightPhase.skipAction') }}
                </button>
            </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-3 px-6 py-4 bg-gray-50 border-t border-gray-200">
            <button
                @click="confirmAction"
                :disabled="!isActionValid || isDisabled"
                :class="[
                    'flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200',
                    (!isActionValid || isDisabled)
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-green-500 text-white hover:bg-green-600 active:scale-95'
                ]"
            >
                {{ $t('nightPhase.confirmAction') }}
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { RoleActionType } from '~/types/game'
import { RoleFaction } from '~/types/role'
import { usePlayersStore } from '~/stores/players'
import { useRolesStore } from '~/stores/roles'
import { useGameStore } from '~/stores/game'

interface Props {
    roleId: string
    playerId: string
    actionType: RoleActionType
    canSkip?: boolean
    isDisabled?: boolean
}

interface Emits {
    (e: 'confirm', action: { targetPlayerId?: string, secondaryTargetPlayerId?: string }): void
    (e: 'skip'): void
}

const props = withDefaults(defineProps<Props>(), {
    canSkip: true,
    isDisabled: false,
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
        case RoleFaction.WEREWOLF:
            return 'bg-red-600'
        case RoleFaction.CULT:
            return 'bg-orange-600'
        case RoleFaction.VAMPIRE:
            return 'bg-purple-600'
        case RoleFaction.VILLAGER:
        case RoleFaction.SPECIAL:
        default:
            return 'bg-blue-600'
    }
})

const actionPrompt = computed(() => {
    switch (props.actionType) {
        case RoleActionType.SELECT_PLAYER:
            return 'Select a player:'
        case RoleActionType.SELECT_TARGET:
            return 'Select your target:'
        case RoleActionType.DUAL_SELECT:
            return 'Select two different players:'
        case RoleActionType.SKIP:
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
    if (props.actionType === RoleActionType.SELECT_PLAYER || props.actionType === RoleActionType.SELECT_TARGET) {
        return !!selectedPlayerId.value
    }
    if (props.actionType === RoleActionType.DUAL_SELECT) {
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

