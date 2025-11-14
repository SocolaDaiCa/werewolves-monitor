import { computed } from 'vue'
import { useGameStore } from '~/stores/game'
import { usePlayersStore } from '~/stores/players'
import { useRolesStore } from '~/stores/roles'

/**
 * Composable for game logic and utilities
 */
export const useGame = () => {
  const gameStore = useGameStore()
  const playersStore = usePlayersStore()
  const rolesStore = useRolesStore()

  // Computed properties for game state
  const canStartGame = computed(() => {
    return (
      playersStore.playerCount > 0 &&
      rolesStore.totalRoleCount > 0 &&
      playersStore.playerCount === rolesStore.totalRoleCount
    )
  })

  const playerRoleMismatch = computed(() => {
    const playerCount = playersStore.playerCount
    const roleCount = rolesStore.totalRoleCount
    if (playerCount === roleCount) return null
    return {
      playerCount,
      roleCount,
      difference: roleCount - playerCount,
    }
  })

  const gameBalance = computed(() => ({
    points: rolesStore.totalBalancePoints,
    status: rolesStore.balanceStatus,
  }))

  // Methods
  function initializeGame(selectedPlayerIds: string[]) {
    const roles = rolesStore.selectedRoles
    gameStore.initializeGame(selectedPlayerIds, roles)
  }

  function advancePhase() {
    gameStore.nextPhase()
  }

  function endCurrentGame() {
    gameStore.endGame()
  }

  function resetGame() {
    gameStore.resetGame()
    rolesStore.clearAllRoles()
  }

  function getPlayerRole(playerId: string) {
    // This would be populated during game start
    // For now, return placeholder
    return null
  }

  function getGameStatus() {
    return gameStore.gameState
  }

  return {
    // State refs
    gameStore,
    playersStore,
    rolesStore,

    // Computed
    canStartGame,
    playerRoleMismatch,
    gameBalance,

    // Methods
    initializeGame,
    advancePhase,
    endCurrentGame,
    resetGame,
    getPlayerRole,
    getGameStatus,
  }
}

