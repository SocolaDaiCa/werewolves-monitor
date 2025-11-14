# ✅ Implementation Checklist - Nuxt 4 Setup

> Danh sách kiểm tra từng bước để khởi tạo project

---

## 📦 PHASE 0: Initial Setup (30 minutes)

### Step 1: Install Dependencies
- [ ] Open terminal in project root
- [ ] Run: `npm install pinia @pinia/nuxt @nuxtjs/i18n`
- [ ] Verify installation: `npm list pinia @pinia/nuxt @nuxtjs/i18n`

### Step 2: Create Folder Structure
```bash
mkdir -p app/stores app/composables app/types app/locales
```
- [ ] `/app/stores/` - Pinia stores
- [ ] `/app/composables/` - Reusable logic
- [ ] `/app/types/` - TypeScript interfaces
- [ ] `/app/locales/` - i18n translations

### Step 3: Update nuxt.config.ts
- [ ] Open `nuxt.config.ts`
- [ ] Add modules: `@pinia/nuxt`, `@nuxtjs/i18n`
- [ ] Add i18n configuration
- [ ] Add pinia configuration
- [ ] Reference: NUXT4_TYPESCRIPT_SETUP.md

### Step 4: Update tsconfig.json
- [ ] Enable strict mode
- [ ] Add TypeScript paths
- [ ] Extend nuxt tsconfig
- [ ] Reference: NUXT4_TYPESCRIPT_SETUP.md

### Step 5: Verify Project Runs
- [ ] Run: `npm run dev`
- [ ] Open browser: `http://localhost:3000`
- [ ] Check no errors in console
- [ ] Check no errors in terminal

---

## 🏪 PHASE 1: Create Base Stores

### Create types/index.ts
- [ ] Create file `/app/types/index.ts`
- [ ] Will re-export all types

### Create types/player.ts
```typescript
export interface Player {
  id: string
  name: string
  avatar: string
  joinedDate: number
  gamesPlayed: number
  wins: number
}
```
- [ ] Create file `/app/types/player.ts`
- [ ] Copy interface above
- [ ] Add `PlayerStatus` type

### Create types/role.ts
```typescript
export interface Role {
  id: string
  name: string
  description: string
  faction: 'villager' | 'werewolf' | 'cult' | 'vampire' | 'neutral'
  image: string
  balancePoints: number
  nightAction: boolean
}

export interface RoleConfig {
  roleId: string
  quantity: number
}
```
- [ ] Create file `/app/types/role.ts`
- [ ] Copy interfaces above

### Create types/game.ts
```typescript
import type { Player, PlayerStatus } from './player'
import type { Role, RoleConfig } from './role'

export type Phase = 'setup' | 'night' | 'day' | 'voting' | 'end'

export interface GamePlayer extends Player {
  role?: Role
  status: PlayerStatus
}

export interface Game {
  id: string
  startedAt: number
  endedAt?: number
  players: GamePlayer[]
  roles: RoleConfig[]
  winner?: 'villagers' | 'werewolves' | 'cult'
}
```
- [ ] Create file `/app/types/game.ts`
- [ ] Copy interfaces above

### Update types/index.ts
```typescript
export * from './player'
export * from './role'
export * from './game'
```
- [ ] Add all exports

### Create stores/game.ts
- [ ] Create file `/app/stores/game.ts`
- [ ] Reference: EXAMPLE_IMPLEMENTATION.md → Complete Pinia Store Example
- [ ] Copy and customize game store
- [ ] Implement: state, getters, actions

### Create stores/players.ts
- [ ] Create file `/app/stores/players.ts`
- [ ] Reference: EXAMPLE_IMPLEMENTATION.md → app/stores/players.ts
- [ ] Copy and customize players store
- [ ] Implement: CRUD actions, localStorage sync

### Create stores/roles.ts
- [ ] Create file `/app/stores/roles.ts`
- [ ] Import roles from `~/app/docs.ts` (existing file)
- [ ] Create store with roles list
- [ ] Implement: `getRoleById()`, filter methods

### Verify Stores
- [ ] Run: `npm run dev`
- [ ] Check no TypeScript errors
- [ ] Open Vue DevTools → check Pinia stores visible

---

## 🌐 PHASE 2: Setup i18n

