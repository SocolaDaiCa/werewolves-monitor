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

