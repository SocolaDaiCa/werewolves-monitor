# Phase 1: Quick Reference Guide

## Using the Stores

### Game Store
```typescript
import { useGameStore } from '~/stores/game'

const gameStore = useGameStore()

// Read state
gameStore.phase        // Current phase: 'NIGHT' | 'DAY' | 'SETUP' | 'END'
gameStore.round        // Current round number
gameStore.players      // Array of player IDs
gameStore.selectedRoles // Object mapping roleId to count

// Write state
gameStore.setPhase('NIGHT')
gameStore.initializeGame(playerIds, roles)
gameStore.nextPhase()
gameStore.endGame()
gameStore.resetGame()
```

### Players Store
```typescript
import { usePlayersStore } from '~/stores/players'

const playersStore = usePlayersStore()

// Read
playersStore.allPlayers      // Array of all players
playersStore.playerCount     // Number of players
playersStore.getPlayerById(id) // Function to get player by ID

// Write
playersStore.addPlayer('John', avatarUrl)
playersStore.updatePlayer(id, { name: 'Jane' })
playersStore.deletePlayer(id)
playersStore.incrementGamesPlayed(id)
playersStore.incrementWins(id)

// Import/Export
playersStore.importPlayers(playersArray)
const json = playersStore.exportPlayers()
```

### Roles Store
```typescript
import { useRolesStore } from '~/stores/roles'

const rolesStore = useRolesStore()

// Read
rolesStore.allRoles              // Array of all roles
rolesStore.rolesByFaction('VILLAGER')  // Filter by faction
rolesStore.totalBalancePoints    // Sum of balance points
rolesStore.balanceStatus         // 'perfect' | 'light-green' | 'light-red' | 'red'
rolesStore.totalRoleCount        // Total selected roles

// Write
rolesStore.addRole('seer', 1)
rolesStore.removeRole('seer', 1)
rolesStore.setRoleQuantity('witch', 2)
rolesStore.clearAllRoles()
```

## Using i18n

### In Templates
```vue
<template>
  <p>{{ $t('app.title') }}</p>
  <!-- Displays: "Werewolves Monitor" (English) or "Giám Sát Sói Đêm" (Vietnamese) -->
</template>
```

### In Scripts
```typescript
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()

const title = t('app.title')
console.log(locale.value) // 'en' or 'vi'
```

### Switch Language
```typescript
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()
locale.value = 'vi'  // Switch to Vietnamese
locale.value = 'en'  // Switch to English
```

## Using the Game Composable

```typescript
import { useGame } from '~/composables/useGame'

const { 
  gameStore,
  playersStore, 
  rolesStore,
  canStartGame,           // Boolean: can we start?
  playerRoleMismatch,     // Object or null with mismatch info
  gameBalance,            // { points, status }
  initializeGame,
  advancePhase,
  endCurrentGame,
  resetGame
} = useGame()

// Example usage
if (canStartGame.value) {
  initializeGame(['player1', 'player2', 'player3'])
}
```

## File Structure Reference

### Adding a New Store
Create file: `/stores/myfeature.ts`
```typescript
import { defineStore } from 'pinia'

export const useMyFeatureStore = defineStore('myfeature', () => {
  // state
  const value = ref(0)
  
  // getters
  const doubled = computed(() => value.value * 2)
  
  // actions
  function increment() { value.value++ }
  
  return { value, doubled, increment }
})
```

### Adding a New Type
Create file: `/types/myfeature.ts`
```typescript
export interface MyFeature {
  id: string
  name: string
  // ...
}
```

### Adding a New Composable
Create file: `/composables/useMyFeature.ts`
```typescript
import { computed, ref } from 'vue'

export const useMyFeature = () => {
  const state = ref({})
  const computed_value = computed(() => state.value.something)
  
  return { state, computed_value }
}
```

### Adding a New Page
Create file: `/app/pages/mypage.vue`
```vue
<template>
  <div>{{ $t('mypage.title') }}</div>
</template>

<script setup lang="ts">
// Your code here
</script>

<style scoped>
// Your styles
</style>
```

## Adding Translations

Edit `/locales/en.json` and `/locales/vi.json`:
```json
{
  "myfeature": {
    "title": "My Feature",
    "description": "This is my feature"
  }
}
```

Then use: `{{ $t('myfeature.title') }}`

## Directory Paths

| Directory | Purpose | Import Path |
|-----------|---------|------------|
| `/stores/` | Pinia stores | `import { useXStore } from '~/stores/x'` |
| `/types/` | Type definitions | `import type { X } from '~/types/x'` |
| `/composables/` | Vue composables | `import { useX } from '~/composables/useX'` |
| `/locales/` | Translations | (automatic via i18n) |
| `/app/pages/` | Routes | (automatic routing) |
| `/app/components/` | Reusable components | `import X from '~/app/components/X'` |
| `/app/layouts/` | Page layouts | (automatic) |
| `/app/assets/` | Static assets | Reference in templates |
| `/public/` | Public assets | Direct URL access |

## Common TypeScript Patterns

### Type imports in components
```typescript
<script setup lang="ts">
import type { Player, Role } from '~/types'

// Your component code
</script>
```

### Store types
```typescript
import type { GameState } from '~/stores/game'
import { useGameStore } from '~/stores/game'
```

## Build Commands

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type check
npm run type-check  # (if configured)
```

## Notes
- All stores automatically persist to localStorage where configured
- i18n is available globally in all components via `$t()`
- TypeScript strict mode is enabled for better type safety
- Pinia DevTools integration available in development
- Tailwind CSS is configured and ready for use in templates

## Common Errors & Solutions

### "Cannot find module '~/stores/x'"
- Check that the file exists in `/stores/` directory
- Make sure the filename matches the import

### Translation key not showing
- Check `/locales/en.json` and `/locales/vi.json` have the key
- Make sure syntax is correct: `$t('section.key')`
- Clear browser cache if needed

### Store not updating
- Make sure you're calling the action method
- Check that you're accessing computed properties for reactivity
- Verify Pinia module is in `nuxt.config.ts` modules array

