# ⚡ QUICK REFERENCE CARD

## 🎮 PROJECT AT A GLANCE

**Game**: Ultimate Werewolf Manager (web-based moderator tool)  
**Framework**: Nuxt.js 2 + Tailwind CSS  
**Duration**: 38-47 hours (6-8 weeks realistic)  
**Phases**: 10 sequential phases  
**Status**: ✅ Specifications complete, ready to code

---

## 📋 THE 10 PHASES

```
Phase 1 ─┬─ Setup & Structure       (2-3h)  [Setup]
Phase 2 ─┼─ Role Management          (3-4h)  [UI]
Phase 3 ─┼─ Player Management        (3-4h)  [UI]
Phase 4 ─┤─ Game Setup               (3-4h)  [UI]
         │  MVP Milestone ─────────────────────────
Phase 5 ─┼─ Night Phase              (5-6h)  [🎮 Complex]
Phase 6 ─┼─ Day Phase                (5-6h)  [🎮 Complex]
Phase 7 ─┼─ Text-to-Speech           (2-3h)  [Feature]
Phase 8 ─┤─ Game End Screen          (3-4h)  [UI]
Phase 9 ─┼─ Mobile Optimization      (3-4h)  [Polish]
Phase 10 ┴─ Testing & Polish         (4-5h)  [QA]
```

---

## 🗂️ 8 DOCUMENTATION FILES

| File | Size | Purpose | Time |
|------|------|---------|------|
| **START_HERE.md** | 4 KB | Quick start | 5 min |
| **SPEC.md** | 11 KB | What to build | 15 min |
| **CHECKLIST.md** | 20 KB | How to build | 20 min |
| **DESIGN_GUIDE.md** | 17 KB | Design system | 15 min |
| **PHASE_OVERVIEW.md** | 23 KB | Timeline | 10 min |
| **PROJECT_SUMMARY.md** | 10 KB | Context | 10 min |
| **README_IMPLEMENTATION.md** | 14 KB | Getting started | 10 min |
| **DOCUMENTATION_INDEX.md** | 9 KB | Index | 5 min |

**Total**: 120+ KB, 18,000+ words

---

## 🚀 HOW TO START

### Step 1: Choose Your Path
- **Quick**: Read START_HERE.md (5 min)
- **Standard**: Read PHASE_OVERVIEW.md + SPEC.md (10 min)
- **Full**: Read all 8 documents (60 min)

### Step 2: Tell Me
```
"Let's start Phase 1: Setup & Structure"
or
"Start Phase 2: Role Management"
or any phase 1-10
```

### Step 3: I Implement
- Create all components
- Add translations (en + vi)
- Make mobile responsive
- Fix linting
- Show you the code

### Step 4: You Review
- Approve or request changes
- I iterate immediately
- Move to next phase

---

## 🎯 KEY FEATURES

### Role Management
- 38+ roles displayed with images
- +/- controls for quantity
- Real-time balance weight calculation
- Color-coded balance (green/red)

### Player Management
- Player profiles with avatars
- CRUD operations
- localStorage persistence
- Stats tracking

### Game Setup
- Smart player auto-selection from last game
- Role assignment
- Player-to-role validation
- Start button (disabled if mismatch)

### Night Phase
- Sequential role actions
- Role-specific UIs
- Narration display
- Action processing

### Day Phase
- Discussion timer
- Player voting interface
- Real-time vote counting
- Vote tally & elimination

### Text-to-Speech
- Narration reading
- Multi-language (en + vi)
- Speed controls
- Voice selection

### Game End
- Victory screen
- Statistics summary
- Player results table
- Action buttons

### Mobile
- Fixed buttons (position: fixed)
- 44×44px touch targets
- Responsive layouts
- Safe area padding

### i18n
- Full English support
- Full Vietnamese support
- All text translatable
- TTS in both languages

---

## 📊 STATS

| Metric | Value |
|--------|-------|
| Total Documentation | 120+ KB |
| Total Words | 18,000+ |
| Total Lines | 3000+ |
| Total Hours | 38-47 |
| Total Phases | 10 |
| Total Tasks | 100+ |
| Vue Components | 15+ |
| Vuex Stores | 6 |
| Role Types | 38+ |
| Languages | 2 (en, vi) |

---

## 🎨 DESIGN QUICK FACTS

