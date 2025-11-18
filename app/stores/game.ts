import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { RoleAction, NightPhaseState, DayPhaseVote, GamePhase, GameStatus, GameState, GameEvent, PlayerElimination } from '~/types/game'
import { useRolesStore } from '~/stores/roles'
import { usePlayersStore } from '~/stores/players'

// Store instances
// const rolesStore = useRolesStore()

export const useGameStore = defineStore('game', {
    state: () => ({
        phase: 'SETUP' as GamePhase,
        round: 1,
        status: 'SETUP' as GameStatus,
        players: [] as string[],
        selectedRoles: {} as { [roleId: string]: number },
        gameLog: [] as GameEvent[],
        roleAcknowledgments: {} as { [playerId: string]: string },
        currentRoleRevealIndex: 0,
        playerRoles: {} as { [playerId: string]: string },
        // Night phase state
        nightPhaseActions: [] as RoleAction[],
        currentNightRoleIndex: 0,
        alivePlayers: [] as string[],
        // Day phase state
        dayPhaseVotes: [] as DayPhaseVote[],
        eliminatedPlayers: [] as string[],

        // Game end tracking
        playerEliminations: [] as PlayerElimination[],
        gameWinner: null as { winner: string; reason: string } | null,

        // Witch state tracking
        witchHealUsed: false,
        witchPoisonUsed: false,
    }),
    getters: {
        totalRoleSlots: (state: any) => {
            return Object.values(state.selectedRoles).reduce((sum, count) => sum + count, 0)
        },
        livingPlayersCount: (state: any) => {
            return state.players.length
        },
        nightPhaseCount: (state: any) => {
            return state.gameLog.filter((e: GameEvent) => e.phase === 'NIGHT').length
        },
        dayPhaseCount: (state: any) => {
            return state.gameLog.filter((e: GameEvent) => e.phase === 'DAY').length
        },
        totalActions: (state: any) => {
            return state.nightPhaseActions.length
        },
        isNightPhase: (state: any) => {
            return state.phase === 'NIGHT'
        },
        totalRoleCount: (state: any) => {
            return Object.values(state.selectedRoles).reduce((sum, count) => sum + count, 0)
        },
        progressPercent: (state: any) => {
            const total = state.players.length
            return total > 0 ? (state.eliminatedPlayers.length / total) * 100 : 0
        },
        lastNightDeaths: (state: any) => {
            const currentRound = state.round
            return state.playerEliminations
                .filter((elimination: PlayerElimination) => {
                    return elimination.round === currentRound &&
                        (elimination.method === 'WEREWOLF_KILL' || elimination.method === 'WITCH')
                })
                .map((elimination: PlayerElimination) => ({
                    playerId: elimination.playerId,
                    description: elimination.description,
                }))
        },
        survivors: (state: any) => {
            return state.players.length - state.eliminatedPlayers.length
        },
        eliminated: (state: any) => {
            return state.eliminatedPlayers.length
        },
        avgRoundTime: (state: any) => {
            if (state.gameLog.length === 0) return 0
            const firstEvent = state.gameLog[0]
            const lastEvent = state.gameLog[state.gameLog.length - 1]
            if (!firstEvent || !lastEvent) return 0

            const firstTimestamp = firstEvent.timestamp
            const lastTimestamp = lastEvent.timestamp
            const totalMinutes = Math.floor((lastTimestamp - firstTimestamp) / 60000)
            return Math.ceil(totalMinutes / state.round)
        },
        hasStats: (state: any) => {
            const nightCount = state.gameLog.filter((e: GameEvent) => e.phase === 'NIGHT').length
            const dayCount = state.gameLog.filter((e: GameEvent) => e.phase === 'DAY').length
            const actionsCount = state.nightPhaseActions.length
            return nightCount > 0 || dayCount > 0 || actionsCount > 0
        },
        gameEvents: (state: any) => {
            return state.gameLog
        },
        gameState: (state: any): GameState => ({
            phase: state.phase.value,
            round: state.round.value,
            status: state.status.value,
            players: state.players.value,
            selectedRoles: state.selectedRoles.value,
            gameLog: state.gameLog.value,
            roleAcknowledgments: state.roleAcknowledgments.value,
            currentRoleRevealIndex: state.currentRoleRevealIndex.value,
            playerRoles: state.playerRoles.value,
        }),
        alivePlayersWithDetails: (state: any) => {
            const playersStore = usePlayersStore()
            return state.alivePlayers
                .map((playerId: string) => playersStore.getPlayerById(playerId))
                .filter((p: any) => p !== null && p !== undefined)
        },
    },
    actions: {
        resetGame() {
            this.phase = 'SETUP'
            this.round = 1
            this.status = 'SETUP'
            this.players = []
            this.selectedRoles = {}
            this.gameLog = []
            this.roleAcknowledgments = {}
            this.currentRoleRevealIndex = 0
            this.playerRoles = {}
            this.nightPhaseActions = []
            this.currentNightRoleIndex = 0
            this.alivePlayers = []
            this.dayPhaseVotes = []
            this.eliminatedPlayers = []
            this.playerEliminations = []
            this.gameWinner = null
            this.witchHealUsed = false
            this.witchPoisonUsed = false
        },
        setPhase(newPhase: GamePhase) {
            this.phase = newPhase
        },
        setRound(newRound: number) {
            this.round = newRound
        },
        setStatus(newStatus: GameStatus) {
            this.status = newStatus
        },
        setSelectedRoles(roles: { [roleId: string]: number }) {
            this.selectedRoles = roles
        },
        initializeGame(playerIds: string[], roles: { [roleId: string]: number }) {
            this.resetGame()
            this.players = playerIds
            this.selectedRoles = roles
        },
        addGameEvent(message: string) {
            this.gameLog.push({
                round: this.round,
                phase: this.phase,
                message,
                timestamp: Date.now(),
            })
        },
        nextPhase() {
            if (this.phase === 'NIGHT') {
                this.phase = 'DAY'
            } else if (this.phase === 'DAY') {
                this.phase = 'NIGHT'
                this.round++
            }
        },
        endGame() {
            this.status = 'FINISHED'
            this.phase = 'END'
        },
        acknowledgeRole(playerId: string, roleId: string) {
            this.roleAcknowledgments[playerId] = roleId
        },
        deacknowledgeRole(playerId: string) {
            delete this.roleAcknowledgments[playerId]
        },
        setCurrentRoleRevealIndex(index: number) {
            this.currentRoleRevealIndex = index
        },
        resetRoleReveal() {
            this.roleAcknowledgments = {}
            this.currentRoleRevealIndex = 0
        },
        copyAcknowledgmentsToPlayerRoles() {
            this.playerRoles = { ...this.roleAcknowledgments }
        },
        assignRolesToPlayers(roles: { [roleId: string]: number }, playerIds: string[]) {
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

            this.playerRoles = roleAssignments
        },
        updateAlivePlayers() {
            this.alivePlayers = this.players.filter(pid => !this.eliminatedPlayers.includes(pid))
        },
        startNightPhase() {
            this.updateAlivePlayers()
            this.nightPhaseActions = []
            this.currentNightRoleIndex = 0
        },
        addNightAction(action: RoleAction) {
            this.nightPhaseActions.push(action)
        },
        setCurrentNightRoleIndex(index: number) {
            this.currentNightRoleIndex = index
        },
        addDayVote(vote: DayPhaseVote) {
            // Remove previous vote from same voter if exists
            this.dayPhaseVotes = this.dayPhaseVotes.filter(v => v.voterId !== vote.voterId)
            this.dayPhaseVotes.push(vote)
        },
        clearDayVotes() {
            this.dayPhaseVotes = []
        },
        eliminatePlayer(playerId: string, round: number, method: 'VOTE' | 'WEREWOLF_KILL' | 'WITCH' | 'HUNTER' | 'OTHER' = 'OTHER', description?: string) {
            if (!this.eliminatedPlayers.includes(playerId)) {
                this.eliminatedPlayers.push(playerId)
                this.playerEliminations.push({
                    playerId,
                    round,
                    method,
                    description: description || `Player eliminated in round ${round}`,
                })
                this.addGameEvent(description || `Player ${playerId} was eliminated in round ${round}`)
            }
        },
        checkWinConditions() {
            const rolesStore = useRolesStore();
            // Count alive players by faction
            const alivePlayersByFaction = new Map<string, number>()

            this.alivePlayers.forEach(playerId => {
                const roleId = this.playerRoles[playerId]
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
                this.gameWinner = result
                return result
            }

            // Condition 2: Werewolves >= Villagers → Werewolves win
            if (werewolvesAlive >= villagersAlive && villagersAlive > 0) {
                const result = { winner: 'WEREWOLVES', reason: 'Werewolves equal or outnumber villagers' }
                this.gameWinner = result
                return result
            }

            return null // Game continues
        },
        setGameWinner(winner: string, reason: string) {
            this.gameWinner = { winner, reason }
        },
        getPlayerElimination(playerId: string) {
            return this.playerEliminations.find(e => e.playerId === playerId)
        },
        getEliminationRound(playerId: string): number | undefined {
            const elimination = this.getPlayerElimination(playerId)
            return elimination ? elimination.round : undefined
        },
        getEliminationMethod(playerId: string): string {
            const elimination = this.getPlayerElimination(playerId)
            if (elimination) {
                const methodLabels: { [key: string]: string } = {
                    VOTE: 'Voted Out',
                    WEREWOLF_KILL: 'Killed by Werewolves',
                    WITCH: 'Poisoned by Witch',
                    HUNTER: 'Shot by Hunter',
                    OTHER: 'Eliminated',
                }
                return methodLabels[elimination.method] || elimination.description
            }
            return '-'
        },
        isPlayerHasRole(playerId: string): boolean {
            return !!this.roleAcknowledgments[playerId]
        }
    },
    persist: true,
});
