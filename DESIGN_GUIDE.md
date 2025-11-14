# WEREWOLVES GAME MANAGER - DESIGN & UX GUIDE

## 🎨 DESIGN SYSTEM

### Color Palette

#### Primary Team Colors
```
Villagers/Townspeople:
  - Primary: #3B82F6 (Blue)
  - Light: #DBEAFE (Light Blue)
  - Dark: #1E40AF (Dark Blue)

Werewolves:
  - Primary: #EF4444 (Red)
  - Light: #FEE2E2 (Light Red)
  - Dark: #7F1D1D (Dark Red)

Special Factions:
  - Cult: #A855F7 (Purple)
  - Vampire: #DC2626 (Crimson)
  - Tanner: #F97316 (Orange)
```

#### Semantic Colors
```
Success: #10B981 (Green) - Game actions, wins
Warning: #F59E0B (Amber) - Alerts, cautions
Error: #EF4444 (Red) - Errors, invalid states
Info: #06B6D4 (Cyan) - Information messages
Neutral: #6B7280 (Gray) - Neutral UI elements
```

#### Game Balance Colors
```
Perfect Balance (0):    #10B981 (Green)
Slightly Positive:      #86EFAC (Light Green)
Slightly Negative:      #FECACA (Light Red)
Severely Imbalanced:    #EF4444 (Red)
```

---

## 🔤 TYPOGRAPHY

### Font Stack (using system fonts)
```css
font-family: system-ui, -apple-system, sans-serif;
```

### Font Sizes
```
h1: 32px/2rem     - Page titles
h2: 24px/1.5rem   - Section titles
h3: 20px/1.25rem  - Component titles
body: 16px/1rem   - Main text
small: 14px/0.875rem - Secondary text
tiny: 12px/0.75rem - Captions

Mobile:
h1: 24px/1.5rem
h2: 20px/1.25rem
h3: 18px/1.125rem
body: 14px/0.875rem
small: 12px/0.75rem
```

### Font Weights
```
Light: 300
Regular: 400
Medium: 500 (for interactive elements)
Semibold: 600 (for important text)
Bold: 700 (for headings)
```

### Line Height
```
Headings: 1.2
Body: 1.6
Compact: 1.4
```

---

## 🎯 SPACING SYSTEM

### Tailwind Spacing Scale (used throughout)
```
0:    0px
1:    4px
2:    8px
3:    12px
4:    16px
6:    24px
8:    32px
10:   40px
12:   48px
16:   64px
20:   80px
```

### Common Patterns
```
Page padding:       px-4 (mobile) → px-8 (desktop)
Section gap:        gap-6 (mobile) → gap-8 (desktop)
Card padding:       p-4 (mobile) → p-6 (desktop)
Button padding:     px-4 py-2 (mobile) → px-6 py-3 (desktop)
Element spacing:    mb-4 (between elements)
```

---

## 🔘 COMPONENT STYLES

### Buttons

#### Primary Button (Main action)
```
Background: #3B82F6 (Blue)
Text: White
Padding: px-6 py-3
Border Radius: rounded-lg (8px)
Hover: bg-blue-700
Active: bg-blue-800
Disabled: opacity-50, cursor-not-allowed

Mobile: Full width on small screens (w-full)
Min height: 44px (touch target)
```

#### Secondary Button (Alternative action)
```
Background: #E5E7EB (Gray)
Text: #1F2937 (Gray-900)
Padding: px-4 py-2
Border Radius: rounded-lg
Hover: bg-gray-300
Active: bg-gray-400
```

#### Danger Button (Destructive action)
```
Background: #EF4444 (Red)
Text: White
Padding: px-6 py-3
Border Radius: rounded-lg
Hover: bg-red-700
Active: bg-red-800
```

#### Icon Button (Compact action)
```
Background: Transparent/Hover color
Text: Theme color
Size: 40px × 40px (mobile) → 44px × 44px (desktop)
Border Radius: rounded-full
```

### Cards

