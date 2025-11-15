# WEREWOLVES GAME MANAGER - DETAILED CHECKLIST

## 📋 IMPLEMENTATION ROADMAP

### ✅ PHASE 1: Setup & Structure
**Status**: Not Started
**Objective**: Initialize project dependencies and folder structure

**Dependencies to install:**
- [x] Install `@nuxtjs/i18n` (for Nuxt 4)
- [x] Install `pinia` (state management - Nuxt 4 standard)
- [x] Install `@pinia/nuxt` (Pinia Nuxt module)
- [x] Additional UI libraries if needed (e.g., `clsx`, `lucide-vue-next`)

**Project Structure:**
- [x] Create Pinia store structure:
  - [x] `/stores/game.ts` - Game state (phase, round, players, roles, actions)
  - [x] `/stores/players.ts` - Player profiles
  - [x] `/stores/roles.ts` - Role configurations
  - [ ] Configure `defineStore()` with TypeScript
- [x] Create `/locales` directory
- [x] Create `/locales/en.json` - English translations
- [x] Create `/locales/vi.json` - Vietnamese translations
- [x] Update `nuxt.config.ts` with i18n and Pinia modules
- [x] Create composables:
  - [x] `/composables/useI18n.ts` - i18n helper (if needed)
  - [x] `/composables/useGame.ts` - Game logic helper
- [x] Create main layout with language switcher:
  - [x] `/layouts/default.vue` - Main layout (already exists, verify)
- [x] Verify page routing structure:
  - [x] `/pages/index.vue` - Home menu (already exists)
  - [x] `/pages/roles.vue` - Role management
  - [x] `/pages/players.vue` - Player management
  - [x] `/pages/game-setup.vue` - Game setup
  - [x] `/pages/game.vue` - Game flow
  - [x] `/pages/game-end.vue` - Game end screen
- [x] Set up global styles:
  - [x] Configure Tailwind CSS (already installed via @nuxtjs/tailwindcss)
  - [x] Verify SCSS setup in `/app/assets/css/main.scss`
  - [x] Create CSS variables for theme (dark/light mode)

**TypeScript Configuration:**
- [x] Ensure `tsconfig.json` is properly configured
- [x] Add type definitions for store modules
- [x] Enable strict mode in tsconfig for better type safety

**Effort**: Medium | **Time**: 2-3 hours

---

### ✅ PHASE 2: Role Management Screen
**Status**: Not Started
**Objective**: Create role management interface with balance calculation

**Components to create:**
- [x] `components/RoleCard.vue` - Display individual role (with TypeScript `<script setup lang="ts">`)
- [x] `components/RoleManagement.vue` - Main role management page
- [x] `pages/roles.vue` - Route handler
- [x] Create TypeScript interfaces:
  - [x] `types/role.ts` - Role interface
  - [x] `types/game.ts` - Game-related types

**Features:**
- [x] Display all 38+ roles from docs.ts
- [x] Show role image (use existing `/public/images/roles/en/`)
- [x] Show role name in current language
- [x] Show role description
- [x] Show balance point value
- [x] Implement quantity controls:
  - [x] Minus button (decrease quantity)
  - [x] Input field (display quantity)
  - [x] Plus button (increase quantity)
  - [x] Prevent negative quantities
  - [x] Set max quantity limit
- [x] Calculate total game weight:
  - [x] Sum all role balance points
  - [x] Real-time calculation as quantities change
- [x] Implement color-coded balance indicator:
  - [x] Green (perfect: 0 points)
  - [x] Light Green (+1 to +5)
  - [x] Light Red (-5 to -1)
  - [x] Red (< -5 or > +5)
- [x] Display balance status text
- [x] Implement role filtering by faction:
  - [x] Villagers
  - [x] Werewolves
  - [x] Special factions (Cult, Vampire)
- [x] Add "Clear all" button
- [x] Add "Load preset" button (for common configurations)
- [x] Save selected configuration to Pinia store
- [x] Mobile responsive layout

**Effort**: Medium | **Time**: 3-4 hours

---

### ✅ PHASE 3: Player Management Screen
**Status**: ✅ COMPLETED
**Objective**: Create player profile management system

**Components Created:**
- [x] `components/PlayerCard.vue` - Display player info (TypeScript setup) ✅
- [x] `components/PlayerForm.vue` - Add/edit player form (TypeScript setup) ✅
- [x] `components/PlayerManagement.vue` - Player list manager ✅
- [x] `pages/players.vue` - Route handler ✅
- [x] `types/player.ts` - Player interface ✅

