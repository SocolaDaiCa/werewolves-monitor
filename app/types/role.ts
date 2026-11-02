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



import type { RoleActionType } from '~/types/game'



// Re-export RoleActionType for convenience
export { RoleActionType } from '~/types/game'

export interface RoleConfiguration {
  roleId: string
  quantity: number
}

export interface RoleBalance {
  totalPoints: number
  status: 'perfect' | 'light-green' | 'light-red' | 'red'
  isBalanced: boolean
}

