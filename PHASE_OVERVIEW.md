# 🎮 WEREWOLVES GAME MANAGER - PHASE OVERVIEW

## 📋 AT A GLANCE

### All 10 Phases Visual Summary

```
┌────────────────────────────────────────────────────────┐
│  PHASE 1: Setup & Structure                  2-3 hours │
├────────────────────────────────────────────────────────┤
│  • Install i18n & dependencies                         │
│  • Create Vuex stores (game, players, roles)           │
│  • Set up routing & navigation                         │
│  • Create locale files (en.json, vi.json)              │
│  Status: ⏳ Not Started                                 │
└────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────┐
│  PHASE 2: Role Management                   3-4 hours  │
├────────────────────────────────────────────────────────┤
│  • Create RoleCard & RoleManagement components         │
│  • Display 38+ roles with images & descriptions        │
│  • Implement +/- quantity controls                     │
│  • Calculate game balance weight (real-time)           │
│  • Color-coded balance indicator (green/red)           │
│  Status: ⏳ Not Started                                 │
└────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────┐
│  PHASE 3: Player Management                 3-4 hours  │
├────────────────────────────────────────────────────────┤
│  • Create PlayerCard & PlayerForm components           │
│  • Player list with CRUD operations                    │
│  • Avatar upload/selection                             │
│  • localStorage persistence                            │
│  • Stats tracking (games played, wins)                 │
│  Status: ⏳ Not Started                                 │
└────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────┐
│  PHASE 4: Game Setup                        3-4 hours  │
├────────────────────────────────────────────────────────┤
│  • Create player selection interface                   │
│  • Smart auto-select from previous game                │
│  • Role confirmation screen                           │
│  • Player-to-role validation                          │
│  • Start button (disabled if numbers don't match)      │
│  • Error messages                                     │
│  Status: ⏳ Not Started                                 │
└────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────┐
│  PHASE 5: Night Phase 🌙                    5-6 hours  │
├────────────────────────────────────────────────────────┤
│  • Night phase UI & flow                               │
│  • Role action components (Seer, Werewolf, Witch...)   │
│  • Player selection interface for each role            │
│  • Action confirmation & state tracking                │
│  • Night action processing (correct order)             │
│  • Narration display with story text                   │
│  ⭐ COMPLEXITY: HIGH - Most complex logic              │
│  Status: ⏳ Not Started                                 │
└────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────┐
│  PHASE 6: Day Phase ☀️                      5-6 hours  │
├────────────────────────────────────────────────────────┤
│  • Discussion timer (configurable 10-15 min)           │
│  • Voting interface with real-time vote counting       │
│  • Player voting cards                                 │
│  • Vote submission & tally                            │
│  • Tie-breaking logic                                 │
│  • Role reveal on elimination                         │
│  • Win condition checks                               │
│  ⭐ COMPLEXITY: HIGH - Vote logic, transitions        │
│  Status: ⏳ Not Started                                 │
└────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────┐
│  PHASE 7: Text-to-Speech 🔊                 2-3 hours  │
├────────────────────────────────────────────────────────┤
│  • Web Speech API integration                          │
│  • Speaker button next to narration text               │
│  • TTS controls (play, pause, stop, speed)             │
│  • Multi-language support (en + vi)                    │
│  • Voice selection & persistence                       │
│  • Error handling & fallbacks                          │
│  Status: ⏳ Not Started                                 │
└────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────┐
│  PHASE 8: Game End Screen                   3-4 hours  │
├────────────────────────────────────────────────────────┤
│  • End condition determination                         │
│  • Victory message display                            │
│  • Statistics summary                                 │
│  • Results table (player | role | status | round)      │
│  • Action buttons (Play Again, Main Menu)              │
│  • Game log/timeline (optional)                        │
│  Status: ⏳ Not Started                                 │
└────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────┐
│  PHASE 9: Mobile Optimization 📱             3-4 hours  │
├────────────────────────────────────────────────────────┤
│  • Fixed button positioning (position: fixed)          │
│  • Touch target optimization (44×44px minimum)          │
│  • Responsive layout testing (sm, md, lg)              │
│  • Font size & contrast verification                   │
│  • Form input optimization                            │
│  • Real device testing (iOS, Android)                  │
│  Status: ⏳ Not Started                                 │
└────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────┐
│  PHASE 10: Testing & Polish                 4-5 hours  │
├────────────────────────────────────────────────────────┤
│  • Full game flow testing                              │
│  • Translation verification (en + vi)                  │
│  • Text-to-speech testing                              │
│  • Mobile testing on real devices                      │
│  • Linting & code quality                              │
│  • Performance optimization                           │
│  • Final visual polish                                │
│  Status: ⏳ Not Started                                 │
└────────────────────────────────────────────────────────┘

TOTAL: 38-47 hours | Most complex: Phases 5 & 6 | Estimated: 6-8 weeks
```

