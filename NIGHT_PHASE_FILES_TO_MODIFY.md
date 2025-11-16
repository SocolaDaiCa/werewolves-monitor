# Files to Modify - Night Phase Implementation

## Priority Order for Modification

### 1️⃣ HIGHEST PRIORITY - Core Data Structures

#### `app/stores/roles.ts`
**Status**: Currently Open (530 lines)

**What to do**:
- [ ] Update `Role` interface (line 4-14):
  - Add `nightOrder: number`
  - Add `actionType: RoleActionType`
  - Add `maxUsesPerGame?: number`
  - Add `displayOrder?: number`
  - Add `defaultOrderPosition?: number`

- [ ] Add `RoleActionType` type definition:
  ```typescript
  export type RoleActionType = 'SELECT_PLAYER' | 'DUAL_SELECT' | 'TEXT_INPUT' | 'DUAL_OPTION' | 'ACKNOWLEDGE' | 'NONE'
  ```

- [ ] Update existing roles with new fields:
  - villager (line 19-28): add `nightOrder: 0, actionType: 'NONE'`
  - werewolf (line 251-260): add `nightOrder: 5, actionType: 'SELECT_PLAYER'`

- [ ] Uncomment and update roles for Phase 1:
  - seer (around line 30): add fields
  - witch (around line 40): add fields with `maxUsesPerGame: undefined`
  - bodyguard (around line 80): add fields
  - hunter (around line 50): add `nightly: 'NEVER'`

- [ ] Add NEW roles from lines 250+ (currently commented):
  - All 30+ roles need `nightOrder` and `actionType`

**Line Count Impact**: Will grow from 530 to ~650 lines

---

#### `app/types/game.ts`
**Status**: Currently 54 lines

**What to do**:
- [ ] Update `RoleActionType` (if not in roles.ts):
  ```typescript
  export type RoleActionType = 'SELECT_PLAYER' | 'DUAL_SELECT' | 'TEXT_INPUT' | 'DUAL_OPTION' | 'ACKNOWLEDGE' | 'NONE'
  ```

- [ ] Extend `RoleAction` interface (line 33-40):
  ```typescript
  export interface RoleAction {
    roleId: string
    playerId: string
    actionType: RoleActionType
    targetPlayerId?: string
    secondaryTargetPlayerId?: string
    actionData?: string  // For DUAL_OPTION, TEXT_INPUT
    timestamp: number
  }
  ```

- [ ] Add new state interface:
  ```typescript
  export interface NightPhaseEffects {
    lovers: Array<[string, string]>
    possessed: Map<string, string>
    cursed: string[]
    silenced: string[]
  }
  ```

**Line Count Impact**: Will grow to ~80 lines

---

### 2️⃣ HIGH PRIORITY - State Management

#### `app/stores/game.ts`
**Status**: Currently 343 lines

**What to do**:
- [ ] Add new state variables (after line 62):
  ```typescript
  // Night phase effects
  const lovers = ref<Array<[string, string]>>([])
  const possessed = ref<Map<string, string>>(new Map())
  const cursed = ref<string[]>([])
  const silenced = ref<string[]>([])
  
  // Ability usage tracking
  const witchHealUsed = ref(false)
  const witchPoisonUsed = ref(false)
  const drunkRealRole = ref<{ [playerId: string]: string }>({})
  ```

- [ ] Add action methods for state updates:
  ```typescript
  function addLoverPair(playerId1: string, playerId2: string)
  function addCursedPlayer(playerId: string)
  function addSilencedPlayer(playerId: string)
  function setPossessed(playerId: string, roleId: string)
  function markWitchHealUsed()
  function markWitchPoisonUsed()
  ```

- [ ] Return new state and methods in store export

**Line Count Impact**: Will grow from 343 to ~420 lines

---

### 3️⃣ HIGH PRIORITY - Action Processing

#### `app/composables/useNightPhaseActions.ts`
**Status**: Currently 269 lines

**What to do**:
- [ ] Add specialized handlers for Phase 1 roles:
  ```typescript
  const handleSeerInvestigation(action: RoleAction)
  const handleWitchAction(action: RoleAction)  // With DUAL_OPTION support
  const handleBodyGuardProtection(action: RoleAction)
  ```

- [ ] Extend `processAction` switch statement (line 54):
  - Add cases for: seer, witch, bodyguard, etc.

- [ ] Update `resolveKills` to handle:
  - Multiple protections on same target
  - Witch heal vs kill priority
  - Lovers death cascade

- [ ] Add helper functions:
  ```typescript
  const isPlayerProtected(playerId: string)
  const hasMultipleKillsOnTarget(playerId: string)
  const resolveLoverDeaths()
  ```

**Line Count Impact**: Will grow from 269 to ~450+ lines

---

### 4️⃣ MEDIUM PRIORITY - UI Components

