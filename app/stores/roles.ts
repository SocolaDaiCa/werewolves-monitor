import { defineStore } from 'pinia'
import {type Role, RoleId} from '~/types/role'
import { RoleFaction, NightlyActivity, RoleActionType } from '~/types/role'
import { useI18n } from 'vue-i18n'



// All roles from Ultimate Werewolf with balance points and Vietnamese translations
const defaultRoles: Role[] = [
    
]

export const useRolesStore = defineStore('roles', {
    state: () => ({
        roles: defaultRoles as Role[],
        selectedRoles: {} as { [roleId: string]: number },
    }),

    getters: {
        allRoles: (state) => state.roles,

        rolesByFaction: (state) => {
            return (faction: Role['faction']) => {
                return state.roles.filter(role => role.faction === faction)
            }
        },

        totalBalancePoints: (state) => {
            return Object.entries(state.selectedRoles).reduce((total, [roleId, count]) => {
                const role = state.roles.find(r => r.id === roleId)
                return total + (role?.balancePoints ?? 0) * count
            }, 0)
        },

        balanceStatus() {
            const points = this.totalBalancePoints
            if (points === 0) return 'perfect'
            if (points > 0 && points <= 5) return 'light-green'
            if (points < 0 && points >= -5) return 'light-red'
            return 'red'
        },

        totalRoleCount: (state) => {
            return Object.values(state.selectedRoles).reduce((sum, count) => sum + count, 0)
        },
    },

    actions: {
        addRole(roleId: string, quantity: number = 1) {
            if (!this.selectedRoles[roleId]) {
                this.selectedRoles[roleId] = 0
            }
            this.selectedRoles[roleId] += quantity
        },

        removeRole(roleId: string, quantity: number = 1) {
            if (this.selectedRoles[roleId]) {
                this.selectedRoles[roleId] = Math.max(0, this.selectedRoles[roleId] - quantity)
                if (this.selectedRoles[roleId] === 0) {
                    delete this.selectedRoles[roleId]
                }
            }
        },

        setRoleQuantity(roleId: string, quantity: number) {
            if (quantity <= 0) {
                delete this.selectedRoles[roleId]
            } else {
                this.selectedRoles[roleId] = quantity
            }
        },

        getRoleQuantity(roleId: string): number {
            return this.selectedRoles[roleId] ?? 0
        },

        clearAllRoles() {
            this.selectedRoles = {}
        },

        setSelectedRoles(roles: { [roleId: string]: number }) {
            this.selectedRoles = roles
        },

        getRoleById(roleId: string): Role | undefined {
            return this.roles.find(r => r.id === roleId)
        },

        getRoleName(roleId: string): string {
            return this.getRoleById(roleId)?.name || 'Unknown'
        },

        getFactionLabel(faction: Role['faction']): string {
            const { t } = useI18n()
            const labels: Record<Role['faction'], string> = {
                [RoleFaction.VILLAGER]: '🏘️ ' + t('roles.villagers'),
                [RoleFaction.WEREWOLF]: '🐺 ' + t('roles.werewolves'),
                [RoleFaction.CULT]: '🔮 ' + t('roles.cult'),
                [RoleFaction.VAMPIRE]: '🧛 ' + t('roles.vampire'),
                [RoleFaction.SPECIAL]: '✨ ' + t('roles.special'),
            }
            return labels[faction] || faction
        },

        getRoleDescription(roleId: string): string {
            return this.getRoleById(roleId)?.description || ''
        },

        getRolePoints(roleId: string): number {
            return this.getRoleById(roleId)?.balancePoints ?? 0
        },

        addCustomRole(role: Role) {
            const index = this.roles.findIndex(r => r.id === role.id)
            if (index === -1) {
                this.roles.push(role)
            } else {
                this.roles[index] = role
            }
        },
    },

    persist: {
        pick: [
            'selectedRoles',
        ]
    },
})