**Features Implemented:**
- [x] Player data structure (TypeScript interface):
  ```typescript
  interface Player {
    id: string;
    name: string;
    avatar: string; // base64 or image URL
    joinedDate: number; // timestamp
    gamesPlayed: number;
    wins: number;
  }
  ```
- [x] Display all players in list/grid view:
  - [x] Player avatar (circular with colorful generated SVG or uploaded image)
  - [x] Player name
  - [x] Stats (games played, wins, win rate percentage)
  - [x] Join date formatted
  - [x] Edit button with modal
  - [x] Delete button with confirmation
- [x] Add new player form:
  - [x] Name input (required, min 2 chars, max 50 chars)
  - [x] Avatar upload with validation (JPEG, PNG, GIF, WebP, max 5MB)
  - [x] Generate default avatar from initials (12-color palette)
  - [x] Submit button with loading state
  - [x] Cancel button
  - [x] Success notification
- [x] Edit existing player:
  - [x] Pre-fill form with current data
  - [x] Update Pinia store
  - [x] Show success confirmation message
- [x] Delete player:
  - [x] Confirmation dialog with player name
  - [x] Remove from store and localStorage
  - [x] Success notification
- [x] Persistence implementation:
  - [x] Save players to localStorage via Pinia
  - [x] Load players on app start
  - [x] Sync with Pinia store
- [x] Avatar generation:
  - [x] Generate colorful default avatar from name initials
  - [x] Support file upload with validation
  - [x] Convert images to base64 data URIs
  - [x] Instant preview in form
- [x] Search/filter players:
  - [x] Real-time search by player name
  - [x] Case-insensitive matching
  - [x] Live filtering of results
- [x] Import/Export functionality:
  - [x] Export player database as JSON file download
  - [x] Import players from JSON file
  - [x] File validation and error handling
  - [x] Date-stamped filenames for exports
- [x] Mobile responsive layout:
  - [x] Single column on mobile
  - [x] Two columns on tablet
  - [x] Three columns on desktop
  - [x] Touch-friendly button sizes (44px+)
  - [x] Proper spacing and padding
- [x] Multi-language support (i18n):
  - [x] English translations (23 keys)
  - [x] Vietnamese translations (23 keys)
  - [x] All labels, buttons, messages translated
- [x] Beautiful UI with Tailwind CSS:
  - [x] Gradient headers and backgrounds
  - [x] Card layouts with shadows
  - [x] Smooth transitions and animations
  - [x] Color-coded stat displays
  - [x] Modal dialogs with overlays
- [x] Error handling:
  - [x] Form validation with error messages
  - [x] File upload validation
  - [x] Import/export error handling
  - [x] Toast notifications for feedback

**Effort**: Medium | **Time**: 3-4 hours | **Actual**: COMPLETED ✅

---

### ✅ PHASE 4: Game Setup Screen
**Status**: ✅ COMPLETED
**Objective**: Create game initialization interface

**Components Created:**
- [x] `components/PlayerSelector.vue` - Player selection ✅
- [x] `components/RoleConfirmation.vue` - Role confirmation ✅
- [x] `components/GameSetup.vue` - Main setup manager ✅
- [x] `pages/game-setup.vue` - Route handler ✅

**Features Implemented:**
- [x] Display all available players as selectable cards:
  - [x] Player avatar and name
  - [x] Click to toggle selection
  - [x] Show selected state (checked, highlight)
- [x] **Smart auto-selection**:
  - [x] Query game history from Pinia store
  - [x] Auto-select players from last game
  - [x] Allow moderator to override selections
- [x] Display real-time counts:
  - [x] Players selected: X
  - [x] Roles configured: Y
  - [x] Status message (computed property)
- [x] After player selection, show roles screen:
  - [x] Display selected roles and their counts
  - [x] Show total role slots
  - [x] Allow role adjustment
  - [x] Show game balance indicator
- [x] Validation logic:
  - [x] Total players === Total role slots
  - [x] Show clear error message if mismatch
  - [x] Specific dynamic error messages with counts
- [x] Start Game button:
  - [x] **Disabled state**: Numbers don't match (visual feedback, greyed out)
  - [x] **Enabled state**: Numbers match (bright color, ready)
  - [x] **Click action**: Save game setup to Pinia store, navigate to game page
