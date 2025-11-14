# 🔄 Migration Notes: CHECKLIST Updates for Nuxt 4.2.1 + TypeScript

## 📋 Summary of Changes Made to CHECKLIST.md

### **PHASE 1: Setup & Structure**

#### ❌ REMOVED (Outdated for Nuxt 4)
- Vuex store references (`/store/game.js`, `/store/players.js`, etc.)
- `nuxt.config.js` (now TypeScript)
- Generic UI libraries without context

#### ✅ ADDED (Nuxt 4 + TypeScript)
- **Pinia** as state management (modern, recommended for Nuxt 4)
- **@nuxtjs/i18n** for Nuxt 4 (separate package from vue-i18n)
- **@pinia/nuxt** module configuration
- **TypeScript store structure**: `/stores/game.ts`, `/stores/players.ts`, etc.
- **Composables** folder for reusable logic (replaces mixins)
- **Types folder** for TypeScript interfaces
- **Strict TypeScript configuration** in tsconfig.json
- **Updated config file**: `nuxt.config.ts` with module setup

---

### **PHASE 2: Role Management Screen**

#### ❌ CHANGED
- Components path: `components/` (but now use TypeScript)
- Image path: `/static/images/` → `/public/images/`
- Reference to `docs.js` → `docs.ts`

#### ✅ ADDED
- TypeScript interfaces for Role types
- `<script setup lang="ts">` directive
- Type-safe component props
- Type definitions in `types/role.ts`

---

### **PHASE 3: Player Management Screen**

#### ❌ CHANGED
- Vuex store → Pinia store
- Player data structure now includes TypeScript interface

#### ✅ ADDED
- **TypeScript interface** for Player type
- Proper typing: `timestamp` → `number` (more explicit)
- `types/player.ts` file with interface definition
- Pinia persistence plugin option (instead of manual localStorage sync)

---

### **PHASE 4: Game Setup Screen**

#### ❌ CHANGED
- Vuex store references → Pinia store
- Router navigation → Nuxt 4 `navigateTo()` function

#### ✅ ADDED
- Computed properties using `computed()` (Vue 3 Composition API)
- Composable for validation logic
- TypeScript types for game setup state

---

### **PHASE 5: Game Flow - Night Phase**

#### ❌ CHANGED
- Vuex store → Pinia store
- File references: `docs.js` → `docs.ts`

#### ✅ ADDED
- State management in Pinia
- Type definitions for game actions

---

### **PHASE 7: Text-to-Speech Integration**

#### ❌ REMOVED
- `/mixins/textToSpeech.js` (Vue 2/3 legacy)

#### ✅ ADDED
- **Composable pattern**: `/composables/useTextToSpeech.ts`
- TypeScript types for voice selection
- Better integration with Vue 3 Composition API

---

### **PHASE 10: Testing & Polish**

#### ✅ ENHANCED TypeScript Section
- Strict mode enforcement
- No `any` types (except where necessary)
- Props type definitions (interface or type)
- Computed properties must be typed
- All components use `<script setup lang="ts">` pattern

#### ✅ UPDATED Deployment
- `npm run build` instead of generic "build"
- `npm run generate` for SSG
- `npm run preview` for local testing
- TypeScript build verification
- Updated meta tags in `nuxt.config.ts`

---

## 🎯 Key Pattern Changes

### 1. **State Management: Vuex → Pinia**

**Before (Vuex):**
```javascript
// store/game.js
export const state = () => ({
  phase: 'setup',
  round: 0
})

export const mutations = {
  SET_PHASE(state, phase) {
    state.phase = phase
  }
}
```

**After (Pinia):**
```typescript
// stores/game.ts
import { defineStore } from 'pinia'

export const useGameStore = defineStore('game', () => {
  const phase = ref('setup')
  const round = ref(0)

  const setPhase = (newPhase: string) => {
    phase.value = newPhase
  }

  return { phase, round, setPhase }
})
```

**Usage in components:**
```typescript
const gameStore = useGameStore() // Auto-imported
gameStore.setPhase('night')
```

---

### 2. **File Organization**

**Before:**
```
/store/
  - game.js
  - players.js
/mixins/
  - textToSpeech.js
```

**After:**
```
/stores/
  - game.ts
  - players.ts
/composables/
  - useTextToSpeech.ts
  - useGame.ts
/types/
  - game.ts
  - player.ts
  - role.ts
```

---

### 3. **Component Script Pattern**

**Before (Options API):**
```vue
<script>
export default {
  props: ['player'],
  data() {
    return { editing: false }
  },
  methods: {
    edit() { this.editing = true }
  }
}
</script>
```

**After (Composition API + TypeScript):**
```vue
<script setup lang="ts">
import type { Player } from '~/types/player'

interface Props {
  player: Player
}

const props = withDefaults(defineProps<Props>(), {})
const editing = ref(false)

const edit = () => {
  editing.value = true
}
</script>
```

