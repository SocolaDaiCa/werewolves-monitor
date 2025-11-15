# Implementation Guide - Night Phase Features

## Quick Reference

### Role Action Types
```
SELECT_PLAYER   - Choose 1 player
DUAL_SELECT     - Choose 2 players
TEXT_INPUT      - Enter text (e.g., Ghost message)
DUAL_OPTION     - Choose between 2 options (e.g., Witch: Heal/Poison)
ACKNOWLEDGE     - Just confirm (e.g., Minion learns werewolves)
NONE            - No action needed
```

### Nightly Constants
```
ALWAYS      - Called every night (if alive)
FIRST_NIGHT - Called only on night 1
NEVER       - Not called at night (e.g., Hunter)
```

---

## Architecture Overview

### 1. Role Definition Flow
```
Role Definition (roles.ts)
    ↓
RoleActionPanel reads nightOrder + nightly
    ↓
Sorted by nightOrder, filtered by nightly type
    ↓
RoleAction component based on actionType
    ↓
useNightPhaseActions processes action
    ↓
Game state updated with results
```

### 2. Night Phase Execution
```
Night Starts
    ↓
For each role (ordered by nightOrder):
  1. Show role description
  2. Show active player(s)
  3. Get action input
  4. Confirm action
  5. Store action
    ↓
Process all actions (resolve conflicts)
    ↓
Display results
    ↓
Advance to Day Phase
```

### 3. Action Resolution Priority
```
1. Confirmations (Apprentice Seer learns from Seer)
2. Protections (Body Guard, Priest)
3. Thefts/Swaps (Leprechaun, Time Bandit, Troublemaker)
4. Investigations (Seer, P.I, Aura Seer results stored)
5. Eliminations (Werewolf, Vampire, Witch poison)
6. Lover cascade (if one lover dies)
7. Possession changes (Doppelganger becomes new role)
8. Curse activation (Cursed becomes Werewolf if bitten)
```

---

## Step-by-Step Implementation

### Step 1: Update Role Interface

**File**: `app/stores/roles.ts`

```typescript
export interface Role {
  id: string
  name: string
  nameVi: string
  description: string
  descriptionVi: string
  faction: 'VILLAGER' | 'WEREWOLF' | 'CULT' | 'VAMPIRE' | 'SPECIAL'
  balancePoints: number
  nightly: 'ALWAYS' | 'FIRST_NIGHT' | 'NEVER'
  icon?: string
  
  // NEW FIELDS
  nightOrder: number              // 1-42, determines order
  actionType: RoleActionType      // Type of action
  maxUsesPerGame?: number         // null = unlimited, 1 = once per game
  displayOrder?: number           // UI display priority (optional)
  defaultOrderPosition?: number   // Default position in GM-ordered section (23-35)
}
```

### Step 2: Update Game Types

**File**: `app/types/game.ts`

```typescript
// Extend RoleActionType
export type RoleActionType = 'SELECT_PLAYER' | 'DUAL_SELECT' | 'TEXT_INPUT' | 'DUAL_OPTION' | 'ACKNOWLEDGE' | 'NONE'

// Add to game state interface
export interface NightPhaseState {
  lovers: Array<[string, string]>           // [[id1, id2], [id3, id4]]
  possessed: Map<string, string>            // playerA -> RoleId that copied them
  cursed: string[]                          // Cursed players (become werewolf if bitten)
  silenced: string[]                        // Cannot speak during next day
  witchHealUsed: boolean
  witchPoisonUsed: boolean
  drunkRealRole: { [playerId: string]: string }  // Actual role if swapped
}
```

### Step 3: Add Phase 1 Roles to roles.ts

**Uncomment and update existing commented roles with new fields:**

```typescript
{
  id: 'seer',
  name: 'Seer',
  nameVi: 'Tiên Tri',
  description: 'Each night, choose a player to learn if they are a werewolf or not.',
  descriptionVi: 'Mỗi đêm, chọn một người chơi để biết họ có phải sói hay không.',
  faction: 'VILLAGER',
  balancePoints: 7,
  nightly: 'ALWAYS',
  nightOrder: 14,           // NEW
  actionType: 'SELECT_PLAYER', // NEW
  maxUsesPerGame: undefined  // NEW - unlimited
}
```

**Add new roles with proper fields**

### Step 4: Update useNightPhaseActions.ts

**Add handlers for each role type:**

```typescript
const processAction = (action: RoleAction) => {
  const role = rolesStore.getRoleById(action.roleId)
  if (!role) return

  switch (action.roleId.toLowerCase()) {
    case 'werewolf':
    case 'wolf-cub':
    case 'dire-wolf':
      handleWerewolfKill(action)
      break
    case 'witch':
      handleWitchAction(action)
      break
    case 'seer':
      handleSeerInvestigation(action)
      break
    // ... add more cases for each role
  }
}
```

