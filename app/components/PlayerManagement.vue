<template>
  <div class="min-h-screen bg-gradient-to-b from-slate-50 to-white">
    <!-- Header -->
    <div class="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-8 rounded-b-3xl shadow-lg">
      <h1 class="text-3xl font-bold mb-2">{{ $t('players.title') }}</h1>
      <p class="text-green-100">{{ $t('players.subtitle') }}</p>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-6 py-12">
      <!-- Top Action Bar -->
      <div class="flex flex-col sm:flex-row gap-4 mb-8 items-center justify-between">
        <!-- Search -->
        <div class="w-full sm:w-64 relative">
          <input
            v-model="searchQuery"
            type="text"
            :placeholder="$t('players.searchPlaceholder')"
            class="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-500 transition-colors"
          />
          <span class="absolute right-3 top-2.5 text-gray-400">🔍</span>
        </div>

        <!-- Add Player Button -->
        <button
          @click="showAddForm"
          class="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <span>➕</span>
          <span>{{ $t('players.addPlayer') }}</span>
        </button>
      </div>

      <!-- Tab Navigation -->
      <div class="flex gap-4 mb-8 border-b-2 border-gray-200">
        <button
          @click="activeTab = 'list'"
          :class="[
            'pb-3 px-4 font-semibold transition-colors',
            activeTab === 'list'
              ? 'text-green-600 border-b-2 border-green-600'
              : 'text-gray-600 hover:text-gray-800',
          ]"
        >
          👥 {{ $t('players.playerList') }} ({{ allPlayers.length }})
        </button>

        <button
          @click="activeTab = 'import-export'"
          :class="[
            'pb-3 px-4 font-semibold transition-colors',
            activeTab === 'import-export'
              ? 'text-green-600 border-b-2 border-green-600'
              : 'text-gray-600 hover:text-gray-800',
          ]"
        >
          📦 {{ $t('players.importExport') }}
        </button>
      </div>

      <!-- Content Area -->
      <div>
        <!-- Player List Tab -->
        <Transition name="fade" mode="out-in">
          <div v-if="activeTab === 'list'" key="list">
            <!-- No Players State -->
            <div
              v-if="filteredPlayers.length === 0"
              class="bg-white rounded-3xl border-2 border-dashed border-gray-300 p-12 text-center max-w-2xl mx-auto"
            >
              <p class="text-4xl mb-4">👤</p>
              <p class="text-lg font-semibold text-gray-600 mb-2">{{ $t('players.noPlayers') }}</p>
              <p class="text-sm text-gray-500 mb-6">{{ $t('players.noPlayersDescription') }}</p>
              <button
                @click="showAddForm"
                class="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors inline-flex items-center gap-2"
              >
                <span>➕</span>
                <span>{{ $t('players.createFirstPlayer') }}</span>
              </button>
            </div>

            <!-- Player Grid -->
            <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <PlayerCard
                v-for="player in filteredPlayers"
                :key="player.id"
                :player="player"
                @edit="editPlayer"
                @delete="deletePlayerConfirm"
              />
            </div>
          </div>

          <!-- Import/Export Tab -->
          <div v-else-if="activeTab === 'import-export'" key="import-export">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
              <!-- Export Section -->
              <div class="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
                <h3 class="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  📥 {{ $t('players.export') }}
                </h3>
                <p class="text-gray-600 mb-6 text-sm">
                  {{ $t('players.exportDescription') }}
                </p>
                <button
                  @click="exportPlayers"
                  :disabled="allPlayers.length === 0"
                  class="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                >
                  💾 {{ $t('players.downloadJSON') }}
                </button>
              </div>

              <!-- Import Section -->
              <div class="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
                <h3 class="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  📤 {{ $t('players.import') }}
                </h3>
                <p class="text-gray-600 mb-6 text-sm">
                  {{ $t('players.importDescription') }}
                </p>
                <div class="relative">
                  <input
                    type="file"
                    ref="importFileInput"
                    @change="handleImportFile"
                    accept=".json"
                    class="hidden"
                  />
                  <button
                    type="button"
                    @click="$refs.importFileInput.click()"
                    class="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                  >
                    📂 {{ $t('players.selectFile') }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </div>

    <!-- Modal: Add/Edit Player Form -->
    <Transition name="modal">
      <div v-if="showForm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div class="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div class="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
            <h2 class="text-2xl font-bold text-gray-800">
              {{ editingPlayer ? $t('players.editPlayer') : $t('players.addNewPlayer') }}
            </h2>
            <button
              @click="closeForm"
              class="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ✕
            </button>
          </div>

          <div class="p-6">
            <PlayerForm
              :player="editingPlayer"
              @submit="handleFormSubmit"
              @cancel="closeForm"
            />
          </div>
        </div>
      </div>
    </Transition>

    <!-- Modal: Delete Confirmation -->
    <Transition name="modal">
      <div v-if="showDeleteConfirm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div class="bg-white rounded-2xl p-8 max-w-sm w-full shadow-lg">
          <div class="text-center">
            <p class="text-4xl mb-4">⚠️</p>
            <h3 class="text-xl font-bold text-gray-800 mb-2">{{ $t('common.confirmDelete') }}</h3>
            <p class="text-gray-600 mb-6">
              {{ $t('players.deleteConfirmMessage') }}: <strong>{{ playerToDelete?.name }}</strong>
            </p>

            <div class="flex gap-4">
              <button
                @click="confirmDelete"
                class="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                {{ $t('common.delete') }}
              </button>
              <button
                @click="showDeleteConfirm = false"
                class="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                {{ $t('common.cancel') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Toast Messages -->
    <Transition name="toast">
      <div
        v-if="showToast"
        :class="[
          'fixed bottom-6 right-6 px-6 py-4 rounded-lg text-white font-semibold shadow-lg',
          toastType === 'success' ? 'bg-green-500' : 'bg-red-500',
        ]"
      >
        {{ toastMessage }}
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { usePlayersStore } from '~/stores/players'
import type { Player } from '~/stores/players'

