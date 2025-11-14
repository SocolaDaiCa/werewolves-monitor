# WEREWOLVES GAME MANAGER - PROJECT SUMMARY

## 🎮 PROJECT OVERVIEW

This is a web-based game manager for **Ultimate Werewolf**, designed to help game moderators manage all aspects of gameplay through a beautiful, responsive web interface.

### Key Features
- 🎯 **Role Management**: Configure game balance with 38+ roles
- 👥 **Player Management**: Register and manage player profiles
- 🎲 **Game Setup**: Intelligent player-to-role assignment
- 🌙 **Night Phase**: Sequential role actions with game logic
- ☀️ **Day Phase**: Discussion timer and voting system
- 🔊 **Text-to-Speech**: Read narration using browser speech API
- 🌍 **Multi-language**: English and Vietnamese support
- 📱 **Mobile-first**: Optimized for smartphones with fixed UI buttons

---

## 📚 DOCUMENTATION FILES

### 1. **SPEC.md** ✅ COMPLETE
- Comprehensive feature specifications for all 7 major features
- Technical requirements and dependencies
- Design principles and game logic notes
- Directory structure and technology stack

### 2. **CHECKLIST.md** ✅ COMPLETE
- Detailed 10-phase implementation roadmap
- Specific tasks for each phase (100+ subtasks)
- Time estimates and difficulty levels
- Testing requirements for each phase
- Success metrics and key deliverables

### 3. **PROJECT_SUMMARY.md** (This file)
- High-level overview
- Team coordination guide
- File descriptions

---

## 🚀 QUICK START GUIDE

### Getting Started (when you're ready to code)

1. **Tell me which phase to start with** (e.g., "Let's start Phase 1")
2. **I'll implement that phase** and update the checklist
3. **You review and give feedback**
4. **Move to next phase**

### Phase Overview

```
Phase 1: Project Setup & Dependencies (2-3h)
   ↓
Phase 2: Role Management Screen (3-4h)
   ↓
Phase 3: Player Management Screen (3-4h)
   ↓
Phase 4: Game Setup Screen (3-4h)
   ↓
Phase 5: Night Phase Implementation (5-6h) [COMPLEX]
   ↓
Phase 6: Day Phase Implementation (5-6h) [COMPLEX]
   ↓
Phase 7: Text-to-Speech Feature (2-3h)
   ↓
Phase 8: Game End Screen (3-4h)
   ↓
Phase 9: Mobile Optimization (3-4h)
   ↓
Phase 10: Testing & Polish (4-5h)
```

---

## 💡 HOW TO USE THIS PROJECT

### For the Developer (You)
1. Read `SPEC.md` for high-level understanding
2. Review `CHECKLIST.md` for detailed tasks
3. Tell me which phase to implement
4. I'll code it following the spec
5. You review the code and provide feedback
6. We iterate until perfect

### For Code Review
- Each phase has clear acceptance criteria
- All subtasks are listed in CHECKLIST.md
- Testing requirements are documented
- Mobile checklist ensures good UX

---

## 🗂️ PROJECT STRUCTURE

```
werewolves-monitor/
├── SPEC.md                          # Feature specifications
├── CHECKLIST.md                     # Implementation checklist
├── PROJECT_SUMMARY.md               # This file
│
├── store/                           # Vuex state management
│   ├── game.js                      # Game state (phase, players, actions)
│   ├── players.js                   # Player profiles
│   └── roles.js                     # Role configurations
│
├── components/                      # Vue components
│   ├── RoleManagement.vue          # Role setup interface
│   ├── RoleCard.vue                # Individual role display
│   ├── PlayerManagement.vue        # Player CRUD
│   ├── PlayerCard.vue              # Player display
│   ├── GameSetup.vue               # Game initialization
│   ├── GameFlow.vue                # Game phase manager
│   ├── PhaseHeader.vue             # Phase/round display
│   ├── RoleAction.vue              # Role action UI
│   ├── VotingInterface.vue         # Day phase voting
│   ├── NarrationDisplay.vue        # Story text + TTS
│   ├── PhaseTimer.vue              # Phase countdown
│   └── GameEnd.vue                 # Results screen
│
├── pages/                           # Route pages
│   ├── index.vue                   # Home menu
│   ├── roles.vue                   # Role management page
│   ├── players.vue                 # Player management page
│   ├── game-setup.vue              # Game setup page
│   ├── game.vue                    # Game flow page
│   └── game-end.vue                # Game results page
│
├── locales/                         # Internationalization
│   ├── en.json                     # English translations
│   └── vi.json                     # Vietnamese translations
│
├── mixins/                          # Reusable logic
│   └── textToSpeech.js             # TTS utility
│
├── assets/                          # Styles
│   └── main.scss                   # Global styles
│
├── static/                          # Static files
│   └── images/roles/               # Role card images (already present)
│
├── nuxt.config.js                   # Nuxt configuration
├── tailwind.config.js               # Tailwind CSS config
├── package.json                     # Dependencies
└── README.md                        # User guide

```

---

## 🎯 KEY DECISIONS MADE

### Architecture
- **Framework**: Nuxt.js 2 (already in place) ✅
- **Styling**: Tailwind CSS (already configured) ✅
- **State Management**: Vuex (will be added)
- **i18n**: vue-i18n (will be added)
- **Storage**: localStorage + Vuex persistence

