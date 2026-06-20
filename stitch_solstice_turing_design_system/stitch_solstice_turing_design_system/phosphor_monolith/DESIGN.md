---
name: Phosphor-Monolith
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#3a3939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#b9ccb5'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#849581'
  outline-variant: '#3b4b3a'
  surface-tint: '#00e55b'
  primary: '#edffe8'
  on-primary: '#003911'
  primary-container: '#00ff66'
  on-primary-container: '#007128'
  inverse-primary: '#006e27'
  secondary: '#ebc238'
  on-secondary: '#3c2f00'
  secondary-container: '#bf9a01'
  on-secondary-container: '#423400'
  tertiary: '#ebffec'
  on-tertiary: '#00391d'
  tertiary-container: '#2dfc96'
  on-tertiary-container: '#00703e'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#6bff83'
  primary-fixed-dim: '#00e55b'
  on-primary-fixed: '#002107'
  on-primary-fixed-variant: '#00531b'
  secondary-fixed: '#ffe085'
  secondary-fixed-dim: '#ebc238'
  on-secondary-fixed: '#231b00'
  on-secondary-fixed-variant: '#574500'
  tertiary-fixed: '#5affa2'
  tertiary-fixed-dim: '#00e384'
  on-tertiary-fixed: '#00210e'
  on-tertiary-fixed-variant: '#00522c'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
  terminal-green: '#00FF66'
  soft-green: '#33FF99'
  solstice-gold: '#FFD54A'
  warning-red: '#FF5555'
  text-white: '#EDEDED'
  panel-gray: '#111111'
typography:
  headline-lg:
    fontFamily: Press Start 2P
    fontSize: 24px
    fontWeight: '400'
    lineHeight: 32px
    letterSpacing: 0.1em
  headline-md:
    fontFamily: Press Start 2P
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-lg:
    fontFamily: VT323
    fontSize: 22px
    fontWeight: '400'
    lineHeight: 26px
  body-md:
    fontFamily: VT323
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 22px
  label-caps:
    fontFamily: VT323
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 16px
  code-sm:
    fontFamily: VT323
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 18px
  headline-lg-mobile:
    fontFamily: Press Start 2P
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 24px
spacing:
  unit: 4px
  gutter: 16px
  margin: 24px
  border-width: 2px
  container-max-width: 1280px
---

## Brand & Style

This design system is a digital archaeology interface, evoking the feeling of a high-stakes recovery mission inside a corrupted 1950s mainframe that has evolved with cyberpunk technology. The aesthetic is strictly **Retro-Brutalist**, emphasizing high-contrast monochrome displays with chromatic highlights, sharp-edged geometry, and a heavy reliance on physical computing metaphors like scanlines and phosphor persistence.

The brand personality is authoritative yet fragile—an "Archive of a Genius" under siege. It avoids all modern UI conveniences like softness or depth via shading, opting instead for structural integrity through 2px pixel borders and monospaced alignment. The target audience is technologically literate and appreciates the marriage of historical cryptography with futuristic hacker aesthetics. Every interaction should feel like a direct command to a machine, accompanied by the visual "noise" of a hardware-limited display.

## Colors

The palette is anchored in an absolute "True Black" (`#050505`) to simulate a deep CRT vacuum. The primary interaction color is **Terminal Green**, used for active data, commands, and primary UI borders. **Solstice Gold** acts as the high-priority highlight, reserved for Alan Turing's legacy fragments and the state of "Light (1)."

All colors are applied at full saturation to ensure a "glowing" effect against the dark background. Use **Warning Red** sparingly for system corruption, logic errors, and critical failures. **Panel Gray** is used to create subtle structural containment without breaking the high-contrast aesthetic. No gradients are permitted; use solid fills or dithering patterns to imply depth if necessary.

## Typography

The typography system relies on fixed-width metrics to maintain the "grid-aligned" terminal feel. **Press Start 2P** is used exclusively for primary headings and UI status indicators, evoking a sense of urgent, low-resolution processing. **VT323** serves as the workhorse for all body text, logs, and data entries, providing the classic typewriter-style terminal legibility.

All text should appear to be "printed" or "rendered" to the screen. For critical alerts, use the `label-caps` style in Warning Red. To maintain the digital archaeology theme, headers should never exceed 24px on desktop to avoid breaking the pixel-perfect alignment. On mobile, headlines scale down significantly to ensure the interface does not feel overcrowded.

## Layout & Spacing

This design system uses a **Fixed Grid** model based on a 4px base unit. The layout is structured as a "Dashboard" rather than a scrolling page. The screen is divided into distinct terminal panes with 2px borders, separated by 16px gutters.

- **Desktop (1280px+):** A 3-column layout. Left Sidebar (System Status), Center Panel (Main Logic), Right Panel (AI Terminal).
- **Tablet (768px - 1024px):** 2-column layout. Sidebar moves to a collapsible drawer or top-docked status bar.
- **Mobile (Below 768px):** Single column stack. Tabs are used to switch between the Game Panel and the AI Terminal.

Alignment must be rigid. Every element must snap to the 4px grid to prevent "shimmering" on pixel-art assets. Use `padding: 12px` for all internal panel content to ensure text does not touch the borders.

## Elevation & Depth

Depth is not achieved through shadows or Z-axis height, but through **Tonal Layering** and **Line Weight**.

- **Level 0 (Background):** Pure `#050505` with a subtle scanline overlay (0.05 opacity).
- **Level 1 (Containers):** `#111111` fill with a `2px solid #00FF66` border. This is the primary interactive surface.
- **Level 2 (Active Focus):** A 1px internal "inset" border or a full-width background block of `#00FF66` with `#050505` text (Inverted).

Instead of shadows, use **Phosphor Glow**. Important elements (Solstice Gold) should have a CSS `text-shadow` or `box-shadow` with a 0px blur and a 4px spread in the same color at 30% opacity to simulate light bleed on a vintage monitor.

## Shapes

The shape language is strictly **Sharp (0)**. There are no rounded corners in the design system. All containers, buttons, and progress bars must have 90-degree angles. This reinforces the "computing foundations" and "binary logic" narrative, where every element is a discrete block in the system.

Pixel-art decorative elements (like corner brackets or logic gate icons) must follow this square-block rule, avoiding anti-aliasing to maintain a crisp, hardware-rendered appearance.

## Components

### Buttons
Buttons are solid containers with a 2px border. Default state: `Terminal Green` border and text. Hover/Focus: `Terminal Green` background with `Black` text (Inversion). Active: `Solstice Gold` highlight. No transitions—state changes should be instantaneous.

### Terminal Panels
Each module (Logic, Memory, etc.) is contained in a pane with a header bar. The header bar displays the module name in `Press Start 2P` and a "Status: OK" or "Status: CORRUPTED" indicator.

### Binary Widgets
Interactive bits (0/1). When '0', use `Panel Gray` text. When '1', use `Solstice Gold` text with a subtle glow effect. Toggle switches should look like physical DIP switches.

### AI Chat (Gemini)
The chat interface should mimic a command-line conversation. User input is preceded by a `>` prompt. AI responses should utilize a "typing" animation (20ms per character) to simulate data retrieval from the archive.

### Solstice Meter (Progress)
A horizontal bar made of 10 discrete blocks. Unfilled blocks are empty `2px` green outlines. Filled blocks are solid `Solstice Gold` squares. As the meter fills, the overall screen brightness (white-point) should subtly increase via a global overlay.

### System Logs
A scrolling bottom region using `code-sm` font. Each entry is timestamped `[HH:MM:SS:MS]` and uses `Soft Green` for standard logs and `Warning Red` for errors.