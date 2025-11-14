# 🚀 Nuxt 4.2.1 + TypeScript Setup Guide

> Hướng dẫn chi tiết setup project với Nuxt 4.2.1, Vue 3.5+, và TypeScript

## 📦 Dependencies Installation

### Phase 1 - Core Dependencies
```bash
npm install pinia @pinia/nuxt @nuxtjs/i18n
```

### Phase 2 - Dev Dependencies (Optional but Recommended)
```bash
npm install -D typescript prettier eslint @nuxt/eslint
npm install -D @vue/test-utils vitest # For testing
```

---

## 🏗️ Project Structure for Nuxt 4

```
werewolves-monitor/
├── app/
│   ├── app.vue                  # Root component
│   ├── assets/
│   │   └── css/
│   │       └── main.scss        # Global styles
│   ├── layouts/
│   │   └── default.vue          # Main layout
│   └── pages/                   # Auto-routed
│       ├── index.vue
│       ├── roles.vue
│       ├── players.vue
│       ├── game-setup.vue
│       ├── game.vue
│       └── game-end.vue
├── components/                  # Auto-imported
│   ├── RoleCard.vue
│   ├── RoleManagement.vue
│   ├── PlayerCard.vue
│   ├── PlayerForm.vue
│   ├── PlayerManagement.vue
│   ├── PhaseHeader.vue
│   ├── RoleAction.vue
│   ├── RoleActionPanel.vue
│   ├── GameFlow.vue
│   ├── PhaseTimer.vue
│   ├── VotingInterface.vue
│   ├── PlayerVoteCard.vue
│   ├── DayPhase.vue
│   ├── GameEndResult.vue
│   ├── GameSummary.vue
│   ├── GameEnd.vue
│   └── NarrationDisplay.vue
├── composables/                 # Auto-imported
│   ├── useGame.ts              # Game logic helper
│   ├── useTextToSpeech.ts      # TTS helper
│   ├── useValidation.ts        # Validation helper
│   └── useI18n.ts              # i18n helper (if needed)
├── stores/                      # Pinia stores
│   ├── game.ts                 # Game state
│   ├── players.ts              # Players state
│   └── roles.ts                # Roles configuration
├── types/                       # TypeScript interfaces
│   ├── player.ts               # Player interface
│   ├── role.ts                 # Role interface
│   ├── game.ts                 # Game-related types
│   └── index.ts                # Re-export all types
├── locales/                     # i18n translations
│   ├── en.json
│   └── vi.json
├── public/                      # Static assets
│   ├── favicon.ico
│   ├── images/
│   │   └── roles/
│   │       └── en/
│   └── robots.txt
├── nuxt.config.ts             # Nuxt configuration
├── tsconfig.json              # TypeScript configuration
└── package.json
```

---

## 🔧 Configuration Files

### `nuxt.config.ts` - Complete Setup
```typescript
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@nuxtjs/i18n',
  ],

  // i18n Configuration
  i18n: {
    locales: [
      { code: 'en', language: 'en-US', name: 'English' },
      { code: 'vi', language: 'vi-VN', name: 'Tiếng Việt' },
    ],
    defaultLocale: 'en',
    langDir: 'locales/',
    strategy: 'prefix_except_default',
  },

  // Pinia Store
  pinia: {
    autoImports: ['defineStore', 'acceptHMRUpdate'],
  },

  // App Configuration
  app: {
    head: {
      title: 'Werewolves Monitor',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Werewolves Game Manager' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      ],
    },
  },

  // Build Configuration
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/sitemap.xml', '/rss.xml'],
    },
  },

  // Development
  devtools: { enabled: true },
  ssr: false, // Set to true if you want SSR
});
```

### `tsconfig.json` - TypeScript Setup
```json
{
  "extends": "./node_modules/nuxt/tsconfig.json",
  "compilerOptions": {
    "strict": true,
    "resolveJsonModule": true,
    "esModuleInterop": true,
    "moduleResolution": "bundler",
    "skipLibCheck": true,
    "lib": ["es2020", "dom", "dom.iterable"],
    "types": ["@nuxt/test-utils", "vitest/globals"]
  },
  "include": [".nuxt/**/*.ts", "**/*.ts", "**/*.vue"],
  "exclude": ["node_modules", ".nuxt", "dist"]
}
```

---

## 🏪 Pinia Store Examples

