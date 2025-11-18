import { defineStore } from 'pinia'
import type { Player } from '~/types/player'

export const usePlayersStore = defineStore('players', {
    state: () => ({
        players: [] as Player[],
        selectedPlayerIds: [] as string[],
    }),

    getters: {
        allPlayers: (state) => state.players,

        playerCount: (state) => state.players.length,

        getPlayerById: (state) => {
            return (id: string) => {
                return state.players.find(p => p.id === id)
            }
        },

        selectedPlayers: (state) => {
            return state.players.filter(p => state.selectedPlayerIds.includes(p.id))
        },

        playerSelectedCount: (state) => {
            return state.selectedPlayerIds.length
        },
    },

    actions: {
        addPlayer(name: string, avatar: string = '') {
            const newPlayer: Player = {
                id: `player_${Date.now()}_${Math.random()}`,
                name,
                avatar,
                joinedDate: Date.now(),
                gamesPlayed: 0,
                wins: 0,
            }
            this.players.push(newPlayer)
            return newPlayer
        },

        updatePlayer(id: string, updates: Partial<Player>) {
            const index = this.players.findIndex(p => p.id === id)
            if (index !== -1) {
                this.players[index] = { ...this.players[index], ...updates }
            }
        },

        deletePlayer(id: string) {
            const index = this.players.findIndex(p => p.id === id)
            if (index !== -1) {
                this.players.splice(index, 1)
                // remove selectedPlayerIds not in players
                this.selectedPlayerIds = this.selectedPlayerIds.filter(selectedId => 
                    this.players.some(p => p.id === selectedId)
                )
            }
        },

        incrementGamesPlayed(id: string) {
            const player = this.players.find(p => p.id === id)
            if (player) {
                player.gamesPlayed++
            }
        },

        incrementWins(id: string) {
            const player = this.players.find(p => p.id === id)
            if (player) {
                player.wins++
            }
        },

        importPlayers(newPlayers: Player[]) {
            this.players = newPlayers
            // remove selectedPlayerIds not in newPlayers
            this.selectedPlayerIds = this.selectedPlayerIds.filter(id => 
                newPlayers.some(p => p.id === id)
            )
        },

        exportPlayers() {
            return JSON.stringify(this.players, null, 2)
        },

        clearAllPlayers() {
            this.players = []
            this.selectedPlayerIds = []
        },

        setSelectedPlayerIds(ids: string[]) {
            this.selectedPlayerIds = ids
        },

        getPlayerAvatar(playerId: string): string | undefined {
            const player = this.players.find(p => p.id === playerId)
            return player?.avatar
        },

        togglePlayer(playerId: string) {
            const ids = [...this.selectedPlayerIds]
            const index = ids.indexOf(playerId)
            if (index > -1) {
                ids.splice(index, 1)
            } else {
                ids.push(playerId)
            }
            this.setSelectedPlayerIds(ids)
        },

        selectAllPlayers() {
            const allIds = this.players.map(p => p.id)
            const ids = [...new Set([...this.selectedPlayerIds, ...allIds])]
            this.setSelectedPlayerIds(ids)
        },

        clearSelectedPlayers() {
            this.setSelectedPlayerIds([])
        },

        getInitials(name: string): string {
            return name
                .split(' ')
                .map(word => word[0])
                .join('')
                .toUpperCase()
                .slice(0, 2)
        },
    },

    persist: true,
})