### Step 5: Update RoleAction.vue

**Support different action types:**

```typescript
const getActionComponent = computed(() => {
  switch (props.actionType) {
    case 'SELECT_PLAYER':
      return PlayerSelector
    case 'DUAL_SELECT':
      return DualPlayerSelector
    case 'TEXT_INPUT':
      return TextInputForm
    case 'DUAL_OPTION':
      return OptionButtons
    case 'ACKNOWLEDGE':
      return ConfirmButton
    default:
      return null
  }
})
```

### Step 5.5: Create Role-Specific ActionPanels ⭐ **IMPORTANT**

**Each role with a night action should have its own dedicated component!**

**Pattern**: `RoleActionPanel{RoleName}.vue`

**Examples:**
- `RoleActionPanelSeer.vue` - Investigation results preview
- `RoleActionPanelWitch.vue` - Heal/Poison buttons
- `RoleActionPanelCupid.vue` - Dual selection with lover pairing
- `RoleActionPanelBodyguard.vue` - Protection preview
- etc.

**Key Benefits:**
✅ Custom UI for each role's unique mechanics  
✅ Real-time result preview (show what happens)  
✅ Better visual feedback and player experience  
✅ Cleaner code than generic RoleAction.vue  
✅ Easier to maintain and debug  

**Template Structure:**
```vue
<template>
  <div class="space-y-6">
    <!-- Role Header (branded colors) -->
    <div class="bg-gradient-to-r from-[role-color-1] to-[role-color-2] text-white rounded-xl p-6">
      <h2 class="text-3xl font-bold mb-2">🔮 {Role Name} Night Action</h2>
      <p class="text-opacity-90">Description of the action</p>
    </div>

    <!-- Status Display -->
    <div class="bg-white rounded-xl p-6 shadow-md border-2">
      <!-- Show relevant stats -->
    </div>

    <!-- Player Selection Grid (or custom UI) -->
    <div class="bg-white rounded-xl p-6 shadow-md">
      <!-- Interactive selection UI -->
    </div>

    <!-- Result Preview -->
    <div v-if="actionResult" class="bg-gradient-to-r rounded-xl p-6">
      <!-- Show what will happen -->
    </div>

    <!-- Action Buttons -->
    <div class="flex gap-3">
      <button @click="skipAction">Skip</button>
      <button @click="confirmAction" :disabled="!isValid">Confirm</button>
    </div>
  </div>
</template>
```

**Register in RoleActionPanel.vue:**
```typescript
// 1. Import the component
import RoleActionPanelSeer from './RoleActionPanelSeer.vue'
import RoleActionPanelWitch from './RoleActionPanelWitch.vue'

// 2. Add computed check
const isSeerRole = computed(() => currentRole.value?.id.toLowerCase() === 'seer')
const isWitchRole = computed(() => currentRole.value?.id.toLowerCase() === 'witch')

// 3. Use in template
<RoleActionPanelSeer v-if="isSeerRole" @confirm="handleActionConfirm" @skip="handleActionSkip" />
<RoleActionPanelWitch v-else-if="isWitchRole" @confirm="handleActionConfirm" @skip="handleActionSkip" />
```

### Step 6: Update RoleActionPanel.vue

**Sort roles by nightOrder:**

```typescript
const activeRoles = computed(() => {
  return rolesStore.roles
    .filter(role => {
      if (role.nightly === 'NEVER') return false
      if (role.nightly === 'FIRST_NIGHT' && gameStore.round !== 1) return false
      // Check if any alive player has this role
      return Object.entries(gameStore.playerRoles).some(
        ([playerId, roleId]) => roleId === role.id && gameStore.alivePlayers.includes(playerId)
      )
    })
    .sort((a, b) => (a.nightOrder || 999) - (b.nightOrder || 999)) // NEW - Sort by nightOrder
})
```

---

## Key Implementation Details

### 1. Kill Resolution Logic

```typescript
const resolveKills = () => {
  const killTargets = new Map<string, Set<string>>() // target -> [sources]
  const protectedPlayers = new Set<string>()
  
  // Group kills by target
  results.forEach(r => {
    if (r.action === 'kill') {
      if (!killTargets.has(r.affectedPlayer!)) {
        killTargets.set(r.affectedPlayer!, new Set())
      }
      killTargets.get(r.affectedPlayer!)!.add(r.playerId)
    }
    if (r.action === 'protect') {
      protectedPlayers.add(r.affectedPlayer!)
    }
  })
  
  // Apply protection
  killTargets.forEach((sources, target) => {
    if (!protectedPlayers.has(target)) {
      gameStore.eliminatePlayer(target, /* ... */)
    }
  })
}
```