- [x] Show warning/error prominently:
  - [x] Red alert box for mismatches
  - [x] Green alert for perfect match
  - [x] Clear, actionable message
  - [x] Specific numbers that don't match
- [x] Add "Back" button to go to menu
- [x] Mobile responsive layout with fixed buttons
- [x] Multi-language support (i18n):
  - [x] English translations
  - [x] Vietnamese translations
- [x] Beautiful UI with Tailwind CSS:
  - [x] Grid layout for player cards
  - [x] Side-by-side panels on desktop
  - [x] Responsive design for all screens
  - [x] Fixed button bar at bottom with safe area padding
  - [x] Color-coded alerts (red/green)
  - [x] Smooth transitions and hover effects

**Effort**: Medium | **Time**: 3-4 hours | **Actual**: COMPLETED ✅

---

### ✅ PHASE 4.1: Night 0 - Role Reveal
**Status**: ✅ COMPLETED
**Objective**: Allow players to recognize their role group before game starts

**Components Created:**
- [x] `components/RoleRevealUI.vue` - Role reveal interface ✅
- [x] `components/RoleCallout.vue` - Individual role callout display ✅
- [x] `components/RoleRecognition.vue` - Main role recognition manager ✅
- [x] `pages/night-zero.vue` - Route handler ✅

**Features Implemented:**
- [x] Display all selected players with role status
- [x] Moderator controls:
  - [x] "Call Next Role" button
  - [x] "Call Previous Role" button
  - [x] Display current role being called (large, prominent, 5xl/6xl text)
  - [x] Show role description in current language
  - [x] Show how many players have this role (expected count)
- [x] Call each role in order (from docs.ts role order - sorted from roles store):
  - [x] Role name displayed in current language (supports English & Vietnamese)
  - [x] Players with that role can acknowledge (self-identify)
  - [x] Show indicator when role players open their eyes/acknowledge
- [x] Player identification process:
  - [x] When role is called, matching players see indicator "This is your role" (green border)
  - [x] Players can click "I'm in!" button to acknowledge
  - [x] Moderator can see acknowledgment count vs expected count (real-time counter)
  - [x] Show visual feedback (checkmark ✓, green highlight, color change)
  - [x] Pulsing animation for players waiting to acknowledge
- [x] Navigation:
  - [x] "Previous Role" button (disabled on first role)
  - [x] "Next Role" button (disabled on last role)
  - [x] Skip to role by clicking role list in sidebar
  - [x] "Start Game" button (enabled only when all roles acknowledged)
  - [x] "Back to Setup" button to return to game setup
  - [x] "Force Start" button (moderator override, visible when not all acknowledged)
- [x] Role acknowledgment tracking:
  - [x] Track which players have acknowledged their role in `gameStore.roleAcknowledgments`
  - [x] Verify count matches expected number (real-time validation)
  - [x] Show summary of acknowledged vs expected for each role
  - [x] Role progress sidebar with color-coded status badges
- [x] Safety check:
  - [x] Confirm all roles acknowledged before allowing "Start Game"
  - [x] Warning if mismatch between players and acknowledged (orange alert)
  - [x] Detailed mismatch warnings showing specific roles with count differences
  - [x] Option to force start (for moderator override with yellow "Force Start" button)
  - [x] Success message when all roles acknowledged (green alert)
- [x] Multi-language support (i18n):
  - [x] English translations (14 keys, all implemented)
  - [x] Vietnamese translations (14 keys, all implemented)
  - [x] Language-aware role names and descriptions
- [x] Beautiful UI with Tailwind CSS:
  - [x] Large role name display (text-5xl/text-6xl)
  - [x] Clear acknowledgment indicators (green badges, orange warnings)
  - [x] Role progress tracker (sticky sidebar with scrollable list)
  - [x] Player acknowledgment status (card layout with avatars)
  - [x] Mobile responsive layout (3-col desktop, stacked mobile)
  - [x] Fixed footer buttons with safe area padding
  - [x] Gradient purple header and smooth transitions

**Data Flow:**
- GameSetup page → Start Game button → `gameStore.initializeGame()` → routes to `/night-zero`
- RoleRevealUI mounts → `gameStore.assignRolesToPlayers()` shuffles & assigns roles
- Roles displayed in sorted order (maintaining docs.ts role sequence)
- Players see personalized message when their role is called
- Acknowledgments tracked in real-time, validation updates dynamically
- All roles acknowledged → Start Game button enabled → routes to `/game`

