# Werewolves Monitor - Night Phase Implementation Checklist

## 📋 Implementation Phases

### 🔴 PHASE 1: Core Investigation & Protection (CRITICAL)
Status: `NOT_STARTED` | Priority: 🔥🔥🔥

- [x] **Seer (Tiên tri)**
  - [x] Add to roles.ts with nightOrder=14, actionType='SELECT_PLAYER'
  - [x] Add handler in useNightPhaseActions.ts
  - [x] Create RoleActionPanelSeer.vue (dedicated component)
  - [x] Update RoleActionPanel.vue to use RoleActionPanelSeer
  - [x] Implement investigation logic (werewolf vs villager)
  - [x] Add translations (en.json, vi.json)

- [ ] **Witch (Phù thủy)**
  - [ ] Add to roles.ts with nightOrder=13, actionType='DUAL_OPTION'
  - [ ] Add handler in useNightPhaseActions.ts
  - [ ] Create RoleActionPanelWitch.vue (dedicated component with heal/poison buttons)
  - [ ] Update RoleActionPanel.vue to use RoleActionPanelWitch
  - [ ] Track potion usage (heal uses, poison uses)
  - [ ] Implement heal priority over kill resolution
  - [ ] Add translations

- [ ] **Body Guard (Bảo vệ)**
  - [ ] Add to roles.ts with nightOrder=12, actionType='SELECT_PLAYER'
  - [ ] Add handler in useNightPhaseActions.ts
  - [ ] Create RoleActionPanelBodyguard.vue (dedicated component)
  - [ ] Update RoleActionPanel.vue to use RoleActionPanelBodyguard
  - [ ] Add protection to kill resolution
  - [ ] Cannot protect self (validation)
  - [ ] Add translations

- [ ] **Wolf Cub & Dire Wolf**
  - [ ] Add as separate entries to roles.ts
  - [ ] Integrate into werewolf kill handling (use RoleActionPanelWerewolf)
  - [ ] Add special death effect tracking
  - [ ] Add translations

---

### 🟠 PHASE 2: First Night & Relationships (HIGH)
Status: `NOT_STARTED` | Priority: 🔥🔥

- [ ] **Cupid (Thần tình yêu)**
  - [ ] Add to roles.ts with nightOrder=2, actionType='DUAL_SELECT', nightly='FIRST_NIGHT'
  - [ ] Add handler in useNightPhaseActions.ts
  - [ ] Create RoleActionPanelCupid.vue (dual selection with lover pairing preview)
  - [ ] Update RoleActionPanel.vue to use RoleActionPanelCupid
  - [ ] Store lover pairs in game state
  - [ ] Implement linked death logic (if one dies, other dies too)
  - [ ] Add translations

- [ ] **Minion (Kẻ phản bội)**
  - [ ] Add to roles.ts with nightOrder=6, actionType='ACKNOWLEDGE', nightly='FIRST_NIGHT'
  - [ ] Create RoleActionPanelMinion.vue (show werewolf list)
  - [ ] Update RoleActionPanel.vue to use RoleActionPanelMinion
  - [ ] Show Minion list of werewolves during night 1
  - [ ] Don't count Minion as werewolf for kill actions
  - [ ] Add translations

- [ ] **Mason (Sinh đôi)**
  - [ ] Add to roles.ts with nightOrder=22, actionType='SELECT_PLAYER', nightly='FIRST_NIGHT'
  - [ ] Create RoleActionPanelMason.vue (show other masons)
  - [ ] Update RoleActionPanel.vue to use RoleActionPanelMason
  - [ ] Show all Masons to each other
  - [ ] Create Mason group in game state
  - [ ] Add translations

