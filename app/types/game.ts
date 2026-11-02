


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

export enum EliminatedBy {
  VOTE = 'VOTE',
  WEREWOLF = 'WEREWOLF',
  WITCH = 'WITCH',
  HUNTER = 'HUNTER',
  OTHER = 'OTHER'
}

export interface PlayerRole {
  playerId: string
  roleId: string
  faction: Faction
  alive: boolean
  eliminatedBy?: EliminatedBy
  eliminatedRound?: number
}

// Night Phase Action Types


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