#### Role Card
```
Background: White
Border: 1px solid #E5E7EB
Border Radius: rounded-lg
Padding: p-4
Box Shadow: shadow (on hover: shadow-lg)
Hover: Scale 1.02, shadow-lg

Contains:
- Role image (top, 120×120px)
- Role name (bold, dark)
- Role description (small, gray)
- Balance point (bottom-left, -3 to +7)
```

#### Player Card
```
Background: White
Border: 2px solid #E5E7EB (selected: #3B82F6)
Border Radius: rounded-lg
Padding: p-3
Box Shadow: shadow-sm
Hover: bg-blue-50, border-blue-300

Contains:
- Avatar (circular, 56×56px)
- Player name (bold)
- Stats (gray, small)
- Checkmark (if selected, top-right)
```

### Input Fields
```
Background: White
Border: 1px solid #D1D5DB
Border Radius: rounded-md
Padding: px-3 py-2
Focus: outline-none, ring-2, ring-blue-500
Error: border-red-500, ring-red-500
Disabled: bg-gray-100, cursor-not-allowed

Mobile: Min height 44px
Font size: 16px (prevent iOS zoom)
```

### Badges

#### Role Type Badge
```
Villager:    bg-blue-100, text-blue-800, "👥 Villager"
Werewolf:    bg-red-100, text-red-800, "🐺 Werewolf"
Cult:        bg-purple-100, text-purple-800, "⛪ Cult"
Special:     bg-yellow-100, text-yellow-800, "✨ Special"
```

#### Status Badge
```
Alive:       bg-green-100, text-green-800, "✓ Alive"
Dead:        bg-gray-100, text-gray-800, "✗ Dead"
Eliminated:  bg-red-100, text-red-800, "✗ Eliminated"
```

---

## 🎪 LAYOUT PATTERNS

### Page Layout
```html
<div class="min-h-screen bg-gray-50">
  <!-- Header/Nav -->
  <div class="bg-white border-b">
    <div class="max-w-7xl mx-auto px-4 py-4">
      <!-- content -->
    </div>
  </div>

  <!-- Main Content -->
  <div class="max-w-7xl mx-auto px-4 py-8">
    <!-- page content -->
  </div>

  <!-- Mobile Safe Area (bottom buttons) -->
  <div class="h-24"></div> <!-- spacer for fixed buttons -->
</div>
```

### Card Grid (Role/Player Selection)
```
Mobile (sm):   1 column  (w-full)
Tablet (md):   2 columns (grid-cols-2, gap-4)
Desktop (lg):  3 columns (grid-cols-3, gap-6)
Desktop (xl):  4 columns (grid-cols-4, gap-6)
```

### Voting Grid (Day Phase)
```
Mobile (sm):   2 columns (grid-cols-2)
Tablet (md):   3 columns (grid-cols-3)
Desktop (lg):  4 columns (grid-cols-4)
Compact vote cards: 80×100px on mobile, 100×120px on desktop
```

---

## 🎬 INTERACTIONS & ANIMATIONS

### Transitions
```css
transition: all 0.2s ease-in-out

/* Specific transitions */
hover: scale-105 (cards)
active: scale-95 (buttons)
opacity changes: 0.3s
slide animations: 0.3s cubic-bezier(0.4, 0, 0.2, 1)
```

### State Feedback
```
Hover:   Slight scale up, shadow increase
Active:  Scale down, background darken
Disabled: Opacity 50%, cursor not-allowed
Loading: Spinner animation, button disabled
Success: Green check, toast message
Error:   Red border, error message
```

### Phase Transitions
```
Night → Day:
  - Fade out (0.3s)
  - Update content
  - Fade in (0.3s)

Vote ending:
  - Highlight winner
  - Play success animation
  - Disable other votes
```

---

## 📱 MOBILE-SPECIFIC DESIGN

### Safe Area Handling (iPhone Notch)
```css
/* Fixed buttons account for safe area */
.fixed-bottom {
  position: fixed;
  bottom: max(12px, env(safe-area-inset-bottom));
  left: max(12px, env(safe-area-inset-left));
  right: max(12px, env(safe-area-inset-right));
  z-index: 50;
}
```

### Touch Targets
```
Minimum: 44×44px (Apple guideline)
Recommended: 48×48px or larger
Spacing: 12px minimum between targets
Padding: 8px inside button to content
```

