# Quick Reference Card - Night Phase Features

## 🎯 At A Glance

```
Total Roles to Implement: 30+ (42 in full spec)
Already Done: 1 (Werewolf)
Remaining: 41

Total Implementation Time: 200-250 hours
Broken into: 4 phases (1 week each roughly)

Key Files to Modify:
- app/stores/roles.ts (add roles & interface)
- app/types/game.ts (new types)
- app/stores/game.ts (new state)
- app/composables/useNightPhaseActions.ts (handlers)
- app/components/RoleAction.vue (UI types)
- i18n/locales/*.json (translations)
```

---

## 🚀 Phase Priorities

### Phase 1 (CRITICAL) ⚡⚡⚡
```
Seer         - SELECT_PLAYER     → Investigate target
Witch        - DUAL_OPTION       → Heal/Poison  
Body Guard   - SELECT_PLAYER     → Protect target
Wolf Cub     - SELECT_PLAYER     → Kill (enhanced)
Dire Wolf    - SELECT_PLAYER     → Kill (linked)

Time: 40-60 hours
Must complete before moving to Phase 2
```

### Phase 2 (HIGH) ⚡⚡
```
Cupid        - DUAL_SELECT       → Create lovers
Minion       - ACKNOWLEDGE       → Learn werewolves
Mason        - SELECT_PLAYER     → Find masons
Drunk        - SELECT_PLAYER     → Swap roles
Old Hag      - SELECT_PLAYER     → Curse players
Doppelganger - SELECT_PLAYER     → Copy role
Nostradamis  - SELECT_PLAYER     → Predict death

Time: 50-80 hours
```

### Phase 3 (MEDIUM) ⚡
```
Vampire      - SELECT_PLAYER     → Kill at dusk
Cult Leader  - SELECT_PLAYER     → Recruit
Hunter       - TRIGGER_ON_DAY    → Shoot
Aura Seer    - SELECT_PLAYER     → Detect special
P.I          - DUAL_SELECT       → Investigate ties
Spellcaster  - SELECT_PLAYER     → Silence
Troublemaker - DUAL_SELECT       → Swap
Priest       - SELECT_PLAYER     → Protect (limited)

Time: 60-100 hours
```

### Phase 4 (LOW) 🔸
```
Ghost, Bogeyman, Leprechaun, Zombie, Count Dracula,
The Thing, Virginia Wolf, Sasquatch, Cursed,
Frankenstein, Martyr, Lycan, Time Bandit,
Village Idiot, Tanner, Prince, Tough Guy,
Diseased, Pacifist, Mayor, Old Man, Apprentice Seer

Time: 40-60 hours
```

---

## 📊 Action Types

| Type | Example | UI | Complexity |
|------|---------|----|----|
| SELECT_PLAYER | Seer, Body Guard | Dropdown list | ⭐ |
| DUAL_SELECT | Cupid, P.I | Choose 2 different | ⭐⭐ |
| TEXT_INPUT | Ghost | Textarea | ⭐ |
| DUAL_OPTION | Witch | 2 buttons | ⭐⭐ |
| ACKNOWLEDGE | Minion | Confirm button | ⭐ |
| NONE | Mayor, Prince | Display only | ⭐ |

---

## 🎪 Night Order Quick Reference

```
Night Phase Sequence:

FIRST NIGHT ONLY (Night 0):
1. Ghost          4. Nostradamis      
2. Cupid §        17. Drunk §
3. Doppelganger § 21. Virginia Wolf §
                  22. Mason §
                  25. Sasquatch §
                  26. Cursed §
                  35. Apprentice Seer §

EVERY NIGHT:
5. Werewolf       8. Bogeyman         15. Hunter ❌
6. Minion §       9. Leprechaun       16. Huntress ❌
7. Vampire        10. Zombie          18. P.I
11. Count Dracula 12. Body Guard      19. Old Hag
13. Witch         14. Seer            20. Troublemaker

GAMEMASTER ORDERED (23-35):
23. Priest        29. Spellcaster     35. Apprentice Seer
24. Martyr        30. Aura Seer       36. The Thing
25. Lycan         31. Hunter (alt)    37. Sasquatch (alt)
26. Time Bandit   32. Huntress (alt)  ...
27. Village Idiot 33. Cult Leader
28. Tanner        34. Frankenstein
29. Prince        ...
30. Tough Guy

§ = First night only
❌ = Not called at night
```

