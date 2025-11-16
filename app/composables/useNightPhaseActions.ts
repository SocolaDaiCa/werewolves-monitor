import { computed, ref } from 'vue'
import type { RoleAction } from '~/types/game'
import { useGameStore } from '~/stores/game'
import { useRolesStore } from '~/stores/roles'
import { usePlayersStore } from '~/stores/players'

export interface ActionResult {
  playerId: string
  action: string
  success: boolean
  message: string
  affectedPlayer?: string
}

export const useNightPhaseActions = () => {
  const gameStore = useGameStore()
  const rolesStore = useRolesStore()
  const playersStore = usePlayersStore()

  const killTargets = ref<Set<string>>(new Set())
  const healTargets = ref<Set<string>>(new Set())
  const protectedPlayers = ref<Set<string>>(new Set())
  const investigationResults = ref<Map<string, boolean>>(new Map())
  const results = ref<ActionResult[]>([])

  /**
   * Process all night actions and determine outcomes
   */
  const processNightActions = (actions: RoleAction[]) => {
    killTargets.value.clear()
    healTargets.value.clear()
    protectedPlayers.value.clear()
    investigationResults.value.clear()
    results.value = []

    // Process each action
    actions.forEach(action => {
      processAction(action)
    })

    // Resolve kills and protections
    resolveKills()

    return results.value
  }

  /**
   * Process individual action based on role
   */
  const processAction = (action: RoleAction) => {
    const role = rolesStore.getRoleById(action.roleId)
    if (!role) return

    switch (action.roleId.toLowerCase()) {
      case 'werewolf':
      case 'wolf-cub':
      case 'dire-wolf':
        handleWerewolfKill(action)
        break
      case 'witch':
        handleWitchAction(action)
        break
      case 'seer':
        handleSeerInvestigation(action)
        break
      case 'bodyguard':
      case 'priest':
        handleProtection(action)
        break
      case 'hunter':
        handleHunterAction(action)
        break
      case 'aura-seer':
        handleAuraSeerAction(action)
        break
      case 'vampire':
        handleVampireKill(action)
        break
      case 'cult-leader':
        handleCultRecruitment(action)
        break
      // Add more role handlers as needed
    }
  }

  /**
   * Handle werewolf killing
   */
  const handleWerewolfKill = (action: RoleAction) => {
    if (action.targetPlayerId && gameStore.alivePlayers.includes(action.targetPlayerId)) {
      killTargets.value.add(action.targetPlayerId)
      results.value.push({
        playerId: action.playerId,
        action: 'kill',
        success: true,
        message: 'Targeted for elimination',
        affectedPlayer: action.targetPlayerId,
      })
    }
  }

  /**
   * Handle witch's heal/poison
   * Witch can use both potions in the same night:
   * - targetPlayerId = heal target (person killed by werewolves)
   * - secondaryTargetPlayerId = poison target (any alive player)
   */
  const handleWitchAction = (action: RoleAction) => {
    // Handle HEAL
    if (action.targetPlayerId && !gameStore.witchHealUsed) {
      if (gameStore.alivePlayers.includes(action.targetPlayerId)) {
        healTargets.value.add(action.targetPlayerId)
        gameStore.witchHealUsed = true
        results.value.push({
          playerId: action.playerId,
          action: 'heal',
          success: true,
          message: 'Used healing potion',
          affectedPlayer: action.targetPlayerId,
        })
      }
    }

    // Handle POISON
    if (action.secondaryTargetPlayerId && !gameStore.witchPoisonUsed) {
      if (gameStore.alivePlayers.includes(action.secondaryTargetPlayerId)) {
        killTargets.value.add(action.secondaryTargetPlayerId)
        gameStore.witchPoisonUsed = true
        results.value.push({
          playerId: action.playerId,
          action: 'poison',
          success: true,
          message: 'Used poison potion',
          affectedPlayer: action.secondaryTargetPlayerId,
        })
      }
    }
  }

  /**
   * Handle seer investigation
   */
  const handleSeerInvestigation = (action: RoleAction) => {
    if (action.targetPlayerId && gameStore.alivePlayers.includes(action.targetPlayerId)) {
      const targetRole = gameStore.playerRoles[action.targetPlayerId]
      const targetRoleObj = rolesStore.getRoleById(targetRole)
      const isWerewolf = targetRoleObj?.faction === 'WEREWOLF'

      investigationResults.value.set(action.playerId, isWerewolf)
      results.value.push({
        playerId: action.playerId,
        action: 'investigate',
        success: true,
        message: isWerewolf ? 'This player is a werewolf' : 'This player is not a werewolf',
        affectedPlayer: action.targetPlayerId,
      })
    }
  }

  /**
   * Handle bodyguard/priest protection
   */
  const handleProtection = (action: RoleAction) => {
    if (action.targetPlayerId && gameStore.alivePlayers.includes(action.targetPlayerId)) {
      protectedPlayers.value.add(action.targetPlayerId)
      results.value.push({
        playerId: action.playerId,
        action: 'protect',
        success: true,
        message: 'Protected a player',
        affectedPlayer: action.targetPlayerId,
      })
    }
  }

  /**
   * Handle aura seer investigation
   */
  const handleAuraSeerAction = (action: RoleAction) => {
    if (action.targetPlayerId && gameStore.alivePlayers.includes(action.targetPlayerId)) {
      const targetRole = gameStore.playerRoles[action.targetPlayerId]
      const isSpecialRole = targetRole && !['villager', 'werewolf'].includes(targetRole)

      investigationResults.value.set(action.playerId, isSpecialRole)
      results.value.push({
        playerId: action.playerId,
        action: 'aura',
        success: true,
        message: isSpecialRole ? 'This player has a special role' : 'This player has no special role',
        affectedPlayer: action.targetPlayerId,
      })
    }
  }

  /**
   * Handle hunter action
   */
  const handleHunterAction = (action: RoleAction) => {
    // Hunter typically acts when dying, handled in day phase
    results.value.push({
      playerId: action.playerId,
      action: 'hunter',
      success: true,
      message: 'Hunter action registered',
    })
  }

  /**
   * Handle vampire kill
   */
  const handleVampireKill = (action: RoleAction) => {
    if (action.targetPlayerId && gameStore.alivePlayers.includes(action.targetPlayerId)) {
      killTargets.value.add(action.targetPlayerId)
      results.value.push({
        playerId: action.playerId,
        action: 'vampire-kill',
        success: true,
        message: 'Targeted for elimination',
        affectedPlayer: action.targetPlayerId,
      })
    }
  }

  /**
   * Handle cult leader recruitment
   */
  const handleCultRecruitment = (action: RoleAction) => {
    if (action.targetPlayerId && gameStore.alivePlayers.includes(action.targetPlayerId)) {
      results.value.push({
        playerId: action.playerId,
        action: 'recruit',
        success: true,
        message: 'Recruited a player',
        affectedPlayer: action.targetPlayerId,
      })
    }
  }

  /**
   * Resolve kill targets after all actions processed
   * Killed players who are protected OR healed by Witch survive
   */
  const resolveKills = () => {
    const actualDeaths: string[] = []

    killTargets.value.forEach(targetId => {
      // Check if player is protected (Bodyguard/Priest) OR healed by Witch
      const isProtected = protectedPlayers.value.has(targetId)
      const isHealed = healTargets.value.has(targetId)
      
      if (!isProtected && !isHealed) {
        actualDeaths.push(targetId)
        // Determine the method of elimination based on who killed them
        const killer = Array.from(results.value).find(r => r.affectedPlayer === targetId)
        const method = killer?.action === 'vampire-kill' ? 'WEREWOLF_KILL' : 'WEREWOLF_KILL'
        const playerName = playersStore.getPlayerById(targetId)?.name || 'Unknown'
        gameStore.eliminatePlayer(targetId, gameStore.round, method, `${playerName} was killed during the night`)
      }
    })

    return actualDeaths
  }

  /**
   * Get night results summary
   */
  const getNightSummary = () => {
    const summary = {
      kills: Array.from(killTargets.value),
      protections: Array.from(protectedPlayers.value),
      investigations: Array.from(investigationResults.value.entries()),
      totalDeaths: gameStore.eliminatedPlayers.filter(
        p => !gameStore.players.includes(p) || gameStore.alivePlayers.includes(p)
      ).length,
    }
    return summary
  }

  return {
    killTargets,
    healTargets,
    protectedPlayers,
    investigationResults,
    results,
    processNightActions,
    resolveKills,
    getNightSummary,
  }
}