#### `app/components/RoleAction.vue`
**Status**: Not yet examined, likely 100-200 lines

**What to do**:
- [ ] Add support for all action types:
  - SELECT_PLAYER: dropdown/button list
  - DUAL_SELECT: choose 2 different players
  - TEXT_INPUT: textarea for messages
  - DUAL_OPTION: 2 buttons (Heal/Poison, etc.)
  - ACKNOWLEDGE: simple confirm button
  - NONE: display message only

- [ ] Add validation:
  - Cannot select dead players
  - Cannot select self (for most roles)
  - Must select 2 different players for DUAL_SELECT
  - Text input not empty for TEXT_INPUT

- [ ] Add role-specific UI:
  - Show remaining uses for limited abilities (Witch potions)
  - Show previously investigated players for Seer
  - Show curse status for related roles

**Line Count Impact**: Will grow from ~150 to ~300+ lines

---

#### `app/components/RoleActionPanel.vue`
**Status**: Currently 256 lines

**What to do**:
- [ ] Update role display to show `nightOrder` info

**Line Count Impact**: Minimal, ~10 lines added

---

### 5️⃣ MEDIUM PRIORITY - Translations

#### `i18n/locales/en.json`
**Status**: Currently 220 lines

**What to do**:
- [ ] Add entries for all new roles:
  ```json
  "roles": {
    "seer": {
      "name": "Seer",
      "description": "Each night, choose a player to learn if they are a werewolf or not."
    },
    "witch": {
      "name": "Witch",
      "description": "Once per game, heal someone. Once per game, poison someone."
    }
    // ... all 30+ roles
  }
  ```

- [ ] Add action descriptions:
  ```json
  "actions": {
    "selectPlayer": "Choose a player",
    "dualSelect": "Choose 2 players",
    "textInput": "Enter your message",
    "dualOption": "Choose an action"
  }
  ```

**Line Count Impact**: Will grow from 220 to ~400+ lines

---

#### `i18n/locales/vi.json`
**Status**: Currently has Vietnamese translations

**What to do**:
- [ ] Add Vietnamese translations for all new roles
- [ ] Match structure of en.json

**Line Count Impact**: Will grow from current to ~400+ lines

---

### 6️⃣ LOWER PRIORITY - Supporting Components

#### `app/pages/game.vue`
**Status**: Not yet examined

**What to do**:
- [ ] Display night phase effects:
  - Show lover pairs when announced
  - Show Doppelganger role changes
  - Show Cursed transformations
  - Show Silenced players in day phase

---

#### `app/pages/night-zero.vue`
**Status**: Not yet examined

**What to do**:
- [ ] Ensure first-night-only roles are displayed correctly
- [ ] Handle Minion introduction to werewolves
- [ ] Handle Mason introductions

---

### 7️⃣ OPTIONAL ENHANCEMENTS

#### Create New Component: `RoleActionDualSelect.vue`
**What to do**:
- Reusable component for selecting 2 players
- Used by Cupid, P.I, Troublemaker, etc.

#### Create New Component: `RoleActionTextInput.vue`
**What to do**:
- Text input for Ghost messages
- Message history tracking

#### Create New Component: `NightPhaseEffectsDisplay.vue`
**What to do**:
- Display lovers, curses, possessions
- Show during morning announcement

---

## File Dependency Graph

```
roles.ts
  ↑
  └─→ types/game.ts
        ↑
        ├─→ stores/game.ts
        │     ↑
        │     └─→ composables/useNightPhaseActions.ts
        │           ↑
        │           └─→ components/RoleActionPanel.vue
        │                 ↑
        │                 └─→ components/RoleAction.vue
        │
        └─→ pages/game.vue
              ↑
              └─→ i18n/locales/*.json
```

## Implementation Order

1. **UPDATE INTERFACES** (roles.ts, types/game.ts)
2. **ADD PHASE 1 ROLES** (roles.ts)
3. **UPDATE STORES** (game.ts)
4. **IMPLEMENT HANDLERS** (useNightPhaseActions.ts)
5. **UPDATE UI** (RoleAction.vue, RoleActionPanel.vue)
6. **ADD TRANSLATIONS** (i18n files)
7. **TEST** End-to-end
8. **REPEAT** for Phase 2, 3, 4

## Estimated Changes

| File | Current Lines | New Lines | Change Type |
|------|---------------|-----------|----|
| roles.ts | 530 | 800+ | Major |
| types/game.ts | 54 | 100+ | Major |
| game.ts | 343 | 420+ | Major |
| useNightPhaseActions.ts | 269 | 450+ | Major |
| RoleAction.vue | ~150 | 300+ | Major |
| RoleActionPanel.vue | 256 | 270+ | Minor |
| en.json | 220 | 400+ | Major |
| vi.json | ~220 | 400+ | Major |
| **TOTAL** | **~2042** | **~3200+** | **~57% growth** |


