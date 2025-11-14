<template>
  <div class="role-card" :class="[`faction-${role.faction.toLowerCase()}`, { selected: quantity > 0 }]">
    <!-- Role Image -->
    <div class="role-image">
      <img 
        :src="`/images/roles/en/dx-${roleImageName}_400x400.png`" 
        :alt="role.name"
        @error="handleImageError"
      />
      <div class="balance-badge" :class="`balance-${getBalanceColor()}`">
        {{ role.balancePoints > 0 ? '+' : '' }}{{ role.balancePoints }}
      </div>
    </div>

    <!-- Role Info -->
    <div class="role-info">
      <h3>{{ currentLanguage === 'vi' ? role.nameVi : role.name }}</h3>
      <p class="faction-label">{{ getFactionLabel() }}</p>
      <p class="description">
        {{ currentLanguage === 'vi' ? role.descriptionVi : role.description }}
      </p>
    </div>

    <!-- Quantity Controls -->
    <div class="quantity-controls">
      <button 
        class="btn-control btn-minus" 
        @click="decreaseQuantity"
        :disabled="quantity === 0"
        :aria-label="$t('common.decrease')"
      >
        <span>−</span>
      </button>
      
      <input 
        v-model.number="localQuantity"
        type="text"
        disabled
        class="quantity-input"
        min="0"
        :max="maxQuantity"
        @blur="syncQuantity"
        @keydown.enter="syncQuantity"
        :aria-label="$t('roles.quantity')"
      />
      
      <button 
        class="btn-control btn-plus" 
        @click="increaseQuantity"
        :disabled="quantity >= maxQuantity"
        :aria-label="$t('common.increase')"
      >
        <span>+</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRolesStore, type Role } from '~/stores/roles'

interface Props {
  role: Role
}

const props = defineProps<Props>()

const emit = defineEmits<{
  quantityChange: [quantity: number]
}>()

const { locale } = useI18n()
const rolesStore = useRolesStore()

const currentLanguage = computed(() => locale.value)
const maxQuantity = 10
const localQuantity = ref(rolesStore.getRoleQuantity(props.role.id))

const quantity = computed(() => rolesStore.getRoleQuantity(props.role.id))

// Map role IDs to image names
const roleImageName = computed(() => {
  const imageMap: { [key: string]: string } = {
    'villager': 'villager',
    'seer': 'seer',
    'witch': 'witch',
    'hunter': 'hunter',
    'mayor': 'mayor',
    'aura-seer': 'Aura-Seer',
    'bodyguard': 'bodyguard',
    'apprentice-seer': 'apprentice-seer',
    'cupid': 'cupid',
    'diseased': 'diseased',
    'ghost': 'ghost',
    'idiot': 'village-idiot',
    'martyr': 'blank', // placeholder
    'mason': 'mason',
    'old-hag': 'old-hag',
    'old-man': 'old-hag',
    'paranormal-investigator': 'pi',
    'pacifist': 'pacifist',
    'priest': 'priest',
    'prince': 'prince',
    'spellcaster': 'spellcaster',
    'tough-guy': 'tough-guy',
    'troublemaker': 'troublemaker',
    'werewolf': 'werewolf',
    'sorceress': 'sorceress',
    'minion': 'minion',
    'wolf-cub': 'wolf-cub',
    'dire-wolf': 'blank', // placeholder
    'lone-wolf': 'lone-wolf',
    'fruit-brute': 'blank', // placeholder
    'fang-face': 'blank', // placeholder
    'wolverine': 'blank', // placeholder
    'cursed': 'cursed',
    'doppelganger': 'doppelganger',
    'drunk': 'drunk',
    'cult-leader': 'cult-leader',
    'hoodlum': 'hoodlum',
    'tanner': 'tanner',
    'vampire': 'vampire',
    'lycan': 'lycan',
  }
  return imageMap[props.role.id] || 'blank'
})

const increaseQuantity = () => {
  if (quantity.value < maxQuantity) {
    rolesStore.addRole(props.role.id, 1)
    localQuantity.value = quantity.value
    emit('quantityChange', quantity.value)
  }
}

const decreaseQuantity = () => {
  if (quantity.value > 0) {
    rolesStore.removeRole(props.role.id, 1)
    localQuantity.value = quantity.value
    emit('quantityChange', quantity.value)
  }
}

