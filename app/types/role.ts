export enum RoleFaction {  
  VILLAGER = 'VILLAGER',
  WEREWOLF = 'WEREWOLF',
  CULT = 'CULT',
  VAMPIRE = 'VAMPIRE',
  SPECIAL = 'SPECIAL'
}

export enum NightlyActivity {
  ALWAYS = 'ALWAYS',
  FIRST_NIGHT = 'FIRST_NIGHT',
  NEVER = 'NEVER'
}

import type { RoleActionType } from '~/types/game'

export interface Role {
  id: string
  name: string
  nameVi: string
  description: string
  descriptionVi: string
  faction: RoleFaction
  balancePoints: number
  nightly: NightlyActivity
  nightOrder?: number
  actionType?: RoleActionType
  icon?: string // URL to role icon
}

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

