# Werewolves Monitor - Night Phase Features: Complete Summary

## 📌 Executive Summary

Bạn đang phát triển một Game Master tool cho trò chơi Werewolves. Hiện tại đã hoàn thành tính năng cơ bản cho Werewolf vào ban đêm. Tôi đã phân tích codebase và tạo một spec chi tiết để phát triển tính năng cho 30+ nhân vật còn lại.

### Documents Created:
1. **NIGHT_PHASE_SPEC.md** - Specification chi tiết cho mỗi nhân vật (42 role)
2. **NIGHT_PHASE_CHECKLIST.md** - Checklist triển khai theo 4 phase
3. **IMPLEMENTATION_GUIDE.md** - Hướng dẫn kỹ thuật chi tiết
4. **FILES_TO_MODIFY.md** - Danh sách file cần sửa và thay đổi
5. **SUMMARY.md** (file này) - Tổng kết lại mọi thứ

---

## 🎯 What's Needed

### Phase 1: CRITICAL (Ưu Tiên Cao Nhất)
**Estimated: 40-60 hours**

These are core investigation/protection roles needed for basic gameplay:

1. **Seer** (Tiên tri) - Investigate: is target werewolf?
2. **Witch** (Phù thủy) - Heal/Poison with limited uses
3. **Body Guard** (Bảo vệ) - Protect player from death
4. **Wolf Cub & Dire Wolf** - Enhanced werewolf variants

### Phase 2: HIGH (Quan Trọng)
**Estimated: 50-80 hours**

Core relationship & first-night mechanics:

1. **Cupid** - Create lover pairs (linked deaths)
2. **Minion** - Learn werewolf identity
3. **Mason** - Find other masons
4. **Drunk** - Swap roles
5. **Old Hag** - Curse players
6. **Doppelganger** - Copy role if target dies
7. **Nostradamis** - Predict deaths

### Phase 3: MEDIUM (Trung Bình)
**Estimated: 60-100 hours**

Special roles and advanced mechanics:

1. **Vampire** - Dusk deaths
2. **Cult Leader** - Recruit players
3. **Hunter** - Shoot on elimination
4. **Aura Seer** - Detect special roles
5. **P.I** - Investigate relationships
6. **Spellcaster** - Silence players
7. **Troublemaker** - Swap two players
8. **Priest** - Protect (limited uses)

### Phase 4: LOW (Ít Dùng)
**Estimated: 40-60 hours**

Less common and niche roles:

1. **Ghost** - Send messages
2. **Bogeyman, Leprechaun, Zombie, Count Dracula** - Various special effects
3. **Virginia Wolf, Sasquatch, Cursed** - First-night specials
4. **The Thing, Frankenstein** - Complex mechanics
5. **Remaining optional roles** - Martyr, Lycan, Time Bandit, etc.

---

## 🏗️ Architecture Changes Needed

### 1. Data Model Updates

**Role Interface** (add 5 new fields):
```typescript
interface Role {
  nightOrder: number           // 1-42 for ordering
  actionType: RoleActionType   // Type of action
  maxUsesPerGame?: number      // Limited uses tracking
  displayOrder?: number        // UI priority
  defaultOrderPosition?: number // Position in GM section
}
```

**Game State** (add 8 new fields):
```typescript
const lovers = ref<[string, string][]>([])      // Lover pairs
const possessed = ref<Map<string, string>>()    // Possession tracking
const cursed = ref<string[]>([])                // Cursed players
const silenced = ref<string[]>([])              // Silenced from speaking
const witchHealUsed = ref(false)                // Track ability usage
const witchPoisonUsed = ref(false)
const drunkRealRole = ref({})
```

### 2. Component Changes

**RoleAction.vue**:
- Support 6 action types (SELECT_PLAYER, DUAL_SELECT, TEXT_INPUT, DUAL_OPTION, ACKNOWLEDGE, NONE)
- Add validation (no dead targets, no self-targeting, etc.)
- Show ability usage status

**RoleActionPanel.vue**:
- Sort roles by `nightOrder`
- Filter by `nightly` type (ALWAYS, FIRST_NIGHT, NEVER)
- Minor updates only

### 3. Logic Updates