### `stores/game.ts`
```typescript
import { defineStore } from 'pinia'
import type { Game, Phase, GameState } from '~/types/game'

export const useGameStore = defineStore('game', () => {
  const state = ref<GameState>({
    phase: 'setup',
    round: 0,
    players: [],
    selectedRoles: [],
    gameHistory: [],
    currentGame: null,
  })

  // Getters
  const currentPhase = computed(() => state.value.phase)
  const currentRound = computed(() => state.value.round)
  const livingPlayers = computed(() => 
    state.value.players.filter(p => p.status === 'alive')
  )

  // Actions
  const setPhase = (phase: Phase) => {
    state.value.phase = phase
  }

  const nextRound = () => {
    state.value.round++
  }

  const addPlayer = (playerId: string) => {
    // Add player to game
  }

  return {
    // State
    state,
    // Getters
    currentPhase,
    currentRound,
    livingPlayers,
    // Actions
    setPhase,
    nextRound,
    addPlayer,
  }
})
```

### `stores/players.ts`
```typescript
import { defineStore } from 'pinia'
import type { Player } from '~/types/player'

export const usePlayersStore = defineStore('players', () => {
  const players = ref<Player[]>([])

  // Load from localStorage
  const loadPlayers = () => {
    if (process.client) {
      const stored = localStorage.getItem('werewolves-players')
      if (stored) {
        players.value = JSON.parse(stored)
      }
    }
  }

  // Save to localStorage
  const savePlayers = () => {
    if (process.client) {
      localStorage.setItem('werewolves-players', JSON.stringify(players.value))
    }
  }

  // Add player
  const addPlayer = (player: Player) => {
    players.value.push(player)
    savePlayers()
  }

  // Update player
  const updatePlayer = (id: string, updates: Partial<Player>) => {
    const idx = players.value.findIndex(p => p.id === id)
    if (idx !== -1) {
      players.value[idx] = { ...players.value[idx], ...updates }
      savePlayers()
    }
  }

  // Delete player
  const deletePlayer = (id: string) => {
    players.value = players.value.filter(p => p.id !== id)
    savePlayers()
  }

  return {
    players,
    loadPlayers,
    addPlayer,
    updatePlayer,
    deletePlayer,
  }
})
```

---

## 📝 Types Definition Example

### `types/player.ts`
```typescript
export interface Player {
  id: string
  name: string
  avatar: string // base64 or image URL
  joinedDate: number // timestamp
  gamesPlayed: number
  wins: number
  lastPlayedDate?: number
}

export type PlayerStatus = 'alive' | 'dead' | 'eliminated'
```

### `types/role.ts`
```typescript
export interface Role {
  id: string
  name: string
  description: string
  faction: 'villager' | 'werewolf' | 'cult' | 'vampire' | 'neutral'
  image: string
  balancePoints: number
  nightAction?: boolean
  actionDescription?: string
}

export interface RoleConfig {
  roleId: string
  quantity: number
}
```

### `types/game.ts`
```typescript
import type { Player, PlayerStatus } from './player'
import type { Role, RoleConfig } from './role'

export type Phase = 'setup' | 'night' | 'day' | 'voting' | 'end'

export interface GameState {
  phase: Phase
  round: number
  players: GamePlayer[]
  selectedRoles: RoleConfig[]
  gameHistory: GameRecord[]
  currentGame: Game | null
}

export interface GamePlayer extends Player {
  role?: Role
  status: PlayerStatus
  eliminator?: string
  elimatedAt?: number
}

export interface Game {
  id: string
  startedAt: number
  endedAt?: number
  players: GamePlayer[]
  roles: RoleConfig[]
  winner?: 'villagers' | 'werewolves' | 'cult' | 'special'
  winner_names?: string[]
}

export type GameRecord = Game
```

---

## 🎨 Component Template Example

### `<script setup lang="ts">` Pattern
```vue
<script setup lang="ts">
import type { Player } from '~/types/player'

interface Props {
  player: Player
  isSelected?: boolean
}

interface Emits {
  (e: 'select', playerId: string): void
  (e: 'edit', player: Player): void
  (e: 'delete', playerId: string): void
}

withDefaults(defineProps<Props>(), {
  isSelected: false,
})

const emit = defineEmits<Emits>()

const handleSelect = () => {
  emit('select', props.player.id)
}

const handleEdit = () => {
  emit('edit', props.player)
}

const handleDelete = () => {
  emit('delete', props.player.id)
}
</script>

<template>
  <div class="player-card" :class="{ selected: isSelected }">
    <img :src="player.avatar" :alt="player.name" class="avatar" />
    <h3>{{ player.name }}</h3>
    <div class="stats">
      <span>Games: {{ player.gamesPlayed }}</span>
      <span>Wins: {{ player.wins }}</span>
    </div>
    <div class="actions">
      <button @click="handleEdit">Edit</button>
      <button @click="handleDelete">Delete</button>
    </div>
  </div>
</template>
```

