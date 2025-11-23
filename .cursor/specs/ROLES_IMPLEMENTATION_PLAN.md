# Werewolves Monitor - Roles Implementation Plan

## Current Status

### ✅ Implemented Roles (5/40+)
1. **VILLAGER** - Basic villager role
2. **SEER** - Discover if a player is a werewolf
3. **WITCH** - Heal or poison once per game each
4. **BODYGUARD** - Protect a player each night
5. **WEREWOLF** - Kill a player each night

---

## 📋 Missing Roles by Faction

### 🏘️ VILLAGER FACTION (19 missing)

| Role | Balance Points | Nightly | Night Order | Priority | Status |
|------|----------------|---------|-------------|----------|--------|
| Hunter | 3 | NEVER | - | P1 | ⏳ TODO |
| Mayor | 2 | NEVER | - | P2 | ⏳ TODO |
| Aura Seer | 4 | ALWAYS | Custom | P1 | ⏳ TODO |
| Apprentice Seer | -3 | FIRST_NIGHT | - | P2 | ⏳ TODO |
| Cupid | 3 | FIRST_NIGHT | Custom | P2 | ⏳ TODO |
| Diseased | 3 | NEVER | - | P2 | ⏳ TODO |
| Ghost | 2 | ALWAYS | First | P2 | ⏳ TODO |
| Village Idiot | 2 | NEVER | - | P2 | ⏳ TODO |
| Martyr | 3 | NEVER | - | P2 | ⏳ TODO |
| Mason | 2 | FIRST_NIGHT | - | P2 | ⏳ TODO |
| Old Hag | 1 | ALWAYS | Custom | P2 | ⏳ TODO |
| Old Man | 0 | NEVER | - | P2 | ⏳ TODO |
| Paranormal Investigator (P.I) | 3 | ALWAYS | Custom | P1 | ⏳ TODO |
| Pacifist | -1 | NEVER | - | P3 | ⏳ TODO |
| Priest | 3 | ALWAYS | Custom | P2 | ⏳ TODO |
| Prince | 3 | NEVER | - | P2 | ⏳ TODO |
| Spellcaster | 1 | ALWAYS | Custom | P2 | ⏳ TODO |
| Tough Guy | 1 | NEVER | - | P2 | ⏳ TODO |
| Troublemaker | -3 | ALWAYS | Custom | P2 | ⏳ TODO |

### 🐺 WEREWOLF FACTION (7 missing)

| Role | Balance Points | Nightly | Night Order | Priority | Status |
|------|----------------|---------|-------------|----------|--------|
| Sorceress | -6 | ALWAYS | Custom | P1 | ⏳ TODO |
| Minion | -6 | FIRST_NIGHT | - | P1 | ⏳ TODO |
| Wolf Cub | -8 | ALWAYS | - | P1 | ⏳ TODO |
| Dire Wolf | -4 | ALWAYS | - | P2 | ⏳ TODO |
| Lone Wolf | -5 | ALWAYS | - | P2 | ⏳ TODO |
| Fruit Brute | -3 | ALWAYS | - | P2 | ⏳ TODO |
| Fang Face | -5 | FIRST_NIGHT | - | P2 | ⏳ TODO |
| Wolverine | -4 | ALWAYS | - | P3 | ⏳ TODO |

### 🌙 SPECIAL FACTION (9 missing)

| Role | Balance Points | Nightly | Night Order | Priority | Status |
|------|----------------|---------|-------------|----------|--------|
| Cursed | -3 | ALWAYS | - | P2 | ⏳ TODO |
| Doppelgänger | -2 | FIRST_NIGHT | - | P1 | ⏳ TODO |
| Drunk | 4 | FIRST_NIGHT | - | P2 | ⏳ TODO |
| Cult Leader | 1 | ALWAYS | - | P3 | ⏳ TODO |
| Hoodlum | 0 | FIRST_NIGHT | - | P3 | ⏳ TODO |
| Tanner | 1 | NEVER | - | P1 | ⏳ TODO |
| Vampire | -7 | ALWAYS | - | P3 | ⏳ TODO |
| Lycan | -1 | NEVER | - | P1 | ⏳ TODO |

---

## 🎯 Implementation Phases

### Phase 1: Core Priority Roles (10 roles)
**Focus:** Game-essential roles for balanced gameplay

**Roles:**
- Aura Seer (VILLAGER)
- Paranormal Investigator (VILLAGER)
- Sorceress (WEREWOLF)
- Minion (WEREWOLF)
- Wolf Cub (WEREWOLF)
- Doppelgänger (SPECIAL)
- Tanner (SPECIAL)
- Lycan (SPECIAL)
- Hunter (VILLAGER)
- Mayor (VILLAGER)

**Tasks:**
1. Update `RoleId` enum in `app/types/role.ts`
2. Uncomment and implement role definitions in `app/stores/roles.ts`
3. Create role-specific night action components (if needed)
4. Add role icons/images mapping

### Phase 2: Medium Priority Roles (18 roles)
**Focus:** Balanced gameplay expansion

**Roles:**
- Apprentice Seer, Cupid, Diseased, Ghost, Village Idiot, Martyr, Mason, Old Hag, Old Man, Priest, Prince, Spellcaster, Tough Guy, Troublemaker (VILLAGER)
- Dire Wolf, Lone Wolf, Fruit Brute, Fang Face (WEREWOLF)
- Cursed, Drunk (SPECIAL)

