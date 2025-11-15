# 🌙 Night Phase Features - Complete Documentation

## 📋 What This Is

A complete specification, checklist, and implementation guide for adding night phase features to your Werewolves Game Master application. Includes 30+ new roles with detailed action handlers.

---

## 📚 Documentation Index

### 🎯 START HERE
**→ [SUMMARY.md](SUMMARY.md)** (Executive Summary)
- Project overview
- What's needed
- Architecture changes
- Implementation roadmap
- FAQ & clarifications
- **Read time**: 15-20 minutes

---

### 📖 Detailed Specifications

**→ [NIGHT_PHASE_SPEC.md](NIGHT_PHASE_SPEC.md)** (Full Specification)
- Complete role order (1-42)
- Detailed description for each role
- Action types and requirements
- UI specifications
- Database persistence notes
- **Length**: 400+ lines
- **Read time**: 60-90 minutes
- **When to use**: When implementing a specific role

**→ [FILES_TO_MODIFY.md](FILES_TO_MODIFY.md)** (File-by-File Guide)
- List of all files to modify
- Specific line numbers
- Exact changes needed
- Dependency graph
- Implementation order
- **Length**: 250+ lines
- **Read time**: 30-45 minutes
- **When to use**: When planning which file to edit

**→ [IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md)** (Technical Details)
- Architecture overview
- Step-by-step instructions
- Code examples
- Action resolution logic
- Testing strategies
- Common pitfalls
- **Length**: 300+ lines
- **Read time**: 45-60 minutes
- **When to use**: When actually writing code

---

### ✅ Actionable Checklists

**→ [NIGHT_PHASE_CHECKLIST.md](NIGHT_PHASE_CHECKLIST.md)** (Implementation Checklist)
- 4 implementation phases
- Specific tasks per role
- Infrastructure tasks
- Testing checklist
- Progress tracking
- **Length**: 200+ lines
- **When to use**: To track what's done vs pending

**→ [QUICK_REFERENCE.md](QUICK_REFERENCE.md)** (Quick Reference Card)
- At-a-glance summaries
- Phase priorities
- Action type reference table
- Night order quick reference
- Data structure cheatsheet
- Common mistakes to avoid
- Pro tips
- **Length**: 500+ lines
- **When to use**: While coding, as a quick lookup

---

## 🚀 Quick Start (5 Minutes)

### For the Impatient Developer

1. **You have 5 minutes?**
   - Read the first section of [SUMMARY.md](SUMMARY.md)

2. **You have 30 minutes?**
   - Read [SUMMARY.md](SUMMARY.md) completely

3. **You have 2 hours?**
   - Read [SUMMARY.md](SUMMARY.md) + [QUICK_REFERENCE.md](QUICK_REFERENCE.md)

4. **You're ready to code?**
   - Read [IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md) + [FILES_TO_MODIFY.md](FILES_TO_MODIFY.md)
   - Use [QUICK_REFERENCE.md](QUICK_REFERENCE.md) as bookmark while coding
   - Reference [NIGHT_PHASE_SPEC.md](NIGHT_PHASE_SPEC.md) for specific role details

---

## 📊 Documentation Overview

| File | Purpose | Length | Time | Audience |
|------|---------|--------|------|----------|
| SUMMARY.md | Executive overview | 300 lines | 15 min | Everyone |
| NIGHT_PHASE_SPEC.md | Full specification | 400 lines | 90 min | Implementers |
| IMPLEMENTATION_GUIDE.md | Technical guide | 300 lines | 45 min | Developers |
| FILES_TO_MODIFY.md | File modifications | 250 lines | 30 min | Developers |
| NIGHT_PHASE_CHECKLIST.md | Task checklist | 200 lines | - | Project managers |
| QUICK_REFERENCE.md | Quick lookup | 500 lines | - | Developers (bookmark) |

**Total Documentation**: ~2000 lines

---

## 🎯 What You'll Build

### Current State ✅
```
Werewolf - Basic kill mechanic
```

### After Phase 1 🔴
```
+ Seer (investigation)
+ Witch (heal/poison)
+ Body Guard (protection)
+ Wolf Cub & Dire Wolf (variants)
```

### After Phase 2 🟠
```
+ Cupid (lovers)
+ Minion (reveal)
+ Mason (group)
+ Drunk (swap)
+ Old Hag (curse)
+ Doppelganger (copy)
+ Nostradamis (predict)
```

### After Phase 3 🟡
```
+ Vampire, Cult Leader, Hunter, Aura Seer
+ P.I, Spellcaster, Troublemaker, Priest
+ 8 more special roles
```

### After Phase 4 🟢
```
+ Ghost, Bogeyman, Leprechaun, Zombie
+ The Thing, Virginia Wolf, Sasquatch, Cursed
+ Frankenstein + 8 remaining roles
```

---

## 🏗️ Architecture Changes

### Data Model
- Add `nightOrder` field to Role interface
- Add `actionType` field to Role interface  
- Add 8 new fields to game state (lovers, possessed, cursed, etc.)

