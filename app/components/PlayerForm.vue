<template>
  <ion-modal ref="modal" trigger="modal-players-create">
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button @click="cancel">{{ $t('common.cancel') }}</ion-button>
        </ion-buttons>
        <ion-title>{{ player ? $t('players.editPlayer') : $t('players.addNewPlayer') }}</ion-title>
        <ion-buttons slot="end">
          <ion-button
            :strong="true"
            @click="submitForm"
            type="submit"
            :disabled="isSubmitting"
          >
            {{ isSubmitting ? $t('common.loading') : $t('common.save') }}
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <!-- Form -->
      <form @submit.prevent="submitForm" class="space-y-6">
        <!-- Avatar Section -->
        <div class="space-y-3">
          <!-- Avatar Preview -->
          <div class="flex justify-center mb-4">
            <img
              :src="previewAvatar"
              alt="Preview"
              class="w-32 h-32 rounded-full object-cover border-4 border-blue-300"
            />
          </div>

          <!-- Avatar Upload Input -->
          <div class="relative">
            <input
              type="file"
              ref="fileInput"
              @change="handleFileUpload"
              accept="image/*"
              class="hidden"
            />

            <button
              type="button"
              @click="$refs.fileInput.click()"
              class="w-full bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold py-3 px-4 rounded-lg transition-colors border-2 border-blue-300 border-dashed"
            >
              📷 {{ $t('players.uploadAvatar') }}
            </button>
          </div>

          <!-- Or Generate -->
          <button
            type="button"
            @click="generateDefaultAvatar"
            class="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-colors"
          >
            🎨 {{ $t('players.generateAvatar') }}
          </button>

          <!-- Error Message -->
          <p v-if="avatarError" class="text-red-500 text-sm mt-2">
            ⚠️ {{ avatarError }}
          </p>
        </div>

        <ion-list>
          <!-- Player Name -->
          <ion-item>
            <ion-input
              label-placement="stacked"
              v-model="formData.name"
              type="text"
              :placeholder="$t('players.namePlaceholder')"
              :minlength="2"
              :maxlength="50"
              required
            >
              <div slot="label">{{ $t('players.name') }} <ion-text color="danger">*</ion-text></div>
            </ion-input>
          </ion-item>
        </ion-list>
        <p v-if="nameError" class="text-red-500 text-sm">
          ⚠️ {{ nameError }}
        </p>
      </form>

      <!-- Success Message -->
      <Transition name="fade">
        <div
          v-if="showSuccessMessage"
          class="mt-4 bg-green-100 border-2 border-green-500 text-green-700 px-4 py-3 rounded-lg"
        >
          ✅ {{ successMessage }}
        </div>
      </Transition>
    </ion-content>
  </ion-modal>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Player } from '~/stores/players'

const modal = ref()
const cancel = () => modal.value?.$el.dismiss(null, 'cancel');

const useAvatarGenerator = () => {
  // Color palette for avatars
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1',
    '#FFA07A', '#98D8C8', '#F7DC6F',
    '#BB8FCE', '#85C1E2', '#F8B88B',
    '#A8D5BA', '#D7BDE2', '#F1948A',
  ]

  function generateAvatarFromName(name: string): string {
    const initials = name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)

    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    const color = colors[hash % colors.length]

    const svg = `
      <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="200" fill="${color}" />
        <text x="100" y="110" font-size="80" font-weight="bold" text-anchor="middle" fill="white" font-family="Arial, sans-serif">
          ${initials}
        </text>
      </svg>
    `

    const base64 = btoa(svg.trim())
    return `data:image/svg+xml;base64,${base64}`
  }

  function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  function isValidImageFile(file: File): boolean {
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    const maxSize = 5 * 1024 * 1024

    return validTypes.includes(file.type) && file.size <= maxSize
  }

  return {
    generateAvatarFromName,
    fileToBase64,
    isValidImageFile,
  }
}

const props = defineProps<{
  player?: Player,
}>()

const emit = defineEmits<{
  submit: [playerData: { name: string; avatar: string }]
  cancel: []
}>()

const open = async () => {
  await modal.value.$el.present()
}

const close = async () => {
  await modal.value.$el.dismiss()
}

// Composables
const { generateAvatarFromName, fileToBase64, isValidImageFile } = useAvatarGenerator()

// Refs
const fileInput = ref<HTMLInputElement>()
const isSubmitting = ref(false)
const avatarError = ref('')
const nameError = ref('')
const showSuccessMessage = ref(false)
const successMessage = ref('')

// Form data
const formData = ref({
  name: props.player?.name || '',
  avatar: props.player?.avatar || '',
})

const previewAvatar = computed(() => {
  return formData.value.avatar || generateAvatarFromName('?')
})

const isEditing = computed(() => !!props.player)

// Methods
async function handleFileUpload(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (!file) return

  avatarError.value = ''

  // Validate file
  if (!isValidImageFile(file)) {
    avatarError.value = 'Please upload a valid image file (JPEG, PNG, GIF, or WebP) under 5MB'
    return
  }

  try {
    const base64 = await fileToBase64(file)
    formData.value.avatar = base64
  } catch (error) {
    avatarError.value = 'Failed to process image file'
    console.error('File upload error:', error)
  }

  // Reset file input
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

function generateDefaultAvatar() {
  avatarError.value = ''
  if (formData.value.name.length >= 2) {
    formData.value.avatar = generateAvatarFromName(formData.value.name)
  } else {
    avatarError.value = 'Please enter at least 2 characters for the name'
  }
}

async function submitForm() {
  nameError.value = ''
  avatarError.value = ''

  // Validate name
  if (!formData.value.name || formData.value.name.length < 2) {
    nameError.value = 'Player name must be at least 2 characters'
    return
  }

  // Generate default avatar if none provided
  if (!formData.value.avatar) {
    formData.value.avatar = generateAvatarFromName(formData.value.name)
  }

  isSubmitting.value = true

  try {
    // Small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500))

    emit('submit', {
      name: formData.value.name,
      avatar: formData.value.avatar,
    })

    // Show success message
    successMessage.value = isEditing.value
      ? 'Player updated successfully!'
      : 'Player added successfully!'
    showSuccessMessage.value = true

    // Hide success message after 2 seconds
    setTimeout(() => {
      showSuccessMessage.value = false
      modal.value.$el.dismiss(null, 'confirm');
    }, 1000)

    // Reset form if adding new player
    if (!isEditing.value) {
      formData.value = {
        name: '',
        avatar: '',
      }
    }
  } finally {
    isSubmitting.value = false
  }
}

defineExpose({ open, close })
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
</style>