**Effort**: Medium | **Time**: 3-4 hours | **Actual**: COMPLETED ✅

---

### ✅ PHASE 5: Game Flow - Night Phase
**Status**: ✅ COMPLETED
**Objective**: Implement night phase management with role actions and day phase voting

**Components Created:**
- [x] `components/PhaseHeader.vue` - Display current phase/round ✅
- [x] `components/RoleAction.vue` - Individual role action component ✅
- [x] `components/RoleActionPanel.vue` - All active roles list ✅
- [x] `components/GameFlow.vue` - Main game manager ✅
- [x] `components/VotingInterface.vue` - Moderator vote control ✅
- [x] `pages/game.vue` - Route handler ✅

**Features Implemented:**
- [x] Phase header with live stats:
  - [x] Current phase (NIGHT or DAY)
  - [x] Current round number
  - [x] Living player count
  - [x] Active roles count
  - [x] Eliminated players count
  - [x] Progress bar
- [x] Night phase sequence:
  - [x] Query which roles need to act (from roles store)
  - [x] For each active role, display action panel:
    - [x] Role name and faction color-coding
    - [x] Role description
    - [x] Action prompt
    - [x] Player selection UI (clickable grid)
    - [x] Confirm/Skip buttons
  - [x] Process actions in sequence
  - [x] Track all night actions in game store
  - [x] Display night results (who died, etc.)
  - [x] Transition to day phase with 3-second delay
- [x] Role-specific action handlers (useNightPhaseActions composable):
  - [x] Werewolf: Kill selection
  - [x] Seer: Investigation with result tracking
  - [x] Witch: Heal/poison actions
  - [x] Bodyguard: Protection mechanics
  - [x] Aura Seer: Special role detection
  - [x] Hunter: Action registration
  - [x] Vampire: Kill mechanics
  - [x] Cult Leader: Recruitment tracking
- [x] Day phase (Discussion + Voting):
  - [x] 10-minute discussion timer (configurable)
  - [x] Moderator vote control interface:
    - [x] Increase (+) / Decrease (−) votes per player
    - [x] Vote total ≤ alive players count
    - [x] Toggle "Mark for Kill" (☠️) for elimination
    - [x] Real-time vote summary display
  - [x] Vote finalization with elimination results
- [x] Win condition checking:
  - [x] All werewolves eliminated → Villagers win (END)
  - [x] Werewolves ≥ Villagers → Werewolves win (END)
  - [x] Otherwise → Continue to next night
- [x] Game flow control:
  - [x] Fixed navigation buttons
  - [x] Skip options (moderator)
  - [x] Return to menu
  - [x] State persistence via Pinia
- [x] Mobile responsive (full-screen, touch-friendly)
- [x] i18n support (English & Vietnamese)

**Effort**: High | **Time**: 5-6 hours | **Actual**: COMPLETED ✅

---

### ✅ PHASE 6: Game Flow - Day Phase
**Status**: ✅ COMPLETED
**Objective**: Implement day phase with discussion timer and voting

**Components Created:**
- [x] `components/PhaseTimer.vue` - Countdown timer (integrated in GameFlow) ✅
- [x] `components/VotingInterface.vue` - Moderator vote control ✅
- [x] `components/GameFlow.vue` - Day phase manager (integrated) ✅

**Features Implemented:**
- [x] Day phase sequence:
  - [x] Display phase start message (☀️)
  - [x] Start discussion timer (10 min default, configurable)
  - [x] Show timer countdown in MM:SS format
  - [x] Auto-transition when timer ends
  - [x] Announce voting phase
- [x] Moderator vote control:
  - [x] Display all living players as vote targets
  - [x] Each player shows:
    - [x] Avatar with name
    - [x] Vote counter with +/− buttons
    - [x] Current vote count display
  - [x] Vote total ≤ alive players count (enforced)
  - [x] "Mark for Kill" (☠️) toggle for each player
  - [x] Real-time summary:
    - [x] Total votes cast
    - [x] Players alive
    - [x] Marked for kill count
    - [x] Remaining votes available
- [x] Vote submission:
  - [x] "Finalize & Eliminate" button
  - [x] Process marked players for elimination
  - [x] Display elimination results with vote counts
  - [x] Show "No one eliminated" if none marked