**useNightPhaseActions.ts**:
- Add 30+ role handlers
- Implement kill resolution with priorities:
  1. Protection override
  2. Multiple kills to same target
  3. Lover cascades
  4. Role changes (Doppelganger)
  5. Curse activation
- Track ability usage (Witch potions, etc.)

### 4. Translation Additions

Add entries for:
- 42 roles (name + description in English & Vietnamese)
- Action descriptions
- Status messages

---

## 📊 Implementation Roadmap

### Week 1-2: Foundation (20 hours)
- [ ] Update Role interface & types
- [ ] Add Phase 1 roles to roles.ts
- [ ] Update game store with new state
- [ ] Create base components for different action types

### Week 2-3: Phase 1 (20 hours)
- [ ] Implement Seer investigation
- [ ] Implement Witch heal/poison
- [ ] Implement Body Guard protection
- [ ] Add Wolf Cub & Dire Wolf
- [ ] Test Phase 1 end-to-end

### Week 3-4: Phase 2 (25 hours)
- [ ] Implement Cupid lovers
- [ ] Implement Minion introduction
- [ ] Implement Mason groups
- [ ] Implement Drunk role swap
- [ ] Implement Old Hag curses
- [ ] Implement Doppelganger
- [ ] Implement Nostradamis

### Week 4-5: Phase 3 (30 hours)
- [ ] Implement Vampire
- [ ] Implement Cult Leader
- [ ] Implement Hunter/Huntress
- [ ] Implement remaining Phase 3 roles
- [ ] Implement action resolution conflicts

### Week 5-6: Phase 4 (20 hours)
- [ ] Implement remaining roles
- [ ] Add edge case handling
- [ ] Optimize performance

### Week 6: Testing & Polish (10 hours)
- [ ] Integration testing
- [ ] E2E testing
- [ ] Polish UI/UX
- [ ] Final bug fixes

**Total Estimated Time**: 200-250 hours (~5-6 weeks at 40-50 hours/week)

---

## 🚀 Quick Start

### Immediate Next Steps (What to do first):

1. **Read the documents** (this will take 1-2 hours):
   - NIGHT_PHASE_SPEC.md - Full specification
   - IMPLEMENTATION_GUIDE.md - Technical details
   - FILES_TO_MODIFY.md - File-by-file guide

2. **Setup Phase 1** (2-3 hours):
   - Update Role interface in roles.ts
   - Add `nightOrder` and `actionType` to all existing roles
   - Add Phase 1 roles (Seer, Witch, Body Guard, Wolf Cub, Dire Wolf)
   - Update types/game.ts with RoleActionType

3. **Setup Components** (2-3 hours):
   - Create RoleActionDualSelect component
   - Create RoleActionDualOption component
   - Extend RoleAction.vue to support all types

4. **Implement Phase 1 Logic** (4-6 hours):
   - Add handlers to useNightPhaseActions.ts
   - Update RoleActionPanel.vue sorting
   - Test basic functionality

---

## 📚 Document Reference

### NIGHT_PHASE_SPEC.md
**Purpose**: Detailed specification for each of 42 roles

**Contains**:
- Complete role order (30 roles listed)
- Detailed action description for each role
- Action type and requirements
- UI/UX specifications
- Database persistence notes
- Action resolution priority
- Implementation checklist

**When to use**: When implementing a specific role

---

### NIGHT_PHASE_CHECKLIST.md
**Purpose**: Actionable checklist for tracking progress

**Contains**:
- 4 implementation phases with priorities
- Specific tasks for each role
- Infrastructure tasks
- Testing checklist
- Progress tracking

**When to use**: To track what's done vs what's pending

---

### IMPLEMENTATION_GUIDE.md
**Purpose**: Technical implementation details

**Contains**:
- Architecture overview
- Step-by-step implementation instructions
- Code examples for each component
- Action resolution logic
- Testing strategies
- Performance considerations
- Common pitfalls
- Helper functions

**When to use**: When actually writing code

---

### FILES_TO_MODIFY.md
**Purpose**: Detailed file-by-file modification guide

**Contains**:
- List of all files to modify
- Specific line numbers (where known)
- Exact changes needed for each file
- Dependency graph
- Implementation order
- Estimated line count changes

