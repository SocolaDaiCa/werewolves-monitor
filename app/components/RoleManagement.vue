<template>
  <div class="role-management">
    <!-- Header Section -->
    <div class="header">
      <h1>{{ $t('roles.title') }}</h1>
      <p class="subtitle">{{ $t('roles.selectRoles') }}</p>
    </div>

    <!-- Balance Status Section -->
    <div class="balance-section" :class="`balance-${balanceStatus}`">
      <div class="balance-container">
        <div class="balance-info">
          <h3>{{ $t('roles.roleBalance') }}</h3>
          <div class="balance-display">
            <span class="balance-value">{{ balancePoints }}</span>
            <span class="balance-points">{{ $t('roles.balancePoints') }}</span>
          </div>
        </div>
        <div class="role-count-info">
          <h3>{{ $t('roles.totalSlots') }}</h3>
          <div class="role-count-display">
            <span class="count-value">{{ totalRoleCount }}</span>
            <span class="count-label">{{ $t('roles.roles') }}</span>
          </div>
        </div>
      </div>
      <div class="balance-status">
        <p :class="`status-${balanceStatusLabel}`">
          {{ getBalanceStatusText() }}
        </p>
      </div>

      <!-- Selected Roles Summary -->
      <div class="selected-roles-summary" v-if="hasSelectedRoles">
        <div v-for="faction in factions" :key="faction" class="faction-group">
          <div class="faction-header">{{ getFactionLabel(faction) }}</div>
          <ul class="roles-list" v-if="getSelectedRolesByFaction(faction).length > 0">
            <li v-for="role in getSelectedRolesByFaction(faction)" :key="role.id">
              <span class="role-count">{{ role.quantity }}x</span>
              <span class="role-name">{{ role.name }}</span>
              <span
                class="role-weight"
                :class="{
                  'text-green-600': role.balancePoints * role.quantity > 0,
                  'text-red-600': role.balancePoints * role.quantity < 0
                }"
              >
                ({{ role.balancePoints * role.quantity > 0 ? '+' : '' }}{{ role.balancePoints * role.quantity }})
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Faction Filter Section -->
    <div class="filter-section">
      <h3>{{ $t('roles.filterByFaction') }}</h3>
      <div class="filter-buttons">
        <button 
          v-for="faction in factions"
          :key="faction"
          class="filter-btn"
          :class="{ active: activeFaction === faction }"
          @click="activeFaction = faction"
        >
          {{ getFactionLabel(faction) }}
        </button>
      </div>
    </div>

    <!-- Roles Grid -->
    <div class="roles-grid">
      <RoleCard 
        v-for="role in filteredRoles"
        :key="role.id"
        :role="role"
        @quantity-change="onRoleQuantityChange"
      />
    </div>

    <!-- Action Buttons -->
    <div class="action-buttons">
      <button 
        class="btn btn-secondary"
        @click="clearAllRoles"
      >
        {{ $t('roles.clearAll') }}
      </button>
      <button 
        class="btn btn-secondary"
        @click="saveConfiguration"
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

const balanceStatus = computed(() => {
  const status = rolesStore.balanceStatus
  if (status === 'perfect') return 'perfect'
  if (status === 'light-green') return 'light-green'
  if (status === 'light-red') return 'light-red'
  return 'red'
})

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

<style scoped lang="scss">
.role-management {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  background: #f9fafb;
  min-height: 100vh;

  @media (max-width: 768px) {
    padding: 1rem;
  }
}

.header {
  margin-bottom: 2rem;
  text-align: center;

  h1 {
    font-size: 2.5rem;
    font-weight: 700;
    color: #1f2937;
    margin: 0 0 0.5rem 0;

    @media (max-width: 768px) {
      font-size: 1.875rem;
    }
  }

  .subtitle {
    font-size: 1.125rem;
    color: #6b7280;
    margin: 0;
  }
}

