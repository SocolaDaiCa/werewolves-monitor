<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-back-button default-href="/"></ion-back-button>
                </ion-buttons>
                <ion-title>{{ $t('roles.title') }}</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content>
            <div class="h-full">
                <!-- flex flex-col  -->
                <!-- Balance Status Section -->
                <ion-card class="m-0 rounded-none">
                    <ion-card-content class="ion-padding">
                        <!-- Balance Info Grid -->
                        <div class="grid grid-cols-2 gap-4 mb-6">
                            <div>
                                <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">{{ $t('roles.roleBalance') }}</p>
                                <div class="flex items-baseline gap-2">
                  <span class="text-3xl font-bold" :class="getBalanceTextColor()">
                    {{ balancePoints > 0 ? '+' : '' }}{{ balancePoints }}
                  </span>
                                    <span class="text-sm text-gray-600">{{ $t('roles.balancePoints') }}</span>
                                </div>
                            </div>
                            <div>
                                <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">{{ $t('roles.totalSlots') }}</p>
                                <div class="flex items-baseline gap-2">
                                    <span class="text-3xl font-bold text-gray-800">{{ totalRoleCount }}</span>
                                    <span class="text-sm text-gray-600">{{ $t('roles.roles') }}</span>
                                </div>
                            </div>
                        </div>

                        <!-- Balance Status Message -->
                        <ion-item lines="none" class="px-0 mb-4">
                            <p class="text-sm font-semibold" :class="getStatusColorClass()">
                                {{ getBalanceStatusText() }}
                            </p>
                        </ion-item>

                        <!-- Selected Roles Summary -->
                        <div v-if="hasSelectedRoles" class="space-y-4">
                            <h3 class="text-sm font-bold text-gray-700 uppercase tracking-wide">{{ $t('roles.selectedRoles') }}</h3>
                            <div v-for="faction in factions" :key="faction">
                                <div v-if="getSelectedRolesByFaction(faction).length > 0" class="mb-4">
                                    <div class="flex items-center justify-between mb-3">
                                        <p class="text-xs font-semibold text-gray-600">
                                            {{ getFactionLabel(faction) }}
                                            <span
                                                class="text-xs font-semibold ml-2"
                                                :class="{
                          'text-green-600': getFactionBalancePoints(faction) > 0,
                          'text-red-600': getFactionBalancePoints(faction) < 0,
                          'text-gray-500': getFactionBalancePoints(faction) === 0
                        }"
                                            >
                        ({{ getFactionBalancePoints(faction) > 0 ? '+' : '' }}{{ getFactionBalancePoints(faction) }})
                      </span>
                                        </p>
                                    </div>
                                    <div class="flex flex-wrap gap-2">
                    <span
                        v-for="role in getSelectedRolesByFaction(faction)"
                        :key="role.id"
                    >
                      <ion-badge class="ion-badge-primary">
                        {{ role.quantity }}×
                      </ion-badge>
                      {{ role.name }}
                      <span
                          class="ml-1"
                          :class="{
                          'text-green-300': role.balancePoints * role.quantity > 0,
                          'text-red-300': role.balancePoints * role.quantity < 0,
                          'text-gray-300': role.balancePoints * role.quantity === 0
                        }"
                      >
                        ({{ role.balancePoints * role.quantity > 0 ? '+' : '' }}{{ role.balancePoints * role.quantity }})
                      </span>
                    </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ion-card-content>
                </ion-card>

                <ion-card>
                    <ion-card-content>
                        <ion-segment value="VILLAGER">
                            <ion-segment-button
                                v-for="faction in factions"
                                :value="faction"
                                :content-id="faction"
                            >
                                <ion-label>
                                    {{ getFactionLabel(faction) }}
                                </ion-label>
                            </ion-segment-button>
                        </ion-segment>
                    </ion-card-content>
                    <ion-segment-view>
                        <ion-segment-content
                            v-for="faction in factions"
                            :id="faction"
                        >
                            <!-- Roles Grid -->
                            <div class="flex-1 overflow-y-auto ion-padding">
                                <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                                    <RoleCard
                                        v-for="role in rolesStore.rolesByFaction(faction)"
                                        :key="role.id"
                                        :role="role"
                                        @quantity-change="onRoleQuantityChange"
                                    />
                                </div>
                            </div>
                        </ion-segment-content>
                    </ion-segment-view>
                </ion-card>
            </div>
        </ion-content>
        <!-- Action Buttons - Fixed Footer -->
        <ion-footer class="ion-no-border">
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-button
                        @click="clearAllRoles"
                        fill="outline"
                        expand="block"
                        class="mr-2"
                    >
                        {{ $t('roles.clearAll') }}
                    </ion-button>
                </ion-buttons>
                <ion-buttons slot="end">
                    <ion-button
                        @click="saveConfiguration"
                        color="primary"
                        expand="block"
                    >
                        {{ $t('roles.savePreset') }}
                    </ion-button>
                </ion-buttons>
            </ion-toolbar>
        </ion-footer>
    </ion-page>