### Components
- Extend `RoleAction.vue` to support 6 action types
- Update `RoleActionPanel.vue` to sort by nightOrder
- No breaking changes to existing components

### Logic
- Add 30+ role handlers to `useNightPhaseActions.ts`
- Implement kill resolution with priorities
- Track ability usage (Witch potions, etc.)

### Translations
- Add 42 role names & descriptions (English & Vietnamese)
- Add action descriptions
- No new locales needed

---

## ⏱️ Implementation Timeline

| Phase | Roles | Hours | Week |
|-------|-------|-------|------|
| Foundation | Infrastructure | 20 | 1-2 |
| Phase 1 | Seer, Witch, Body Guard, Wolf Cub, Dire Wolf | 20 | 2-3 |
| Phase 2 | Cupid, Minion, Mason, Drunk, Old Hag, Doppelganger, Nostradamis | 25 | 3-4 |
| Phase 3 | Vampire, Cult, Hunter, Aura Seer, P.I, Spellcaster, Troublemaker, Priest | 30 | 4-5 |
| Phase 4 | Ghost, Bogeyman, Leprechaun, Zombie, The Thing, Virginia Wolf, etc. | 20 | 5-6 |
| Testing & Polish | E2E, bug fixes, optimization | 10 | 6 |
| **TOTAL** | **30+ roles** | **225 hours** | **6 weeks** |

---

## 🎮 Current File Structure

```
app/
├── stores/
│   ├── roles.ts          ← Add roles here
│   ├── players.ts
│   └── game.ts           ← Add state here
├── components/
│   ├── RoleAction.vue    ← Extend for action types
│   ├── RoleActionPanel.vue
│   ├── RoleActionPanelWerewolf.vue
│   └── ...
├── composables/
│   └── useNightPhaseActions.ts  ← Add handlers here
├── types/
│   └── game.ts           ← Add types here
└── pages/
    └── game.vue

i18n/
└── locales/
    ├── en.json           ← Add translations
    └── vi.json           ← Add translations
```

---

## 🧪 Testing Strategy

### Unit Tests
- Test role definitions have required fields
- Test action processing for each role
- Test action resolution priorities

### Integration Tests
- Test full night phase with multiple roles
- Test protection vs kill resolution
- Test lover death cascades
- Test role changes (Doppelganger, Cursed)

### E2E Tests
- Test from UI perspective
- Test all action type UI components
- Test end-to-end night -> day transition

---

## ⚠️ Critical Paths

### Must-Have Before Moving Forward
1. ✅ Role interface updated with nightOrder
2. ✅ Game state extended with effects tracking
3. ✅ RoleActionPanel sorts by nightOrder
4. ✅ Action handlers for each role type
5. ✅ Kill resolution with protection priority
6. ✅ No dead players can be targeted
7. ✅ Limited abilities tracked (Witch potions)

### Success Criteria Per Phase

**Phase 1 ✅**
- Seer can investigate
- Witch can heal/poison
- Body Guard can protect
- All action types work
- No conflicts in resolution

**Phase 2 ✅**
- Lovers work (both die if one dies)
- Minion sees werewolves
- Mason groups work
- Drunk role swap works

**Phase 3 ✅**
- Vampire dusk death works
- Cult recruitment works
- Hunters can shoot
- All investigations work

**Phase 4 ✅**
- Ghost messages display
- All special effects work
- No regressions in previous phases

---

## 🚨 High-Risk Areas

1. **Kill Resolution**: Multiple kills, protections, healing
2. **Role Changes**: Doppelganger, Cursed, Drunk
3. **Linked Effects**: Lovers, possession, curses
4. **Ability Tracking**: Limited uses (Witch potions)
5. **First Night**: Only call FIRST_NIGHT roles on night 1
6. **Player Validation**: Cannot target dead/self players

---

## 📞 How to Use This Documentation

### "I want to understand what needs to be done"
→ Read [SUMMARY.md](SUMMARY.md)

### "I want to understand each role in detail"
→ Read [NIGHT_PHASE_SPEC.md](NIGHT_PHASE_SPEC.md)

### "I need to know which files to modify"
→ Read [FILES_TO_MODIFY.md](FILES_TO_MODIFY.md)

### "I'm ready to code and need guidance"
→ Read [IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md)

### "I need a quick reference while coding"
→ Use [QUICK_REFERENCE.md](QUICK_REFERENCE.md)

### "I need to track progress"
→ Use [NIGHT_PHASE_CHECKLIST.md](NIGHT_PHASE_CHECKLIST.md)

### "I want everything in one place"
→ Bookmark this file and reference the index above

---

## 🎓 Suggested Reading Order

