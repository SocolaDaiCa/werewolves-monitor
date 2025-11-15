# WEREWOLVES GAME MANAGER - SPECIFICATION & CHECKLIST

## PROJECT OVERVIEW
A game management web app for "Ultimate Werewolf" designed to help moderators manage the game flow, including role management, player selection, game progression through day/night phases, and providing text-to-speech narration support.

---

## FEATURE SPECIFICATIONS

### 1. ROLE MANAGEMENT SCREEN
**Purpose**: Moderator can configure game roles and check game balance

#### 1.1 Role Display
- Display list of available roles with:
  - Role image (illustrative icon)
  - Role name
  - Role description/function
  - Balance point value (shown at bottom-left of role card)

#### 1.2 Role Quantity Controls
- For each role, provide:
  - Decrease button (-)
  - Quantity input/display
  - Increase button (+)
- Allow quantity from 0 to reasonable maximum (e.g., 10)

#### 1.3 Game Balance Indicator
- **Total Weight Value**: Display sum of all role balance points
- **Color-coded status**:
  - Green (🟢) if total weight = 0 (perfectly balanced)
  - Light green if total weight is slightly positive (0 < value ≤ 5)
  - Light red if total weight is slightly negative (-5 ≤ value < 0)
  - Red (🔴) if total weight is significantly negative or positive (|value| > 5)
- **Status label**: e.g., "Balanced", "Slightly Favors Villagers", "Favors Werewolves"

#### 1.4 Roles to Support
- Villager (0)
- Seer (+7)
- Werewolf (-6)
- Witch (+4)
- Hunter (+3)
- Mayor (+2)
- Aura Seer (+4)
- And all roles from docs.js

**Tech**: Vue component, Tailwind CSS, responsive layout

---

### 2. PLAYER MANAGEMENT SCREEN
**Purpose**: Register and manage player profiles

#### 2.1 Player List
- Display all registered players with:
  - Player avatar/image
  - Player name
  - Edit/Delete buttons

#### 2.2 Add/Edit Player
- Form to:
  - Input player name
  - Upload/select player avatar
  - Save player profile

#### 2.3 Player Persistence
- Store player data in localStorage or Vuex store
- Allow import/export of player database

**Tech**: Vue component with form, Tailwind CSS

---

### 3. GAME SETUP SCREEN (Pre-Game)
**Purpose**: Moderator selects players and roles for current game

#### 3.1 Player Selection
- Display all registered players as selectable cards
- **Smart default selection**: If players participated in previous game, automatically select them
- **Toggle selection**: Allow moderator to add/remove players

#### 3.2 Role Assignment
- After player selection, display role setup screen
- Show total players vs total role slots
- Prevent starting if numbers don't match

#### 3.3 Start Game Button
- **Disable condition**: Total players ≠ Total role slots
- **Warning message**: "Number of players ({N}) does not match number of roles ({M}). Cannot start game!"
- **Enable condition**: Numbers match → activate button with visual feedback

**Tech**: Vue component with computed properties, Tailwind CSS

---

### 4.1 NIGHT 0 - ROLE REVEAL SCREEN (Pre-Game)
**Purpose**: Allow players to identify their role group before game starts

#### 4.1.1 Role Reveal Flow
- **Moderator controls**:
  - "Call Next Role" and "Previous Role" buttons to navigate through roles
  - Display current role name prominently (large text)
  - Show role description and expected player count
  - Show progress indicator (e.g., "Role 3 of 8")

#### 4.1.2 Player Acknowledgment
- **When role is called**:
  - Players with that role see a notification: "This is your role!"
  - Players can click "I'm in!" to acknowledge
  - Moderator sees count: "Werewolves: 2/2 acknowledged" or similar
- **Visual feedback**:
  - Players who acknowledged show checkmark or highlight
  - Color change or animation for acknowledgment
  - Running total of acknowledged vs expected

#### 4.1.3 Safety Validation
- **Before allowing "Start Game"**:
  - Verify all roles have correct acknowledgment count
  - Show warning if mismatch: "Werewolves: 1 acknowledged, but 2 expected"
  - Option for moderator to "Force Start" if needed (for edge cases)

#### 4.1.4 End Condition
- After all roles acknowledged → "Start Game" button enabled (bright, ready)
- Click "Start Game" → Save role acknowledgments to store → Navigate to game page

**Tech**: Vue component with game state management, Pinia store

---

### 5. GAME FLOW SCREEN (During Game)
**Purpose**: Manage day/night phases and track game state

#### 5.1 Phase Manager
- Display current phase: **NIGHT** or **DAY**
- Display round number (Night 1, Day 1, Night 2, etc.)
- Elapsed time for current phase