- [ ] **Drunk (Kẻ say rượu)**
  - [ ] Add to roles.ts with nightOrder=17, actionType='SELECT_PLAYER', nightly='FIRST_NIGHT'
  - [ ] Create RoleActionPanelDrunk.vue (role swap preview)
  - [ ] Update RoleActionPanel.vue to use RoleActionPanelDrunk
  - [ ] Swap roles with target (doesn't know actual role until night 3)
  - [ ] Hide actual role from Drunk until night 3
  - [ ] Add translations

- [ ] **Doppelganger (Người nhân bản)**
  - [ ] Add to roles.ts with nightOrder=3, actionType='SELECT_PLAYER', nightly='FIRST_NIGHT'
  - [ ] Create RoleActionPanelDoppelganger.vue
  - [ ] Update RoleActionPanel.vue to use RoleActionPanelDoppelganger
  - [ ] Track if target dies at night, Doppelganger becomes that role
  - [ ] Add translations

- [ ] **Nostradamis (Nhà tiên tri)**
  - [ ] Add to roles.ts with nightOrder=4, actionType='SELECT_PLAYER', nightly='FIRST_NIGHT'
  - [ ] Create RoleActionPanelNostradamis.vue
  - [ ] Update RoleActionPanel.vue to use RoleActionPanelNostradamis
  - [ ] Store prediction
  - [ ] Reveal if prediction was correct after night resolves
  - [ ] Add translations

- [ ] **Old Hag (Mụ già)**
  - [ ] Add to roles.ts with nightOrder=19, actionType='SELECT_PLAYER'
  - [ ] Create RoleActionPanelOldHag.vue
  - [ ] Update RoleActionPanel.vue to use RoleActionPanelOldHag
  - [ ] Track cursed players (cannot speak during next day)
  - [ ] Add translations

- [ ] **Game State Extensions**
  - [ ] Add `lovers: [playerId[], playerId[]][]` to track lover pairs
  - [ ] Add `possessed: { playerId: string; byRoleId: string }[]` for Doppelganger
  - [ ] Add `cursed: string[]` for Old Hag targets
  - [ ] Add `swapped: { playerId1: string; playerId2: string }[]` for swaps
  - [ ] Add `witchHealUsed: boolean` and `witchPoisonUsed: boolean`
  - [ ] Add `drunkRealRole: string` for actual role if swapped

---

### 🟡 PHASE 3: Special Roles & Advanced Actions (MEDIUM)
Status: `NOT_STARTED` | Priority: 🔥

- [ ] **Vampire (Ma cà rồng)**
  - [ ] Add to roles.ts with nightOrder=7, actionType='SELECT_PLAYER'
  - [ ] Create RoleActionPanelVampire.vue (dusk kill preview)
  - [ ] Update RoleActionPanel.vue to use RoleActionPanelVampire
  - [ ] Implement dusk death (after morning announcement)
  - [ ] Add translations

- [ ] **Cult Leader (Kẻ sùng đạo)**
  - [ ] Add to roles.ts with nightOrder=27, actionType='SELECT_PLAYER'
  - [ ] Create RoleActionPanelCultLeader.vue (recruitment preview)
  - [ ] Update RoleActionPanel.vue to use RoleActionPanelCultLeader
  - [ ] Track recruited players
  - [ ] Add translations

- [ ] **Hunter (Thợ săn) & Huntress (Nữ thợ săn)**
  - [ ] Add to roles.ts with nightly='NEVER' (actions on day when eliminated)
  - [ ] Create RoleActionPanelHunter.vue (for day phase shooting)
  - [ ] Implement shoot action in day phase
  - [ ] Add translations

- [ ] **Aura Seer (Tiên tri vũ trụ)**
  - [ ] Add to roles.ts with nightOrder=42, actionType='SELECT_PLAYER'
  - [ ] Create RoleActionPanelAuraSeer.vue (special role detection)
  - [ ] Update RoleActionPanel.vue to use RoleActionPanelAuraSeer
  - [ ] Add translations

- [ ] **Priest (Mục sư)**
  - [ ] Add to roles.ts with nightOrder=23, actionType='SELECT_PLAYER'
  - [ ] Create RoleActionPanelPriest.vue (protection preview)
  - [ ] Update RoleActionPanel.vue to use RoleActionPanelPriest
  - [ ] Add translations

- [ ] **P.I (Thám tử)**
  - [ ] Add to roles.ts with nightOrder=18, actionType='DUAL_SELECT'
  - [ ] Create RoleActionPanelPI.vue (relationship investigation)
  - [ ] Update RoleActionPanel.vue to use RoleActionPanelPI
  - [ ] Add translations

- [ ] **Troublemaker (Kẻ phá rối)**
  - [ ] Add to roles.ts with nightOrder=20, actionType='DUAL_SELECT'
  - [ ] Create RoleActionPanelTroublemaker.vue (role swap preview)
  - [ ] Update RoleActionPanel.vue to use RoleActionPanelTroublemaker
  - [ ] Add translations

- [ ] **Spellcaster (Pháp sư câm)**
  - [ ] Add to roles.ts with nightOrder=29, actionType='SELECT_PLAYER'
  - [ ] Create RoleActionPanelSpellcaster.vue (silence effect preview)
  - [ ] Update RoleActionPanel.vue to use RoleActionPanelSpellcaster
  - [ ] Add translations

---

### 🟢 PHASE 4: Less Common Roles (LOW)
Status: `NOT_STARTED` | Priority: 🔸

- [ ] **Ghost (Hồn ma)**
  - [ ] Add to roles.ts with nightOrder=1, actionType='TEXT_INPUT'
  - [ ] Allow text message input
  - [ ] Store message in game log
  - [ ] Quản trò reads message to village next morning
  - [ ] Add translations

- [ ] **Bogeyman (Ông kẹ)**
  - [ ] Add to roles.ts with nightOrder=8, actionType='SELECT_PLAYER'
  - [ ] Creates fear effect (UI notification)
  - [ ] Add translations

- [ ] **Leprechaun (Yêu tinh)**
  - [ ] Add to roles.ts with nightOrder=9, actionType='SELECT_PLAYER'
  - [ ] "Steal" something (quản trò decides)
  - [ ] Add translations

- [ ] **Zombie (Xác sống)**
  - [ ] Add to roles.ts with nightOrder=10, actionType='SELECT_PLAYER'
  - [ ] Infect target (effect handled later)
  - [ ] Add translations

- [ ] **Count Dracula (Bá tước Dracula)**
  - [ ] Add to roles.ts with nightOrder=11, actionType='SELECT_PLAYER'
  - [ ] Drain blood from target
  - [ ] Add translations

- [ ] **The Thing (Quái vật kinh dị)**
  - [ ] Add to roles.ts with nightOrder=24, actionType='SELECT_PLAYER'
  - [ ] Choose player to "replace"
  - [ ] Add translations

- [ ] **Virginia Wolf (Virginia Sói) §**
  - [ ] Add to roles.ts with nightOrder=21, actionType='SELECT_PLAYER', nightly='FIRST_NIGHT'
  - [ ] Find another werewolf (dies next night if not found)
  - [ ] Add translations

- [ ] **Sasquatch (Chân to) §**
  - [ ] Add to roles.ts with nightOrder=25, actionType='SELECT_PLAYER', nightly='FIRST_NIGHT'
  - [ ] Find another player to "bond with"
  - [ ] Add translations

- [ ] **Cursed (Kẻ bị nguyền rủa) §**
  - [ ] Add to roles.ts with nightOrder=26, actionType='ACKNOWLEDGE', nightly='FIRST_NIGHT'
  - [ ] If bitten by werewolf, becomes werewolf next night
  - [ ] Track cursed state in game
  - [ ] Add translations

- [ ] **Frankenstein (Quái vật Frankenstein)**
  - [ ] Add to roles.ts with nightOrder=28, actionType='DUAL_OPTION'
  - [ ] Choose: Resurrect or Kill
  - [ ] Add translations

- [ ] **Martyr (Kẻ tử đạo), Lycan (Người lai sói), Time Bandit, Village Idiot, Tanner, Prince, Tough Guy, Diseased, Pacifist, Mayor, Old Man, Apprentice Seer**
  - [ ] Add all to roles.ts with correct nightOrder, actionType='NONE' or appropriate
  - [ ] Implement special effects in game logic
  - [ ] Add translations

---

## 🏗️ Infrastructure Updates Required

### 1. **Data Structure Modifications**
- [ ] Update `Role` interface in app/stores/roles.ts:
  ```typescript
  interface Role {
    // ... existing fields ...
    nightOrder: number           // 1-42 for ordering
    actionType: RoleActionType   // Type of action required
    maxUsesPerGame?: number      // null = unlimited
    displayOrder?: number        // UI display priority
    defaultOrderPosition?: number // Default position in GM-ordered section
  }
  ```

- [ ] Update `RoleActionType` in app/types/game.ts:
  ```typescript
  type RoleActionType = 'SELECT_PLAYER' | 'DUAL_SELECT' | 'TEXT_INPUT' | 'DUAL_OPTION' | 'ACKNOWLEDGE' | 'NONE'
  ```

- [ ] Add to game state in app/stores/game.ts:
  ```typescript
  lovers: Array<[string, string]>          // Lover pairs
  possessed: Map<string, string>           // playerId -> role copying
  cursed: string[]                         // Cursed players
  silenced: string[]                       // Silenced players
  witchHealUsed: boolean
  witchPoisonUsed: boolean
  drunkRealRole: { [playerId: string]: string }
  ```

### 2. **Component Updates**
- [ ] **RoleAction.vue**
  - [ ] Support all actionType variants
  - [ ] Add TEXT_INPUT component
  - [ ] Add DUAL_OPTION component with buttons
  - [ ] Add ACKNOWLEDGE component with confirm button
  - [ ] Proper player filtering (can't select self, can't select dead, etc.)

- [ ] **RoleActionPanel.vue**
  - [ ] Sort activeRoles by `nightOrder`
  - [ ] Filter by `nightly` type (ALWAYS, FIRST_NIGHT, NEVER)
  - [ ] Properly handle role ordering

- [ ] **GameFlow.vue**
  - [ ] Handle night results display
  - [ ] Display lover deaths cascade
  - [ ] Display Doppelganger role changes
  - [ ] Display Cursed transformations

### 3. **Composable Updates**
- [ ] **useNightPhaseActions.ts**
  - [ ] Create individual handlers for 30+ roles
  - [ ] Implement kill resolution with:
    - [ ] Protection override
    - [ ] Multiple kills to same target
    - [ ] Lover cascade deaths
  - [ ] Implement investigation results storage
  - [ ] Track used abilities (Witch potions, etc.)
  - [ ] Handle linked effects (possession, curses)

### 4. **Translations**
- [ ] **en.json**: Add entries for all 30+ roles and their descriptions
- [ ] **vi.json**: Add Vietnamese translations for all roles

---

## 🧪 Testing Checklist

### Phase 1 Testing
- [ ] Test Seer investigation (werewolf detection)
- [ ] Test Witch heal (saves player from kill)
- [ ] Test Witch poison (kills player)
- [ ] Test multiple kills resolving to single death
- [ ] Test protection preventing kills
- [ ] Test kill + poison on same target (poison wins)

### Phase 2 Testing
- [ ] Test Cupid lovers (both die if one dies)
- [ ] Test Minion revealed to werewolves
- [ ] Test Mason finding other Masons
- [ ] Test Drunk role swap
- [ ] Test Doppelganger copying
- [ ] Test Old Hag curse preventing speech

### Phase 3 Testing
- [ ] Test Vampire dusk death timing
- [ ] Test Cult Leader recruitment
- [ ] Test Hunter shooting on day elimination
- [ ] Test Aura Seer detection
- [ ] Test P.I relationship detection

### Edge Cases
- [ ] Dead players can't be targeted
- [ ] Self-targeting validation
- [ ] Multiple protection sources
- [ ] Role changes mid-game (Doppelganger, Cursed)
- [ ] Game state persistence across phases

---

## 📊 Progress Tracking

```
Phase 1 (CRITICAL):    ░░░░░░░░░░░░░░░░░░░░ 0%
Phase 2 (HIGH):        ░░░░░░░░░░░░░░░░░░░░ 0%
Phase 3 (MEDIUM):      ░░░░░░░░░░░░░░░░░░░░ 0%
Phase 4 (LOW):         ░░░░░░░░░░░░░░░░░░░░ 0%
Infrastructure:        ░░░░░░░░░░░░░░░░░░░░ 0%
Translations:          ░░░░░░░░░░░░░░░░░░░░ 0%
─────────────────────────────────────────
TOTAL:                 ░░░░░░░░░░░░░░░░░░░░ 0%
```

---

## 🎯 Next Steps

1. ✅ Read current codebase structure (COMPLETED)
2. ✅ Create comprehensive specification (COMPLETED)
3. ⏭️ **START HERE**: Update Role interface and add Phase 1 roles to roles.ts
4. Update types/game.ts with new action types and state
5. Implement Phase 1 action handlers in useNightPhaseActions.ts
6. Update RoleAction.vue to support all action types
7. Test Phase 1 end-to-end
8. Proceed with Phase 2, 3, 4 in priority order