---

## 📚 Composable Example

### `composables/useTextToSpeech.ts`
```typescript
export const useTextToSpeech = () => {
  const isSupported = ref(false)
  const isPlaying = ref(false)
  const speed = ref(1)
  const selectedVoice = ref<SpeechSynthesisVoice | null>(null)
  const availableVoices = ref<SpeechSynthesisVoice[]>([])

  // Check browser support
  onMounted(() => {
    const synth = window.speechSynthesis
    isSupported.value = !!synth

    if (synth) {
      availableVoices.value = synth.getVoices()
      synth.onvoiceschanged = () => {
        availableVoices.value = synth.getVoices()
      }
    }
  })

  const speak = (text: string, lang: string = 'en-US') => {
    if (!isSupported.value) return

    const synth = window.speechSynthesis
    synth.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = lang
    utterance.rate = speed.value

    if (selectedVoice.value) {
      utterance.voice = selectedVoice.value
    }

    utterance.onstart = () => {
      isPlaying.value = true
    }

    utterance.onend = () => {
      isPlaying.value = false
    }

    synth.speak(utterance)
  }

  const pause = () => {
    window.speechSynthesis.pause()
  }

  const resume = () => {
    window.speechSynthesis.resume()
  }

  const stop = () => {
    window.speechSynthesis.cancel()
    isPlaying.value = false
  }

  return {
    isSupported,
    isPlaying,
    speed,
    selectedVoice,
    availableVoices,
    speak,
    pause,
    resume,
    stop,
  }
}
```

---

## 🔄 Auto-Import Configuration

Nuxt 4 automatically imports:
- ✅ Components from `~/components/`
- ✅ Composables from `~/composables/`
- ✅ Store modules from `~/stores/`
- ✅ Vue utilities (`ref`, `computed`, etc.)
- ✅ Nuxt utilities (`useRouter`, `navigateTo`, etc.)

**No need for manual imports!** Just use them directly in components.

---

## 🚀 Running Your Project

```bash
# Development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Generate static site
npm run generate
```

---

## 📌 Key Differences from Nuxt 3 → 4

| Feature | Nuxt 3 | Nuxt 4 |
|---------|--------|--------|
| **State Management** | Vuex | Pinia (default) |
| **Config File** | `nuxt.config.js` | `nuxt.config.ts` |
| **Mixins** | Supported | Use Composables ❌ |
| **Store Pattern** | `/store/*.js` | `/stores/*.ts` |
| **Asset Path** | `/static/` | `/public/` |
| **Script Setup** | `<script setup>` | `<script setup lang="ts">` ✅ |
| **Strict TypeScript** | Optional | Encouraged ✅ |

---

## ✅ Checklist Before Starting Development

- [ ] `npm install` completed
- [ ] Dependencies installed: `pinia`, `@pinia/nuxt`, `@nuxtjs/i18n`
- [ ] `nuxt.config.ts` updated with modules
- [ ] `/stores/` directory created
- [ ] `/types/` directory created
- [ ] `/composables/` directory created
- [ ] TypeScript types defined for Player, Role, Game
- [ ] Base stores created (game.ts, players.ts, roles.ts)
- [ ] i18n configuration in `nuxt.config.ts`
- [ ] `/locales/en.json` and `/locales/vi.json` created
- [ ] `npm run dev` runs without errors
- [ ] TypeScript compiler passes (`npx tsc --noEmit`)

---

## 📖 Useful Links

- [Nuxt 4 Documentation](https://nuxt.com)
- [Pinia Documentation](https://pinia.vuejs.org)
- [Vue 3 TypeScript Guide](https://vuejs.org/guide/typescript/)
- [i18n for Nuxt](https://i18n.nuxtjs.org)
- [Tailwind CSS Setup](https://tailwindcss.nuxtjs.org)

---

Happy coding! 🎉

