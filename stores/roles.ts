import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Role {
  id: string
  name: string
  nameVi: string
  description: string
  descriptionVi: string
  faction: 'VILLAGER' | 'WEREWOLF' | 'CULT' | 'VAMPIRE' | 'SPECIAL'
  balancePoints: number
  nightly: 'ALWAYS' | 'FIRST_NIGHT' | 'NEVER'
}

// Sample roles data - this will be expanded from docs.ts
const defaultRoles: Role[] = [
  {
    id: 'villager',
    name: 'Villager',
    nameVi: 'Dân Làng',
    description: 'An ordinary villager trying to find and eliminate the werewolves.',
    descriptionVi: 'Một dân thường bình thường cố gắng tìm và tiêu diệt các con sói.',
    faction: 'VILLAGER',
    balancePoints: 1,
    nightly: 'NEVER',
  },
  {
    id: 'seer',
    name: 'Seer',
    nameVi: 'Tiên Tri',
    description: 'Each night, choose a player to learn if they are a werewolf or not.',
    descriptionVi: 'Mỗi đêm, chọn một người chơi để biết họ có phải sói hay không.',
    faction: 'VILLAGER',
    balancePoints: 7,
    nightly: 'ALWAYS',
  },
  {
    id: 'witch',
    name: 'Witch',
    nameVi: 'Phù Thủy',
    description: 'Once per game, heal someone. Once per game, poison someone.',
    descriptionVi: 'Một lần mỗi game, cứu chữa ai đó. Một lần mỗi game, làm ai đó bị độc.',
    faction: 'VILLAGER',
    balancePoints: 4,
    nightly: 'ALWAYS',
  },
  {
    id: 'hunter',
    name: 'Hunter',
    nameVi: 'Thợ Săn',
    description: 'When you die, shoot someone to eliminate them.',
    descriptionVi: 'Khi bạn chết, bắn ai đó để tiêu diệt họ.',
    faction: 'VILLAGER',
    balancePoints: 3,
    nightly: 'NEVER',
  },
  {
    id: 'werewolf',
    name: 'Werewolf',
    nameVi: 'Sói',
    description: 'Each night, choose a player to eliminate.',
    descriptionVi: 'Mỗi đêm, chọn một người chơi để tiêu diệt.',
    faction: 'WEREWOLF',
    balancePoints: -6,
    nightly: 'ALWAYS',
  },
  {
    id: 'sorceress',
    name: 'Sorceress',
    nameVi: 'Pháp Sư Sói',
    description: 'Each night, discover who the Seer is.',
    descriptionVi: 'Mỗi đêm, khám phá ai là Tiên Tri.',
    faction: 'WEREWOLF',
    balancePoints: -6,
    nightly: 'ALWAYS',
  },
]

export const useRolesStore = defineStore('roles', () => {
  // State
  const roles = ref<Role[]>(defaultRoles)
  const selectedRoles = ref<{ [roleId: string]: number }>({})

  // Getters
  const allRoles = computed(() => roles.value)

  const rolesByFaction = computed(() => (faction: Role['faction']) => {
    return roles.value.filter(role => role.faction === faction)
  })

  const totalBalancePoints = computed(() => {
    return Object.entries(selectedRoles.value).reduce((total, [roleId, count]) => {
      const role = roles.value.find(r => r.id === roleId)
      return total + (role?.balancePoints ?? 0) * count
    }, 0)
  })

  const balanceStatus = computed(() => {
    const points = totalBalancePoints.value
    if (points === 0) return 'perfect'
    if (points > 0 && points <= 5) return 'light-green'
    if (points < 0 && points >= -5) return 'light-red'
    return 'red'
  })

  const totalRoleCount = computed(() => {
    return Object.values(selectedRoles.value).reduce((sum, count) => sum + count, 0)
  })

  // Actions
  function addRole(roleId: string, quantity: number = 1) {
    if (!selectedRoles.value[roleId]) {
      selectedRoles.value[roleId] = 0
    }
    selectedRoles.value[roleId] += quantity
  }

  function removeRole(roleId: string, quantity: number = 1) {
    if (selectedRoles.value[roleId]) {
      selectedRoles.value[roleId] = Math.max(0, selectedRoles.value[roleId] - quantity)
      if (selectedRoles.value[roleId] === 0) {
        delete selectedRoles.value[roleId]
      }
    }
  }

  function setRoleQuantity(roleId: string, quantity: number) {
    if (quantity <= 0) {
      delete selectedRoles.value[roleId]
    } else {
      selectedRoles.value[roleId] = quantity
    }
  }

  function getRoleQuantity(roleId: string): number {
    return selectedRoles.value[roleId] ?? 0
  }

  function clearAllRoles() {
    selectedRoles.value = {}
  }

  function setSelectedRoles(roles: { [roleId: string]: number }) {
    selectedRoles.value = roles
  }

  function getRoleById(roleId: string): Role | undefined {
    return roles.value.find(r => r.id === roleId)
  }

  function addCustomRole(role: Role) {
    const index = roles.value.findIndex(r => r.id === role.id)
    if (index === -1) {
      roles.value.push(role)
    } else {
      roles.value[index] = role
    }
  }

  return {
    roles,
    selectedRoles,
    allRoles,
    rolesByFaction,
    totalBalancePoints,
    balanceStatus,
    totalRoleCount,
    addRole,
    removeRole,
    setRoleQuantity,
    getRoleQuantity,
    clearAllRoles,
    setSelectedRoles,
    getRoleById,
    addCustomRole,
  }
})

