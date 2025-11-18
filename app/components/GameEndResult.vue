<template>
  <div class="space-y-6">
    <!-- Victory/Defeat Screen -->
    <div
      :class="[
        'rounded-xl p-8 md:p-12 text-center shadow-lg',
        winnerClass,
      ]"
    >
      <!-- Winner Badge -->
      <div class="mb-6">
        <div
          :class="[
            'inline-block text-6xl md:text-7xl font-bold mb-4 animate-bounce',
          ]"
        >
          {{ winnerEmoji }}
        </div>
      </div>

      <!-- Winner Message -->
      <h1 class="text-4xl md:text-6xl font-bold mb-4 text-white">
        {{ winnerMessage }}
      </h1>
      <p class="text-lg md:text-xl text-white/90 mb-2">
        {{ winReasonMessage }}
      </p>

      <!-- Game Stats -->
      <div
        class="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-white bg-white/10 rounded-lg p-6"
      >
        <div>
          <p class="text-sm opacity-75 mb-1">{{ $t('gameEnd.roundsPlayed') }}</p>
          <p class="text-3xl font-bold">{{ gameStore.round }}</p>
        </div>
        <div>
          <p class="text-sm opacity-75 mb-1">{{ $t('gameEnd.totalPlayers') }}</p>
          <p class="text-3xl font-bold">{{ gameStore.players.length }}</p>
        </div>
        <div>
          <p class="text-sm opacity-75 mb-1">{{ $t('gameEnd.survivors') }}</p>
          <p class="text-3xl font-bold">{{ gameStore.survivors }}</p>
        </div>
        <div>
          <p class="text-sm opacity-75 mb-1">{{ $t('gameEnd.eliminated') }}</p>
          <p class="text-3xl font-bold">{{ gameStore.eliminated }}</p>
        </div>
      </div>
    </div>

    <!-- Summary Section -->
    <div class="bg-white rounded-xl p-6 shadow-md">
      <h2 class="text-2xl font-bold text-gray-800 mb-6">{{ $t('gameEnd.summary') }}</h2>

      <!-- Summary Table -->
      <div class="overflow-x-auto">
        <table class="w-full text-sm md:text-base">
          <thead>
            <tr class="border-b-2 border-gray-300">
              <th class="text-left py-3 px-3 font-bold text-gray-700">
                {{ $t('gameEnd.player') }}
              </th>
              <th class="text-left py-3 px-3 font-bold text-gray-700">
                {{ $t('gameEnd.role') }}
              </th>
              <th class="text-center py-3 px-3 font-bold text-gray-700">
                {{ $t('gameEnd.status') }}
              </th>
              <th class="text-left py-3 px-3 font-bold text-gray-700 hidden sm:table-cell">
                {{ $t('gameEnd.eliminatedBy') }}
              </th>
              <th class="text-center py-3 px-3 font-bold text-gray-700 hidden md:table-cell">
                {{ $t('gameEnd.round') }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="player in playerResults"
              :key="player.playerId"
              :class="[
                'border-b border-gray-200 hover:bg-gray-50 transition-colors',
                player.isWinner ? 'bg-green-50' : '',
                !player.alive ? 'opacity-75' : '',
              ]"
            >
              <td class="py-3 px-3">
                <div class="flex items-center gap-2">
                  <img
                    v-if="playersStore.getPlayerAvatar(player.playerId)"
                    :src="playersStore.getPlayerAvatar(player.playerId)"
                    :alt="player.playerName"
                    class="w-8 h-8 rounded-full"
                  />
                  <span class="font-medium text-gray-800">{{ player.playerName }}</span>
                  <span v-if="player.isWinner" class="text-lg">👑</span>
                </div>
              </td>
              <td class="py-3 px-3">
                <span
                  :class="[
                    'px-3 py-1 rounded-full text-xs font-semibold text-white',
                    factionColorClass(player.faction),
                  ]"
                >
                  {{ rolesStore.getRoleName(player.roleId) }}
                </span>
              </td>
              <td class="py-3 px-3 text-center">
                <span
                  v-if="player.alive"
                  class="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800"
                >
                  ✓ {{ $t('gameEnd.alive') }}
                </span>
                <span
                  v-else
                  class="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800"
                >
                  ✗ {{ $t('gameEnd.dead') }}
                </span>
              </td>
              <td class="py-3 px-3 hidden sm:table-cell text-sm text-gray-600">
                {{ player.eliminatedBy || '-' }}
              </td>
              <td class="py-3 px-3 text-center hidden md:table-cell text-sm text-gray-600">
                {{ player.eliminatedRound || '-' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- No Data State -->
      <div v-if="playerResults.length === 0" class="text-center py-8 text-gray-500">
        <p>{{ $t('gameEnd.noData') }}</p>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex flex-col gap-3 sm:flex-row">
      <button
        @click="handlePlayAgain"
        class="flex-1 py-3 px-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all active:scale-95"
      >
        🔄 {{ $t('gameEnd.playAgain') }}
      </button>
      <button
        @click="handleNewGame"
        class="flex-1 py-3 px-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-bold rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all active:scale-95"
      >
        ➕ {{ $t('gameEnd.newGame') }}
      </button>
      <button
        @click="handleMainMenu"
        class="flex-1 py-3 px-4 bg-gray-500 text-white font-bold rounded-lg hover:bg-gray-600 transition-all active:scale-95"
      >
        🏠 {{ $t('gameEnd.mainMenu') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useGameStore } from '~/stores/game'
import { usePlayersStore } from '~/stores/players'
import { useRolesStore } from '~/stores/roles'
import { useRouter } from 'vue-router'
import type { Faction } from '~/types/game'
import { RoleFaction } from '~/types/role'

interface PlayerResult {
  playerId: string
  playerName: string
  roleId: string
  faction: Faction
  alive: boolean
  eliminatedBy?: string
  eliminatedRound?: number
  isWinner: boolean
}

const emit = defineEmits<{
  (e: 'play-again'): void
  (e: 'new-game'): void
  (e: 'main-menu'): void
}>()

const router = useRouter()
const gameStore = useGameStore()
const playersStore = usePlayersStore()
const rolesStore = useRolesStore()

const winConditions = computed(() => gameStore.checkWinConditions())

const playerResults = computed((): PlayerResult[] => {
  return gameStore.players.map(playerId => {
    const player = playersStore.getPlayerById(playerId)
    const roleId = gameStore.playerRoles[playerId] || 'unknown'
    const role = rolesStore.getRoleById(roleId)
    const isAlive = !gameStore.eliminatedPlayers.includes(playerId)
    const isWinner =
      winConditions.value &&
      ((winConditions.value.winner === 'VILLAGERS' &&
        role?.faction === RoleFaction.VILLAGER) ||
        (winConditions.value.winner === 'WEREWOLVES' && role?.faction === RoleFaction.WEREWOLF))

    return {
      playerId,
      playerName: player?.name || 'Unknown',
      roleId,
      faction: role?.faction || RoleFaction.VILLAGER,
      alive: isAlive,
      eliminatedBy: isAlive ? undefined : gameStore.getEliminationMethod(playerId),
      eliminatedRound: isAlive ? undefined : gameStore.getEliminationRound(playerId),
      isWinner: isWinner || false,
    }
  })
})

const winnerMessage = computed(() => {
  if (!winConditions.value) return $t('gameEnd.unknown')
  const winner = winConditions.value.winner
  if (winner === 'VILLAGERS') return $t('gameEnd.villagersWin')
  if (winner === 'WEREWOLVES') return $t('gameEnd.werewolvesWin')
  if (winner === 'CULT') return $t('gameEnd.cultWin')
  return $t('gameEnd.gameEnd')
})

const winReasonMessage = computed(() => {
  if (!winConditions.value) return ''
  return winConditions.value.reason || ''
})

const winnerEmoji = computed(() => {
  if (!winConditions.value) return '🎮'
  const winner = winConditions.value.winner
  if (winner === 'VILLAGERS') return '🏘️'
  if (winner === 'WEREWOLVES') return '🐺'
  if (winner === 'CULT') return '🔮'
  return '🎮'
})

const winnerClass = computed(() => {
  if (!winConditions.value) return 'bg-gray-600'
  const winner = winConditions.value.winner
  if (winner === 'VILLAGERS')
    return 'bg-gradient-to-r from-green-500 to-emerald-600'
  if (winner === 'WEREWOLVES')
    return 'bg-gradient-to-r from-red-500 to-orange-600'
  if (winner === 'CULT') return 'bg-gradient-to-r from-purple-600 to-indigo-700'
  return 'bg-gray-600'
})

function factionColorClass(faction: Faction): string {
  switch (faction) {
    case RoleFaction.VILLAGER:
      return 'bg-green-500'
    case RoleFaction.WEREWOLF:
      return 'bg-red-500'
    case RoleFaction.CULT:
      return 'bg-purple-600'
    case RoleFaction.VAMPIRE:
      return 'bg-gray-700'
    default:
      return 'bg-gray-500'
  }
}

function handlePlayAgain() {
  emit('play-again')
  router.push('/game-setup')
}

function handleNewGame() {
  emit('new-game')
  gameStore.resetGame()
  router.push('/game-setup')
}

function handleMainMenu() {
  emit('main-menu')
  gameStore.resetGame()
  router.push('/')
}
</script>

