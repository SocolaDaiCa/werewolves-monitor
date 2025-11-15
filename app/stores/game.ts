import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { RoleAction, NightPhaseState, DayPhaseVote } from '~/types/game'

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

export const useGameStore = defineStore('game', () => {
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
    roleAcknowledgments.value = {}
    currentRoleRevealIndex.value = 0
    playerRoles.value = {}
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

  function startNightPhase() {
    alivePlayers.value = players.value.filter(pid => !eliminatedPlayers.value.includes(pid))
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

  function eliminatePlayer(playerId: string, round: number) {
    if (!eliminatedPlayers.value.includes(playerId)) {
      eliminatedPlayers.value.push(playerId)
      addGameEvent(`Player ${playerId} was eliminated in round ${round}`)
    }
  }

  function checkWinConditions() {
    // Count alive players by faction
    const alivePlayersByFaction = new Map<string, number>()
    
    alivePlayers.value.forEach(playerId => {
      const roleId = playerRoles.value[playerId]
      // This is simplified - in full version, check role's actual faction
      // For now, assume 'werewolf' in roleId means werewolf faction
      const faction = roleId?.toLowerCase().includes('werewolf') ? 'WEREWOLF' : 'VILLAGER'
      alivePlayersByFaction.set(faction, (alivePlayersByFaction.get(faction) || 0) + 1)
    })

    const werewolvesAlive = alivePlayersByFaction.get('WEREWOLF') || 0
    const villagersAlive = alivePlayersByFaction.get('VILLAGER') || 0

    // Check win conditions
    if (werewolvesAlive === 0) {
      return { winner: 'VILLAGERS', reason: 'All werewolves eliminated' }
    }
    if (werewolvesAlive >= villagersAlive && villagersAlive > 0) {
      return { winner: 'WEREWOLVES', reason: 'Werewolves equal or outnumber villagers' }
    }
    
    return null // Game continues
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
    startNightPhase,
    addNightAction,
    setCurrentNightRoleIndex,
    addDayVote,
    clearDayVotes,
    eliminatePlayer,
    checkWinConditions,
  }
}, {
  persist: true,
})