---

## 🎨 ActionPanel Component Pattern ⭐ **REQUIRED**

**Every role with a night action MUST have a dedicated RoleActionPanel component!**

### File Pattern
```
RoleActionPanel{RoleName}.vue
RoleActionPanelSeer.vue
RoleActionPanelWitch.vue
RoleActionPanelBodyguard.vue
```

### Minimal Template
```vue
<template>
  <div class="space-y-6">
    <!-- Header with role colors -->
    <div class="bg-gradient-to-r from-[color-1] to-[color-2] text-white rounded-xl p-6">
      <h2 class="text-3xl font-bold mb-2">🔮 {Role Name}</h2>
      <p class="text-opacity-90">What the role does</p>
    </div>

    <!-- Status -->
    <div class="bg-white rounded-xl p-6 shadow-md border-2 border-[color]">
      <div class="grid grid-cols-2 gap-4">
        <div class="text-center">
          <p class="text-sm font-medium text-gray-600">Alive Players</p>
          <p class="text-2xl font-bold">{{ alivePlayers.length }}</p>
        </div>
        <div class="text-center">
          <p class="text-sm font-medium text-gray-600">Result Status</p>
          <p class="text-2xl font-bold">{{ resultIcon }}</p>
        </div>
      </div>
    </div>

    <!-- Selection UI -->
    <div class="bg-white rounded-xl p-6 shadow-md border-2 border-gray-200">
      <h3 class="text-lg font-bold text-gray-800 mb-4">Select action:</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <!-- Player selection buttons OR custom UI -->
      </div>
    </div>

    <!-- Result Preview -->
    <div v-if="actionResult" class="bg-gradient-to-r rounded-xl p-6 border-2">
      <h3 class="text-2xl font-bold mb-3">Result Preview</h3>
      <p>Show what will happen when confirmed</p>
    </div>

    <!-- Buttons -->
    <div class="flex gap-3">
      <button @click="skipAction" class="flex-1 py-3 px-4 bg-gray-500">Skip</button>
      <button @click="confirmAction" class="flex-1 py-3 px-4 bg-gradient-to-r">Confirm</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useGameStore } from '~/stores/game'
import { usePlayersStore } from '~/stores/players'
import { useRolesStore } from '~/stores/roles'

const emit = defineEmits<{
  (e: 'confirm', action: { targetPlayerId?: string; secondaryTargetPlayerId?: string }): void
  (e: 'skip'): void
}>()

const selectedTarget = ref<string>('')
const actionResult = ref<any>(null)

const alivePlayers = computed(() => {
  return gameStore.alivePlayers
    .map(id => playersStore.getPlayerById(id))
    .filter(Boolean)
})

const confirmAction = () => {
  if (selectedTarget.value) {
    emit('confirm', { targetPlayerId: selectedTarget.value })
    selectedTarget.value = ''
    actionResult.value = null
  }
}

const skipAction = () => {
  emit('skip')
  selectedTarget.value = ''
  actionResult.value = null
}
</script>
```

### Register in RoleActionPanel.vue
```typescript
// 1. Import
import RoleActionPanelSeer from './RoleActionPanelSeer.vue'
import RoleActionPanelWitch from './RoleActionPanelWitch.vue'

// 2. Add computed check
const isSeerRole = computed(() => currentRole.value?.id.toLowerCase() === 'seer')
const isWitchRole = computed(() => currentRole.value?.id.toLowerCase() === 'witch')

// 3. Template
<RoleActionPanelSeer v-if="isSeerRole" @confirm @skip />
<RoleActionPanelWitch v-else-if="isWitchRole" @confirm @skip />
<RoleAction v-else /> <!-- fallback generic -->
```

---

## 💾 Data Structure Cheatsheet

### Role Interface Addition
```typescript
{
  id: 'seer',
  name: 'Seer',
  nameVi: 'Tiên Tri',
  description: '...',
  descriptionVi: '...',
  faction: 'VILLAGER',
  balancePoints: 7,
  nightly: 'ALWAYS',
  
  // NEW FIELDS
  nightOrder: 14,           // Position in sequence
  actionType: 'SELECT_PLAYER', // Type of action
  maxUsesPerGame: undefined // null = unlimited
}
```

