import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// Types
export type GamePhase = 'NIGHT' | 'DAY' | 'SETUP' | 'END'
export type GameStatus = 'SETUP' | 'PLAYING' | 'FINISHED'

export interface GameState {
  phase: GamePhase
  round: number
  status: GameStatus
  players: string[] // player IDs
  selectedRoles: { [roleId: string]: number } // role id -> count
  gameLog: GameEvent[]
}

export interface GameEvent {
  round: number
  phase: GamePhase
  message: string
  timestamp: number
}

export const useGameStore = defineStore('game', () => {
  // State
  const phase = ref<GamePhase>('SETUP')
  const round = ref(1)
  const status = ref<GameStatus>('SETUP')
  const players = ref<string[]>([])
  const selectedRoles = ref<{ [roleId: string]: number }>({})
  const gameLog = ref<GameEvent[]>([])

  // Getters
  const totalRoleSlots = computed(() => {
    return Object.values(selectedRoles.value).reduce((sum, count) => sum + count, 0)
  })

  const livingPlayersCount = computed(() => {
    return players.value.length
  })

  const gameState = computed((): GameState => ({
    phase: phase.value,
    round: round.value,
    status: status.value,
    players: players.value,
    selectedRoles: selectedRoles.value,
    gameLog: gameLog.value,
  }))

  // Actions
  function setPhase(newPhase: GamePhase) {
    phase.value = newPhase
  }

  function setRound(newRound: number) {
    round.value = newRound
  }

  function setStatus(newStatus: GameStatus) {
    status.value = newStatus
  }

  function setPlayers(playerIds: string[]) {
    players.value = playerIds
  }

  function setSelectedRoles(roles: { [roleId: string]: number }) {
    selectedRoles.value = roles
  }

  function initializeGame(playerIds: string[], roles: { [roleId: string]: number }) {
    players.value = playerIds
    selectedRoles.value = roles
    round.value = 1
    phase.value = 'NIGHT'
    status.value = 'PLAYING'
    gameLog.value = []
  }

  function addGameEvent(message: string) {
    gameLog.value.push({
      round: round.value,
      phase: phase.value,
      message,
      timestamp: Date.now(),
    })
  }

  function nextPhase() {
    if (phase.value === 'NIGHT') {
      phase.value = 'DAY'
    } else if (phase.value === 'DAY') {
      phase.value = 'NIGHT'
      round.value++
    }
  }

  function endGame() {
    status.value = 'FINISHED'
    phase.value = 'END'
  }

  function resetGame() {
    phase.value = 'SETUP'
    round.value = 1
    status.value = 'SETUP'
    players.value = []
    selectedRoles.value = {}
    gameLog.value = []
  }

  return {
    phase,
    round,
    status,
    players,
    selectedRoles,
    gameLog,
    totalRoleSlots,
    livingPlayersCount,
    gameState,
    setPhase,
    setRound,
    setStatus,
    setPlayers,
    setSelectedRoles,
    initializeGame,
    addGameEvent,
    nextPhase,
    endGame,
    resetGame,
  }
})

