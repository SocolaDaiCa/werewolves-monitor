import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

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

  // Persist to localStorage
  const storageKey = 'werewolves_players'

  // Load from localStorage on initialization
  if (process.client) {
    const stored = localStorage.getItem(storageKey)
    if (stored) {
      try {
        players.value = JSON.parse(stored)
      } catch (e) {
        console.error('Failed to load players from localStorage:', e)
      }
    }
  }

  // Getters
  const allPlayers = computed(() => players.value)

  const playerCount = computed(() => players.value.length)

  const getPlayerById = computed(() => (id: string) => {
    return players.value.find(p => p.id === id)
  })

  // Actions
  function saveToLocalStorage() {
    if (process.client) {
      localStorage.setItem(storageKey, JSON.stringify(players.value))
    }
  }

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
    saveToLocalStorage()
    return newPlayer
  }

  function updatePlayer(id: string, updates: Partial<Player>) {
    const index = players.value.findIndex(p => p.id === id)
    if (index !== -1) {
      players.value[index] = { ...players.value[index], ...updates }
      saveToLocalStorage()
    }
  }

  function deletePlayer(id: string) {
    const index = players.value.findIndex(p => p.id === id)
    if (index !== -1) {
      players.value.splice(index, 1)
      saveToLocalStorage()
    }
  }

  function incrementGamesPlayed(id: string) {
    const player = players.value.find(p => p.id === id)
    if (player) {
      player.gamesPlayed++
      saveToLocalStorage()
    }
  }

  function incrementWins(id: string) {
    const player = players.value.find(p => p.id === id)
    if (player) {
      player.wins++
      saveToLocalStorage()
    }
  }

  function importPlayers(newPlayers: Player[]) {
    players.value = newPlayers
    saveToLocalStorage()
  }

  function exportPlayers() {
    return JSON.stringify(players.value, null, 2)
  }

  function clearAllPlayers() {
    players.value = []
    saveToLocalStorage()
  }

  return {
    players,
    allPlayers,
    playerCount,
    getPlayerById,
    addPlayer,
    updatePlayer,
    deletePlayer,
    incrementGamesPlayed,
    incrementWins,
    importPlayers,
    exportPlayers,
    clearAllPlayers,
  }
}, {
  persist: true,
})