---

### 4. **Router Navigation**

**Before (Vue Router):**
```javascript
this.$router.push('/game')
```

**After (Nuxt 4):**
```typescript
const router = useRouter()
// or
navigateTo('/game')
```

---

### 5. **Asset Paths**

**Before:**
```html
<img src="/static/images/roles/en/werewolf.png" />
```

**After:**
```html
<img src="/public/images/roles/en/werewolf.png" />
<!-- or in Nuxt, just: -->
<img src="/images/roles/en/werewolf.png" />
```

---

## 📦 Package.json Updates Required

Add these to `package.json`:

```json
{
  "dependencies": {
    "pinia": "^2.1.7",
    "@pinia/nuxt": "^0.5.1",
    "@nuxtjs/i18n": "^8.0.0-rc.4"
  },
  "devDependencies": {
    "typescript": "^5.3.0"
  }
}
```

Then run: `npm install`

---

## 🔑 Key Configuration Files

### `nuxt.config.ts` - Updated Pattern

```typescript
export default defineNuxtConfig({
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@nuxtjs/i18n',
  ],
  
  // Pinia config (auto-import store functions)
  pinia: {
    autoImports: ['defineStore', 'acceptHMRUpdate'],
  },
  
  // i18n config
  i18n: {
    locales: ['en', 'vi'],
    defaultLocale: 'en',
    langDir: 'locales/',
  },
})
```

---

## ⚠️ Important Notes

### 1. **No Vue 2 Legacy**
- Nuxt 4 is Vue 3 only
- Mixins discouraged → use Composables
- Class components → use Composition API

### 2. **TypeScript is Standard**
- All files should use `.ts` extension
- Vue components should have `lang="ts"`
- Define interfaces for all data structures
- Enable strict mode in `tsconfig.json`

### 3. **Auto-Import Features**
Nuxt 4 auto-imports:
- ✅ All components from `~/components/`
- ✅ All composables from `~/composables/`
- ✅ All stores from `~/stores/`
- ✅ Vue/Nuxt utilities
- ❌ You still need to import custom types and utilities

### 4. **i18n Module**
- Use `@nuxtjs/i18n` (not bare `vue-i18n`)
- Access via `useI18n()` composable
- Translation files in `/locales/`

### 5. **Pinia Persistence**
```typescript
// Optional: Add pinia-plugin-persistedstate
npm install pinia-plugin-persistedstate

// In nuxt.config.ts:
import { PersistedStatePlugin } from 'pinia-plugin-persistedstate'

// Usage in store:
export const usePlayersStore = defineStore('players', () => {
  // ...
}, {
  persist: true
})
```

---

## ✅ Pre-Implementation Checklist

- [ ] Update dependencies in `package.json`
- [ ] Run `npm install`
- [ ] Update `nuxt.config.ts` with new modules
- [ ] Create `/stores/` directory
- [ ] Create `/types/` directory
- [ ] Create `/composables/` directory
- [ ] Define base TypeScript interfaces
- [ ] Create base Pinia stores
- [ ] Update `tsconfig.json` for strict mode
- [ ] Test project builds: `npm run build`
- [ ] Verify no TypeScript errors: `npx tsc --noEmit`
- [ ] Run dev server: `npm run dev`

---

## 🆘 Troubleshooting

### Error: "Cannot find module '@pinia/nuxt'"
```bash
npm install @pinia/nuxt
```

### Error: "Cannot find module '@nuxtjs/i18n'"
```bash
npm install @nuxtjs/i18n
```

### Error: "Type '{}' is not assignable to type"
- Check prop definitions use `withDefaults(defineProps<Props>())`
- Ensure all interface properties are optional or have defaults
- Use TypeScript strict mode correctly

### Stores not auto-imported?
- Ensure store files are in `/stores/` directory
- Store file names must end with `.ts`
- Store names should follow pattern: `useXxxStore()`

---

## 📚 Documentation References

- [Nuxt 4 Official Docs](https://nuxt.com)
- [Pinia Documentation](https://pinia.vuejs.org)
- [Vue 3 TypeScript Guide](https://vuejs.org/guide/typescript/)
- [i18n for Nuxt](https://i18n.nuxtjs.org)

---

## 🎓 Learning Path

1. **Day 1-2**: Setup Nuxt 4 + TypeScript + Pinia
2. **Day 3-4**: Learn Composition API + TypeScript patterns
3. **Day 5-6**: Implement Phase 1-2 (Setup & Role Management)
4. **Day 7-8**: Implement Phase 3-4 (Player & Game Setup)
5. **Day 9-11**: Implement Phase 5-6 (Game Flow)
6. **Day 12-13**: Implement Phase 7-8 (TTS & Game End)
7. **Day 14+**: Mobile optimization, testing, polish

---

Happy migration! 🚀