- [x] Win condition checks:
  - [x] All werewolves eliminated → Villagers win (END GAME)
  - [x] Werewolves ≥ Villagers → Werewolves win (END GAME)
  - [x] Otherwise → Proceed to next night
  - [x] Auto-navigate to game-end screen on win
- [x] Phase transitions:
  - [x] Day → End (if win condition met)
  - [x] Day → Night (if game continues)
  - [x] Proper state reset between phases
- [x] Mobile responsive (full-width cards, touch-friendly)
- [x] i18n support (English & Vietnamese)

**Effort**: High | **Time**: 5-6 hours | **Actual**: COMPLETED ✅

---

### ✅ PHASE 7: Text-to-Speech Integration
**Status**: Not Started
**Objective**: Add narration audio reading capability

**Components to create:**
- [ ] `components/NarrationDisplay.vue` - Text + TTS button
- [ ] `/composables/useTextToSpeech.ts` - TTS utility (replaces mixins)
  - [ ] Composable should return functions and state for TTS control
  - [ ] TypeScript types for voice selection

**Features:**
- [ ] Web Speech API integration:
  - [ ] Detect browser support
  - [ ] Fallback if not available (show message)
- [ ] Speaker button next to all narration text:
  - [ ] Button icon (🔊)
  - [ ] Position: inline next to text
  - [ ] Click to start speaking
- [ ] TTS Controls:
  - [ ] Play button (start/resume)
  - [ ] Pause button (stop mid-sentence)
  - [ ] Stop button (reset)
  - [ ] Speed slider (0.8x - 1.5x):
    - [ ] Display current speed
    - [ ] Adjust in 0.1x increments
  - [ ] Voice selector (if browser supports):
    - [ ] List available voices
    - [ ] Show current selection
    - [ ] Persist selection preference
- [ ] Language support:
  - [ ] Vietnamese narration (vi-VN voice)
  - [ ] English narration (en-US voice)
  - [ ] Auto-detect from app language setting
- [ ] Features:
  - [ ] Read narration in app language
  - [ ] Use appropriate voice for language
  - [ ] Handle text with special characters (names, emphasis)
  - [ ] Cancel previous speech before starting new one
- [ ] Error handling:
  - [ ] Show error if speech API fails
  - [ ] Fallback to manual reading
  - [ ] Log errors for debugging
- [ ] Mobile support:
  - [ ] Test on iOS Safari (may be limited)
  - [ ] Test on Android Chrome
  - [ ] Show appropriate warnings if unsupported
- [ ] Accessibility:
  - [ ] Add aria-labels to buttons
  - [ ] Keyboard accessible
  - [ ] Screen reader friendly

**Effort**: Medium | **Time**: 2-3 hours

---

### ✅ PHASE 8: Game End Screen
**Status**: Not Started
**Objective**: Display game results and summary

**Components to create:**
- [ ] `components/GameEndResult.vue` - Result display
- [ ] `components/GameSummary.vue` - Summary table
- [ ] `components/GameEnd.vue` - Main game end manager
- [ ] `pages/game-end.vue` - Route handler

**Features:**
- [ ] End condition determination:
  - [ ] Villagers win: All werewolves dead
  - [ ] Werewolves win: Werewolves >= Villagers
  - [ ] Cult win: All remaining players are cult members
  - [ ] Tanner win: If Tanner lynched
  - [ ] Hoodlum win: Both targets dead and alive
  - [ ] Lone Wolf win: Last survivor
  - [ ] Lovers win: Last two survivors are lovers
- [ ] Victory screen:
  - [ ] Large, clear "TEAM WIN!" message
  - [ ] Team name (VILLAGERS / WEREWOLVES / CULT / etc.)
  - [ ] Animated confetti/celebration (optional)
  - [ ] Team color background
- [ ] Game statistics:
  - [ ] Total rounds played
  - [ ] Total players
  - [ ] Survivors count
  - [ ] Eliminations count
  - [ ] Final day number
- [ ] Summary table:
  - [ ] Columns: Player | Role | Status | Eliminated By | Round
  - [ ] Rows: All players sorted by survival
  - [ ] Highlight winning team in different color
  - [ ] Show role icons/colors
- [ ] Individual player results:
  - [ ] Avatar
  - [ ] Name
  - [ ] Role (revealed)
  - [ ] How eliminated (voted/killed/lynched)
  - [ ] Which round
  - [ ] Won badge if on winning team
- [ ] Game log/timeline:
  - [ ] Optional expanded view of game events
  - [ ] Each round summary
  - [ ] All eliminations chronologically
