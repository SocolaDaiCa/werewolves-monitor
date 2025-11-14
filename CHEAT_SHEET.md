# 🚀 Nuxt 4 + TypeScript Cheat Sheet

> Quick reference for common patterns

---

## 📦 Installation

```bash
npm install pinia @pinia/nuxt @nuxtjs/i18n
```

---

## 🏪 Pinia Store

### Create Store
```typescript
// stores/game.ts
export const useGameStore = defineStore('game', () => {
  const state = ref({ /* ... */ })
  const getter = computed(() => /* ... */)
  const action = () => { /* ... */ }
  
  return { state, getter, action }
})
```

### Use Store
```typescript
const store = useGameStore() // Auto-imported
store.action()
console.log(store.state)
```

---

## 📝 TypeScript Interfaces

### Create Type
```typescript
// types/player.ts
export interface Player {
  id: string
  name: string
  status: 'alive' | 'dead'
}
```

### Import Type
```typescript
import type { Player } from '~/types/player'
```

---

## 🧩 Component Patterns

### Basic Component
```vue
<script setup lang="ts">
interface Props {
  title: string
  count?: number
}

withDefaults(defineProps<Props>(), {
  count: 0,
})

const emit = defineEmits<{
  increment: [value: number]
}>()
</script>

<template>
  <div>
    <h1>{{ title }}</h1>
    <button @click="emit('increment', count + 1)">+</button>
  </div>
</template>
```

### With Store
```typescript
const store = useGameStore()
const phase = computed(() => store.currentPhase)
</script>
```

### With i18n
```typescript
const { t } = useI18n()
const message = t('common.title')
</script>
```

---

## 🎣 Composables

### Create Composable
```typescript
// composables/useMyLogic.ts
export const useMyLogic = () => {
  const state = ref()
  const method = () => { /* ... */ }
  
  return { state, method }
}
```

### Use Composable
```typescript
const { state, method } = useMyLogic() // Auto-imported
```

---

## 🔗 Routing

### Navigate
```typescript
navigateTo('/page')
```

### Get Route
```typescript
const route = useRoute()
console.log(route.params)
```

### Get Router
```typescript
const router = useRouter()
```

---

## 🌐 i18n

### Translate in Template
```vue
<h1>{{ $t('common.title') }}</h1>
```

### Translate in Script
```typescript
const { t, locale } = useI18n()
const title = t('common.title')
locale.value = 'vi'
```

### Translate with Parameters
```json
{
  "greeting": "Hello {name}"
}
```

```typescript
t('greeting', { name: 'John' })
```

---

## 💾 State Management Patterns

### Save to localStorage
```typescript
const saveState = () => {
  if (process.client) {
    localStorage.setItem('key', JSON.stringify(data))
  }
}

const loadState = () => {
  if (process.client) {
    const stored = localStorage.getItem('key')
    if (stored) data.value = JSON.parse(stored)
  }
}
```

---

## 🎨 Common Computed Properties

### Derived Data
```typescript
const total = computed(() => 
  items.value.reduce((sum, item) => sum + item.value, 0)
)
```

### Conditional Class
```typescript
const className = computed(() => ({
  'active': isActive.value,
  'error': hasError.value,
}))
```

### Filtered List
```typescript
const filtered = computed(() => 
  items.value.filter(item => item.status === 'active')
)
```

---

## 🎯 TypeScript Patterns

### Props with Types
```typescript
interface Props {
  title: string
  count?: number
  items: Item[]
}

withDefaults(defineProps<Props>(), {
  count: 0,
})
```

### Emit with Types
```typescript
interface Emits {
  (e: 'select', id: string): void
  (e: 'update', value: number): void
}

defineEmits<Emits>()
```

### Computed with Type
```typescript
const filtered: Ref<Player[]> = computed(() => 
  players.value.filter(p => p.status === 'alive')
)
```

### Function Types
```typescript
type ActionFn = (player: Player) => Promise<void>

const executeAction: ActionFn = async (player) => {
  // ...
}
```

---

## 🔴 Common Mistakes

❌ **Don't:**
```typescript
// Missing lang="ts"
<script setup>

// Using $store (Vuex)
this.$store.commit()

// No prop types
defineProps(['title'])

// Using mixins
import mixin from '@/mixins'

// Loose types
const data = ref<any>()
```