**When to use**: Planning which file to edit next

---

## ❓ FAQ & Clarifications

### Q: Do I need to implement all 42 roles?
**A**: No, only implement the roles that are in your `defaultRoles` array in roles.ts. Currently you only have `Villager` and `Werewolf` uncommented. Most other roles are commented out.

### Q: What's the difference between nightOrder and nightly?
**A**: 
- `nightly`: When the role acts (ALWAYS, FIRST_NIGHT, NEVER)
- `nightOrder`: In what sequence they act (1-42)

### Q: How do I handle limited abilities like Witch potions?
**A**: Use `maxUsesPerGame` field and track in game state (`witchHealUsed`, `witchPoisonUsed`)

### Q: What about roles that don't have night actions?
**A**: Set `actionType: 'NONE'` and `nightly: 'NEVER'` (e.g., Hunter who shoots on day elimination)

### Q: How do I handle role changes (Doppelganger, Cursed)?
**A**: Update game state after night resolution:
```typescript
if (doppelgangerTarget.died && doppelgangerTarget.role !== 'VILLAGER') {
  gameStore.playerRoles[doppelgangePlayerId] = doppelgangerTarget.role
}
```

### Q: What's the performance impact?
**A**: Minimal - using Pinia for state management, computed properties for sorting. Main concern is tracking too many relationships (lovers, curses) but with typical 10-20 players it's fine.

---

## 🛠️ Tools & Dependencies

**No new dependencies needed** - All functionality can be implemented with existing stack:
- Vue 3 Composition API
- Pinia (state management)
- Tailwind CSS (styling)
- TypeScript

---

## 📞 Support Resources

**Existing Code to Reference**:
- Werewolf implementation in `RoleActionPanelWerewolf.vue` - Good example of role-specific UI
- Game store in `stores/game.ts` - Shows state management patterns
- useNightPhaseActions.ts - Shows action processing patterns

**Key Files to Study**:
1. app/components/RoleActionPanelWerewolf.vue (145 lines) - Reference for special role UI
2. app/composables/useNightPhaseActions.ts (269 lines) - Reference for action handlers
3. app/stores/game.ts (343 lines) - Reference for state management

---

## 🎉 Success Criteria

Phase 1 Complete means:
- ✅ Seer can investigate players
- ✅ Witch can heal/poison with proper limits
- ✅ Body Guard can protect
- ✅ All kill/protection conflicts resolve correctly
- ✅ Night results display properly
- ✅ No console errors

Full Implementation Complete means:
- ✅ All 30+ roles can be selected and used
- ✅ All action types work correctly
- ✅ All relationships (lovers, possession, curses) work
- ✅ Full night phase executes without errors
- ✅ UI is user-friendly for Game Master
- ✅ All translations working

---

## 📋 Quick Command Reference

**To understand current structure**:
```bash
# Check role definitions
grep -n "nightOrder\|actionType" app/stores/roles.ts

# Find action handlers
grep -n "handleWerewolf\|handleSeer" app/composables/useNightPhaseActions.ts

# See game state
grep -n "ref<" app/stores/game.ts
```

---

## ✅ Current Status

| Component | Status | Notes |
|-----------|--------|-------|
| Werewolf | ✅ DONE | Already implemented |
| Seer | ⏳ TODO | Phase 1 |
| Witch | ⏳ TODO | Phase 1 |
| Body Guard | ⏳ TODO | Phase 1 |
| All Others | ⏳ TODO | Phases 2-4 |

---

## 🎓 Next Steps

1. **Read NIGHT_PHASE_SPEC.md** fully (1 hour)
2. **Read IMPLEMENTATION_GUIDE.md** (30 minutes)
3. **Read FILES_TO_MODIFY.md** (30 minutes)
4. **Start with roles.ts modifications** (Phase 1 setup)
5. **Implement Phase 1 roles one by one**
6. **Test after each role**
7. **Move to Phase 2**

---

**Created**: November 15, 2025
**Spec Version**: 1.0
**Target Game**: Werewolves (Ultimate) - Game Master Tool
**Frontend**: Nuxt 3 + Vue 3 + TypeScript