// Store
const playersStore = usePlayersStore()

// Refs
const searchQuery = ref('')
const activeTab = ref<'list' | 'import-export'>('list')
const showForm = ref(false)
const showDeleteConfirm = ref(false)
const editingPlayer = ref<Player | undefined>()
const playerToDelete = ref<Player | undefined>()
const importFileInput = ref<HTMLInputElement>()
const showToast = ref(false)
const toastMessage = ref('')
const toastType = ref<'success' | 'error'>('success')

// Computed
const allPlayers = computed(() => playersStore.allPlayers)

const filteredPlayers = computed(() => {
  if (!searchQuery.value) return allPlayers.value

  const query = searchQuery.value.toLowerCase()
  return allPlayers.value.filter(player =>
    player.name.toLowerCase().includes(query)
  )
})

// Methods
function showAddForm() {
  editingPlayer.value = undefined
  showForm.value = true
}

function editPlayer(player: Player) {
  editingPlayer.value = player
  showForm.value = true
}

function closeForm() {
  showForm.value = false
  editingPlayer.value = undefined
}

function handleFormSubmit(playerData: { name: string; avatar: string }) {
  if (editingPlayer.value) {
    // Update existing player
    playersStore.updatePlayer(editingPlayer.value.id, {
      name: playerData.name,
      avatar: playerData.avatar,
    })
  } else {
    // Add new player
    playersStore.addPlayer(playerData.name, playerData.avatar)
  }

  closeForm()
  showToastMessage('Player saved successfully!', 'success')
}

function deletePlayerConfirm(playerId: string) {
  const player = allPlayers.value.find(p => p.id === playerId)
  if (player) {
    playerToDelete.value = player
    showDeleteConfirm.value = true
  }
}

function confirmDelete() {
  if (playerToDelete.value) {
    playersStore.deletePlayer(playerToDelete.value.id)
    showDeleteConfirm.value = false
    playerToDelete.value = undefined
    showToastMessage('Player deleted successfully!', 'success')
  }
}

function exportPlayers() {
  try {
    const data = playersStore.exportPlayers()
    const element = document.createElement('a')
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(data))
    element.setAttribute('download', `werewolves-players-${new Date().toISOString().split('T')[0]}.json`)
    element.style.display = 'none'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
    showToastMessage('Players exported successfully!', 'success')
  } catch (error) {
    console.error('Export error:', error)
    showToastMessage('Failed to export players', 'error')
  }
}

function handleImportFile(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const content = e.target?.result as string
      const importedPlayers = JSON.parse(content) as Player[]

      // Validate structure
      if (!Array.isArray(importedPlayers)) {
        throw new Error('Invalid file format')
      }

      // Validate each player
      importedPlayers.forEach((p) => {
        if (!p.id || !p.name || typeof p.gamesPlayed !== 'number' || typeof p.wins !== 'number') {
          throw new Error('Invalid player data structure')
        }
      })

      playersStore.importPlayers(importedPlayers)
      showToastMessage(`Imported ${importedPlayers.length} players successfully!`, 'success')
    } catch (error) {
      console.error('Import error:', error)
      showToastMessage('Failed to import players. Please check the file format.', 'error')
    }
  }

  reader.readAsText(file)

  // Reset input
  if (importFileInput.value) {
    importFileInput.value.value = ''
  }
}

function showToastMessage(message: string, type: 'success' | 'error') {
  toastMessage.value = message
  toastType.value = type
  showToast.value = true

  setTimeout(() => {
    showToast.value = false
  }, 3000)
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(100px);
}
</style>

