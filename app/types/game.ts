export enum GamePhase {
  NIGHT = 'NIGHT',
  DAY = 'DAY',
  SETUP = 'SETUP',
  END = 'END'
}

export enum GameStatus {
  SETUP = 'SETUP',
  PLAYING = 'PLAYING',
  FINISHED = 'FINISHED'
}
export enum Faction {
  VILLAGER = 'VILLAGER',
  WEREWOLF = 'WEREWOLF',
  CULT = 'CULT',
  VAMPIRE = 'VAMPIRE',
  SPECIAL = 'SPECIAL'
}

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
  roleAcknowledgments: { [playerId: string]: string } // playerId -> roleId
  currentRoleRevealIndex: number
  playerRoles: { [playerId: string]: string } // playerId -> roleId (assigned roles)
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
export type RoleActionType = 'SELECT_PLAYER' | 'SELECT_TARGET' | 'DUAL_SELECT' | 'TEXT_INPUT' | 'ACKNOWLEDGE' | 'DUAL_OPTION' | 'SKIP' | 'NONE'

export interface RoleAction {
  roleId: string
  playerId: string
  actionType: RoleActionType
  targetPlayerId?: string
  secondaryTargetPlayerId?: string
  tertiaryTargetPlayerId?: string // For roles that need 3 targets (e.g., Witch: heal + poison)
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

export enum EliminationMethod {
  VOTE = 'VOTE',
  WEREWOLF_KILL = 'WEREWOLF_KILL',
  WITCH = 'WITCH',
  HUNTER = 'HUNTER',
  OTHER = 'OTHER'
}

export interface PlayerElimination {
  playerId: string
  round: number
  method: EliminationMethod
  description: string
}

