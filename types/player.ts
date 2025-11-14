export interface Player {
  id: string
  name: string
  avatar: string // base64 or image URL
  joinedDate: number // timestamp
  gamesPlayed: number
  wins: number
}

export interface PlayerStats {
  playerId: string
  gamesPlayed: number
  wins: number
  winRate: number
}

