# Night Phase Implementation Task Prompt

## 🎯 Persona/Role

You are a **Werewolves Game Master Application Developer** tasked with implementing the night phase mechanic for a Vue 3/Nuxt 3 game master tool. You have access to a comprehensive 3,000+ line specification covering 42 game roles, their actions, ordering, and interactions.

---

## 📖 Context

### Project Overview
The **Werewolves Monitor** is a Game Master tool for the Werewolves party game. The application currently supports basic werewolf mechanics (player registration, basic kill action). You are implementing an advanced **Night Phase system** that allows a game master to orchestrate 30-42 complex roles with interdependent actions, state tracking, and real-time resolution.

### Current Architecture
```
app/
├── stores/
│   ├── roles.ts          # Role definitions (add nightOrder, actionType)
│   └── game.ts           # Game state (add lovers, cursed, etc.)
├── types/
│   └── game.ts           # TypeScript types
├── composables/
│   └── useNightPhaseActions.ts  # Action handlers
├── components/
│   ├── RoleAction.vue          # UI for single role action
│   └── RoleActionPanel.vue     # Night phase orchestrator
└── i18n/locales/
    ├── en.json
    └── vi.json
```

### Key Requirements
1. **42 total roles** across 4 priority phases
2. **6 action types**: SELECT_PLAYER, DUAL_SELECT, TEXT_INPUT, DUAL_OPTION, ACKNOWLEDGE, NONE
3. **Night order sequencing**: Roles called in specific order (nightOrder 1-42)
4. **State persistence**: Lovers, curses, possessions tracked across phases
5. **Multi-language**: English + Vietnamese translations required
6. **Phase-based execution**: FIRST_NIGHT only, ALWAYS, or NEVER patterns

### Available Documentation
Reference these files from project root (all starting with `NIGHT_PHASE_*`):

| File | Purpose | Use It For |
|------|---------|-----------|
| NIGHT_PHASE_START_HERE.md | Project overview | Understanding timeline & phases |
| NIGHT_PHASE_SPEC.md | Complete role specifications | Role details, nightOrder, actionType, mechanics |
| NIGHT_PHASE_QUICK_REFERENCE.md | Quick lookup tables | Code patterns, action types, data structures |
| NIGHT_PHASE_IMPLEMENTATION_GUIDE.md | Technical how-to | Architecture patterns & examples |
| NIGHT_PHASE_FILES_TO_MODIFY.md | File-by-file guide | Which files to edit & what changes |
| NIGHT_PHASE_CHECKLIST.md | Task tracker | Progress tracking & detailed TODOs |
| NIGHT_PHASE_GUIDE_VIETNAMESE.md | Vietnamese docs | Vietnamese explanations & translations |
| NIGHT_PHASE_README.md | Navigation hub | Central index of all documents |

---

## 🛠️ Task Definition

Implement night phase features for the Werewolves Monitor application following a **4-phase priority system**.

### Task Breakdown by Phase

#### **PHASE 1 (CRITICAL)** - Foundation & Core Mechanics [40-60 hours]
**Must complete before Phase 2**

Roles:
- **Seer** (nightOrder=14): Investigate player → "werewolf" or "villager"
- **Witch** (nightOrder=13): DUAL_OPTION action → heal/poison/skip (1 use each per game)
- **Body Guard** (nightOrder=12): SELECT_PLAYER → protect from kills
- **Wolf Cub & Dire Wolf**: Werewolf variants with special deaths

Deliverables:
- [ ] Update Role interface (add nightOrder, actionType, maxUsesPerGame)
- [ ] Add 5 Phase 1 roles to roles.ts with metadata
- [ ] Implement handlers in useNightPhaseActions.ts
- [ ] Update RoleAction.vue to support SELECT_PLAYER + DUAL_OPTION
- [ ] Add protection logic to kill resolution
- [ ] Add translations (en.json, vi.json)
- [ ] Test end-to-end with 5-player game

---

#### **PHASE 2 (HIGH)** - First Night & Relationships [50-80 hours]
**After Phase 1 complete**

Roles:
- **Cupid** (nightOrder=2, FIRST_NIGHT): DUAL_SELECT → create lovers (death cascade)
- **Minion** (nightOrder=6, FIRST_NIGHT): ACKNOWLEDGE → show werewolves
- **Mason** (nightOrder=22, FIRST_NIGHT): SELECT_PLAYER → find other Masons
- **Drunk** (nightOrder=17, FIRST_NIGHT): SELECT_PLAYER → role swap
- **Doppelganger** (nightOrder=3, FIRST_NIGHT): SELECT_PLAYER → copy role if target dies
- **Nostradamis** (nightOrder=4, FIRST_NIGHT): SELECT_PLAYER → predict death
- **Old Hag** (nightOrder=19): SELECT_PLAYER → curse (silence on day)

