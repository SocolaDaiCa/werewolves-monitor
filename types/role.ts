export type RoleFaction = 'VILLAGER' | 'WEREWOLF' | 'CULT' | 'VAMPIRE' | 'SPECIAL'
export type NightlyActivity = 'ALWAYS' | 'FIRST_NIGHT' | 'NEVER'

export interface Role {
  id: string
  name: string
  nameVi: string
  description: string
  descriptionVi: string
  faction: RoleFaction
  balancePoints: number
  nightly: NightlyActivity
  icon?: string // URL to role icon
}

export interface RoleConfiguration {
  roleId: string
  quantity: number
}

export interface RoleBalance {
  totalPoints: number
  status: 'perfect' | 'light-green' | 'light-red' | 'red'
  isBalanced: boolean
}