### Game State Additions
```typescript
// New state refs in game.ts
lovers: [['p1', 'p2'], ['p3', 'p4']]
possessed: { 'doppelganger_id': 'seer' }
cursed: ['player_id1', 'player_id2']
silenced: ['player_id3']
witchHealUsed: false
witchPoisonUsed: false
drunkRealRole: { 'drunk_player_id': 'werewolf' }
```

---

## 🔧 Implementation Checklist (Do This First)

```typescript
// Step 1: Update types/game.ts
export type RoleActionType = 
  | 'SELECT_PLAYER'    // Choose 1 player
  | 'DUAL_SELECT'      // Choose 2 players
  | 'TEXT_INPUT'       // Text message
  | 'DUAL_OPTION'      // Choose A or B
  | 'ACKNOWLEDGE'      // Confirm
  | 'NONE'             // No action

// Step 2: Update Role interface in roles.ts
interface Role {
  // ... existing ...
  nightOrder: number
  actionType: RoleActionType
  maxUsesPerGame?: number
}

// Step 3: Add to game state (game.ts)
const lovers = ref<[string, string][]>([])
const possessed = ref<Map<string, string>>(new Map())
const cursed = ref<string[]>([])

// Step 4: Update RoleActionPanel sort
.sort((a, b) => (a.nightOrder || 999) - (b.nightOrder || 999))

// Step 5: Add handlers to useNightPhaseActions
case 'seer': handleSeerInvestigation(action); break;
case 'witch': handleWitchAction(action); break;
case 'bodyguard': handleProtection(action); break;
```

---

## 🧪 Test Scenarios (Per Phase)

### Phase 1 Test
```
Scenario: 5 players, roles: Werewolf, Seer, Body Guard, Witch

Night 1:
1. Werewolf kills Player 2
2. Seer investigates Player 3 (finds not werewolf)
3. Body Guard protects Player 2 ← SAVES THEM!

Result:
- Player 2 alive (protected)
- Player 3 cleared by Seer
✅ Protection override kill works
```

### Phase 2 Test
```
Scenario: Cupid, Lovers created, Werewolf kills one

Night 1:
1. Cupid creates lovers: Player 1 & Player 2
2. Werewolf kills Player 1

Result:
- Player 1 dead
- Player 2 auto-dies (lover cascade)
✅ Lover death handling works
```

### Phase 3 Test
```
Scenario: Multiple investigations

Night 1:
1. Seer investigates Player 2 → "Werewolf"
2. P.I investigates Players 2 & 3 → "One is aligned evil"
3. Aura Seer investigates Player 4 → "Has special role"

Result:
- 3 different investigation types stored
- All display correctly next day
✅ Multiple investigation types work
```

---

## ⚠️ Common Mistakes to Avoid

```
❌ Forgetting nightOrder on roles
   → Role won't appear in correct order

❌ Not checking player alive status
   → Dead players can be targeted

❌ Protection applied AFTER kill
   → Protected players still die

❌ Forgetting FIRST_NIGHT filtering
   → Night 0 roles appear on Night 1+

❌ Not handling "no action" (skip)
   → Game breaks if role skips

❌ Limited abilities not tracked
   → Witch can heal/poison unlimited times

❌ Role changes not persisted
   → Doppelganger doesn't actually get role

✅ Check all of these before testing
```

---

## 📁 Files Open in Editor

Currently viewing: `app/stores/roles.ts` (530 lines)

