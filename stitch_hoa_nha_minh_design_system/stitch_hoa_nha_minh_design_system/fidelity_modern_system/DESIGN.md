---
name: Fidelity Modern System
colors:
  surface: '#f9f9ff'
  surface-dim: '#d7dae3'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f1f3fc'
  surface-container: '#ebedf7'
  surface-container-high: '#e6e8f1'
  surface-container-highest: '#e0e2eb'
  on-surface: '#181c22'
  on-surface-variant: '#414753'
  inverse-surface: '#2d3037'
  inverse-on-surface: '#eef0fa'
  outline: '#717785'
  outline-variant: '#c1c6d5'
  surface-tint: '#005db8'
  primary: '#005cb8'
  on-primary: '#ffffff'
  primary-container: '#1275e2'
  on-primary-container: '#000512'
  inverse-primary: '#aac7ff'
  secondary: '#465f88'
  on-secondary: '#ffffff'
  secondary-container: '#b6d0ff'
  on-secondary-container: '#3f5881'
  tertiary: '#9a4600'
  on-tertiary: '#ffffff'
  tertiary-container: '#c05900'
  on-tertiary-container: '#0d0300'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d6e3ff'
  primary-fixed-dim: '#aac7ff'
  on-primary-fixed: '#001b3e'
  on-primary-fixed-variant: '#00458d'
  secondary-fixed: '#d6e3ff'
  secondary-fixed-dim: '#aec7f7'
  on-secondary-fixed: '#001b3d'
  on-secondary-fixed-variant: '#2d476f'
  tertiary-fixed: '#ffdbc9'
  tertiary-fixed-dim: '#ffb68c'
  on-tertiary-fixed: '#321200'
  on-tertiary-fixed-variant: '#763400'
  background: '#f9f9ff'
  on-background: '#181c22'
  surface-variant: '#e0e2eb'
typography:
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  margin: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

# Fidelity Modern Design System

## Brand & Style
The design system adopts a **Corporate / Modern** aesthetic, prioritizing clarity, efficiency, and structured reliability. It uses **Inter** for all typography roles to maintain crisp readability across digital interfaces. The visual language favors subtle roundedness (`roundedness: 2`, approx 0.5rem base radius) to feel modern yet grounded, avoiding overly playful shapes or sharp, aggressive edges.

## Colors
The color system is built around a trustworthy, high-fidelity light mode palette:
- **Primary (`#1275e2`)**: A vibrant, accessible blue used for key actions, primary buttons, and active states.
- **Secondary (`#5f78a3`)**: A slate blue-gray providing balanced support for secondary elements and borders.
- **Tertiary (`#c55b00`)**: A warm accent color used sparingly for high-priority calls to action or status highlights.
- **Neutral (`#74777f`)**: A cool neutral palette for text, backgrounds, and structural dividers.

## Typography
Typography relies entirely on the **Inter** typeface family. The hierarchy is scaled for high legibility, using clear weight distinctions (Regular for body, Medium/SemiBold for labels and headlines) to establish visual structure without clutter.

## Layout & Spacing
The layout uses a standard fluid grid with structured spacing tokens. The spacing scale maintains comfortable breathing room between components, utilizing consistent 1.5rem gutters and 2rem outer margins on standard desktop viewports.

## Elevation & Depth
Elevation is achieved primarily through tonal layers and subtle ambient shadows, reinforcing a clean, modern interface hierarchy. Interactive elements lift slightly on hover.

## Shapes
A moderate roundedness setting (`2`) is applied across all standard interactive elements, yielding a baseline 0.5rem border radius for inputs and buttons, and larger 1rem to 1.5rem radii for container cards.

## Components
- **Buttons**: Primary actions use solid `#1275e2` fills with rounded corners (`roundedness: 2`), while secondary actions use subtle borders or neutral backgrounds.
- **Inputs**: Clean outlines framed by neutral borders (`#74777f`), shifting to primary blue upon focus.
- **Cards**: Surface containers utilizing subtle tonal separation and light rounded corners.