#### 5.2 Night Phase
- **Role Activation Flow**:
  1. List all active roles (those still alive)
  2. Display roles to wake up in order (per docs)
  3. For each role, show:
     - Role name and description
     - Action buttons based on role type:
       - Seer: Select player to investigate
       - Werewolf: Select player to kill
       - Witch: Select to heal/poison
       - Hunter: Select target
       - Bodyguard: Select to protect
       - etc.
  4. Record all actions (don't apply immediately)
  5. Process all actions after all roles acted
  6. Display results (who died, etc.)

#### 5.3 Day Phase
- **Player Discussion**: Allow 10-15 minute timer (configurable)
- **Moderator Vote Control**:
  - Display all living players with vote counters
  - Moderator can:
    - Increase (+) or decrease (−) vote count for each player
    - Vote total cannot exceed number of alive players
    - Toggle "Mark for Kill" (☠️) for each player to eliminate
  - Show real-time vote summary:
    - Total votes cast
    - Number of alive players
    - Players marked for kill count
    - Remaining votes available
- **After voting**: Announce eliminated players and show vote count per player
- **Win Condition Check**: After day phase, check if:
  - Werewolves >= Villagers → Werewolves win (END GAME)
  - All werewolves eliminated → Villagers win (END GAME)
  - Otherwise → Proceed to next night

#### 5.4 Narration Text Display
- Display role-specific narration text (from story elements)
- Include Speaker icon button next to text
- Text-to-Speech feature: Click button to read narration aloud

#### 5.5 Dialogue Text to Speech
- Use Web Speech API (browser-native)
- Support languages: Vietnamese and English
- Features:
  - Play/Pause buttons
  - Speed control (0.8x - 1.5x)
  - Voice selection (if available)

**Tech**: Vue component with game state management, Web Speech API

---

### 6. GAME END SCREEN
**Purpose**: Display game result and end condition

#### 6.1 End Screen Components
- **Result Message**:
  - "VILLAGERS WIN!" (if all werewolves eliminated)
  - "WEREWOLVES WIN!" (if werewolves >= villagers)
  - "CULT WINS!" (if cult condition met)
  - etc.
- **Final Statistics**:
  - Total rounds played
  - Players who survived
  - Players eliminated and their roles
  - MVP/Notable plays (optional)
- **Summary Table**:
  - Player name | Role | Status (alive/dead) | Killed by | Round eliminated

#### 6.2 Action Buttons
- "Play Again" (return to setup)
- "View Game Log" (detailed game timeline)
- "Back to Menu"

**Tech**: Vue component with props, Tailwind CSS

---

### 7. MOBILE RESPONSIVENESS
**Purpose**: Ensure excellent UX on smartphones

#### 7.1 Fixed UI Elements
- **Fixed buttons** for critical actions (position: fixed):
  - Start Game button
  - Next Phase button
  - Submit Vote button
  - Positioned at bottom with safe area padding
  - Large touch targets (44px+ minimum)

#### 7.2 Responsive Layout
- Mobile-first design
- Breakpoints:
  - sm: 640px (phone)
  - md: 768px (tablet)
  - lg: 1024px (desktop)
- Stack layouts vertically on small screens
- Single column for player/role selection
- Cards should be full-width or near-full on mobile

#### 7.3 Touch Optimization
- Large buttons (48-64px)
- Adequate spacing between interactive elements
- Swipe gestures for navigation (optional)
- Prevent text selection on interactive elements

**Tech**: Tailwind CSS responsive utilities, Vue mobile detection

---

### 8. INTERNATIONALIZATION (i18n)
**Purpose**: Support Vietnamese and English languages

#### 8.1 Language Support
- Vietnamese (vi)
- English (en)
- Language selector in app header

#### 8.2 Translations Required
- All UI text
- Role names and descriptions
- Narration text
- Phase labels
- Result messages
- Button labels

#### 8.3 Implementation
- Use vue-i18n plugin
- Store translations in `/locales` directory
- Support both languages for text-to-speech

**Tech**: vue-i18n, locale JSON files

---

## CHECKLIST

### Phase 1: Setup & Structure
- [ ] Install i18n plugin for multi-language support
- [ ] Create store (Vuex) for game state management
- [ ] Create locale files (en.json, vi.json)
- [ ] Set up layout and navigation structure
- [ ] Create basic page routing

### Phase 2: Role Management
- [ ] Create RoleManagement.vue component
- [ ] Display all roles with images and descriptions
- [ ] Implement +/- quantity controls
- [ ] Calculate total balance weight
- [ ] Implement color-coded balance indicator
- [ ] Add role filtering/search

### Phase 3: Player Management
- [ ] Create PlayerManagement.vue component
- [ ] Build player CRUD forms
- [ ] Implement avatar upload/selection
- [ ] Set up localStorage for player persistence
- [ ] Create player list display with edit/delete

### Phase 4: Game Setup
- [ ] Create GameSetup.vue component
- [ ] Implement player selection with auto-select logic
- [ ] Display role summary
- [ ] Add player-to-role validation
- [ ] Disable/enable Start button based on validation
- [ ] Show warning messages

### Phase 4.1: Night 0 - Role Reveal
- [ ] Create RoleRevealUI.vue component
- [ ] Build role calling interface with role progression
- [ ] Implement player acknowledgment system
- [ ] Add role acknowledgment tracking
- [ ] Create validation logic before game start
- [ ] Add "Start Game" button (enabled after all roles acknowledged)

### Phase 5: Game Flow - Night Phase
- [ ] Create GameFlow.vue component
- [ ] Build night phase UI
- [ ] Implement role action selection system
- [ ] Create role-specific action components
- [ ] Add narration text display
- [ ] Implement role action processing

### Phase 6: Game Flow - Day Phase
- [ ] Build day phase UI
- [ ] Create player voting interface
- [ ] Implement vote counting system
- [ ] Add phase timer
- [ ] Display voting results
- [ ] Track eliminated players

### Phase 7: Text-to-Speech Integration
- [ ] Integrate Web Speech API
- [ ] Add speaker button next to narration text
- [ ] Implement language selection for TTS
- [ ] Add play/pause controls
- [ ] Add speed controls for speech
- [ ] Handle TTS errors gracefully

### Phase 8: Game End & Results
- [ ] Create GameEnd.vue component
- [ ] Display end conditions (villagers/werewolves/cult win)
- [ ] Show final statistics
- [ ] Create summary table
- [ ] Implement navigation to new game/menu

### Phase 9: Mobile Optimization
- [ ] Review all components for mobile UX
- [ ] Implement fixed positioned buttons
- [ ] Test on various screen sizes
- [ ] Optimize touch targets (44px+)
- [ ] Test on real mobile devices

### Phase 10: Testing & Polish
- [ ] Test full game flow
- [ ] Verify all translations (en/vi)
- [ ] Test TTS in both languages
- [ ] Performance optimization
- [ ] Fix linting issues
- [ ] Final UI/UX polish

---

## TECHNICAL REQUIREMENTS

### Dependencies (to add)
```json
{
  "vue-i18n": "^8.28.2",
  "web-speech-api": "^0.0.1"
}
```

### Directory Structure
```
/store
  - game.js (game state)
  - players.js (player management)
  - roles.js (role management)
/components
  - RoleManagement.vue
  - PlayerManagement.vue
  - GameSetup.vue
  - GameFlow.vue
  - GameEnd.vue
  - RoleCard.vue
  - PlayerCard.vue
  - VotingInterface.vue
  - NarrationDisplay.vue
  - PhaseTimer.vue
/locales
  - en.json
  - vi.json
/pages
  - index.vue (menu)
  - roles.vue
  - players.vue
  - game-setup.vue
  - game.vue
  - game-end.vue
```

### Technologies
- **Framework**: Nuxt.js 2
- **Styling**: Tailwind CSS
- **State Management**: Vuex
- **Internationalization**: vue-i18n
- **Speech**: Web Speech API (built-in)
- **Storage**: localStorage/Vuex persistence

---

## DESIGN PRINCIPLES

1. **Mobile-first**: Design for phones, scale up
2. **Accessibility**: Large touch targets, clear labels
3. **Clear information hierarchy**: Important info prominent
4. **User feedback**: Indicate state changes immediately
5. **Error prevention**: Validate before allowing actions
6. **Multi-language**: All text translatable

---

## GAME LOGIC NOTES

- **Balance calculation**: Sum of role balance points (negative favors werewolves, positive favors villagers)
- **Phase order**: Night → Day → Night → Day... until end condition met
- **Role calling order**: See docs.js line 113 for proper order
- **Winner conditions**:
  - Villagers win: All werewolves dead
  - Werewolves win: Werewolves >= Villagers
  - Cult win: All players are cult members
  - etc. (based on special roles present)

---

## FUTURE ENHANCEMENTS (Out of Scope)
- Game recording/replay
- Statistics tracking across games
- Role complexity levels
- Custom rule sets
- Multiplayer/online support
- Dark mode
- Sound effects
- Animated role reveals