### Readable Without Zoom
```
Base font size: 16px
Never use < 14px for body text
Line height: 1.5+ for readability
Tap target text: 14px+
```

### Landscape Orientation
```
sm: 568px width (iPhone SE landscape)
Must still be usable in landscape
Don't hide critical UI elements
Use horizontal scroll sparingly
```

---

## 🎨 COMPONENT-SPECIFIC DESIGNS

### Role Management Screen
```
┌─────────────────────────────────────┐
│ Role Management                     │
├─────────────────────────────────────┤
│
│ Balance Status: [Green/Red indicator]
│ Total Weight: -3 (Slightly favors werewolves)
│
│ [Filter: All] [Villagers] [Werewolves]
│
│ ┌──────────┐ ┌──────────┐ ┌──────────┐
│ │ [Image]  │ │ [Image]  │ │ [Image]  │
│ │ Role     │ │ Role     │ │ Role     │
│ │ -3       │ │ +4       │ │ +7       │
│ │ [-] 2 [+]│ │ [-] 1 [+]│ │ [-] 1 [+]│
│ └──────────┘ └──────────┘ └──────────┘
│
│ [Clear All] [Load Preset] [Next]
└─────────────────────────────────────┘
```

### Player Management Screen
```
┌─────────────────────────────────────┐
│ Players                      [+Add] │
├─────────────────────────────────────┤
│
│ ┌────────────────────────────────┐
│ │ [Avatar] John    [Edit] [Delete]│
│ │          5 games, 2 wins       │
│ └────────────────────────────────┘
│
│ ┌────────────────────────────────┐
│ │ [Avatar] Alice   [Edit] [Delete]│
│ │          12 games, 7 wins      │
│ └────────────────────────────────┘
│
└─────────────────────────────────────┘
```

### Game Setup Screen
```
┌─────────────────────────────────────┐
│ Select Players (Step 1/2)           │
├─────────────────────────────────────┤
│
│ Selected: 0/8 Required
│
│ ┌──────────┐ ┌──────────┐
│ │ ✓[Avatar]│ │ [ Avatar]│
│ │ John     │ │ Alice    │
│ └──────────┘ └──────────┘
│
│ [Back] ← ← ← [Next →]
├─────────────────────────────────────┤
│ ⚠️  ERROR: 0 players selected, need 8
│ Please select at least 8 players
└─────────────────────────────────────┘
```

### Game Flow - Night Phase
```
┌─────────────────────────────────────┐
│ 🌙 NIGHT PHASE - Round 1            │
│ 7 players alive | 2 werewolves      │
├─────────────────────────────────────┤
│
│ Seer, please investigate a player:
│
│ ┌──────────┐ ┌──────────┐
│ │ [Avatar] │ │ [Avatar] │
│ │ John     │ │ Alice    │
│ └──────────┘ └──────────┘
│
│ [Back] ← ← ← [Confirm]
└─────────────────────────────────────┘
```

### Game Flow - Day Phase
```
┌─────────────────────────────────────┐
│ ☀️  DAY PHASE - Discussion          │
│ 5:42 remaining | Vote when ready    │
├─────────────────────────────────────┤
│
│ "Someone was killed last night..."
│ 🔊 [TTS Button]
│
│ [Discuss]
│
│ ┌──────────┐ ┌──────────┐
│ │ [Avatar] │ │ [Avatar] │
│ │ John  (0)│ │ Alice (3)│
│ └──────────┘ └──────────┘
│
│ [Fixed at bottom]
│ ════════════════════════════════════
│ [VOTE RESULTS] [← CHANGE VOTE →]    
│ ════════════════════════════════════
│
│ (If submitted:)
│ ✓ Your vote for: Alice
│ [Submit Vote]
└─────────────────────────────────────┘
```

### Game End Screen
```
┌─────────────────────────────────────┐
│                                     │
│        🎉 VILLAGERS WIN! 🎉         │
│                                     │
│    Game lasted 4 rounds             │
│    7 players, 3 survived            │
│                                     │
├─────────────────────────────────────┤
│
│ RESULTS:
│ [Avatar] John    | Seer    | Alive ✓
│ [Avatar] Alice   | Villager| Dead (lynched)
│ [Avatar] Bob     | Werewolf| Dead (eliminated)
│
│ ═══════════════════════════════════
│ [Play Again] [Main Menu]
│
└─────────────────────────────────────┘
```