const syncQuantity = () => {
  const newQuantity = Math.max(0, Math.min(maxQuantity, localQuantity.value || 0))
  rolesStore.setRoleQuantity(props.role.id, newQuantity)
  localQuantity.value = newQuantity
  emit('quantityChange', newQuantity)
}

const getFactionLabel = () => {
  const factionMap: { [key: string]: string } = {
    'VILLAGER': '🏘️ Village',
    'WEREWOLF': '🐺 Werewolf',
    'CULT': '🔮 Cult',
    'VAMPIRE': '🧛 Vampire',
    'SPECIAL': '✨ Special',
  }
  return factionMap[props.role.faction] || props.role.faction
}

const getBalanceColor = () => {
  const points = props.role.balancePoints
  if (points > 0) return 'green'
  if (points < 0) return 'red'
  return 'neutral'
}

const handleImageError = (e: Event) => {
  // Fallback to blank image if role image doesn't exist
  const img = e.target as HTMLImageElement
  img.src = '/images/roles/en/dx-blank_400x400.png'
}
</script>

<style scoped lang="scss">
.role-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 100%;
  border: 2px solid transparent;

  &:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }

  &.selected {
    border-color: #10b981;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2);
  }

  &.faction-villager {
    --faction-color: #3b82f6;
  }

  &.faction-werewolf {
    --faction-color: #ef4444;
  }

  &.faction-cult {
    --faction-color: #8b5cf6;
  }

  &.faction-vampire {
    --faction-color: #6b21a8;
  }

  &.faction-special {
    --faction-color: #f59e0b;
  }

  .role-image {
    position: relative;
    overflow: hidden;
    background: linear-gradient(135deg, rgba(0, 0, 0, 0.05) 0%, rgba(0, 0, 0, 0.1) 100%);
    aspect-ratio: 1;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }

    &:hover img {
      transform: scale(1.05);
    }

    .balance-badge {
      position: absolute;
      bottom: 8px;
      left: 8px;
      padding: 4px 8px;
      border-radius: 6px;
      font-weight: bold;
      font-size: 0.875rem;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);

      &.balance-green {
        background: #10b981;
        color: white;
      }

      &.balance-red {
        background: #ef4444;
        color: white;
      }

      &.balance-neutral {
        background: #6b7280;
        color: white;
      }
    }
  }

  .role-info {
    padding: 1rem;
    flex: 1;
    display: flex;
    flex-direction: column;
    border-bottom: 2px solid var(--faction-color, #e5e7eb);

    h3 {
      margin: 0 0 0.25rem 0;
      font-size: 1.125rem;
      font-weight: 600;
      color: #1f2937;
    }

    .faction-label {
      margin: 0 0 0.5rem 0;
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--faction-color, #6b7280);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .description {
      margin: 0;
      font-size: 0.875rem;
      color: #6b7280;
      line-height: 1.4;
      flex: 1;
    }
  }

  .quantity-controls {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.75rem;
    background: #f9fafb;

    .btn-control {
      width: 40px;
      height: 40px;
      padding: 0;
      border: none;
      border-radius: 6px;
      background: white;
      color: #1f2937;
      font-size: 1.25rem;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid #d1d5db;

      &:hover:not(:disabled) {
        background: var(--faction-color, #e5e7eb);
        color: white;
        border-color: var(--faction-color, #d1d5db);
      }

      &:active:not(:disabled) {
        transform: scale(0.95);
      }

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }

    .quantity-input {
      width: 50px;
      padding: 0.5rem;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      text-align: center;
      font-size: 1rem;
      font-weight: 600;

      &:focus {
        outline: none;
        border-color: var(--faction-color, #3b82f6);
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
      }
    }
  }
}

/* Mobile optimization */
@media (max-width: 640px) {
  .role-card {
    .role-image {
      aspect-ratio: 1.2;
    }

    .role-info {
      padding: 0.75rem;

      h3 {
        font-size: 1rem;
      }

      .description {
        font-size: 0.8125rem;
      }
    }

    .quantity-controls {
      padding: 0.5rem;

      .btn-control {
        width: 36px;
        height: 36px;
        font-size: 1.125rem;
      }

      .quantity-input {
        width: 44px;
        font-size: 0.9rem;
      }
    }
  }
}
</style>

