<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-back-button default-href="/"></ion-back-button>
                </ion-buttons>
                <ion-title>{{ $t('players.title') }}</ion-title>
                <ion-buttons slot="end">
                    <ion-button @click="showAddForm">
                        <ion-icon slot="icon-only" :icon="ioniconsAdd"></ion-icon>
                    </ion-button>
                </ion-buttons>
            </ion-toolbar>
        </ion-header>
        <ion-content>
            <div class="min-h-screen bg-gradient-to-b from-slate-50 to-white">
                <ion-text>
                    <h5>
                        {{ $t('players.subtitle') }}
                    </h5>
                </ion-text>
                <ion-searchbar
                    v-model="searchQuery"
                />

                <ion-card>
                    <ion-card-content>
                        <ion-segment value="list" style="margin-left: 16px; width: calc(100% - 32px)">
                            <ion-segment-button value="list" content-id="list">
                                👥 {{ $t('players.playerList') }} ({{ allPlayers.length }})
                            </ion-segment-button>
                            <ion-segment-button value="import-export" content-id="import-export">
                                📦 {{ $t('players.importExport') }}
                            </ion-segment-button>
                        </ion-segment>
                        <ion-segment-view class="pt-6">
                            <ion-segment-content id="list">
                                <ion-list style="margin-left: -16px;">
                                    <ion-item
                                        v-for="player in filteredPlayers"
                                        style="margin-right: -16px;"
                                    >
                                        <ion-avatar slot="start">
                                            <img
                                                :src="player.avatar"
                                                :alt="player.name"
                                            />
                                        </ion-avatar>
                                        <ion-label class="truncate">{{ player.name }}</ion-label>
                                        <ion-buttons slot="end">
                                            <ion-button shape="round" @click="editPlayer(player)">
                                                <ion-icon slot="icon-only" :icon="ioniconsPencil" color="dark"></ion-icon>
                                            </ion-button>
                                            <ion-button shape="round" @click="deletePlayerConfirm(player.id)">
                                                <ion-icon slot="icon-only" :icon="ioniconsTrash" color="danger"></ion-icon>
                                            </ion-button>
                                        </ion-buttons>
                                    </ion-item>
                                </ion-list>
                                <div>
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
                            </ion-segment-content>
                            <ion-segment-content id="import-export">
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                            </ion-segment-content>
                        </ion-segment-view>
                    </ion-card-content>
                </ion-card>
                <!-- Main Content -->
                <!-- Modal: Add/Edit Player Form -->
                <PlayerForm
                    ref="playerForm"
                    :player="editingPlayer"
                    @submit="handleFormSubmit"
                    @cancel="closeForm"
                />

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
        </ion-content>
    </ion-page>

</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { usePlayersStore } from '~/stores/players'
import type { Player } from '~/types/player'

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
const playerForm = ref()

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
    playerForm.value.open();
    editingPlayer.value = undefined
    showForm.value = true
}

function editPlayer(player: Player) {
    editingPlayer.value = player
    showForm.value = true
    playerForm.value.open();
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