.balance-section {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border-left: 6px solid;

  &.balance-perfect {
    border-left-color: #10b981;
    background: linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, transparent 100%);
  }

  &.balance-light-green {
    border-left-color: #34d399;
    background: linear-gradient(135deg, rgba(52, 211, 153, 0.05) 0%, transparent 100%);
  }

  &.balance-light-red {
    border-left-color: #fca5a5;
    background: linear-gradient(135deg, rgba(252, 165, 165, 0.05) 0%, transparent 100%);
  }

  &.balance-red {
    border-left-color: #ef4444;
    background: linear-gradient(135deg, rgba(239, 68, 68, 0.05) 0%, transparent 100%);
  }

  .balance-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    margin-bottom: 1.5rem;

    @media (max-width: 640px) {
      grid-template-columns: 1fr;
      gap: 1rem;
    }

    > div {
      h3 {
        font-size: 0.875rem;
        font-weight: 600;
        color: #6b7280;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        margin: 0 0 0.75rem 0;
      }
    }
  }

  .balance-info,
  .role-count-info {
    display: flex;
    flex-direction: column;

    h3 {
      font-size: 0.875rem;
      font-weight: 600;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin: 0 0 0.75rem 0;
    }
  }

  .balance-display,
  .role-count-display {
    display: flex;
    align-items: baseline;
    gap: 0.5rem;

    .balance-value,
    .count-value {
      font-size: 2.5rem;
      font-weight: 700;
      color: #1f2937;

      @media (max-width: 640px) {
        font-size: 2rem;
      }
    }

    .balance-points,
    .count-label {
      font-size: 1rem;
      color: #6b7280;
      font-weight: 500;
    }
  }

  .balance-status {
    p {
      margin: 0;
      font-weight: 600;
      font-size: 1.125rem;

      &.status-perfect {
        color: #10b981;
      }

      &.status-light-green {
        color: #34d399;
      }

      &.status-light-red {
        color: #f87171;
      }

      &.status-red {
        color: #ef4444;
      }
    }
  }

  .selected-roles-summary {
    margin-top: 2rem;
    padding-top: 2rem;
    border-top: 1px solid #e5e7eb;

    .faction-group {
      margin-bottom: 1.5rem;

      &:last-child {
        margin-bottom: 0;
      }

      .faction-header {
        font-size: 1rem;
        font-weight: 600;
        color: #1f2937;
        margin-bottom: 0.75rem;
      }

      .roles-list {
        list-style: none;
        margin: 0;
        padding-left: 0;
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;

        li {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9375rem;
          color: #374151;
          background: #f3f4f6;
          padding: 0.5rem 1rem;
          border-radius: 6px;

          .role-count {
            font-weight: 600;
            color: #1f2937;
            min-width: 2.5rem;
          }

          .role-name {
            font-weight: 500;
          }

          .role-weight {
            font-size: 0.8125rem;
            color: #6b7280;
          }
        }
      }
    }
  }
}

.filter-section {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  h3 {
    font-size: 1rem;
    font-weight: 600;
    color: #1f2937;
    margin: 0 0 1rem 0;
  }

  .filter-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;

    .filter-btn {
      padding: 0.75rem 1.5rem;
      border: 2px solid #e5e7eb;
      background: white;
      border-radius: 8px;
      font-size: 0.9375rem;
      font-weight: 500;
      color: #6b7280;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        border-color: #d1d5db;
        color: #4b5563;
      }

      &.active {
        background: #3b82f6;
        border-color: #3b82f6;
        color: white;
      }

      @media (max-width: 640px) {
        padding: 0.625rem 1.125rem;
        font-size: 0.875rem;
      }
    }
  }
}

.roles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 1.25rem;
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
  }

  @media (max-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
}

.action-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  padding: 2rem 0;
  flex-wrap: wrap;

  @media (max-width: 640px) {
    padding: 1rem 0;
  }

  .btn {
    padding: 0.75rem 2rem;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;

    &.btn-secondary {
      background: white;
      color: #3b82f6;
      border: 2px solid #3b82f6;

      &:hover {
        background: #f0f9ff;
        border-color: #1d4ed8;
        color: #1d4ed8;
      }

      &:active {
        transform: scale(0.98);
      }
    }

    @media (max-width: 640px) {
      padding: 0.625rem 1.5rem;
      font-size: 0.9375rem;
      flex: 1;
      min-width: 140px;
    }
  }
}
</style>