### Create locales/en.json
```json
{
  "common": {
    "title": "Werewolves Monitor",
    "language": "English",
    "home": "Home",
    "roles": "Roles",
    "players": "Players",
    "gameSetup": "Game Setup",
    "startGame": "Start Game",
    "back": "Back"
  },
  "roles": {
    "werewolf": "Werewolf",
    "seer": "Seer",
    "witch": "Witch"
  }
}
```
- [ ] Create `/app/locales/en.json`
- [ ] Add at least 30+ role translations
- [ ] Add all UI text translations

### Create locales/vi.json
```json
{
  "common": {
    "title": "Trò chơi Sói Đêm",
    "language": "Tiếng Việt",
    "home": "Trang chủ",
    "roles": "Vai trò",
    "players": "Người chơi",
    "gameSetup": "Chuẩn bị trò chơi",
    "startGame": "Bắt đầu trò chơi",
    "back": "Quay lại"
  },
  "roles": {
    "werewolf": "Sói đêm",
    "seer": "Nhân vật tiên tri",
    "witch": "Phù thuỷ"
  }
}
```
- [ ] Create `/app/locales/vi.json`
- [ ] Translate all content
- [ ] Ensure Vietnamese diacritics correct

### Verify i18n
- [ ] Run: `npm run dev`
- [ ] Check i18n module loads
- [ ] No errors in console

---

## 🧩 PHASE 3: Create Base Composables

### Create composables/useGame.ts
- [ ] Create `/app/composables/useGame.ts`
- [ ] Export useful game logic functions
- [ ] Example: `useGame().playerCount`
- [ ] Reference: EXAMPLE_IMPLEMENTATION.md

### Create composables/useTextToSpeech.ts
- [ ] Create `/app/composables/useTextToSpeech.ts`
- [ ] Implement TTS logic
- [ ] Export: `speak()`, `pause()`, `resume()`, `stop()`
- [ ] Reference: EXAMPLE_IMPLEMENTATION.md

### Create composables/useGameValidation.ts
- [ ] Create `/app/composables/useGameValidation.ts`
- [ ] Export: `validateGameSetup()`, `getBalanceStatus()`
- [ ] Reference: EXAMPLE_IMPLEMENTATION.md

---

## 📝 PHASE 4: Create Base Components

### Create components/RoleCard.vue
- [ ] Create `/app/components/RoleCard.vue`
- [ ] Props: `role: Role`, `isSelected?: boolean`
- [ ] Display: role image, name, description, balance points
- [ ] Emit: `select`
- [ ] Reference: EXAMPLE_IMPLEMENTATION.md

### Create components/PlayerCard.vue
- [ ] Create `/app/components/PlayerCard.vue`
- [ ] Props: `player: Player`, `isSelected?: boolean`
- [ ] Display: avatar, name, stats
- [ ] Emit: `select`, `edit`, `delete`
- [ ] Reference: EXAMPLE_IMPLEMENTATION.md

### Create components/RoleSelector.vue
- [ ] Create `/app/components/RoleSelector.vue`
- [ ] Props: `role: Role`, `currentQuantity`, `maxQuantity`
- [ ] Quantity controls: -/+/input
- [ ] Emit: `update` with new quantity
- [ ] Reference: EXAMPLE_IMPLEMENTATION.md

---

## 🎨 PHASE 5: Create Base Pages

### Update pages/index.vue
- [ ] Create main menu page
- [ ] Add navigation links to:
  - Players management
  - Roles management
  - Game setup
- [ ] Add language switcher
- [ ] Style with Tailwind

### Create pages/players.vue
- [ ] Route handler for player management
- [ ] Display all players
- [ ] Add/edit/delete buttons
- [ ] Reference EXAMPLE_IMPLEMENTATION.md

### Create pages/roles.vue
- [ ] Route handler for role management
- [ ] Display roles with filters by faction
- [ ] Show balance indicator
- [ ] Reference EXAMPLE_IMPLEMENTATION.md

### Create pages/game-setup.vue
- [ ] Route handler for game setup
- [ ] Player selection
- [ ] Role selection
- [ ] Validation with error messages
- [ ] Start Game button

### Create pages/game.vue
- [ ] Route handler for active game
- [ ] Phase display
- [ ] Actions for night phase
- [ ] Voting interface for day phase