### 2. Lover Handling

```typescript
// When a lover dies
const handleLoverDeath = (deadPlayerId: string) => {
  const lovers = gameStore.lovers
  const loverPair = lovers.find(pair => pair.includes(deadPlayerId))
  
  if (loverPair) {
    const survivingLover = loverPair.find(id => id !== deadPlayerId)
    gameStore.eliminatePlayer(survivingLover, gameStore.round, 'LOVER_DEATH')
  }
}
```

### 3. Action Confirmation Pattern

```typescript
// In RoleAction.vue component
const handleConfirm = () => {
  const action: RoleAction = {
    roleId: props.roleId,
    playerId: props.playerId,
    actionType: props.actionType,
    targetPlayerId: selectedPlayer.value,
    timestamp: Date.now()
  }
  
  emit('confirm', action)
}
```

### 4. Witch Action with Limits

```typescript
const handleWitchAction = (action: RoleAction) => {
  const { targetPlayerId, actionData } = action
  
  if (actionData === 'HEAL') {
    if (!gameStore.witchHealUsed) {
      healTargets.add(targetPlayerId)
      gameStore.witchHealUsed = true
    }
  } else if (actionData === 'POISON') {
    if (!gameStore.witchPoisonUsed) {
      killTargets.add(targetPlayerId)
      gameStore.witchPoisonUsed = true
    }
  }
}
```

---

## Testing Strategy

### Unit Tests

```typescript
// Test role definitions
test('All roles have required fields', () => {
  rolesStore.roles.forEach(role => {
    expect(role.nightOrder).toBeDefined()
    expect(role.actionType).toBeDefined()
  })
})

// Test action processing
test('Seer investigation returns correct result', () => {
  const action = {
    roleId: 'seer',
    playerId: 'player1',
    actionType: 'SELECT_PLAYER',
    targetPlayerId: 'player2',
    timestamp: Date.now()
  }
  
  const results = useNightPhaseActions().processNightActions([action])
  expect(results[0].action).toBe('investigate')
  expect(results[0].message).toContain('werewolf')
})
```

### Integration Tests

```typescript
// Test full night phase
test('Full night phase with multiple roles', () => {
  // Setup: 5 players, roles: Werewolf, Seer, Bodyguard, Witch
  // Execute: Each role makes action
  // Verify: Correct kills, protections, investigations stored
})
```

### E2E Tests

```typescript
// Test from UI perspective
test('Seer can investigate player and get result', () => {
  // Start night phase
  // Select Seer from role list
  // Choose target player
  // Confirm action
  // Verify action recorded
})
```

---

## Performance Considerations

1. **Role Sorting**: Sort once in computed property, don't re-sort every render
2. **Action Processing**: Use Maps/Sets for O(1) lookups instead of arrays
3. **State Persistence**: Use pinia persist plugin for overnight changes
4. **Memory**: Clear old actions from previous nights to prevent memory leak

---

## Common Pitfalls

1. ❌ Forgetting to check if player is alive before allowing selection
2. ❌ Not handling "no action" case (player skips)
3. ❌ Not considering protection before kill resolution
4. ❌ Forgetting to handle first night (FIRST_NIGHT roles)
5. ❌ Not tracking limited-use abilities (Witch potions)
6. ❌ Not handling dead players being targeted
7. ❌ Not implementing role changes (Doppelganger, Cursed)

---

## Useful Helpers

```typescript
// Check if player is alive
const isPlayerAlive = (playerId: string) => 
  gameStore.alivePlayers.includes(playerId)

// Get all players with specific role
const getPlayersWithRole = (roleId: string) =>
  Object.entries(gameStore.playerRoles)
    .filter(([, role]) => role === roleId)
    .map(([playerId]) => playerId)
    .filter(isPlayerAlive)

// Check if on first night
const isFirstNight = () => gameStore.round === 1

// Check if role was used
const isRoleUsedThisNight = (roleId: string) =>
  gameStore.nightPhaseActions.some(a => a.roleId === roleId)
```

---

## Troubleshooting

### Issue: Roles not appearing in night phase
**Solution**: Check `nightly` field and `nightOrder` > 0

### Issue: Role action not processing
**Solution**: Verify handler exists in `processAction` switch statement

### Issue: Multiple kills resolving incorrectly
**Solution**: Check kill resolution priority logic

### Issue: Protected player still dies
**Solution**: Verify protection is added BEFORE kill resolution, not after


