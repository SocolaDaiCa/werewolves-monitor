# 💻 Complete Example Implementation - Nuxt 4 + TypeScript

> Real-world examples để bạn copy-paste và customize

---

## 1️⃣ Complete Pinia Store Example

### `app/stores/game.ts` - Full Implementation

```typescript
import { defineStore } from 'pinia'
import type { Game, GamePlayer, Phase } from '~/types/game'
import type { RoleConfig } from '~/types/role'

interface GameState {
  phase: Phase
  round: number
  selectedPlayers: string[]
  selectedRoles: RoleConfig[]
  currentGame: Game | null
  gameHistory: Game[]
}

export const useGameStore = defineStore('game', () => {
  // State
  const state = reactive<GameState>({
    phase: 'setup',
    round: 0,
    selectedPlayers: [],
    selectedRoles: [],
    currentGame: null,
    gameHistory: [],
  })

  // Getters
  const currentPhase = computed(() => state.phase)
  const playerCount = computed(() => state.selectedPlayers.length)
  const roleCount = computed(() => 
    state.selectedRoles.reduce((sum, r) => sum + r.quantity, 0)
  )
  const isBalanced = computed(() => playerCount.value === roleCount.value)
  const totalBalance = computed(() => 
    state.selectedRoles.reduce((sum, r) => {
      const role = useRolesStore().getRoleById(r.roleId)
      return sum + (role?.balancePoints || 0) * r.quantity
    }, 0)
  )

  // Actions
  const selectPlayer = (playerId: string) => {
    const idx = state.selectedPlayers.indexOf(playerId)
    if (idx === -1) {
      state.selectedPlayers.push(playerId)
    } else {
      state.selectedPlayers.splice(idx, 1)
    }
  }

  const clearPlayers = () => {
    state.selectedPlayers = []
  }

  const setRoleQuantity = (roleId: string, quantity: number) => {
    const existing = state.selectedRoles.find(r => r.roleId === roleId)
    if (existing) {
      if (quantity > 0) {
        existing.quantity = quantity
      } else {
        state.selectedRoles = state.selectedRoles.filter(r => r.roleId !== roleId)
      }
    } else if (quantity > 0) {
      state.selectedRoles.push({ roleId, quantity })
    }
  }

  const setPhase = (phase: Phase) => {
    state.phase = phase
  }

  const nextRound = () => {
    state.round++
  }

  const startGame = (players: GamePlayer[], roles: RoleConfig[]) => {
    const game: Game = {
      id: `game-${Date.now()}`,
      startedAt: Date.now(),
      players: players.map(p => ({
        ...p,
        status: 'alive' as const,
      })),
      roles,
    }
    state.currentGame = game
    state.phase = 'night'
    state.round = 1
  }

  const endGame = (winner: Game['winner'], winners?: string[]) => {
    if (state.currentGame) {
      state.currentGame.endedAt = Date.now()
      state.currentGame.winner = winner
      if (winners) {
        state.currentGame.winner_names = winners
      }
      state.gameHistory.push(state.currentGame)
      state.currentGame = null
      state.phase = 'end'
    }
  }

  const resetGame = () => {
    state.phase = 'setup'
    state.round = 0
    state.selectedPlayers = []
    state.selectedRoles = []
    state.currentGame = null
  }

  // Persistence (save to localStorage)
  const saveToLocalStorage = () => {
    if (process.client) {
      localStorage.setItem('werewolves-game', JSON.stringify(state))
    }
  }

  const loadFromLocalStorage = () => {
    if (process.client) {
      const stored = localStorage.getItem('werewolves-game')
      if (stored) {
        Object.assign(state, JSON.parse(stored))
      }
    }
  }

  return {
    // State
    state,
    // Getters
    currentPhase,
    playerCount,
    roleCount,
    isBalanced,
    totalBalance,
    // Actions
    selectPlayer,
    clearPlayers,
    setRoleQuantity,
    setPhase,
    nextRound,
    startGame,
    endGame,
    resetGame,
    saveToLocalStorage,
    loadFromLocalStorage,
  }
})
```