**Colors**:
- Villagers: Blue (#3B82F6)
- Werewolves: Red (#EF4444)
- Balance Perfect: Green (#10B981)
- Balance Bad: Red (#EF4444)

**Typography**:
- H1: 32px → 24px (mobile)
- Body: 16px → 14px (mobile)
- Line height: 1.6 (body), 1.2 (headings)

**Spacing**:
- Grid: 4px system
- Page padding: 16px → 32px
- Gap between elements: 16px → 24px

**Touch Targets**:
- Minimum: 44×44px
- Recommended: 48×48px
- Spacing: 12px minimum

**Breakpoints**:
- sm: 640px (mobile landscape)
- md: 768px (tablet)
- lg: 1024px (desktop)

---

## 🔧 TECH STACK

| Layer | Technology | Status |
|-------|-----------|--------|
| Framework | Nuxt.js 2 | ✅ Installed |
| Styling | Tailwind CSS | ✅ Configured |
| State | Vuex | ⏳ To install |
| i18n | vue-i18n | ⏳ To install |
| TTS | Web Speech API | ✅ Built-in |
| Storage | localStorage | ✅ Built-in |
| Build | Nuxt build | ✅ Ready |

---

## 📱 MOBILE REQUIREMENTS

- **Fixed buttons** at bottom
- **44×44px** minimum touch targets
- **12px** minimum spacing
- **16px** font minimum (readable)
- **No** horizontal scrolling
- **Safe area** padding (notches)
- **Responsive** layouts (sm/md/lg)
- **Tested** on iOS + Android

---

## 🌍 INTERNATIONALIZATION

**Languages**:
- English (en) ✅
- Vietnamese (vi) ✅

**Translated**:
- All UI text
- All role names/descriptions
- All game narration
- All error messages
- TTS in both languages

**Vietnamese Specifics**:
- Diacritics handled (é, ơ, ư, đ)
- Text expansion planned (20-30% longer)
- TTS voice: vi-VN
- No RTL needed

---

## ✅ SUCCESS CRITERIA

**After Phase 4**:
- Game setup working
- Players manageable
- Roles configured
- Validation working

**After Phase 6**:
- Full game playable
- Night actions working
- Voting working
- Win conditions checking

**After Phase 10**:
- All features complete
- Mobile optimized
- Both languages working
- TTS functional
- Zero console errors
- Performance excellent
- Ready to deploy

---

## 🎯 COMMUNICATION QUICK GUIDE

| Action | Say | Response |
|--------|-----|----------|
| Start phase | "Let's start Phase 1" | I implement it |
| Request change | "Make buttons bigger" | I update it |
| Ask question | "Why Vuex?" | I explain |
| Report issue | "This is broken" | I fix it |
| Approve | "Looks good, Phase 2!" | I start Phase 2 |
| Pause | "Wait, I need..." | I pause and help |

---

## 📚 WHEN TO READ WHAT

**I want to START NOW**:
→ Read START_HERE.md (5 min)
→ Tell me which phase
→ I start coding

**I want FULL CONTEXT**:
→ Read SPEC.md (what)
→ Read CHECKLIST.md (how)
→ Read PHASE_OVERVIEW.md (when)
→ Tell me which phase

**I want DESIGN RULES**:
→ Read DESIGN_GUIDE.md
→ Reference during coding

**I want CURRENT STATUS**:
→ Read SUMMARY.txt or this file

**I want EVERYTHING**:
→ Read DOCUMENTATION_INDEX.md
→ It lists all documents

---

## ⏱️ TIME BREAKDOWN

**Reading**: 1-2 hours
**Phase 1-4**: 12-16 hours (UI setup)
**Phase 5-6**: 10-12 hours (game logic) ⭐
**Phase 7-8**: 5-7 hours (features)
**Phase 9-10**: 7-10 hours (optimization)
**Total**: 38-47 hours

**Schedule Options**:
- 8 weeks @ 5-8h/week (conservative)
- 5 weeks @ 8-10h/week (realistic)
- 3 weeks @ 15-20h/week (intensive)

---

## ✨ QUICK CHECKLIST

Before starting, confirm:
- [ ] You understand there are 10 phases
- [ ] You know it's 38-47 hours total
- [ ] You understand Phases 5-6 are complex
- [ ] You're ready to iterate on design
- [ ] You have time to review code
- [ ] You want to build this app

**If all checked ✅:**

Tell me which phase to start! 🚀

---

## 🎮 GAME MECHANICS SUMMARY

**Roles**: 38+ (Seer, Werewolf, Witch, Hunter, Mayor, etc.)
**Phases**: Day (vote) ↔ Night (actions)
**Win**: Villagers win (all werewolves dead) OR Werewolves win (≥ villagers)
**Balance**: Sum of role points (negative = favors werewolves)
**Actions**: Each role has specific night action
**Voting**: Real-time vote counting during day
**Narration**: Story text for each phase + TTS reading

---

## 📞 NEED HELP?

**Can't find answer?**
→ Check DOCUMENTATION_INDEX.md (explains all docs)

**Want to know WHAT?**
→ Read SPEC.md

**Want to know HOW?**
→ Read CHECKLIST.md

**Want to know WHEN?**
→ Read PHASE_OVERVIEW.md

**Want to know WHY?**
→ Read PROJECT_SUMMARY.md (architecture decisions)

**Ready to CODE?**
→ Read your current Phase section in CHECKLIST.md

---

## 🚀 FINAL CHECKLIST

To begin implementation:

1. [ ] Read at least one document (START_HERE.md)
2. [ ] Understand the 10 phases
3. [ ] Know the 38-47 hour timeline
4. [ ] Have CHECKLIST.md available
5. [ ] Tell me which phase to start
6. [ ] I'll implement phase 1
7. [ ] You review phase 1
8. [ ] We move to phase 2
9. [ ] Repeat until phase 10
10. [ ] Deploy amazing game manager! 🎉

---

## ✅ YOU'RE READY!

Everything is documented.
Everything is specified.
Everything is ready to build.

**Next step:**

Tell me: **"Let's start Phase 1"** (or your chosen phase)

And let's build this! 🎮

---

*This quick reference assumes you've reviewed at least one major document.*  
*For more details, see the full documentation.*