Deliverables:
- [ ] Add game state: lovers, possessed, cursed, swapped, witchHealUsed/Poison, drunkRealRole
- [ ] Implement FIRST_NIGHT filtering in RoleActionPanel
- [ ] Handle lover cascade (if one dies, other dies)
- [ ] Implement role swap mechanics (Drunk doesn't know real role until night 3)
- [ ] Add Doppelganger possession state
- [ ] Test lover death, mason groups, drunk reveal

---

#### **PHASE 3 (MEDIUM)** - Advanced Roles [60-100 hours]
**After Phase 2 complete**

Roles:
- **Vampire** (nightOrder=7): Kill at dusk (separate timing)
- **Cult Leader** (nightOrder=27): Recruit to faction
- **Hunter & Huntress** (nightly=NEVER): Shoot on day elimination
- **Aura Seer** (nightOrder=42): Detect special roles
- **P.I** (nightOrder=18): DUAL_SELECT → investigate relationship
- **Troublemaker** (nightOrder=20): DUAL_SELECT → swap roles
- **Spellcaster** (nightOrder=29): Silence target on day
- **Priest** (nightOrder=23): Limited protection

Deliverables:
- [ ] Add dusk death timing for Vampire
- [ ] Implement cult faction system
- [ ] Add day-phase shoot mechanics for Hunter
- [ ] Implement dual-select investigations
- [ ] Add role-swap logic (Troublemaker)
- [ ] Implement silence effect for day discussions

---

#### **PHASE 4 (LOW)** - Remaining Roles [40-60 hours]
**After Phase 3 complete**

Roles: Ghost, Bogeyman, Leprechaun, Zombie, Count Dracula, The Thing, Virginia Wolf, Sasquatch, Cursed, Frankenstein, and 12 optional roles (Martyr, Lycan, Time Bandit, etc.)

Deliverables:
- [ ] Add all Phase 4 roles to roles.ts
- [ ] Implement special mechanics as needed
- [ ] Add translations
- [ ] Polish UI/UX
- [ ] Final comprehensive testing

---

## 📋 Output/Format

### What To Produce

1. **Code Changes** in target files:
   - app/stores/roles.ts (add role definitions)
   - app/stores/game.ts (add state fields)
   - app/types/game.ts (add types)
   - app/composables/useNightPhaseActions.ts (add handlers)
   - app/components/RoleAction.vue (add UI components)
   - app/components/RoleActionPanel.vue (sorting/filtering)
   - i18n/locales/en.json (translations)
   - i18n/locales/vi.json (Vietnamese)

2. **Documentation** (in chat):
   - Summary of changes per file
   - Key implementation patterns used
   - Testing scenarios completed

3. **Status Updates**:
   - Phase completion checklist
   - Bugs encountered & fixed
   - Performance considerations

### Example Output Structure

```typescript
// app/stores/roles.ts
// ADD: nightOrder, actionType to Role interface
// ADD: 5 new roles with metadata

// app/types/game.ts
// ADD: RoleActionType = 'SELECT_PLAYER' | 'DUAL_SELECT' | ...

// app/stores/game.ts
// ADD: lovers, possessed, cursed, silenced state refs

// app/composables/useNightPhaseActions.ts
// ADD: handleSeerInvestigation, handleWitchAction, handleBodyGuardProtection

// app/components/RoleAction.vue
// ADD: Support for SELECT_PLAYER, DUAL_OPTION, TEXT_INPUT components
```

---

## 📚 Examples

### Example 1: Implementing Seer (SELECT_PLAYER type)
```typescript
// In roles.ts
{
  id: 'seer',
  name: 'Seer',
  nameVi: 'Tiên Tri',
  nightOrder: 14,
  actionType: 'SELECT_PLAYER',
  nightly: 'ALWAYS',
  // ... other fields
}

// In useNightPhaseActions.ts
case 'seer':
  const targetRole = getPlayerRole(action.targetPlayerId);
  const result = targetRole.faction === 'WEREWOLF' ? 'werewolf' : 'villager';
  storeInvestigationResult('seer', action.targetPlayerId, result);
  break;
```

### Example 2: Implementing Cupid (DUAL_SELECT + relationships)
```typescript
// In roles.ts
{
  id: 'cupid',
  name: 'Cupid',
  nightOrder: 2,
  actionType: 'DUAL_SELECT',
  nightly: 'FIRST_NIGHT',
  // ... other fields
}

// In game.ts
const lovers = ref<Array<[string, string]>>([]);

// In useNightPhaseActions.ts
case 'cupid':
  lovers.value.push([action.targetPlayerId1, action.targetPlayerId2]);
  // On death: if one dies, kill the other
  break;
```

---

## ⚙️ Constraints & Requirements

### Must Follow
✅ Use existing Pinia store architecture (roles.ts, game.ts)  
✅ Follow Vue 3 Composition API patterns  
✅ Maintain TypeScript strict mode  
✅ Support Tailwind CSS for UI (no raw CSS)  
✅ Maintain English + Vietnamese translations  
✅ Respect nightOrder sequencing (1-42)  
✅ Filter roles by nightly type (FIRST_NIGHT, ALWAYS, NEVER)  
✅ Handle edge cases (dead players, self-targeting, missing state)  
✅ Persist state across night phases  

### Must NOT
❌ Create unused exports or dead code  
❌ Modify already-working werewolf kill mechanics  
❌ Use deprecated Vue 2 patterns  
❌ Skip player alive validation  
❌ Forget nightOrder on any role  
❌ Mix action types (role must have one actionType)  
❌ Create markdown documentation files (auto-generated docs only)  

### Performance Requirements
- Role actions must resolve in <1s per action
- Night phase with 12 players shouldn't exceed 30s total
- State persistence via Pinia should be automatic

---

## 🧪 Testing & Validation

### Minimum Test Coverage Per Phase

**Phase 1 Validation**:
```
✓ Seer investigates player (returns werewolf or villager)
✓ Witch heals killed player (saves life)
✓ Witch poisons player (causes death)
✓ Body Guard protects (prevents kill)
✓ Protection beats kill (protected player survives)
✓ Multiple kills resolve to single death
✓ Cannot protect self (validation)
✓ Cannot select dead players (validation)
```

**Phase 2 Validation**:
```
✓ Lovers created and stored
✓ One lover dies → other dies
✓ Minion sees werewolves
✓ Masons find each other
✓ Drunk role swap works (real role hidden)
✓ Doppelganger copies on target death
✓ Old Hag curse prevents speech
```

---

## 🚦 Success Criteria

### Phase 1 Complete When
- [ ] All 5 Phase 1 roles functional (Seer, Witch, Body Guard, Wolf Cub, Dire Wolf)
- [ ] nightOrder sorting works (roles appear 12, 13, 14 in order)
- [ ] DUAL_OPTION component displays correctly
- [ ] Protection overrides kills in all cases
- [ ] Translations complete for all roles
- [ ] 5-player test game runs without errors

### Overall Success When
- [ ] All 42 roles implemented (4 phases complete)
- [ ] State persistence works across phases
- [ ] All relationships function (lovers, curses, possession)
- [ ] 12+ player games run smoothly
- [ ] UI responsive and user-friendly
- [ ] Comprehensive testing passed

---

## 📞 Documentation Navigation

**Need to understand a role?** → `NIGHT_PHASE_SPEC.md` (line 70+)  
**Need code patterns?** → `NIGHT_PHASE_QUICK_REFERENCE.md` (line 150+)  
**Need file change details?** → `NIGHT_PHASE_FILES_TO_MODIFY.md`  
**Need implementation steps?** → `NIGHT_PHASE_IMPLEMENTATION_GUIDE.md`  
**Tracking progress?** → `NIGHT_PHASE_CHECKLIST.md`  
**Need Vietnamese?** → `NIGHT_PHASE_GUIDE_VIETNAMESE.md`  

---

## ⏱️ Time Estimates

| Phase | Roles | Time | Priority |
|-------|-------|------|----------|
| 1 | 5 roles | 40-60h | 🔴 CRITICAL |
| 2 | 7 roles | 50-80h | 🟠 HIGH |
| 3 | 8 roles | 60-100h | 🟡 MEDIUM |
| 4 | 22 roles | 40-60h | 🟢 LOW |
| **Total** | **42 roles** | **200-250h** | — |

---

## 🎯 Next Immediate Steps

1. **Read**: NIGHT_PHASE_START_HERE.md (5 min) - Understand big picture
2. **Read**: NIGHT_PHASE_SPEC.md sections on Phase 1 roles (30 min) - Know what to build
3. **Read**: NIGHT_PHASE_QUICK_REFERENCE.md data structures (15 min) - Know how to code
4. **Implement**: Phase 1 roles following NIGHT_PHASE_FILES_TO_MODIFY.md
5. **Test**: Validate Phase 1 before moving to Phase 2

---

**Version**: 1.0  
**Created**: November 15, 2025  
**Status**: Ready for Implementation  
**Total Documentation**: 3,000+ lines across 9 reference docs