---

## 🌐 INTERNATIONALIZATION VISUAL NOTES

### Text Expansion
- Vietnamese text is typically 20-30% longer than English
- Add extra width/height to UI elements in Vietnamese
- Headings: Use flexible width (max-w-full)
- Buttons: Use larger width on non-mobile
- Never cut off text mid-word

### Font Rendering
- Both languages use Unicode perfectly
- No special fonts needed
- Vietnamese diacritics: é, ơ, ư, đ display correctly
- Use `lang="vi"` attribute for Vietnamese sections

### Right-to-Left (Future)
- Not needed for Vietnamese/English
- Structure is flexible for RTL if needed later

---

## ♿ ACCESSIBILITY (WCAG 2.1 AA)

### Color Contrast
```
Normal text:      4.5:1 minimum
Large text (18+): 3:1 minimum
UI elements:      3:1 minimum
```

### Keyboard Navigation
```
Tab order: Logical, top-to-bottom, left-to-right
Focus indicator: Visible (2px outline)
Skip link: "Skip to main content" (optional)
No keyboard trap: All elements escapable
```

### Screen Reader Support
```
alt text: All images have descriptive alt text
aria-label: All icon buttons labeled
aria-live: Game updates announced
role: Semantic HTML used primarily
```

### Form Accessibility
```
Labels: Associated with inputs (for/id)
Errors: Associated with inputs (aria-describedby)
Required: Marked with aria-required
Instructions: Clear and concise
```

---

## 📊 RESPONSIVE BREAKPOINTS

### Tailwind Breakpoints (standard)
```
sm:  640px   (mobile landscape, large phone)
md:  768px   (tablet)
lg:  1024px  (desktop)
xl:  1280px  (large desktop)
2xl: 1536px  (ultra-wide)

Focus: sm, md, lg (most common devices)
```

### Device Targeting
```
Mobile:      < 640px   (iPhone, Android phone)
Tablet:      640-1024px (iPad, Android tablet)
Desktop:     > 1024px  (Laptops, large screens)

Testing sizes:
- iPhone 12: 390×844px (sm)
- iPad: 768×1024px (md)
- Desktop: 1920×1080px (lg+)
```

---

## 🎯 DESIGN CHECKLIST

Before implementation of each component:
- [ ] Colors match palette
- [ ] Typography hierarchy correct
- [ ] Spacing consistent (using 4px grid)
- [ ] Touch targets 44px+ on mobile
- [ ] Focus states visible
- [ ] Hover states clear
- [ ] Error states obvious
- [ ] Accessible (contrast, alt text)
- [ ] Responsive (mobile/tablet/desktop)
- [ ] Translations fit without overflow
- [ ] No hardcoded colors (use Tailwind classes)
- [ ] Smooth transitions/animations
- [ ] Performance: < 3s load time
- [ ] Works offline (PWA ready)

---

## 📝 TAILWIND CSS UTILITY CLASSES (Quick Reference)

```
Spacing:     m-{size}, p-{size}, gap-{size}
Display:     flex, grid, block, inline, hidden
Colors:      bg-{color}-{shade}, text-{color}-{shade}
Responsive:  sm:, md:, lg:, xl: prefix
Hover:       hover:, focus:, active: modifiers
Sizing:      w-{size}, h-{size}, max-w-{size}
Text:        text-{size}, font-{weight}, text-{color}
Shadows:     shadow, shadow-lg, shadow-none
Rounded:     rounded-{size}
Borders:     border, border-{color}, border-{size}
Opacity:     opacity-{value}
Flex:        flex-row, flex-col, justify-{value}, items-{value}
Grid:        grid-cols-{count}, grid-rows-{count}
```

Example:
```html
<button class="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 md:px-8 md:py-4">
  Click Me
</button>
```

---

**These guidelines ensure a consistent, beautiful, accessible, and responsive design throughout the application!**