### `app/stores/players.ts`

```typescript
import { defineStore } from 'pinia'
import type { Player } from '~/types/player'

export const usePlayersStore = defineStore('players', () => {
  const players = ref<Player[]>([])

  const addPlayer = (player: Player) => {
    players.value.push(player)
    savePlayers()
  }

  const updatePlayer = (id: string, updates: Partial<Player>) => {
    const idx = players.value.findIndex(p => p.id === id)
    if (idx !== -1) {
      players.value[idx] = { ...players.value[idx], ...updates }
      savePlayers()
    }
  }

  const deletePlayer = (id: string) => {
    players.value = players.value.filter(p => p.id !== id)
    savePlayers()
  }

  const getPlayerById = (id: string) => {
    return players.value.find(p => p.id === id)
  }

  const savePlayers = () => {
    if (process.client) {
      localStorage.setItem('werewolves-players', JSON.stringify(players.value))
    }
  }

  const loadPlayers = () => {
    if (process.client) {
      const stored = localStorage.getItem('werewolves-players')
      if (stored) {
        players.value = JSON.parse(stored)
      }
    }
  }

  return {
    players,
    addPlayer,
    updatePlayer,
    deletePlayer,
    getPlayerById,
    savePlayers,
    loadPlayers,
  }
})
```

---

## 2️⃣ TypeScript Types Examples

### `app/types/player.ts`

```typescript
export interface Player {
  id: string
  name: string
  avatar: string // base64 or URL
  joinedDate: number
  gamesPlayed: number
  wins: number
  lastPlayedDate?: number
}

export type PlayerStatus = 'alive' | 'dead' | 'eliminated'

export interface GamePlayer extends Player {
  role?: Role
  status: PlayerStatus
  eliminator?: string
  eliminatedAt?: number
}
```

### `app/types/role.ts`

```typescript
export interface Role {
  id: string
  name: string
  description: string
  faction: 'villager' | 'werewolf' | 'cult' | 'vampire' | 'neutral' | 'special'
  image: string // filename without path
  balancePoints: number
  nightAction: boolean
  actionDescription?: string
  actionType?: 'target_player' | 'none'
}

export interface RoleConfig {
  roleId: string
  quantity: number
}
```

### `app/types/game.ts`

```typescript
import type { Player, PlayerStatus } from './player'
import type { Role, RoleConfig } from './role'

export type Phase = 'setup' | 'night' | 'day' | 'voting' | 'end'

export type Winner = 'villagers' | 'werewolves' | 'cult' | 'tanner' | 'lovers' | 'special'

export interface GamePlayer extends Player {
  role?: Role
  status: PlayerStatus
  eliminator?: string
  eliminatedAt?: number
}

export interface GameAction {
  playerId: string
  targetPlayerId?: string
  action: string
  round: number
}

export interface Game {
  id: string
  startedAt: number
  endedAt?: number
  players: GamePlayer[]
  roles: RoleConfig[]
  actions: GameAction[]
  winner?: Winner
  winner_names?: string[]
  rounds: number
}
```

---

## 3️⃣ Composable Examples

### `app/composables/useTextToSpeech.ts`

