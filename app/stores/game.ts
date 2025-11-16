import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { RoleAction, NightPhaseState, DayPhaseVote } from '~/types/game'
import { useRolesStore } from './roles'

// Store instances
// const rolesStore = useRolesStore()

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
  roleAcknowledgments: { [playerId: string]: string } // playerId -> roleId
  currentRoleRevealIndex: number
  playerRoles: { [playerId: string]: string } // playerId -> roleId (assigned roles)
}

export interface GameEvent {
  round: number
  phase: GamePhase
  message: string
  timestamp: number
}

export interface PlayerElimination {
  playerId: string
  round: number
  method: 'VOTE' | 'WEREWOLF_KILL' | 'WITCH' | 'HUNTER' | 'OTHER'
  description: string
}

export const useGameStore = defineStore('game', () => {
  const rolesStore = useRolesStore();
  // State
  const phase = ref<GamePhase>('SETUP')
  const round = ref(1)
  const status = ref<GameStatus>('SETUP')
  const players = ref<string[]>([])
  const selectedRoles = ref<{ [roleId: string]: number }>({})
  const gameLog = ref<GameEvent[]>([])
  const roleAcknowledgments = ref<{ [playerId: string]: string }>({})
  const currentRoleRevealIndex = ref(0)
  const playerRoles = ref<{ [playerId: string]: string }>({})
  
  // Night phase state
  const nightPhaseActions = ref<RoleAction[]>([])
  const currentNightRoleIndex = ref(0)
  const alivePlayers = ref<string[]>([])
  
  // Day phase state
  const dayPhaseVotes = ref<DayPhaseVote[]>([])
  const eliminatedPlayers = ref<string[]>([])
  
  // Game end tracking
  const playerEliminations = ref<PlayerElimination[]>([])
  const gameWinner = ref<{ winner: string; reason: string } | null>(null)

  // Witch state tracking
  const witchHealUsed = ref(false)
  const witchPoisonUsed = ref(false)

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
    roleAcknowledgments: roleAcknowledgments.value,
    currentRoleRevealIndex: currentRoleRevealIndex.value,
    playerRoles: playerRoles.value,
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

  function setSelectedRoles(roles: { [roleId: string]: number }) {
    selectedRoles.value = roles
  }

  function initializeGame(playerIds: string[], roles: { [roleId: string]: number }) {
    resetGame()
    players.value = playerIds
    selectedRoles.value = roles
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
    roleAcknowledgments.value = {}
    currentRoleRevealIndex.value = 0
    playerRoles.value = {}
    nightPhaseActions.value = []
    currentNightRoleIndex.value = 0
    alivePlayers.value = []
    dayPhaseVotes.value = []
    eliminatedPlayers.value = []
    playerEliminations.value = []
    gameWinner.value = null
    witchHealUsed.value = false
    witchPoisonUsed.value = false
  }

  function acknowledgeRole(playerId: string, roleId: string) {
    roleAcknowledgments.value[playerId] = roleId
  }

  function deacknowledgeRole(playerId: string) {
    delete roleAcknowledgments.value[playerId]
  }

  function setCurrentRoleRevealIndex(index: number) {
    currentRoleRevealIndex.value = index
  }

  function resetRoleReveal() {
    roleAcknowledgments.value = {}
    currentRoleRevealIndex.value = 0
  }

  function copyAcknowledgmentsToPlayerRoles() {
    playerRoles.value = { ...roleAcknowledgments.value }
  }

  // 

  function assignRolesToPlayers(roles: { [roleId: string]: number }, playerIds: string[]) {
    // Create role assignments from the selected roles
    const roleAssignments: { [playerId: string]: string } = {}
    const rolesList: string[] = []

    // Build a list of roleIds repeated by their count
    Object.entries(roles).forEach(([roleId, count]) => {
      for (let i = 0; i < count; i++) {
        rolesList.push(roleId)
      }
    })

    // Shuffle the roles list
    for (let i = rolesList.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      const temp = rolesList[i] as string
      rolesList[i] = rolesList[j] as string
      rolesList[j] = temp
    }

    // Assign roles to players
    playerIds.forEach((playerId, index) => {
      if (index < rolesList.length) {
        roleAssignments[playerId] = rolesList[index] || ''
      }
    })

    playerRoles.value = roleAssignments
  }

  function updateAlivePlayers() {
    alivePlayers.value = players.value.filter(pid => !eliminatedPlayers.value.includes(pid))
  }

  function startNightPhase() {
    updateAlivePlayers()
    nightPhaseActions.value = []
    currentNightRoleIndex.value = 0
  }

  function addNightAction(action: RoleAction) {
    nightPhaseActions.value.push(action)
  }

  function setCurrentNightRoleIndex(index: number) {
    currentNightRoleIndex.value = index
  }

  function addDayVote(vote: DayPhaseVote) {
    // Remove previous vote from same voter if exists
    dayPhaseVotes.value = dayPhaseVotes.value.filter(v => v.voterId !== vote.voterId)
    dayPhaseVotes.value.push(vote)
  }

  function clearDayVotes() {
    dayPhaseVotes.value = []
  }

  function eliminatePlayer(playerId: string, round: number, method: 'VOTE' | 'WEREWOLF_KILL' | 'WITCH' | 'HUNTER' | 'OTHER' = 'OTHER', description?: string) {
    if (!eliminatedPlayers.value.includes(playerId)) {
      eliminatedPlayers.value.push(playerId)
      playerEliminations.value.push({
        playerId,
        round,
        method,
        description: description || `Player eliminated in round ${round}`,
      })
      addGameEvent(description || `Player ${playerId} was eliminated in round ${round}`)
    }
  }

  function checkWinConditions() {
    // Count alive players by faction
    const alivePlayersByFaction = new Map<string, number>()
    
    alivePlayers.value.forEach(playerId => {
      const roleId = playerRoles.value[playerId]
      if (!roleId) return
      
      // Get the actual role from roles store to check faction
      const role = rolesStore.getRoleById(roleId)
      const faction = role?.faction || 'VILLAGER'
      alivePlayersByFaction.set(faction, (alivePlayersByFaction.get(faction) || 0) + 1)
    })

    const werewolvesAlive = alivePlayersByFaction.get('WEREWOLF') || 0
    const villagersAlive = alivePlayersByFaction.get('VILLAGER') || 0

    console.log('werewolvesAlive', werewolvesAlive)
    console.log('villagersAlive', villagersAlive)
    console.log('alivePlayersByFaction', alivePlayersByFaction)

    // Check win conditions
    // Condition 1: No werewolves left → Villagers win
    if (werewolvesAlive === 0) {
      const result = { winner: 'VILLAGERS', reason: 'All werewolves eliminated' }
      gameWinner.value = result
      return result
    }
    
    // Condition 2: Werewolves >= Villagers → Werewolves win
    if (werewolvesAlive >= villagersAlive && villagersAlive > 0) {
      const result = { winner: 'WEREWOLVES', reason: 'Werewolves equal or outnumber villagers' }
      gameWinner.value = result
      return result
    }
    
    return null // Game continues
  }

  function setGameWinner(winner: string, reason: string) {
    gameWinner.value = { winner, reason }
  }

  function getPlayerElimination(playerId: string) {
    return playerEliminations.value.find(e => e.playerId === playerId)
  }

  return {
    phase,
    round,
    status,
    players,
    selectedRoles,
    gameLog,
    roleAcknowledgments,
    currentRoleRevealIndex,
    playerRoles,
    nightPhaseActions,
    currentNightRoleIndex,
    alivePlayers,
    dayPhaseVotes,
    eliminatedPlayers,
    playerEliminations,
    gameWinner,
    witchHealUsed,
    witchPoisonUsed,
    totalRoleSlots,
    livingPlayersCount,
    gameState,
    setPhase,
    setRound,
    setStatus,
    setSelectedRoles,
    initializeGame,
    addGameEvent,
    nextPhase,
    endGame,
    resetGame,
    acknowledgeRole,
    deacknowledgeRole,
    setCurrentRoleRevealIndex,
    resetRoleReveal,
    copyAcknowledgmentsToPlayerRoles,
    assignRolesToPlayers,
    updateAlivePlayers,
    startNightPhase,
    addNightAction,
    setCurrentNightRoleIndex,
    addDayVote,
    clearDayVotes,
    eliminatePlayer,
    checkWinConditions,
    setGameWinner,
    getPlayerElimination,
  }
}, {
  persist: true,
})

