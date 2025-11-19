import {defineStore} from 'pinia'
import type {DayPhaseVote, GameEvent, GameState, PlayerElimination, RoleAction} from '~/types/game'
import {EliminationMethod, Faction, GamePhase, GameStatus} from '~/types/game'
import {useRolesStore} from '~/stores/roles'
import {usePlayersStore} from '~/stores/players'

// Store instances
// const rolesStore = useRolesStore()

export interface DayOrNightAction {
    round: number
    phase: GamePhase
    villagerVoteKillForPlayerId?: string
    werewolfKillToPlayerId?: string
    // ----
    witchHealToPlayerId?: string
    witchPoisonToPlayerId?: string
    // hunterKillToPlayerId?: string
    // bodyguardProtectFromPlayerId?: string
    // bodyguardProtectToPlayerId?: string
    // seerInvestigatePlayerId?: string
    // seerInvestigateResult?: boolean
    // seerInvestigateToPlayerId?: string
    // seerInvestigateResult?: boolean
}

export const useGameStore = defineStore('game', {
    state: () => ({
        phase: GamePhase.SETUP,
        round: 1,
        status: GameStatus.SETUP,
        dayOrNightActions: [] as DayOrNightAction[],
        currentDayOrNightAction: {} as DayOrNightAction,
        // ---
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
            return (Object.values(state.selectedRoles) as number[]).reduce((sum: number, count: number): number => sum + count, 0)
        },
        livingPlayersCount: (state: any) => {
            return state.players.length
        },
        nightPhaseCount: (state: any) => {
            return state.gameLog.filter((e: GameEvent) => e.phase === GamePhase.NIGHT).length
        },
        dayPhaseCount: (state: any) => {
            return state.gameLog.filter((e: GameEvent) => e.phase === GamePhase.DAY).length
        },
        isNightPhase: (state: any) => {
            return state.phase === GamePhase.NIGHT
        },
        totalRoleCount: (state: any) => {
            return (Object.values(state.selectedRoles as number[]).reduce((sum, count) => sum + count, 0))
        },
        progressPercent: (state: any) => {
            const total = state.players.length
            return total > 0 ? (state.eliminatedPlayers.length / total) * 100 : 0
        },
        lastNightDeaths: (state: any) => {
            return state.playerEliminations
                .filter((elimination: PlayerElimination) => elimination.round === state.round)
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
            const nightCount = state.gameLog.filter((e: GameEvent) => e.phase === GamePhase.NIGHT).length
            const dayCount = state.gameLog.filter((e: GameEvent) => e.phase === GamePhase.DAY).length
            return nightCount > 0 || dayCount > 0
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
            this.phase = GamePhase.SETUP
            this.round = 1
            this.status = GameStatus.SETUP
            this.players = []
            this.selectedRoles = {}
            this.gameLog = []
            this.roleAcknowledgments = {}
            this.currentRoleRevealIndex = 0
            this.playerRoles = {}
            this.currentNightRoleIndex = 0
            this.alivePlayers = []
            this.dayPhaseVotes = []
            this.eliminatedPlayers = []
            this.playerEliminations = []
            this.gameWinner = null
            this.witchHealUsed = false
            this.witchPoisonUsed = false
            this.currentDayOrNightAction = {
                round: 1,
                phase: GamePhase.NIGHT,
            } as DayOrNightAction
            this.dayOrNightActions = [this.currentDayOrNightAction]
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
            if (this.phase === GamePhase.NIGHT) {
                this.currentDayOrNightAction = {
                    round: this.round,
                    phase: GamePhase.DAY,
                }
                this.dayOrNightActions.push(this.currentDayOrNightAction as DayOrNightAction)
                this.phase = GamePhase.DAY
            } else if (this.phase === GamePhase.DAY) {
                this.currentDayOrNightAction = {
                    round: this.round + 1,
                    phase: GamePhase.NIGHT,
                }
                this.dayOrNightActions.push(this.currentDayOrNightAction as DayOrNightAction)
                this.phase = GamePhase.NIGHT
                this.round++
            }
        },
        endGame() {
            this.status = GameStatus.FINISHED
            this.phase = GamePhase.END
        },
        acknowledgeRole(playerId: string, roleId: string) {
            this.roleAcknowledgments[playerId] = roleId
        },
        deacknowledgeRole(playerId: string) {
            delete this.roleAcknowledgments[playerId]
        },
        copyAcknowledgmentsToPlayerRoles() {
            this.playerRoles = { ...this.roleAcknowledgments }
        },
        updateAlivePlayers() {
            let currentEliminatedPlayers = []

            if (
                this.currentDayOrNightAction.werewolfKillToPlayerId
                && !this.currentDayOrNightAction.witchHealToPlayerId
            ) {
                currentEliminatedPlayers.push(this.currentDayOrNightAction.werewolfKillToPlayerId)
                this.eliminatePlayer(
                    this.currentDayOrNightAction.werewolfKillToPlayerId,
                    this.round,
                    EliminationMethod.WEREWOLF_KILL,
                )
            }

            if (this.currentDayOrNightAction.witchPoisonToPlayerId) {
                currentEliminatedPlayers.push(this.currentDayOrNightAction.witchPoisonToPlayerId)
                this.eliminatePlayer(
                    this.currentDayOrNightAction.witchPoisonToPlayerId,
                    this.round,
                    EliminationMethod.WITCH,
                )
            }

            this.alivePlayers = this.players.filter(pid => !this.eliminatedPlayers.includes(pid))
        },
        startNightPhase() {
            this.updateAlivePlayers()
            this.currentNightRoleIndex = 0
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
        eliminatePlayer(playerId: string, round: number, method: EliminationMethod = EliminationMethod.OTHER, description?: string) {
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
                const faction = role?.faction || Faction.VILLAGER
                alivePlayersByFaction.set(faction, (alivePlayersByFaction.get(faction) || 0) + 1)
            })

            const werewolvesAlive = alivePlayersByFaction.get(Faction.WEREWOLF) || 0
            const villagersAlive = alivePlayersByFaction.get(Faction.VILLAGER) || 0

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
                const methodLabels: { [key in EliminationMethod]: string } = {
                    [EliminationMethod.VOTE]: 'Voted Out',
                    [EliminationMethod.WEREWOLF_KILL]: 'Killed by Werewolves',
                    [EliminationMethod.WITCH]: 'Poisoned by Witch',
                    [EliminationMethod.HUNTER]: 'Shot by Hunter',
                    [EliminationMethod.OTHER]: 'Eliminated',
                }
                return methodLabels[elimination.method] || elimination.description
            }
            return '-'
        },
        isPlayerHasRole(playerId: string): boolean {
            return !!this.roleAcknowledgments[playerId]
        },
        buildDayOrNightActionMessage(event: DayOrNightAction): string[] {
            const playersStore = usePlayersStore()
            let messages: string[] = []

            if (event.werewolfKillToPlayerId) {
                const player = playersStore.getPlayerById(event.werewolfKillToPlayerId)
                messages.push(`🐺 Werewolves killed ${player?.name || 'Unknown Player'}.`)
            }

            return messages
        }
    },
    persist: true,
});