- [ ] Action buttons:
  - [ ] "Play Again" → Return to game setup with same players
  - [ ] "New Game" → Return to game setup, clear selections
  - [ ] "View Players" → Go to players management
  - [ ] "Save Record" → Save game result to history
  - [ ] "Main Menu" → Go to home page
- [ ] Mobile responsive layout

**Effort**: Medium | **Time**: 3-4 hours

---

### ✅ PHASE 9: Mobile Optimization
**Status**: Not Started
**Objective**: Ensure excellent mobile UX

**Testing on:**
- [ ] iPhone (iOS Safari)
- [ ] Android (Chrome)
- [ ] iPad/Tablet
- [ ] Desktop (verification)

**Checklist:**
- [ ] Fixed button positioning:
  - [ ] Start Game button → position: fixed, bottom: safe-area
  - [ ] Next Phase button → position: fixed, bottom: safe-area
  - [ ] Submit Vote button → position: fixed, bottom: safe-area
  - [ ] All fixed buttons have z-index stacking
  - [ ] No overlap with page content
- [ ] Touch targets:
  - [ ] All buttons minimum 44px × 44px (ideally 48-56px)
  - [ ] Adequate spacing between buttons (12px minimum)
  - [ ] No small click targets
  - [ ] Test with thumb/finger interaction
- [ ] Responsive layout:
  - [ ] Mobile-first CSS (start with sm breakpoint)
  - [ ] sm (640px): Single column, stacked layouts
  - [ ] md (768px): Two columns where appropriate
  - [ ] lg (1024px): Three columns/full layouts
- [ ] Viewport optimization:
  - [ ] Proper viewport meta tag (already in nuxt.config)
  - [ ] No horizontal scroll
  - [ ] Font sizes readable without zoom:
    - [ ] Body text: 16px minimum
    - [ ] Headings: 20px+ 
  - [ ] Line height adequate (1.5+)
- [ ] Form inputs:
  - [ ] Input fields 44px tall
  - [ ] Appropriate keyboard type (number, tel, email)
  - [ ] Sufficient padding inside inputs
  - [ ] Touch-friendly select dropdowns
- [ ] Images:
  - [ ] Responsive images (use srcset if needed)
  - [ ] Player avatars scale appropriately
  - [ ] Role cards fit on mobile
  - [ ] No giant images slowing page
- [ ] Scrolling:
  - [ ] Smooth scrolling
  - [ ] No janky animation
  - [ ] Fixed elements don't cover content
  - [ ] Proper padding at bottom (safe area)
- [ ] Test scenarios:
  - [ ] Select 8 players on mobile (usable?)
  - [ ] Vote during day phase on mobile
  - [ ] Read narration and hear TTS on mobile
  - [ ] Navigate between phases smoothly
- [ ] Performance:
  - [ ] Page loads within 3 seconds (3G)
  - [ ] Interactions respond immediately
  - [ ] No frame drops during animations
  - [ ] Battery usage reasonable

**Effort**: Medium | **Time**: 3-4 hours

---

### ✅ PHASE 10: Testing & Polish
**Status**: Not Started
**Objective**: Comprehensive testing and final refinements

**Functionality Testing:**
- [ ] Full 5-player game flow (test all phases)
- [ ] Full 10-player game flow (test with more roles)
- [ ] All role actions work correctly
- [ ] Win conditions trigger properly
- [ ] Special role combinations (lovers, cult, etc.)
- [ ] All edge cases handled:
  - [ ] Player disconnection (refresh)
  - [ ] Role action skipping
  - [ ] Tie voting
  - [ ] Multiple eliminations same round
  - [ ] Deaths before action phase
- [ ] Data persistence:
  - [ ] Players save between sessions
  - [ ] Game state survives refresh
  - [ ] Language selection persists

**Translation Testing:**
- [ ] All UI text translated (en + vi)
- [ ] All role names and descriptions (en + vi)
- [ ] All narration text (en + vi)
- [ ] All button labels (en + vi)
- [ ] All error messages (en + vi)
- [ ] No missing translation keys
- [ ] No hardcoded English text
- [ ] TTS works for both languages
- [ ] Vietnamese diacritics display correctly
- [ ] Language switcher works