```typescript
export const useTextToSpeech = () => {
  const isSupported = ref(false)
  const isPlaying = ref(false)
  const speed = ref(1)
  const language = ref('en-US')
  const voices = ref<SpeechSynthesisVoice[]>([])
  const selectedVoiceIndex = ref(0)

  onMounted(() => {
    if (!process.client) return

    const synth = window.speechSynthesis
    isSupported.value = !!synth

    if (synth) {
      // Load voices
      const loadVoices = () => {
        voices.value = synth.getVoices()
      }

      loadVoices()
      synth.onvoiceschanged = loadVoices
    }
  })

  const speak = (text: string, lang: string = 'en-US') => {
    if (!isSupported.value || !process.client) return

    const synth = window.speechSynthesis

    // Cancel previous speech
    if (isPlaying.value) {
      synth.cancel()
    }

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = lang
    utterance.rate = speed.value

    // Set voice if available
    if (voices.value.length > 0) {
      utterance.voice = voices.value[selectedVoiceIndex.value]
    }

    utterance.onstart = () => {
      isPlaying.value = true
    }

    utterance.onend = () => {
      isPlaying.value = false
    }

    utterance.onerror = (event) => {
      console.error('TTS Error:', event)
      isPlaying.value = false
    }

    synth.speak(utterance)
  }

  const pause = () => {
    if (process.client) {
      window.speechSynthesis.pause()
    }
  }

  const resume = () => {
    if (process.client) {
      window.speechSynthesis.resume()
    }
  }

  const stop = () => {
    if (process.client) {
      window.speechSynthesis.cancel()
      isPlaying.value = false
    }
  }

  const setLanguage = (lang: 'en-US' | 'vi-VN') => {
    language.value = lang
  }

  return {
    isSupported,
    isPlaying,
    speed,
    language,
    voices,
    selectedVoiceIndex,
    speak,
    pause,
    resume,
    stop,
    setLanguage,
  }
}
```

### `app/composables/useGameValidation.ts`

```typescript
export const useGameValidation = () => {
  const gameStore = useGameStore()

  const validateGameSetup = (): {
    isValid: boolean
    error?: string
  } => {
    const { playerCount, roleCount } = gameStore

    if (playerCount === 0) {
      return { isValid: false, error: 'Please select at least 1 player' }
    }

    if (roleCount === 0) {
      return { isValid: false, error: 'Please select at least 1 role' }
    }

    if (playerCount !== roleCount) {
      return {
        isValid: false,
        error: `Player count (${playerCount}) must match role count (${roleCount})`,
      }
    }

    return { isValid: true }
  }

  const getBalanceStatus = () => {
    const balance = gameStore.totalBalance

    if (balance === 0) return { status: 'perfect', color: 'green' }
    if (balance > 0 && balance <= 5) return { status: 'slight_village_bias', color: 'light-green' }
    if (balance < 0 && balance >= -5) return { status: 'slight_wolf_bias', color: 'light-red' }
    if (balance > 5) return { status: 'too_village_bias', color: 'red' }
    if (balance < -5) return { status: 'too_wolf_bias', color: 'red' }

    return { status: 'unknown', color: 'gray' }
  }

  return {
    validateGameSetup,
    getBalanceStatus,
  }
}
```

---

## 4️⃣ Component Examples

### `app/components/PlayerCard.vue`

```vue
<script setup lang="ts">
import type { Player } from '~/types/player'

interface Props {
  player: Player
  isSelected?: boolean
}

interface Emits {
  (e: 'select', id: string): void
  (e: 'edit', player: Player): void
  (e: 'delete', id: string): void
}

const props = withDefaults(defineProps<Props>(), {
  isSelected: false,
})

const emit = defineEmits<Emits>()

const winRate = computed(() => {
  if (props.player.gamesPlayed === 0) return 0
  return Math.round((props.player.wins / props.player.gamesPlayed) * 100)
})
</script>

<template>
  <div
    class="player-card"
    :class="{ 'selected': isSelected, 'cursor-pointer hover:shadow-lg': true }"
    @click="emit('select', player.id)"
  >
    <img
      :src="player.avatar"
      :alt="player.name"
      class="avatar"
    />

    <div class="info">
      <h3 class="font-bold text-lg">{{ player.name }}</h3>
      <div class="stats text-sm text-gray-600">
        <p>Games: {{ player.gamesPlayed }}</p>
        <p>Wins: {{ player.wins }} ({{ winRate }}%)</p>
      </div>
    </div>

    <div class="actions" @click.stop>
      <button
        class="btn-sm btn-primary"
        @click="emit('edit', player)"
      >
        Edit
      </button>
      <button
        class="btn-sm btn-danger"
        @click="emit('delete', player.id)"
      >
        Delete
      </button>
    </div>
  </div>
</template>

<style scoped>
.player-card {
  @apply border rounded-lg p-4 transition-all;
  @apply flex items-center gap-4;
}

.player-card.selected {
  @apply border-blue-500 bg-blue-50;
}

.avatar {
  @apply w-16 h-16 rounded-full object-cover;
}

.info {
  @apply flex-1;
}

.actions {
  @apply flex gap-2;
}

.btn-sm {
  @apply px-3 py-1 rounded text-sm font-medium;
}

.btn-primary {
  @apply bg-blue-500 text-white hover:bg-blue-600;
}

.btn-danger {
  @apply bg-red-500 text-white hover:bg-red-600;
}
</style>
```