### Design Patterns
- Component-based architecture
- Centralized state management
- Separation of concerns
- Mobile-first responsive design

### Performance
- Lazy-loaded components where possible
- Image optimization
- No unnecessary re-renders
- Efficient game state updates

---

## 📱 MOBILE EXPERIENCE HIGHLIGHTS

### Fixed UI Elements
All critical action buttons are **position: fixed** at bottom:
- ✅ Start Game button
- ✅ Next Phase button
- ✅ Submit Vote button
- ✅ Proper safe-area padding (for notched phones)

### Touch Optimization
- Minimum 44px touch targets
- 12px minimum spacing between buttons
- Full-width buttons on mobile
- No horizontal scrolling

### Responsive Breakpoints
```
Mobile (sm < 640px)    → Single column, stacked
Tablet (md: 640-768px) → Two columns
Desktop (lg: 768px+)   → Full layout
```

---

## 🌍 MULTI-LANGUAGE SUPPORT

### Currently Supported
- 🇬🇧 English (en)
- 🇻🇳 Vietnamese (vi)

### What Gets Translated
- All UI text (buttons, labels, headings)
- All role names and descriptions
- Game narration text
- Error messages and alerts
- Phase labels
- Result messages

### Text-to-Speech
- TTS reads narration in selected language
- Vietnamese voice (vi-VN)
- English voice (en-US)
- Speed controls (0.8x - 1.5x)

---

## 🧪 TESTING STRATEGY

### Phases to Test Thoroughly
1. **Phase 5 (Night)** - Complex role interactions
2. **Phase 6 (Day)** - Voting logic and tie-breaking
3. **Phase 10** - Full end-to-end game flows

### Test Scenarios
- 5-player game (testing basic flow)
- 10-player game (testing multiple roles)
- All special role combinations
- Edge cases (deaths, role conflicts)
- Mobile on real devices
- TTS in both languages

---

## 📊 IMPLEMENTATION TIMELINE

**Total Effort**: 38-47 hours of development

```
Week 1: Phase 1-3 (Setup, Role Mgmt, Player Mgmt)
Week 2: Phase 4-6 (Game Setup, Night Phase, Day Phase)
Week 3: Phase 7-9 (TTS, End Screen, Mobile Optimization)
Week 4: Phase 10 (Testing & Polish)
```

---

## ✨ SUCCESS CRITERIA

### MVP (Minimum Viable Product)
- ✅ Phases 1-6 complete and working
- ✅ Basic game flow playable
- ✅ English interface
- ✅ Desktop and tablet responsive

### Full Release
- ✅ All 10 phases complete
- ✅ English + Vietnamese
- ✅ Mobile-optimized
- ✅ Text-to-speech working
- ✅ Zero console errors
- ✅ Full test coverage

---

## 🔄 HOW TO REQUEST IMPLEMENTATION

When ready to code a phase, simply say:

> "Let's start Phase 2: Role Management"

I will:
1. ✅ Create all necessary components
2. ✅ Follow the SPEC.md requirements
3. ✅ Follow all tasks in CHECKLIST.md
4. ✅ Add proper translations (en + vi)
5. ✅ Make it mobile-responsive
6. ✅ Include inline comments
7. ✅ Fix any linting errors
8. ✅ Update the todo list

Then I'll show you the code and explain what was built.

---

## 💬 COMMUNICATION PROTOCOL

### Starting a Phase
```
You: "Let's start Phase X: [Phase Name]"
Me: [Implement phase following spec]
Me: [Show components created]
Me: [Ask for feedback]
```

### Feedback & Changes
```
You: "Change button color to blue" or "This doesn't match the spec"
Me: [Update code immediately]
Me: [Verify against spec]
Me: [Re-check]
```

### Moving Forward
```
You: "Looks good! Let's move to Phase X+1"
Me: [Mark phase complete]
Me: [Update checklist]
Me: [Start next phase]
```

---

## 📞 QUESTIONS & CLARIFICATIONS

Before starting implementation, I can clarify:

- **Role details**: Any specific role mechanics?
- **UI preferences**: Any color scheme or design preferences?
- **Gameplay rules**: Any house rules or custom variants?
- **Performance**: Target device/browser requirements?
- **Scope**: Any features to include/exclude?

---

## 🎓 LEARNING RESOURCES

### Built-in Docs
- `app/docs.js` - All 114 game rules and role descriptions
- `app/Doc.js` - Data structure for rules

### Key Game Concepts (from docs)
- **Phases**: Day (voting) → Night (role actions) cycle
- **Win Conditions**: Villagers (all werewolves dead), Werewolves (equal/outnumber villagers), Special roles
- **Role Order**: See line 113 in docs.js for correct calling sequence
- **38+ Roles**: All implemented in balance system

---

## 🚀 NEXT STEPS

1. **Review** the SPEC.md and CHECKLIST.md
2. **Tell me which phase to start** with
3. **I'll implement it** and show you the code
4. **You review and provide feedback**
5. **Rinse and repeat** until app is complete!

---

**Ready to build? 🎮**

Just tell me: **"Let's start Phase 1!"** (or any other phase)

I'll handle the rest! 🚀