</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRolesStore, type Role } from '~/stores/roles'
import RoleCard from '~/components/RoleCard.vue'

const { t } = useI18n()
const rolesStore = useRolesStore()

// Reactive state
const activeFaction = ref<Role['faction']>('VILLAGER')
const factions: Role['faction'][] = ['VILLAGER', 'WEREWOLF', 'SPECIAL']

// Computed properties
const balancePoints = computed(() => rolesStore.totalBalancePoints)
const balanceStatusLabel = computed(() => rolesStore.balanceStatus)
const totalRoleCount = computed(() => rolesStore.totalRoleCount)

const filteredRoles = computed(() => {
    return rolesStore.rolesByFaction(activeFaction.value)
})

const hasSelectedRoles = computed(() => {
    return Object.entries(rolesStore.selectedRoles).some(([, quantity]) => quantity > 0)
})

const getSelectedRolesByFaction = (faction: Role['faction']) => {
    return Object.entries(rolesStore.selectedRoles)
        .map(([roleId, quantity]) => {
            const role = rolesStore.getRoleById(roleId)
            return { ...role, quantity } as Role & { quantity: number }
        })
        .filter((role): role is (Role & { quantity: number }) => role !== undefined && role.faction === faction && role.quantity > 0)
        .sort((a, b) => b.quantity - a.quantity)
}

const getFactionBalancePoints = (faction: Role['faction']) => {
    return getSelectedRolesByFaction(faction).reduce((total, role) => {
        return total + (role.balancePoints * role.quantity)
    }, 0)
}

// Methods
const getFactionLabel = (faction: Role['faction']) => {
    const labels: Record<Role['faction'], string> = {
        'VILLAGER': '🏘️ ' + t('roles.villagers'),
        'WEREWOLF': '🐺 ' + t('roles.werewolves'),
        'CULT': '🔮 ' + t('roles.cult'),
        'VAMPIRE': '🧛 ' + t('roles.vampire'),
        'SPECIAL': '✨ ' + t('roles.special'),
    }
    return labels[faction] || faction
}

const getBalanceStatusText = () => {
    const points = balancePoints.value
    if (points === 0) return t('roles.balancePerfect')
    if (points > 0 && points <= 5) return t('roles.balanceLightGreen')
    if (points < 0 && points >= -5) return t('roles.balanceLightRed')
    if (points > 5) return t('roles.balanceRed') + ` (${t('roles.favorVillage')})`
    return t('roles.balanceRed') + ` (${t('roles.favorWerewolves')})`
}

const getBorderColorClass = () => {
    const status = rolesStore.balanceStatus
    if (status === 'perfect') return 'border-green-500'
    if (status === 'light-green') return 'border-emerald-500'
    if (status === 'light-red') return 'border-rose-500'
    return 'border-red-500'
}

const getBalanceTextColor = () => {
    const status = rolesStore.balanceStatus
    if (status === 'perfect') return 'text-green-600'
    if (status === 'light-green') return 'text-emerald-600'
    if (status === 'light-red') return 'text-rose-600'
    return 'text-red-600'
}

const getStatusColorClass = () => {
    const status = rolesStore.balanceStatus
    if (status === 'perfect') return 'text-green-600'
    if (status === 'light-green') return 'text-emerald-600'
    if (status === 'light-red') return 'text-rose-600'
    return 'text-red-600'
}

const clearAllRoles = () => {
    if (confirm(t('roles.confirmClearAll'))) {
        rolesStore.clearAllRoles()
    }
}

const saveConfiguration = () => {
    // Convert selected roles to a preset format for localStorage
    const preset = {
        timestamp: new Date().toISOString(),
        roles: rolesStore.selectedRoles,
        balancePoints: balancePoints.value,
    }

    localStorage.setItem('role-preset', JSON.stringify(preset))
    alert(t('roles.presetSaved'))
}

const onRoleQuantityChange = () => {
    // Reactive update is handled by the store
}
</script>