---

## 🗺️ PHASE FLOW CHART

```
┌─────────────────────────────────────────────────────────────────┐
│ Start Project                                                   │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 ▼
        ┌────────────────┐
        │ PHASE 1: Setup │ (2-3h)
        │ Dependencies   │
        │ Vuex, i18n     │
        └────────┬───────┘
                 │
                 ▼
        ┌────────────────┐
        │ PHASE 2: Roles │ (3-4h)
        │ 38+ roles UI   │
        │ Balance calc   │
        └────────┬───────┘
                 │
                 ▼
        ┌────────────────┐
        │PHASE 3: Players│ (3-4h)
        │ CRUD, avatar   │
        │ Storage        │
        └────────┬───────┘
                 │
                 ▼
        ┌────────────────┐
        │PHASE 4: Setup  │ (3-4h)
        │ Player select  │
        │ Validation     │
        └────────┬───────┘
                 │
                 ▼
   ┌─────────────────────────────┐
   │ Game is Now Playable!       │ ◀─── MVP Milestone
   └─────────────────────────────┘
                 │
                 ▼
        ┌────────────────┐
        │PHASE 5: Night  │ (5-6h) ⭐
        │ Role actions   │
        │ Game logic     │
        └────────┬───────┘
                 │
                 ▼
        ┌────────────────┐
        │PHASE 6: Day    │ (5-6h) ⭐
        │ Voting         │
        │ Elimination    │
        └────────┬───────┘
                 │
                 ▼
        ┌────────────────┐
        │PHASE 7: TTS    │ (2-3h)
        │ Speech API     │
        │ Multi-lang     │
        └────────┬───────┘
                 │
                 ▼
        ┌────────────────┐
        │PHASE 8: End    │ (3-4h)
        │ Results        │
        │ Statistics     │
        └────────┬───────┘
                 │
                 ▼
        ┌────────────────┐
        │PHASE 9: Mobile │ (3-4h)
        │ Optimization   │
        │ Testing        │
        └────────┬───────┘
                 │
                 ▼
        ┌────────────────┐
        │PHASE 10: Test  │ (4-5h)
        │ Final QA       │
        │ Polish         │
        └────────┬───────┘
                 │
                 ▼
   ┌─────────────────────────────┐
   │ 🎉 Production Ready!        │ ◀─── Full Release
   │ All features complete       │
   │ Mobile optimized            │
   │ Multilingual                │
   └─────────────────────────────┘
```

---

## 📊 COMPLEXITY & EFFORT BREAKDOWN

```
Phase | Name               | Duration | Difficulty | Complexity
------|-------------------|----------|------------|------------
  1   | Setup              | 2-3h     | 🟡 Medium  | 🟡 Medium
  2   | Role Management    | 3-4h     | 🟡 Medium  | 🟡 Medium
  3   | Player Management  | 3-4h     | 🟡 Medium  | 🟡 Medium
  4   | Game Setup         | 3-4h     | 🟡 Medium  | 🟡 Medium
  5   | Night Phase        | 5-6h     | 🔴 High    | 🔴 HIGH ⭐
  6   | Day Phase          | 5-6h     | 🔴 High    | 🔴 HIGH ⭐
  7   | Text-to-Speech     | 2-3h     | 🟡 Medium  | 🟡 Medium
  8   | Game End           | 3-4h     | 🟡 Medium  | 🟡 Medium
  9   | Mobile Optim.      | 3-4h     | 🟡 Medium  | 🟠 Moderate
  10  | Testing & Polish   | 4-5h     | 🟠 Moderate| 🟠 Moderate
------|-------------------|----------|------------|------------
TOTAL | All Phases         | 38-47h   |           |
```