### `app/components/RoleSelector.vue`

```vue
<script setup lang="ts">
import type { Role, RoleConfig } from '~/types/role'

interface Props {
  role: Role
  currentQuantity?: number
  maxQuantity?: number
}

interface Emits {
  (e: 'update', quantity: number): void
}

const props = withDefaults(defineProps<Props>(), {
  currentQuantity: 0,
  maxQuantity: 10,
})

const emit = defineEmits<Emits>()

const quantity = ref(props.currentQuantity)

const increment = () => {
  if (quantity.value < props.maxQuantity) {
    quantity.value++
    emit('update', quantity.value)
  }
}

const decrement = () => {
  if (quantity.value > 0) {
    quantity.value--
    emit('update', quantity.value)
  }
}

const updateQuantity = (e: Event) => {
  const value = parseInt((e.target as HTMLInputElement).value) || 0
  if (value >= 0 && value <= props.maxQuantity) {
    quantity.value = value
    emit('update', quantity.value)
  }
}
</script>

<template>
  <div class="role-selector">
    <div class="role-header">
      <img
        :src="`/images/roles/en/${role.id}.png`"
        :alt="role.name"
        class="role-icon"
      />
      <div class="role-info">
        <h3>{{ role.name }}</h3>
        <p class="faction" :class="role.faction">{{ role.faction }}</p>
      </div>
      <div class="balance" :class="{ positive: role.balancePoints > 0, negative: role.balancePoints < 0 }">
        {{ role.balancePoints > 0 ? '+' : '' }}{{ role.balancePoints }}
      </div>
    </div>

    <p class="description">{{ role.description }}</p>

    <div class="quantity-control">
      <button @click="decrement" class="btn">−</button>
      <input
        type="number"
        :value="quantity"
        @input="updateQuantity"
        :max="maxQuantity"
        class="quantity-input"
      />
      <button @click="increment" class="btn">+</button>
    </div>
  </div>
</template>

<style scoped>
.role-selector {
  @apply border rounded-lg p-4 bg-white;
}

.role-header {
  @apply flex items-center gap-4 mb-3;
}

.role-icon {
  @apply w-12 h-12 rounded object-cover;
}

.role-info {
  @apply flex-1;
}

.role-info h3 {
  @apply font-bold text-lg;
}

.faction {
  @apply text-sm capitalize text-gray-600;
}

.faction.villager { @apply text-blue-600; }
.faction.werewolf { @apply text-red-600; }
.faction.cult { @apply text-purple-600; }
.faction.vampire { @apply text-gray-600; }

.balance {
  @apply text-sm font-bold px-2 py-1 rounded;
}

.balance.positive {
  @apply bg-green-100 text-green-700;
}

.balance.negative {
  @apply bg-red-100 text-red-700;
}

.description {
  @apply text-sm text-gray-600 mb-3;
}

.quantity-control {
  @apply flex items-center gap-2;
}

.btn {
  @apply w-8 h-8 rounded border hover:bg-gray-100 font-bold;
}

.quantity-input {
  @apply w-16 border rounded px-2 py-1 text-center;
}
</style>
```