✅ **Do:**
```typescript
// Include lang="ts"
<script setup lang="ts">

// Use store (Pinia)
const store = useGameStore()

// Type props
interface Props { title: string }
defineProps<Props>()

// Use composables
const { state } = useComposable()

// Strong types
const data = ref<Player | null>(null)
```

---

## 📂 File Locations

| Type | Location | Extension |
|------|----------|-----------|
| Component | `components/` | `.vue` |
| Page | `pages/` | `.vue` |
| Layout | `layouts/` | `.vue` |
| Store | `stores/` | `.ts` |
| Composable | `composables/` | `.ts` |
| Type | `types/` | `.ts` |
| Locale | `locales/` | `.json` |
| Style | `assets/css/` | `.scss` |
| Image | `public/` | varies |

---

## 🛠️ Configuration

### nuxt.config.ts
```typescript
export default defineNuxtConfig({
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@nuxtjs/i18n',
  ],
  i18n: {
    locales: ['en', 'vi'],
    defaultLocale: 'en',
    langDir: 'locales/',
  },
})
```

### tsconfig.json
```json
{
  "extends": "./node_modules/nuxt/tsconfig.json",
  "compilerOptions": {
    "strict": true
  }
}
```

---

## 🧪 Dev Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Generate static site
npm run generate

# Type check only
npx tsc --noEmit

# Lint (if ESLint configured)
npm run lint
```

---

## 🔍 Debugging

### Check Store State
```typescript
const store = useGameStore()
console.log(store.$state)
console.log(store.state)
```

### Print Route
```typescript
const route = useRoute()
console.log(route.params, route.query)
```

### Check i18n
```typescript
const { locale, t } = useI18n()
console.log(locale.value, t('key'))
```

---

## 📱 Responsive Classes (Tailwind)

```vue
<div class="text-sm md:text-base lg:text-lg">
  <!-- Responsive text -->
</div>

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  <!-- Responsive grid -->
</div>
```

---

## 🎬 Lifecycle

```typescript
onMounted(() => {
  // Component mounted
})

onUpdated(() => {
  // Component updated
})

onUnmounted(() => {
  // Component unmounted
})

watch(() => state.value, (newVal) => {
  // State changed
})

watchEffect(() => {
  // Auto-track dependencies
})
```

---

## 🚀 Performance Tips

✅ Use `v-show` for frequent toggles
✅ Use `v-if` for large components
✅ Use `computed` for expensive calculations
✅ Lazy load components with `defineAsyncComponent`
✅ Use `shallowRef` for large nested objects
✅ Avoid inline arrow functions in templates

---

## 🔐 API Calls

```typescript
// Using $fetch (built-in Nuxt)
const data = await $fetch('/api/endpoint')

// With headers
const data = await $fetch('/api/endpoint', {
  method: 'POST',
  body: { /* ... */ },
  headers: { 'Authorization': 'Bearer token' },
})
```

---

## 📤 Form Handling

```vue
<script setup lang="ts">
interface FormData {
  name: string
  email: string
}

const form = ref<FormData>({ name: '', email: '' })

const submit = async () => {
  // Handle submit
}
</script>

<template>
  <form @submit.prevent="submit">
    <input v-model="form.name" type="text" />
    <input v-model="form.email" type="email" />
    <button type="submit">Submit</button>
  </form>
</template>
```

---

## 🎁 Quick Reference Table

| Need | Use |
|------|-----|
| Global state | Pinia store |
| Reusable logic | Composable |
| Page component | `/pages/*.vue` |
| Shared component | `/components/*.vue` |
| Route info | `useRoute()` |
| Navigate | `navigateTo()` |
| Translate | `$t()` or `useI18n()` |
| Fetch data | `$fetch()` |
| TypeScript | `types/*.ts` |
| Styling | Tailwind classes |

---

## 🎓 Learning Checklist

- [ ] Understand Pinia basics
- [ ] Know TypeScript interfaces
- [ ] Master `<script setup lang="ts">`
- [ ] Understand computed/ref
- [ ] Know composable pattern
- [ ] Understand watch/watchEffect
- [ ] Know router/routes
- [ ] Understand i18n setup
- [ ] Know Tailwind basics
- [ ] Understand lifecycle hooks

---

**Save this file for quick reference!** 📌