**Text-to-Speech Testing:**
- [ ] TTS button appears next to all narration
- [ ] TTS works in English
- [ ] TTS works in Vietnamese
- [ ] Speed control works
- [ ] Pause/resume works
- [ ] Stop button works
- [ ] Voice selector works (if available)
- [ ] Fallback message if unsupported browser
- [ ] No error messages in console

**Mobile Testing:**
- [ ] Test on 3 different mobile devices
- [ ] All buttons accessible and properly sized
- [ ] No horizontal scrolling
- [ ] Fixed buttons don't cover content
- [ ] Forms are usable
- [ ] Voting interface clear on mobile
- [ ] TTS accessible on mobile
- [ ] Performance adequate

**Linting & Code Quality:**
- [ ] Run ESLint (if configured) and fix all errors
- [ ] TypeScript strict mode enabled and passing
  - [ ] No `any` types (except where absolutely necessary)
  - [ ] All props properly typed
  - [ ] All computed properties typed
- [ ] No console warnings or errors
- [ ] No Vue lifecycle warnings
- [ ] All components use `<script setup lang="ts">` pattern
- [ ] All props have type definitions (interface or type)
- [ ] No unused variables/imports
- [ ] Code follows naming conventions
- [ ] Comments for complex logic
- [ ] Consistent code formatting (use Prettier if available)

**Browser Compatibility:**
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] iOS Safari
- [ ] Android Chrome

**Performance Optimization:**
- [ ] Lazy load components where appropriate
- [ ] Optimize images (compression)
- [ ] No memory leaks (test long gameplay)
- [ ] Smooth 60fps animations
- [ ] Bundle size acceptable

**Final Polish:**
- [ ] Review all visual design
- [ ] Ensure consistent styling
- [ ] Color contrast adequate (a11y)
- [ ] Loading states clear
- [ ] Error states clear
- [ ] Success feedback visible
- [ ] No placeholder text in production
- [ ] README updated with instructions
- [ ] Comments added for maintainability

**Deployment Preparation:**
- [ ] Run `npm run build` and verify no errors
- [ ] Run `npm run generate` for static site (if using SSG)
- [ ] Test generated build locally with `npm run preview`
- [ ] Optimize for web:
  - [ ] Image optimization in `/public/images/`
  - [ ] Remove unused dependencies
  - [ ] Check bundle size with `nuxt build --analyze` (if available)
- [ ] Update meta tags in `nuxt.config.ts`:
  - [ ] favicon
  - [ ] page title and description
  - [ ] viewport settings
- [ ] Verify environment variables configured (if using `.env`)
- [ ] Test on production build locally
- [ ] Check TypeScript build passes

**Effort**: High | **Time**: 4-5 hours

---

## 📊 SUMMARY

|| Phase | Status | Est. Time | Difficulty |
||-------|--------|-----------|-----------|
|| 1. Setup & Structure | ✅ COMPLETED | 2-3h | Medium |
|| 2. Role Management | ✅ COMPLETED | 3-4h | Medium |
|| 3. Player Management | ✅ COMPLETED | 3-4h | Medium |
|| 4. Game Setup | ✅ COMPLETED | 3-4h | Medium |
|| 4.1. Night 0 - Role Reveal | ✅ COMPLETED | 3-4h | Medium |
|| 5. Game Flow (Night) | ⏳ Pending | 5-6h | High |
|| 6. Game Flow (Day) | ⏳ Pending | 5-6h | High |
|| 7. Text-to-Speech | ⏳ Pending | 2-3h | Medium |
|| 8. Game End | ⏳ Pending | 3-4h | Medium |
|| 9. Mobile Optimization | ⏳ Pending | 3-4h | Medium |
|| 10. Testing & Polish | ⏳ Pending | 4-5h | High |
|| **COMPLETED: 5/11** | **~15-19h** | **45% Done** |
|| **REMAINING: 6/11** | **~27-35h** | **55% Remaining** |

---

## 🎯 KEY SUCCESS METRICS

- ✅ All 10 phases completed
- ✅ Full game playable end-to-end
- ✅ Both English and Vietnamese working
- ✅ Mobile experience excellent
- ✅ Zero console errors/warnings
- ✅ Text-to-speech functioning
- ✅ All tests passing
- ✅ Performance acceptable

---

## 📝 NOTES

- Start with Phase 1 to establish foundation
- Phases 5-6 are most complex (allocate most time)
- Test frequently to catch issues early
- Get user feedback on Phase 2-4 early
- Leave Phase 10 for final polish
- Document any blockers/decisions made