### Files to Edit Next (In Order)
1. roles.ts → Add nightOrder, actionType
2. types/game.ts → New action types
3. game.ts → New state
4. RoleAction.vue → New components
5. useNightPhaseActions.ts → Handlers
6. i18n/*.json → Translations

---

## 🎮 User Flow Diagram

```
Quản Trò (Game Master)
       ↓
Game.vue → "NIGHT" phase
       ↓
RoleActionPanel shows roles by nightOrder
       ↓
GM clicks role → RoleAction component loads
       ↓
Based on actionType:
  SELECT_PLAYER    → Dropdown list
  DUAL_SELECT      → Choose 2 players
  TEXT_INPUT       → Text box
  DUAL_OPTION      → 2 buttons
  ACKNOWLEDGE      → Confirm button
  NONE             → Just display
       ↓
GM makes selection → Action stored
       ↓
Next role or "Proceed to Day"
       ↓
useNightPhaseActions processes all actions
       ↓
Results displayed
       ↓
Advance to DAY phase
```

---

## 🚨 Critical Success Factors

1. **Sorting**: Must sort roles by nightOrder, not randomly
2. **Filtering**: Must filter FIRST_NIGHT roles only on night 1
3. **Validation**: Cannot select dead/self players
4. **Protection**: Must check protection BEFORE applying kills
5. **State**: Must persist state changes across phases
6. **UI**: Must support all 6 action types correctly
7. **Translations**: Must have English & Vietnamese
8. **Testing**: Test each phase before moving next

---

## 💡 Pro Tips

1. **Use components for reusability**:
   - RoleActionPlayerSelect (single)
   - RoleActionDualSelect (pair)
   - RoleActionTextInput (text)
   - RoleActionDualOption (buttons)

2. **Group related handlers**:
   - Protection group (Body Guard, Priest)
   - Investigators group (Seer, P.I, Aura Seer)
   - Killers group (Werewolf, Witch poison, Vampire)

3. **Use helper functions**:
   ```typescript
   isPlayerAlive(id) → boolean
   getPlayersWithRole(roleId) → string[]
   hasAnyProtection(playerId) → boolean
   ```

4. **Track edge cases in tests**:
   - Multiple kills same target
   - Protect + kill same target
   - Lover dies + Witch heal
   - Role changes mid-resolution

---

## 📞 Quick Links

| Document | Purpose | Length |
|----------|---------|--------|
| NIGHT_PHASE_SPEC.md | Full specification | 400+ lines |
| IMPLEMENTATION_GUIDE.md | Technical details | 300+ lines |
| FILES_TO_MODIFY.md | File-by-file guide | 250+ lines |
| QUICK_REFERENCE.md | This file | 500 lines |
| SUMMARY.md | Executive summary | 300+ lines |
| NIGHT_PHASE_CHECKLIST.md | Actionable tasks | 200+ lines |

**Total Documentation**: ~2000 lines of detailed guides

---

## 🎓 Learning Path

```
1. SUMMARY.md (15 min)
   └─ Overview & big picture

2. NIGHT_PHASE_SPEC.md (60 min)
   └─ Understand each role

3. IMPLEMENTATION_GUIDE.md (45 min)
   └─ Understand architecture

4. FILES_TO_MODIFY.md (30 min)
   └─ Know which files change

5. Start coding → Phase 1
   └─ Refer to QUICK_REFERENCE.md as needed
```

---

## 📈 Progress Tracking Template

```markdown
## Implementation Progress

### Phase 1: CRITICAL
- [ ] Seer (0%)
- [ ] Witch (0%)
- [ ] Body Guard (0%)
- [ ] Wolf Cub (0%)
- [ ] Dire Wolf (0%)

**Phase 1 Status**: 0/5 complete (0%)

### Phase 2: HIGH
- [ ] Cupid (0%)
- [ ] Minion (0%)
- [ ] Mason (0%)
- [ ] Drunk (0%)
- [ ] Old Hag (0%)
- [ ] Doppelganger (0%)
- [ ] Nostradamis (0%)

**Phase 2 Status**: 0/7 complete (0%)

### Infrastructure
- [ ] Update Role interface
- [ ] Update game types
- [ ] Update RoleAction component
- [ ] Add action handlers

**Infrastructure Status**: 0/4 complete (0%)

### Overall Progress
█░░░░░░░░░░░░░░░░░░ 0% (0/30+ roles complete)
```

---

## ✅ Completion Checklist

- [ ] Read all documentation (2 hours)
- [ ] Understand current architecture (1 hour)
- [ ] Update Role interface (1 hour)
- [ ] Add Phase 1 roles (1 hour)
- [ ] Implement Phase 1 logic (4 hours)
- [ ] Test Phase 1 (2 hours)
- [ ] Proceed to Phase 2
- [ ] Repeat for Phases 3 & 4
- [ ] Polish & final testing (2 hours)

**Total**: 200-250 hours for full implementation

---

**Version**: 1.0 | **Date**: Nov 15, 2025 | **Status**: Ready to Implement