```
START
  ↓
SUMMARY.md (20 min)
  ↓
QUICK_REFERENCE.md (30 min)
  ↓
Ready to code? ← YES → IMPLEMENTATION_GUIDE.md (45 min)
  ↓ NO                        ↓
  ↓                      FILES_TO_MODIFY.md (30 min)
  ↓                           ↓
NIGHT_PHASE_SPEC.md (90 min)  START CODING
  ↓                           ↓
Understand specific role? ← YES → Reference NIGHT_PHASE_SPEC.md
  ↓ NO
  ↓
NIGHT_PHASE_CHECKLIST.md
  ↓
Track progress
```

---

## 💡 Pro Tips

1. **Keep QUICK_REFERENCE.md bookmarked** while coding
2. **Reference NIGHT_PHASE_SPEC.md** for each role you implement
3. **Use IMPLEMENTATION_GUIDE.md** for patterns and examples
4. **Update NIGHT_PHASE_CHECKLIST.md** as you complete tasks
5. **Test after each phase**, not just at the end

---

## 📊 Current Status

```
Documentation: ✅ 100% COMPLETE
Architecture Analysis: ✅ 100% COMPLETE
Specification: ✅ 100% COMPLETE
Implementation Plan: ✅ 100% COMPLETE

Code Implementation: ⏳ 0% (NOT STARTED)

Ready to build? → Start with SUMMARY.md
```

---

## 🎉 Next Steps

1. **Read SUMMARY.md** (15 minutes)
2. **Read QUICK_REFERENCE.md** (30 minutes)
3. **Read IMPLEMENTATION_GUIDE.md** (45 minutes)
4. **Open FILES_TO_MODIFY.md** for guidance
5. **Start with Phase 1** (roles.ts modifications)
6. **Code Phase 1** (Seer, Witch, Body Guard)
7. **Test Phase 1** (end-to-end)
8. **Move to Phase 2**
9. **Repeat until done**

---

## 📈 Progress Tracking

Save this template and update as you progress:

```
## Implementation Progress

### Foundation
- [ ] Update Role interface (roles.ts)
- [ ] Update game types (types/game.ts)
- [ ] Update game state (game.ts)
- [ ] Update RoleAction component
- [ ] Update RoleActionPanel sorting

### Phase 1 (CRITICAL)
- [ ] Seer
- [ ] Witch  
- [ ] Body Guard
- [ ] Wolf Cub
- [ ] Dire Wolf

### Phase 2 (HIGH)
- [ ] Cupid
- [ ] Minion
- [ ] Mason
- [ ] Drunk
- [ ] Old Hag
- [ ] Doppelganger
- [ ] Nostradamis

### Phase 3 (MEDIUM)
- [ ] Vampire
- [ ] Cult Leader
- [ ] Hunter/Huntress
- [ ] Aura Seer
- [ ] P.I
- [ ] Spellcaster
- [ ] Troublemaker
- [ ] Priest

### Phase 4 (LOW)
- [ ] Ghost
- [ ] Bogeyman
- [ ] Leprechaun
- [ ] Zombie
- [ ] Count Dracula
- [ ] The Thing
- [ ] Virginia Wolf
- [ ] Sasquatch
- [ ] Cursed
- [ ] Frankenstein
- [ ] Others (Martyr, Lycan, Time Bandit, etc.)

### Testing
- [ ] Phase 1 E2E
- [ ] Phase 2 E2E
- [ ] Phase 3 E2E
- [ ] Phase 4 E2E
- [ ] Full integration test

## Overall Progress
█░░░░░░░░░░░░░░░░░░ 0% (0/30+ complete)
```

---

## 🔗 Related Files

- [SPEC.md](SPEC.md) - Original game specification
- [CHECKLIST.md](CHECKLIST.md) - General checklist
- [DESIGN_GUIDE.md](DESIGN_GUIDE.md) - Design guidelines
- [CHEAT_SHEET.md](CHEAT_SHEET.md) - General cheat sheet

---

## 📄 Document Versions

| Doc | Version | Date | Status |
|-----|---------|------|--------|
| NIGHT_PHASE_SPEC.md | 1.0 | Nov 15, 2025 | ✅ STABLE |
| IMPLEMENTATION_GUIDE.md | 1.0 | Nov 15, 2025 | ✅ STABLE |
| FILES_TO_MODIFY.md | 1.0 | Nov 15, 2025 | ✅ STABLE |
| NIGHT_PHASE_CHECKLIST.md | 1.0 | Nov 15, 2025 | ✅ STABLE |
| QUICK_REFERENCE.md | 1.0 | Nov 15, 2025 | ✅ STABLE |
| SUMMARY.md | 1.0 | Nov 15, 2025 | ✅ STABLE |
| NIGHT_PHASE_README.md | 1.0 | Nov 15, 2025 | ✅ STABLE |

---

## 🏁 Ready?

Start with **[SUMMARY.md](SUMMARY.md)** →

```
⏱️ Total Documentation: ~2000 lines
📚 6 detailed guides
✅ 100% specifications complete
🚀 Ready to implement
```

---

**Last Updated**: November 15, 2025  
**Documentation Status**: ✅ Complete & Ready  
**Implementation Status**: ⏳ Not Started  


