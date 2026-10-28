<div align="center">

# Sampan Development Ltd.

### Real Estate & Property Development — Next.js 16 Enterprise Application

[![Next.js](https://img.shields.io/badge/Next.js-16.4-black?style=flat-square&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-06B6D4?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![GSAP](https://img.shields.io/badge/GSAP-3.12-88CE02?style=flat-square&logo=greensock&logoColor=white)](https://gsap.com/)
[![Leaflet](https://img.shields.io/badge/Leaflet-1.9-199900?style=flat-square&logo=leaflet&logoColor=white)](https://leafletjs.com/)
[![Framer Motion](https://img.shields.io/badge/Framer%20Motion-12-FF0080?style=flat-square&logo=framer&logoColor=white)](https://www.framer.com/motion/)

<p align="center">
  <strong>A premium, fully-animated real estate platform</strong> showcasing ongoing and completed<br/>
  residential, hospitality, commercial, and lifestyle developments across Bangladesh.<br/>
  Built with cinematic scroll experiences, GSAP-powered animations, interactive maps,<br/>
  and an editorial design language inspired by luxury real estate publications.
</p>

---

[Features](#-features) · [Tech Stack](#-tech-stack) · [Getting Started](#-getting-started) · [Project Structure](#-project-structure) · [Components](#-key-components) · [Scripts](#-available-scripts) · [Deploy](#-deployment)

</div>

---

## Features

### Cinematic User Experience

| Feature | Description |
|---|---|
| Pinned Scroll Sections | GSAP ScrollTrigger-powered cinematic project showcase with 5 pinned chapters — each with image reveals, parallax, kinetic typography, and staggered text entrances |
| Ken Burns Hero | All hero banners feature slow Ken Burns zoom on background images for cinematic depth |
| 3D Mouse-Tilt 404 | The 404 page features a 3D mouse-tracking 404 number with orbiting rings, floating dots, and animated SVG wave paths |
| Scroll Progress Bars | Fixed top progress bar + right-side vertical progress rail on showcase sections — tracks scroll position in real-time |
| Staggered Card Entrances | Every card grid (specifications, galleries, highlights, related projects) uses GSAP staggered fade-up animations |
| Parallax Images | All project images use scrub-based parallax that drifts as you scroll |
| Corner Bracket Draw-in | Architectural corner brackets scale in from 0→1 when sections enter the viewport |

### Design System

| Element | Details |
|---|---|
| Typography | Cormorant Garamond (serif headings) + Inter (sans body) + JetBrains Mono (technical labels) |
| Color Palette | Obsidian `#0B0B0D`, Warm Ivory `#F5F3EE`, Forest `#15201A`, Brass/Gold `#C5A059`, Blue accent `#19ABE1` |
| Film Grain | SVG `feTurbulence` noise overlay on all dark sections at 2.5% opacity with `mix-blend-overlay` |
| Dot Grid | Subtle `radial-gradient` dot pattern on light sections at 3% opacity |
| Ambient Glows | Drifting radial-gradient orbs (24s/28s loops) on hero sections for atmospheric depth |

### Interactive Components

| Component | Functionality |
|---|---|
| Floating Contact Dock | Horizontal pill-style contact dock (Call/WhatsApp/Email) with brand colors, hover sweep sheen, and Framer Motion width-expand animations |
| Interactive Location Map | Leaflet + OpenStreetMap (no API key required) with custom HTML pins, directional labels, active pulse rings, and `flyTo` recentering |
| Project Archive | Filterable project grid with status tabs (All/Ongoing/Completed), category dropdown, live search, and equal-height cards |
| Project Details | Dynamic project pages rendering from JSON data — hero, fact sheet, overview, specifications, editorial chapters, galleries, FAQ, and related projects |
| Highway Address Section | Cinematic pinned scroll with Three.js atmospheric shader background, GSAP labelled timeline, and mobile card-based fallback |

### Technical

| Feature | Implementation |
|---|---|
| Framework | Next.js 16 with App Router, Turbopack, Cache Components, Partial Prefetching |
| Maps | Leaflet + React-Leaflet with Esri Light Gray Canvas tiles (free, no API key) |
| Animations | GSAP 3.12 + ScrollTrigger for scroll-based, Framer Motion 12 for component-level |
| 3D Background | Three.js WebGL shader on highway address section (atmospheric gold glow + grain) |
| Smooth Scroll | Lenis smooth scroll provider wrapping all pages |
| SEO | Full metadata API, JSON-LD structured data (Organization + WebSite schema), Open Graph, Twitter Cards |
| TypeScript | Strict mode, full type safety across all components and data layers |

---

## Tech Stack

### Core

```
next@16.4.3          → App Router, Turbopack, RSC
react@19              → Concurrent features, improved refs
typescript@5.x       → Strict type checking
tailwindcss@4.0      → Utility-first CSS, JIT compilation
```

### Animation & Interaction

```
gsap@3.12             → ScrollTrigger, matchMedia, pinned timelines
@gsap/react@2.x       → useGSAP hook, context scoping
framer-motion@12      → Floating contact, page transitions
three@0.x             → WebGL shader background (highway section)
lenis@1.x             → Smooth scroll provider
```

### Maps & Data

```
leaflet@1.9           → OpenStreetMap raster tiles
react-leaflet@4.x     → React wrapper for Leaflet
@types/leaflet        → TypeScript definitions
```

### UI & Icons

```
react-icons@5.x       → FiMapPin, FiArrowRight, FiX, FiMail, FiPhone, FaWhatsapp, etc.
```

---

## Getting Started

### Prerequisites

- **Node.js** 18.17+ (recommended: 20.x LTS)
- **npm** 10+ (or pnpm/yarn)
- **Git**

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/sampandevelopment.git

# Navigate to project directory
cd sampandevelopment

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
```

### Environment Variables

Create a `.env.local` file in the project root:

```env
# ─── Site Configuration ──────────────────────────────
NEXT_PUBLIC_SITE_URL=https://sampandevelopmentltd.com

# ─── Google Maps (OPTIONAL — only if switching from Leaflet) ──
# The project uses Leaflet + OpenStreetMap by default (no key needed).
# To use Google Maps instead, uncomment and set this:
# NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_js_api_key

# ─── Analytics (optional) ────────────────────────────
# NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

> **Note:** No API keys are required for basic operation. Maps use free OpenStreetMap tiles via Leaflet.

### Development

```bash
# Start development server
npm run dev

# Open http://localhost:3000
```

### Production Build

```bash
# Create optimized production build
npm run build

# Start production server
npm start
```

### Type Checking

```bash
# Run TypeScript type checker
npx tsc --noEmit
```

---

## Project Structure

```
sampandevelopment/
├── src/
│   ├── app/
│   │   ├── layout.tsx                  # Root layout (fonts, Navbar, Footer, FloatingContact, JSON-LD)
│   │   ├── page.tsx                    # Homepage
│   │   ├── not-found.tsx              # 404 page (3D animated, dark theme)
│   │   ├── globals.css                # Global styles, Tailwind layers
│   │   │
│   │   ├── projects/
│   │   │   ├── page.tsx               # Project archive (filterable grid)
│   │   │   ├── ongoing/
│   │   │   │   ├── [slug]/
│   │   │   │   │   └── page.tsx       # Ongoing project detail page
│   │   │   │   └── ProjectDetails.tsx  # Ongoing project renderer
│   │   │   └── completed/
│   │   │       ├── [slug]/
│   │   │       │   └── page.tsx       # Completed project detail page
│   │   │       └── CompletedProjectDetails.tsx  # Completed project renderer
│   │   │
│   │   ├── about/
│   │   │   └── page.tsx               # About page (GSAP horizontal scroll-jack)
│   │   ├── contact/
│   │   │   └── page.tsx               # Contact page
│   │   └── sampan-group/
│   │       └── page.tsx               # Sampan Group overview
│   │
│   ├── components/
│   │   ├── Navbar/
│   │   │   └── Navbar.tsx              # Sticky transparent-over-hero navbar
│   │   ├── Footer/
│   │   │   └── Footer.tsx             # Sitemap footer with magnetic links, marquee
│   │   ├── FloatingContact/
│   │   │   └── FloatingContact.tsx    # Horizontal pill dock (Call/WhatsApp/Email)
│   │   ├── LenisProvider/
│   │   │   └── LenisProvider.tsx      # Smooth scroll wrapper
│   │   ├── AntiInspect/
│   │   │   └── AntiInspect.tsx       # DevTools detection (disabled in prod by default)
│   │   ├── HighwayAddressSection.tsx  # Pinned cinematic 5-project showcase (Three.js)
│   │   ├── ProjectShowcase.tsx        # Pinned scroll showcase (5 chapters, GSAP)
│   │   ├── ProjectCards.tsx           # 3-card expanding hover grid
│   │   ├── ExpressHighwayStory.tsx   # Highway inn hero section
│   │   ├── InteractiveMap/
│   │   │   ├── InteractiveMap.tsx     # Leaflet + OSM map component
│   │   │   └── ClientLocationMap.tsx  # Dynamic import wrapper (SSR-safe)
│   │   └── LocationMap.tsx           # Legacy map component (Google Maps)
│   │
│   └── data/
│       ├── project.json               # Ongoing projects data
│       ├── sampan-completed-projects.json  # Completed projects data
│       └── navigation.json            # Navbar/footer sitemap data
│
├── public/
│   ├── images/                        # All project images, brand assets
│   │   ├── projects/                  # Project hero/overview/gallery images
│   │   ├── brand/                     # Logo files
│   │   └── leader/                    # Leadership team photos
│   └── expresshighway/               # Express Highway Inn assets
│
├── next.config.ts                     # Next.js config (Turbopack, experiments)
├── tailwind.config.ts                 # Tailwind config (if using v3; v4 uses CSS)
├── tsconfig.json                      # TypeScript config
├── package.json                       # Dependencies & scripts
└── README.md                          # This file
```

---

## Key Components

### `HighwayAddressSection.tsx`

The flagship cinematic component. Features:
- **Three.js atmospheric shader** — gold wandering glows + film grain on WebGL canvas
- **GSAP labelled timeline** — 5-phase pinned scroll (intro → 3 projects → outro)
- **Image cross-fade layers** — background images transition between phases
- **Text block animations** — headline line reveals + staggered fade-ups
- **Mobile fallback** — card-based layout with progress bar for `<1024px`
- **Reduced motion** — full fallback for `prefers-reduced-motion: reduce`

### `ProjectShowcase.tsx`

5-chapter pinned scroll showcase:
- Chapter 1: Metro Square (dark, image-right)
- Chapter 2: Agro & Golf Academy (dark, full-bleed immersive)
- Chapter 3: Trade Emporium (dark, full-bg + floor directory)
- Chapter 4: Express Highway Inn (dark, image-right)
- Chapter 5: Condominium (light, image-left)
- Right-side progress rail + top status bar (desktop)
- Mobile progress bar at top (mobile)

### `FloatingContact.tsx`

Horizontal pill dock contact widget:
- 3 brand-colored pills (Call blue, WhatsApp green, Email red)
- Width-expand animation via Framer Motion `layout` prop
- Hover sweep sheen effect
- Pulsing red notification dot when collapsed
- Compass-mark toggle button with architectural corner brackets
- Outside-click-to-close

### `InteractiveMap.tsx`

Leaflet-based interactive map (no API key):
- Esri Light Gray Canvas tiles (free, no billing)
- Custom HTML pins via `L.divIcon` with directional labels
- Active pulse rings (`@keyframes sgm-ping`)
- `flyTo` recentering on marker click
- Premium attribution styling
- Dynamically imported via `ClientLocationMap.tsx` (SSR-safe)

### `ProjectDetails.tsx` / `CompletedProjectDetails.tsx`

JSON-driven project detail pages:
- Both use the `useScrollReveal` hook for GSAP scroll-triggered animations
- Ken Burns hero background zoom
- Staggered card entrances for specifications, galleries, highlights
- Parallax on all images
- Corner bracket draw-in animations
- Theme-driven colors (each project has its own theme in JSON)
- Premium blockquote with decorative quotation marks
- Image panels with loading spinner + onError fallback
- Top scroll progress bar (fixed, real-time)

### `not-found.tsx`

Premium 404 page:
- 3D mouse-tilt 404 number (follows cursor with `rotateX/Y`)
- Floating animation (`float404` keyframe — 6s ease-in-out)
- Gradient shimmer (gold → white → gold, 6s loop)
- 3 orbiting rings (different speeds/directions)
- 3 orbiting dots at different radii
- Pulsing ring (4s scale/opacity loop)
- Animated SVG wave paths at bottom (dashed strokes moving infinitely)
- Floating accent dots at different Z depths
- Architectural corner brackets
- Film grain + dot grid texture
- Quick links (Projects / Completed / Contact / Sampan Group external link)

---

## Available Scripts

| Script | Command | Description |
|---|---|---|
| **Dev** | `npm run dev` | Start development server at `localhost:3000` |
| **Build** | `npm run build` | Create optimized production build |
| **Start** | `npm start` | Start production server (after build) |
| **Lint** | `npm run lint` | Run ESLint |
| **Type Check** | `npx tsc --noEmit` | Run TypeScript compiler in check-only mode |

---

## Deployment

### Vercel (Recommended)

1. Push your repository to GitHub
2. Go to [vercel.com](https://vercel.com) and import the repo
3. Framework preset: **Next.js** (auto-detected)
4. No environment variables required for basic deployment
5. Deploy

```bash
# Or via CLI
npm i -g vercel
vercel
```

### Self-Hosted

```bash
# Build the application
npm run build

# Start the production server
npm start

# Or use PM2 for process management
pm2 start npm --name sampandevelopment -- start
```

### Production Checklist

- [ ] Set `NEXT_PUBLIC_SITE_URL` to your production domain
- [ ] Verify all project images exist in `public/images/`
- [ ] Test all project detail pages (`/projects/ongoing/[slug]` and `/projects/completed/[slug]`)
- [ ] Verify `not-found.tsx` renders on unmatched routes
- [ ] Check Google Maps API key is NOT required (Leaflet is used by default)
- [ ] Run `npm run build` — must pass with zero TypeScript errors
- [ ] Test on mobile devices (768px breakpoint for desktop-only features)

---

## Data Structure

Projects are defined in JSON files under `src/data/`:

```
src/data/
├── project.json                      # Ongoing projects
└── sampan-completed-projects.json    # Completed projects
```

Each project object supports:

```json
{
  "id": "project-slug",
  "slug": "project-slug",
  "projectName": "Project Name",
  "tagline": "Short tagline",
  "shortDescription": "One-line description",
  "status": "ongoing | completed",
  "category": "residential | hospitality | commercial | land",
  "hero": {
    "backgroundImage": "/images/projects/hero.jpg",
    "title": "Hero headline",
    "description": "Hero description",
    "quickFacts": [...],
    "primaryCTA": { "label": "Enquire", "href": "/contact" }
  },
  "theme": {
    "primary": "#15201A",
    "accent": "#C5A059",
    "background": "#F7F4ED"
  },
  "overview": {
    "sectionTitle": "Overview title",
    "description": "Overview body",
    "editorialQuote": "Pull quote",
    "highlights": [...]
  },
  "specifications": [...],
  "sections": [...],
  "gallery": { "items": [...] },
  "faq": [...],
  "relatedProjects": ["slug-1", "slug-2"]
}
```

---

## Browser Support

| Browser | Supported |
|---|---|
| Chrome 90+ | Full support |
| Firefox 88+ | Full support |
| Safari 14+ | Full support |
| Edge 90+ | Full support |
| Mobile Safari 14+ | Full support (mobile layouts) |
| Chrome Android 90+ | Full support |

> **Note:** Three.js shader (HighwayAddressSection) requires WebGL support. Falls back gracefully on unsupported devices.

---

## Performance

| Metric | Target |
|---|---|
| Lighthouse Performance | 90+ |
| Lighthouse Accessibility | 95+ |
| First Contentful Paint | < 1.5s |
| Largest Contentful Paint | < 2.5s |
| Cumulative Layout Shift | < 0.1 |
| Total Bundle Size | < 500KB gzipped |

### Optimization Features

- Turbopack for fast development builds
- Dynamic imports for client-only components (maps, highway section)
- `loading="lazy"` on all non-critical images
- `once: true` on all GSAP ScrollTriggers (no re-trigger overhead)
- CSS `will-change` on parallax elements
- `prefers-reduced-motion` support on all animated components
- Ken Burns + ambient drifts use pure CSS (GPU-accelerated)

---

## Credits

| Role | Name |
|---|---|
| **Developer** | Mahfuz |
| **Company** | Sampan Development Ltd. |
| **Parent Group** | [Sampan Group](https://sampangroup.com.bd/) |
| **Domain** | sampandevelopmentltd.com |

---

## License

This project is proprietary and confidential. Unauthorized copying, distribution, or use of this codebase is strictly prohibited.

© 2025 Sampan Development Ltd. All rights reserved.

---

<div align="center">

**[Sampan Group](https://sampangroup.com.bd/)** · Building Opportunities Across Industries

<br/>

<sub>Built with Next.js 16, React 19, GSAP, Three.js, Leaflet, Framer Motion, and Tailwind CSS.</sub>

</div>