---

## 🎯 KEY MILESTONES

### Milestone 1: MVP (End of Phase 4)
```
✅ Project structure complete
✅ Roles management working
✅ Players management working
✅ Game setup validated
✅ Basic UI responsive
❌ Game flow not yet implemented (no actual gameplay yet)
```

### Milestone 2: Playable (End of Phase 6)
```
✅ All Phase 4 features
✅ Night phase fully working
✅ Day phase with voting
✅ Basic end conditions working
✅ Full game loop playable (5-10 player games)
✅ English interface complete
❌ No multi-language yet
```

### Milestone 3: Feature Complete (End of Phase 9)
```
✅ All Phase 6 features
✅ Text-to-speech working
✅ Game end screen with stats
✅ Mobile interface optimized
✅ Multi-language support (en + vi)
✅ All UI responsive
❌ May have minor bugs to fix
```

### Milestone 4: Production Ready (End of Phase 10)
```
✅ All Phase 9 features
✅ Full testing completed
✅ All bugs fixed
✅ Performance optimized
✅ Code clean & documented
✅ Ready for deployment
✅ 100% ready for users
```

---

## 🚦 DECISION POINTS

### After Phase 2: Can We Add More Roles?
**Answer**: Yes, the system is extensible. Add new roles to `app/docs.js` and reference images.

### After Phase 4: Can We Test Single-Player?
**Answer**: No, games need minimum 5 players. Phase 4 will validate this.

### After Phase 6: Are Edge Cases Handled?
**Answer**: Most are. Phase 10 will find and fix remaining edge cases.

### After Phase 8: Can We Track Game History?
**Answer**: Yes, after Phase 10. Add historical data storage to Vuex.

### After Phase 9: Should We Deploy?
**Answer**: No, wait for Phase 10 (testing & polish) first.

---

## 💡 QUICK LOOKUP TABLE

### Which Phase Should I Do First?
**Answer**: Phase 1. It sets up everything else.

### Which Phases Can Be Done in Parallel?
**Answer**: None. Each depends on previous. Must be sequential.

### Which Phase Takes Longest?
**Answer**: Phases 5 & 6 (both 5-6 hours each).

### Which Phase is Easiest?
**Answer**: Phase 1 (mostly dependencies, no complex logic).

### Which Phase Has Most Tasks?
**Answer**: Phase 5 (Night logic with 20+ role actions).

### Which Phase is Most Complex?
**Answer**: Phase 6 (voting logic, win conditions, edge cases).

### Which Phase Needs Most Testing?
**Answer**: Phase 10 (full game flow, all scenarios).

### Which Phase is Most Fun?
**Answer**: Phase 5-6 (actual gameplay mechanics!).

---

## 📱 MOBILE TIMELINE

```
Phases 1-8: Desktop-first implementation
                ▼
Phase 9: Mobile optimization sprint
├─ Fixed buttons positioning
├─ Touch target sizing
├─ Responsive layout refinement
├─ Real device testing
└─ Safe area handling
                ▼
Phase 10: Final mobile testing
├─ iOS Safari testing
├─ Android Chrome testing
├─ Performance check
└─ UX refinement
```

---

## 🌍 INTERNATIONALIZATION TIMELINE

```
Phases 1-4: English-only (prepare i18n infrastructure)
                ▼
Phase 5-8: English game flow complete
                ▼
Phase 9: Add Vietnamese translations
├─ All UI text translated
├─ All role descriptions translated
├─ All narration translated
└─ TTS Vietnamese voice tested
                ▼
Phase 10: Bilingual QA
├─ Verify all translations correct
├─ Test language switching
├─ Check Vietnamese diacritics
└─ Confirm TTS in both languages
```

---

## ✨ PHASE DEPENDENCIES

```
Phase 1 (Setup)
  ↓ (required for)
Phases 2, 3, 4 (UI Components)
  ↓ (required for)
Phases 5, 6 (Game Logic)
  ↓ (required for)
Phase 7 (Features)
Phase 8 (UI)
  ↓ (required for)
Phase 9 (Optimization)
  ↓ (required for)
Phase 10 (Testing)

KEY RULE: No skipping ahead!
```