**Tasks:**
1. Implement role action panels for complex roles
2. Add game logic for role interactions
3. Update night phase sequencing

### Phase 3: Advanced/Special Roles (9 roles)
**Focus:** Complex mechanics and niche gameplay

**Roles:**
- Pacifist (VILLAGER)
- Wolverine (WEREWOLF)
- Cult Leader, Hoodlum, Vampire (SPECIAL)

**Tasks:**
1. Implement faction-switching mechanics (Cult, Vampire)
2. Complex state tracking
3. Win condition modifications

---

## 📝 Implementation Checklist

### Step 1: Update Type Definitions
- [ ] Add all missing role IDs to `RoleId` enum
- [ ] Verify `RoleFaction` enum covers all factions
- [ ] Update `NightlyActivity` if needed
- [ ] Ensure `RoleActionType` supports all action types

### Step 2: Update Role Store
- [ ] Uncomment all role definitions
- [ ] Verify all roles have correct properties:
  - `id`, `name`, `nameVi`
  - `description`, `descriptionVi`
  - `faction`, `balancePoints`
  - `nightly`, `nightOrder` (where applicable)
  - `actionType` (where applicable)

### Step 3: Create Role Components
- [ ] Create action panels for complex roles:
  - `RoleActionPanelAuraSeer.vue`
  - `RoleActionPanelSorceress.vue`
  - `RoleActionPanelMinion.vue`
  - `RoleActionPanelCupid.vue`
  - `RoleActionPanelWitchNew.vue` (if current one needs enhancement)
  - etc.

### Step 4: Update Game Logic
- [ ] Implement role-specific night phase logic
- [ ] Add role interactions and dependencies
- [ ] Handle special win conditions
- [ ] Track role state changes (e.g., Apprentice Seer inheriting)

### Step 5: UI/UX
- [ ] Add role icons mapping to all roles
- [ ] Update role display components
- [ ] Ensure role selection UI shows all roles
- [ ] Add role descriptions to game setup

### Step 6: Testing
- [ ] Test each role individually
- [ ] Test role interactions
- [ ] Verify balance points calculation
- [ ] Test persistence of selected roles

---

## 🔧 Key Implementation Details

### Night Order Management
- Roles with custom night order need to be sequenced correctly
- Update `RoleNightOrder` enum as needed
- Some roles should act before/after others (e.g., Seer after Witch)

### Action Types Needed
Current types: `SELECT_PLAYER`, `DUAL_OPTION`
Potential new types:
- `SELECT_TWO_PLAYERS` (Cupid, Doppelgänger)
- `SELECT_OR_PASS` (Priest)
- `DUAL_SELECT_PLAYERS` (Sorceress/Minion choice)
- `WRITE_MESSAGE` (Ghost)
- Custom faction actions (Cult Leader, Vampire)

### Special Mechanics
1. **Faction Switching:** Cursed → Werewolf, Doppelgänger role assumption
2. **Multiple Win Conditions:** Tanner, Lone Wolf, Cult Leader, Hoodlum
3. **State Tracking:** Witch potions, Priest uses, etc.
4. **Conditional Roles:** Apprentice Seer, Wolf Cub bonus kill
5. **Reveal Mechanics:** Mason discovery, Minion reveal

---

## 📊 Current Balance Analysis

**Villager Balance:** +1 (currently) → need -5 to -10 for 19 roles
**Werewolf Balance:** -6 (currently) → need -40 to -50 for 8 roles
**Special Balance:** 0 (currently) → varies

Total needed balance adjustments based on selected roles.

---

## 🚀 Quick Start

1. **Start with Phase 1** - These roles have images and are mentioned in comments
2. **Update `RoleId` enum first** - All roles depend on this
3. **Implement role store entries** - Move from commented to active
4. **Create night action components progressively** - One role type at a time
5. **Test continuously** - Validate each role implementation

---

## 📁 Files to Modify

1. `app/types/role.ts` - Add role IDs
2. `app/stores/roles.ts` - Activate role definitions
3. `app/types/game.ts` - Add/update action types if needed
4. `app/components/RoleAction*.vue` - Create action panels
5. `app/stores/game.ts` - Implement game logic for roles
6. `i18n/locales/*.json` - Add translations (if needed)

---

## 🎨 Assets Available

Role images are available in `public/images/roles/en/`:
- dx-apprentice-seer_400x400.png
- dx-aura-seer_400x400.png
- dx-cult-leader_400x400.png
- dx-cupid_400x400.png
- dx-cursed_400x400.png
- dx-diseased_400x400.png
- dx-doppelganger_400x400.png
- dx-drunk_400x400.png
- dx-ghost_400x400.png
- dx-hoodlum_400x400.png
- dx-hunter_400x400.png
- dx-lone-wolf_400x400.png
- dx-lycan_400x400.png
- dx-mason_400x400.png
- dx-mayor_400x400.png
- dx-minion_400x400.png
- dx-old-hag_400x400.png
- dx-pacifist_400x400.png
- dx-pi_400x400.png
- dx-priest_400x400.png
- dx-prince_400x400.png
- dx-sorceress_400x400.png
- dx-spellcaster_400x400.png
- dx-tanner_400x400.png
- dx-tough-guy_400x400.png
- dx-troublemaker_400x400.png
- dx-vampire_400x400.png
- dx-village-idiot_400x400.png
- dx-wolf-cub_400x400.png

Most roles have assets ready! 🎉


