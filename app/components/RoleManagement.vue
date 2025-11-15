<template>
  <div class="min-h-screen bg-gradient-to-b from-slate-50 to-white flex flex-col">
    <!-- Header -->
    <div class="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-8 rounded-b-3xl shadow-lg">
      <h1 class="text-3xl font-bold mb-2">{{ $t('roles.title') }}</h1>
      <p class="text-orange-100">{{ $t('roles.selectRoles') }}</p>
    </div>

    <!-- Balance Status Section -->
    <div class="px-6 py-6">
      <div class="bg-white rounded-2xl p-6 shadow-md border-l-4" :class="getBorderColorClass()">
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
        <div class="mb-6 pb-6 border-b border-gray-200">
          <p class="text-sm font-semibold" :class="getStatusColorClass()">
            {{ getBalanceStatusText() }}
          </p>
        </div>

        <!-- Selected Roles Summary -->
        <div v-if="hasSelectedRoles" class="space-y-4">
          <h3 class="text-sm font-bold text-gray-700 uppercase tracking-wide">Selected Roles</h3>
          <div v-for="faction in factions" :key="faction" class="space-y-2">
            <div v-if="getSelectedRolesByFaction(faction).length > 0">
              <div class="flex items-center justify-between">
                <p class="text-xs font-semibold text-gray-600 mb-2">
                  {{ getFactionLabel(faction) }}
                  <span 
                    class="text-xs font-semibold mb-2"
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
                <div 
                  v-for="role in getSelectedRolesByFaction(faction)" 
                  :key="role.id"
                  class="bg-gray-100 rounded-lg px-3 py-2 text-xs font-medium text-gray-700 flex items-center gap-2"
                >
                  <span class="font-bold">{{ role.quantity }}×</span>
                  <span>{{ role.name }}</span>
                  <span 
                    :class="{
                      'text-green-600': role.balancePoints * role.quantity > 0,
                      'text-red-600': role.balancePoints * role.quantity < 0,
                      'text-gray-500': role.balancePoints * role.quantity === 0
                    }"
                  >
                    ({{ role.balancePoints * role.quantity > 0 ? '+' : '' }}{{ role.balancePoints * role.quantity }})
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Filter Section -->
    <div class="px-6 py-4">
      <div class="bg-white rounded-2xl p-4 shadow-md">
        <p class="text-sm font-bold text-gray-700 uppercase tracking-wide mb-3">{{ $t('roles.filterByFaction') }}</p>
        <div class="flex flex-wrap gap-2">
          <button 
            v-for="faction in factions"
            :key="faction"
            @click="activeFaction = faction"
            :class="[
              'px-4 py-2 rounded-xl font-semibold text-sm transition-all active:scale-95',
              activeFaction === faction
                ? 'bg-orange-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 border border-gray-200'
            ]"
          >
            {{ getFactionLabel(faction) }}
          </button>
        </div>
      </div>
    </div>

    <!-- Roles Grid -->
    <div class="flex-1 px-6 py-6 overflow-y-auto">
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        <RoleCard 
          v-for="role in filteredRoles"
          :key="role.id"
          :role="role"
          @quantity-change="onRoleQuantityChange"
        />
      </div>
    </div>

    <!-- Action Buttons - Sticky Footer -->
    <div class="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex gap-3">
      <button 
        @click="clearAllRoles"
        class="flex-1 py-3 px-4 bg-gray-200 text-gray-800 rounded-xl font-bold active:scale-95 transition-transform"
      >
        {{ $t('roles.clearAll') }}
      </button>
      <button 
        @click="saveConfiguration"
        class="flex-1 py-3 px-4 bg-orange-500 text-white rounded-xl font-bold shadow-lg active:scale-95 transition-transform"
      >
        {{ $t('roles.savePreset') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRolesStore, type Role } from '~/stores/roles'
import RoleCard from './RoleCard.vue'

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
  return Object.keys(rolesStore.selectedRoles).length > 0
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
