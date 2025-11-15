export type GamePhase = 'NIGHT' | 'DAY' | 'SETUP' | 'END'
export type GameStatus = 'SETUP' | 'PLAYING' | 'FINISHED'
export type Faction = 'VILLAGER' | 'WEREWOLF' | 'CULT' | 'VAMPIRE' | 'SPECIAL'

export interface GameEvent {
  round: number
  phase: GamePhase
  message: string
  timestamp: number
}

export interface GameState {
  phase: GamePhase
  round: number
  status: GameStatus
  players: string[] // player IDs
  selectedRoles: { [roleId: string]: number }
  gameLog: GameEvent[]
}

export interface PlayerRole {
  playerId: string
  roleId: string
  faction: Faction
  alive: boolean
  elimatedBy?: 'VOTE' | 'WEREWOLF' | 'WITCH' | 'HUNTER' | 'OTHER'
  eliminatedRound?: number
}

// Night Phase Action Types
export type RoleActionType = 'SELECT_PLAYER' | 'SELECT_TARGET' | 'DUAL_SELECT' | 'SKIP' | 'NONE'

export interface RoleAction {
  roleId: string
  playerId: string
  actionType: RoleActionType
  targetPlayerId?: string
  secondaryTargetPlayerId?: string
  timestamp: number
}

export interface NightPhaseState {
  currentRoleIndex: number
  completedActions: RoleAction[]
  activePlayers: string[] // players still alive
}

export interface DayPhaseVote {
  voterId: string
  targetPlayerId?: string // null for 'vote none'
  timestamp: number
}