---

## 5️⃣ Page Example

### `app/pages/roles.vue`

```vue
<script setup lang="ts">
import { useRolesStore } from '~/stores/roles'
import { useGameStore } from '~/stores/game'

const rolesStore = useRolesStore()
const gameStore = useGameStore()

const selectedFaction = ref<string>('all')

const filteredRoles = computed(() => {
  const roles = rolesStore.roles
  if (selectedFaction.value === 'all') return roles
  return roles.filter(r => r.faction === selectedFaction.value)
})

const factions = [
  { id: 'all', label: 'All Roles' },
  { id: 'villager', label: 'Villagers' },
  { id: 'werewolf', label: 'Werewolves' },
  { id: 'cult', label: 'Cult' },
  { id: 'special', label: 'Special' },
]

const handleRoleQuantityChange = (roleId: string, quantity: number) => {
  gameStore.setRoleQuantity(roleId, quantity)
}

const clearAllRoles = () => {
  gameStore.state.selectedRoles = []
}
</script>

<template>
  <div class="roles-page">
    <div class="header">
      <h1>Role Management</h1>
      <div class="controls">
        <button @click="clearAllRoles" class="btn btn-secondary">
          Clear All
        </button>
      </div>
    </div>

    <div class="balance-indicator">
      <p>Total Balance: <strong>{{ gameStore.totalBalance }}</strong></p>
      <div class="balance-bar" :class="getBalanceClass">
        <div class="balance-fill" :style="{ width: getBalanceWidth + '%' }"></div>
      </div>
    </div>

    <div class="filters">
      <button
        v-for="faction in factions"
        :key="faction.id"
        :class="{ active: selectedFaction === faction.id }"
        @click="selectedFaction = faction.id"
        class="filter-btn"
      >
        {{ faction.label }}
      </button>
    </div>

    <div class="roles-grid">
      <RoleSelector
        v-for="role in filteredRoles"
        :key="role.id"
        :role="role"
        :current-quantity="gameStore.state.selectedRoles.find(r => r.roleId === role.id)?.quantity || 0"
        @update="handleRoleQuantityChange(role.id, $event)"
      />
    </div>
  </div>
</template>

<style scoped>
.roles-page {
  @apply p-4 max-w-7xl mx-auto;
}

.header {
  @apply flex justify-between items-center mb-6;
}

.header h1 {
  @apply text-3xl font-bold;
}

.balance-indicator {
  @apply bg-gray-100 p-4 rounded-lg mb-6;
}

.balance-indicator p {
  @apply mb-2 font-semibold;
}

.balance-bar {
  @apply w-full h-2 bg-gray-300 rounded-full overflow-hidden;
}

.balance-fill {
  @apply h-full transition-all;
}

.filters {
  @apply flex gap-2 mb-6 overflow-x-auto pb-2;
}

.filter-btn {
  @apply px-4 py-2 rounded border whitespace-nowrap;
  @apply hover:bg-gray-100 transition;
}

.filter-btn.active {
  @apply bg-blue-500 text-white border-blue-500;
}

.roles-grid {
  @apply grid gap-4 md:grid-cols-2 lg:grid-cols-3;
}

.btn {
  @apply px-4 py-2 rounded font-medium;
}

.btn-secondary {
  @apply bg-gray-500 text-white hover:bg-gray-600;
}
</style>
```

---

## 💡 Key Patterns Used

✅ Store pattern: `const store = useStore()`
✅ Computed properties: `computed(() => ...)`
✅ Reactive refs: `ref()` for state
✅ TypeScript interfaces: Props validation
✅ Emit typing: `defineEmits<Emits>()`
✅ Props with defaults: `withDefaults(defineProps<Props>(), {})`

---

Ready to implement? Copy these examples and customize! 🚀

