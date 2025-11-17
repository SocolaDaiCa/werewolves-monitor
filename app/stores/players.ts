import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

export interface Player {
    id: string
    name: string
    avatar: string // base64 or image URL
    joinedDate: number // timestamp
    gamesPlayed: number
    wins: number
}

export const usePlayersStore = defineStore('players', () => {
    // State
    const players = ref<Player[]>([])
    const selectedPlayerIds = ref<string[]>([])
    watch(players, (newPlayers) => {
        // remove selectedPlayerIds not in newPlayers
        selectedPlayerIds.value = selectedPlayerIds.value.filter(id => newPlayers.some(p => p.id === id));
    })

    // Getters
    const allPlayers = computed(() => players.value)

    const playerCount = computed(() => players.value.length)

    const getPlayerById = computed(() => (id: string) => {
        return players.value.find(p => p.id === id)
    })

    const selectedPlayers = computed(() => {
        return players.value.filter(p => selectedPlayerIds.value.includes(p.id))
    })

    // Actions
    function addPlayer(name: string, avatar: string = '') {
        const newPlayer: Player = {
            id: `player_${Date.now()}_${Math.random()}`,
            name,
            avatar,
            joinedDate: Date.now(),
            gamesPlayed: 0,
            wins: 0,
        }
        players.value.push(newPlayer)
        return newPlayer
    }

    function updatePlayer(id: string, updates: Partial<Player>) {
        const index = players.value.findIndex(p => p.id === id)
        if (index !== -1) {
            players.value[index] = { ...players.value[index], ...updates }
        }
    }

    function deletePlayer(id: string) {
        const index = players.value.findIndex(p => p.id === id)
        if (index !== -1) {
            players.value.splice(index, 1)
        }
    }

    function incrementGamesPlayed(id: string) {
        const player = players.value.find(p => p.id === id)
        if (player) {
            player.gamesPlayed++
        }
    }

    function incrementWins(id: string) {
        const player = players.value.find(p => p.id === id)
        if (player) {
            player.wins++
        }
    }

    function importPlayers(newPlayers: Player[]) {
        players.value = newPlayers
    }

    function exportPlayers() {
        return JSON.stringify(players.value, null, 2)
    }

    function clearAllPlayers() {
        players.value = []
    }

    function setSelectedPlayerIds(ids: string[]) {
        selectedPlayerIds.value = ids
    }

    return {
        players,
        selectedPlayerIds,
        allPlayers,
        playerCount,
        getPlayerById,
        selectedPlayers,
        addPlayer,
        updatePlayer,
        deletePlayer,
        incrementGamesPlayed,
        incrementWins,
        importPlayers,
        exportPlayers,
        clearAllPlayers,
        setSelectedPlayerIds,
    }
}, {
    persist: true,
})