---

## 🎓 LEARNING CURVE

```
Easy:  Phases 1, 2, 3 (mostly UI components)
            ▼
Medium: Phases 4, 7, 8, 9 (UI + some logic)
            ▼
Hard:  Phases 5, 6 (complex game logic)
            ▼
Variable: Phase 10 (testing, debugging)
```

### Recommendation
- Do Phases 1-4 first (warm up)
- Then tackle Phases 5-6 (challenge yourself)
- Rest in Phases 7-9 (polish work)
- Finish with Phase 10 (detailed QA)

---

## 📅 REALISTIC SCHEDULE

### Conservative Estimate (8 weeks)
```
Week 1: Phases 1-2 (8 hours)
Week 2: Phase 3 (4 hours) + Phase 4 (4 hours)
Week 3: Phase 5 (6 hours)
Week 4: Phase 6 (6 hours)
Week 5: Phase 7 (3 hours) + Phase 8 (3 hours)
Week 6: Phase 9 (4 hours)
Week 7: Phase 10 (4 hours) + Buffer (2 hours)
Week 8: Final polish & deployment (4 hours)
```

### Aggressive Estimate (3 weeks)
```
Week 1: Phases 1-4 (13 hours)
Week 2: Phases 5-6 (11 hours)
Week 3: Phases 7-10 (15 hours)
        Requires focused work & fewer meetings
```

### Realistic (5 weeks)
```
Week 1: Phases 1-2 (6 hours)
Week 2: Phases 3-4 (8 hours)
Week 3: Phase 5 (6 hours)
Week 4: Phase 6 (6 hours)
Week 5: Phases 7-10 (14 hours)
```

---

## 🚀 WHEN TO DEPLOY

### Never Deploy Before
- ❌ Phase 4 (no gameplay yet)
- ❌ Phase 6 (incomplete game loop)
- ❌ Phase 9 (mobile not optimized)

### Okay to Deploy After
- ✅ Phase 8 (full game working, but needs polish)
- ✅ Phase 10 (production ready!)

### Recommended
- 🟢 Deploy after Phase 10 only (fully tested, polished)

---

## 🎯 SUCCESS CHECKLIST

### After Each Phase
- [ ] All tasks in CHECKLIST.md completed
- [ ] No console errors or warnings
- [ ] Code follows DESIGN_GUIDE.md
- [ ] Mobile responsive (tested)
- [ ] i18n strings added (en + vi)
- [ ] Linting passes
- [ ] User can use feature without error

### Before Moving to Next Phase
- [ ] Current phase fully working
- [ ] No critical bugs
- [ ] Code reviewed
- [ ] Mobile tested
- [ ] Approved to proceed

---

## 💬 COMMUNICATION POINTS

### Phase Start
```
You: "Let's start Phase 3"
Me: "Starting Phase 3: Player Management"
```

### During Phase
```
You: "Can you make buttons bigger?"
Me: "Done! Updated to 48px minimum"
```

### Phase Complete
```
Me: "Phase 3 complete! 
     • CRUD forms working
     • Avatar upload done
     • localStorage persisting
     Ready for review?"
You: "Looks great! Start Phase 4"
```

---

## 📋 COPY-PASTE PHASE START COMMANDS

When ready to start each phase, simply copy and paste:

```
Phase 1: "Let's start Phase 1: Setup & Structure"
Phase 2: "Let's start Phase 2: Role Management"
Phase 3: "Let's start Phase 3: Player Management"
Phase 4: "Let's start Phase 4: Game Setup"
Phase 5: "Let's start Phase 5: Night Phase"
Phase 6: "Let's start Phase 6: Day Phase"
Phase 7: "Let's start Phase 7: Text-to-Speech"
Phase 8: "Let's start Phase 8: Game End Screen"
Phase 9: "Let's start Phase 9: Mobile Optimization"
Phase 10: "Let's start Phase 10: Testing & Polish"
```

---

## 🎉 YOU'RE READY!

All 10 phases are mapped out, documented, and ready to implement.

**Pick a phase and let's build! 🚀**

The most common starting point is Phase 1, but you could also start with a different phase if you prefer. Your call!


