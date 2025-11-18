<template>
    <div class="space-y-6">
        <!-- Header -->
        <div class="space-y-2">
            <h2 class="text-2xl font-bold text-gray-800">{{ $t('gameSetup.rolesConfigured') }}</h2>
            <p class="text-sm text-gray-600">
                {{ rolesStore.totalRoleCount }} {{ $t('roles.roles') }} for {{ playersStore.playerSelectedCount }}
                {{ $t('gameSetup.playersSelected').toLowerCase() }}
            </p>
        </div>

        <!-- Validation Alert -->
        <div
            v-if="!isValid"
            class="bg-red-50 border-2 border-red-300 rounded-xl p-4 flex gap-3"
        >
            <div class="text-3xl">⚠️</div>
            <div>
                <p class="font-semibold text-red-800">{{ $t('gameSetup.validation.playerRoleMismatch') }}</p>
                <p class="text-sm text-red-700 mt-1">
                    {{ mismatchMessage }}
                </p>
            </div>
        </div>

        <!-- Success Alert -->
        <div
            v-else
            class="bg-green-50 border-2 border-green-300 rounded-xl p-4 flex gap-3"
        >
            <div class="text-3xl">✅</div>
            <div>
                <p class="font-semibold text-green-800">Perfect Match!</p>
                <p class="text-sm text-green-700 mt-1">
                    Players and roles are aligned. Ready to start the game!
                </p>
            </div>
        </div>

        <!-- Role Summary -->
        <div
            v-if="Object.keys(rolesStore.selectedRoles).length > 0"
            class="bg-white rounded-xl border border-gray-200 overflow-hidden"
        >
            <div class="bg-gray-50 px-4 py-3 border-b font-semibold text-gray-700">
                Role Distribution
            </div>
            <div class="divide-y">
                <div
                    v-for="(count, roleId) in rolesStore.selectedRoles"
                    :key="roleId"
                    class="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition"
                >
                    <div class="flex-1">
                        <p class="font-semibold text-gray-800">{{ rolesStore.getRoleName(''+roleId) }}</p>
                        <p class="text-xs text-gray-600">{{ rolesStore.getRoleDescription(''+roleId) }}</p>
                    </div>
                    <div class="flex items-center gap-3">
                        <span class="text-sm font-semibold text-gray-600">×{{ count }}</span>
                        <span
                            :class="[
                                'px-3 py-1 rounded-full text-xs font-semibold',
                                rolesStore.getRolePoints(''+roleId) > 0
                                    ? 'bg-green-100 text-green-700'
                                    : rolesStore.getRolePoints(''+roleId) < 0
                                        ? 'bg-red-100 text-red-700'
                                        : 'bg-gray-100 text-gray-700'
                            ]"
                        >
                            {{ rolesStore.getRolePoints(''+roleId) * count > 0 ? '+' : '' }}{{ rolesStore.getRolePoints(''+roleId) * count }}
                        </span>
                    </div>
                </div>
            </div>
        </div>

        <!-- No Roles Selected -->
        <div v-else class="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6 text-center">
            <p class="text-yellow-800 font-semibold">{{ $t('gameSetup.validation.noRolesSelected') }}</p>
            <NuxtLink to="/roles" class="inline-block mt-4 px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition">
                {{ $t('navigation.roles') }}
            </NuxtLink>
        </div>

        <!-- Balance Summary -->
        <div
            v-if="Object.keys(rolesStore.selectedRoles).length > 0"
            :class="[
                'rounded-xl p-4 border-2',
                rolesStore.balanceStatus === 'perfect'
                    ? 'bg-green-50 border-green-300'
                    : rolesStore.balanceStatus === 'light-green'
                        ? 'bg-blue-50 border-blue-300'
                        : rolesStore.balanceStatus === 'light-red'
                    ? 'bg-orange-50 border-orange-300'
                    : 'bg-red-50 border-red-300'
            ]"
        >
            <div class="flex justify-between items-center">
                <div>
                    <p
                        :class="[
                            'font-semibold',
                            rolesStore.balanceStatus === 'perfect'
                                ? 'text-green-800'
                                : rolesStore.balanceStatus === 'light-green'
                                    ? 'text-blue-800'
                                    : rolesStore.balanceStatus === 'light-red'
                                    ? 'text-orange-800'
                                : 'text-red-800'
                        ]"
                    >
                        Game Balance: {{ balanceLabel }}
                    </p>
                </div>
                <span
                    :class="[
                        'px-4 py-2 rounded-lg font-bold text-lg',
                        rolesStore.balanceStatus === 'perfect'
                            ? 'bg-green-200 text-green-900'
                            : rolesStore.balanceStatus === 'light-green'
                                ? 'bg-blue-200 text-blue-900'
                                : rolesStore.balanceStatus === 'light-red'
                                    ? 'bg-orange-200 text-orange-900'
                                    : 'bg-red-200 text-red-900'
                    ]"
                >
                    {{ rolesStore.totalBalancePoints > 0 ? '+' : '' }}{{ rolesStore.totalBalancePoints }}
                </span>
            </div>
        </div>

        <!-- Edit Roles Button -->
        <NuxtLink
            to="/roles"
        >
            <button class="w-full px-4 py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-lg transition text-center mt-4">
                Edit Roles Configuration
            </button>
        </NuxtLink>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRolesStore } from '~/stores/roles'
import { useGameStore } from '~/stores/game'
import { usePlayersStore } from '~/stores/players'

const { t } = useI18n()
const rolesStore = useRolesStore()
const playersStore = usePlayersStore()

const balanceLabel = computed(() => {
    const points = rolesStore.totalBalancePoints
    if (points === 0) return t('roles.balancePerfect') || 'Perfect Balance'
    if (points > 0 && points <= 5) return t('roles.balanceLightGreen') || 'Slightly Favors Village'
    if (points < 0 && points >= -5) return t('roles.balanceLightRed') || 'Slightly Favors Werewolves'
    return t('roles.balanceRed') || 'Heavily Unbalanced'
})

const isValid = computed(() => playersStore.playerSelectedCount === rolesStore.totalRoleCount && rolesStore.totalRoleCount > 0)

const mismatchMessage = computed(() => {
    if (rolesStore.totalRoleCount === 0) return t('gameSetup.validation.noRolesSelected') || 'Please select at least 1 role'
    if (playersStore.playerSelectedCount === 0) return t('gameSetup.validation.noPlayersSelected') || 'Please select at least 2 players'

    const difference = Math.abs(playersStore.playerSelectedCount - rolesStore.totalRoleCount)
    if (playersStore.playerSelectedCount > rolesStore.totalRoleCount) {
        return `You have ${playersStore.playerSelectedCount} players but only ${rolesStore.totalRoleCount} roles. Need ${difference} more role${difference > 1 ? 's' : ''}.`
    } else {
        return `You have ${playersStore.playerSelectedCount} players but ${rolesStore.totalRoleCount} roles. Too many roles by ${difference}.`
    }
})
</script>