### Create pages/game-end.vue
- [ ] Route handler for game results
- [ ] Display winner
- [ ] Show game summary table
- [ ] Play Again / Main Menu buttons

---

## 🧪 PHASE 6: Testing

### Type Checking
- [ ] Run: `npx tsc --noEmit`
- [ ] Fix all TypeScript errors
- [ ] Ensure no `any` types (except where necessary)

### Build Check
- [ ] Run: `npm run build`
- [ ] Verify build completes without errors
- [ ] Check build output size reasonable

### Dev Server
- [ ] Run: `npm run dev`
- [ ] Open in browser
- [ ] Navigate between pages
- [ ] Check console for errors/warnings

### Preview Build
- [ ] Run: `npm run generate`
- [ ] Run: `npm run preview`
- [ ] Test all pages work in production build

---

## 📋 Validation Checklist

### Directory Structure
```
app/
├── stores/
│   ├── game.ts ✓
│   ├── players.ts ✓
│   └── roles.ts ✓
├── composables/
│   ├── useGame.ts ✓
│   ├── useTextToSpeech.ts ✓
│   └── useGameValidation.ts ✓
├── types/
│   ├── player.ts ✓
│   ├── role.ts ✓
│   ├── game.ts ✓
│   └── index.ts ✓
├── locales/
│   ├── en.json ✓
│   └── vi.json ✓
├── components/
│   ├── RoleCard.vue ✓
│   ├── PlayerCard.vue ✓
│   ├── RoleSelector.vue ✓
│   └── ... (more)
└── pages/
    ├── index.vue ✓
    ├── players.vue ✓
    ├── roles.vue ✓
    ├── game-setup.vue ✓
    ├── game.vue ✓
    └── game-end.vue ✓
```

### Configuration Files
- [ ] `nuxt.config.ts` updated with modules
- [ ] `tsconfig.json` strict mode enabled
- [ ] `package.json` has pinia, @pinia/nuxt, @nuxtjs/i18n

### Functionality
- [ ] Stores auto-import and work
- [ ] Components render without errors
- [ ] Navigation between pages works
- [ ] i18n translations display correctly
- [ ] Language switcher changes language
- [ ] All TypeScript types valid
- [ ] No ESLint/TypeScript errors

### Performance
- [ ] Dev server starts in < 5 seconds
- [ ] Pages load quickly
- [ ] No console warnings
- [ ] Build completes in < 30 seconds

---

## ✅ Final Sign-Off

After completing all phases:

- [ ] All directories created ✓
- [ ] All stores working ✓
- [ ] All types defined ✓
- [ ] All composables functional ✓
- [ ] All components rendering ✓
- [ ] All pages accessible ✓
- [ ] i18n working (en + vi) ✓
- [ ] No TypeScript errors ✓
- [ ] No build errors ✓
- [ ] Dev server runs smoothly ✓

---

## 🚀 Ready to Implement Features?

Once this setup checklist is complete, start implementing the CHECKLIST.md phases:

1. **PHASE 1**: ✅ Setup & Structure (COMPLETED - this checklist)
2. **PHASE 2**: Role Management Screen
3. **PHASE 3**: Player Management Screen
4. **PHASE 4**: Game Setup Screen
5. **PHASE 5**: Game Flow - Night Phase
6. **PHASE 6**: Game Flow - Day Phase
7. **PHASE 7**: Text-to-Speech Integration
8. **PHASE 8**: Game End Screen
9. **PHASE 9**: Mobile Optimization
10. **PHASE 10**: Testing & Polish

---

## 📞 Troubleshooting

**Error: "Cannot find module '@pinia/nuxt'"**
```bash
npm install @pinia/nuxt
```

**Error: "Type 'X' is not assignable to type 'Y'"**
- Check interface definitions in types/
- Verify props use correct types
- Enable strict mode in tsconfig.json

**Store not auto-importing?**
- Ensure file is in `/stores/` directory
- Ensure file ends with `.ts`
- Ensure store name follows pattern: `useXxxStore()`

**i18n not showing translations?**
- Check JSON syntax in locale files
- Verify module configuration in nuxt.config.ts
- Check file path in i18n config

---

**Status: Ready for Implementation!** 🎉

Next: Start PHASE 2 in CHECKLIST.md

