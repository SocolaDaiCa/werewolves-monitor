<template>
  <button
    @click="handleToggle"
    class="relative group w-full"
  >
    <!-- Card Background -->
    <div
      :class="[
        'relative rounded-2xl transition-all duration-300 border-3 h-40',
        isSelected
          ? 'border-green-500 bg-green-50 shadow-lg scale-105'
          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
      ]"
    >
      <!-- Checkmark Badge -->
      <div
        v-if="isSelected"
        class="absolute -top-2 -right-2 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center shadow-lg font-bold text-sm"
      >
        ✓
      </div>

      <!-- Content Slot -->
      <slot />
    </div>
  </button>
</template>

<script setup lang="ts">
interface Props {
  isSelected: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  toggle: []
}>()

function handleToggle() {
  emit('toggle')
}
</script>

