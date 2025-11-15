<template>
  <div class="bg-white rounded-2xl overflow-hidden border-2 shadow-md transition-all duration-300 active:scale-95" :class="[
    `border-${getFactionColor()}`,
    quantity > 0 ? 'border-opacity-100 shadow-lg' : 'border-gray-200 border-opacity-50'
  ]">
    <!-- Role Image -->
    <div class="relative aspect-square bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
      <img 
        :src="`/images/roles/en/dx-${roleImageName}_400x400.png`" 
        :alt="role.name"
        class="w-full h-full object-cover object-left-top transition-transform duration-300"
        @error="handleImageError"
      />
      <!-- Balance Badge -->
      <div class="absolute bottom-2 left-2 px-2 py-1 rounded-lg text-xs font-bold text-white shadow-md"
        :class="getBalanceBadgeColor()">
        {{ role.balancePoints > 0 ? '+' : '' }}{{ role.balancePoints }}
      </div>
    </div>

    <!-- Role Info -->
    <div class="p-3 border-b-2" :class="`border-${getFactionColor()}-200`">
      <h3 class="font-bold text-sm text-gray-800 line-clamp-2">
        {{ currentLanguage === 'vi' ? role.nameVi : role.name }}
      </h3>
      <p class="text-xs font-semibold uppercase tracking-wide mb-1" :class="`text-${getFactionColor()}`">
        {{ getFactionLabel() }}
      </p>
      <p class="text-xs text-gray-600 line-clamp-2">
        {{ currentLanguage === 'vi' ? role.descriptionVi : role.description }}
      </p>
    </div>

    <!-- Quantity Controls -->
    <div class="flex items-center justify-between gap-1 p-2 bg-gray-50 min-w-0">
      <button 
        @click="decreaseQuantity"
        :disabled="quantity === 0"
        class="flex-none py-1 px-3 bg-white border border-gray-300 rounded-lg font-bold text-gray-700 text-base sm:text-lg min-w-0  leading-none active:scale-90 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
        :aria-label="$t('common.decrease')"
      >
        −
      </button>
      
      <input 
        v-model.number="localQuantity"
        type="text"
        disabled
        class="flex-1 py-2 px-0.5 text-center font-bold text-gray-800 bg-white border border-gray-300 rounded-lg text-xs sm:text-sm min-w-0"
        :aria-label="$t('roles.quantity')"
      />
      
      <button 
        @click="increaseQuantity"
        :disabled="quantity >= maxQuantity"
        class="flex-none py-1 px-3 bg-white border border-gray-300 rounded-lg font-bold text-gray-700 text-base sm:text-lg min-w-0  leading-none active:scale-90 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
        :aria-label="$t('common.increase')"
      >
        +
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
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

// Watch for changes to quantity from store (e.g., from localStorage hydration)
watch(quantity, (newQuantity) => {
  localQuantity.value = newQuantity
})

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
    'martyr': 'blank',
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
    'dire-wolf': 'blank',
    'lone-wolf': 'lone-wolf',
    'fruit-brute': 'blank',
    'fang-face': 'blank',
    'wolverine': 'blank',
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

const getFactionColor = () => {
  const colorMap: { [key: string]: string } = {
    'VILLAGER': 'blue',
    'WEREWOLF': 'red',
    'CULT': 'purple',
    'VAMPIRE': 'slate',
    'SPECIAL': 'amber',
  }
  return colorMap[props.role.faction] || 'gray'
}

const getBalanceBadgeColor = () => {
  const points = props.role.balancePoints
  if (points > 0) return 'bg-green-500'
  if (points < 0) return 'bg-red-500'
  return 'bg-gray-500'
}

const handleImageError = (e: Event) => {
  const img = e.target as HTMLImageElement
  img.src = '/images/roles/en/dx-blank_400x400.png'
}
</script>
