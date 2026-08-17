# Tech Spec - Opulence

UCC reference role: Opulence is preserved as an Experience Profile reference. It demonstrates how an entity can open into a cinematic, brand-specific rendered world while still sitting above the Universal Command Center architecture:

Canonical graph -> Room profile -> Experience profile -> Rendered world

This is not a dependency plan for the current static Universal Command Center shell.

## Dependencies

| Package | Version | Purpose |
| --- | --- | --- |
| react | ^18.2.0 | UI framework |
| react-dom | ^18.2.0 | React DOM renderer |
| react-router-dom | ^6.22.0 | Multi-page routing (4 pages) |
| gsap | ^3.12.5 | Core animation engine, timelines |
| lenis | ^1.1.13 | Smooth scroll with inertia |
| lucide-react | ^0.400.0 | Icons (cart, menu, close, arrow, social) |

GSAP plugins bundled with GSAP and registered at runtime: ScrollTrigger, SplitText, Flip.

## Component Inventory

### Layout

| Component | Source | Notes |
| --- | --- | --- |
| Navigation | Custom | Fixed top, transparent -> solid on scroll, logo center, hamburger + cart icons, full-screen overlay menu |
| Footer | Custom | 5-column grid, newsletter input, link groups, bottom bar |
| CartSidebar | Custom | 460px slide-in from right, overlay, item list, checkout button |
| PageTransition | Custom | Wrapper component for page load entrance sequence |

### Sections

| Section | Used On | Notes |
| --- | --- | --- |
| HeroSection | All 4 pages | Fullscreen video bg + centered text + CTA. Same layout, different content/video per page |
| VideoShowcaseSection | Straps, Cases, Lifestyle | Full-width video + bottom-left overlay content |
| FeaturedProductSection | Straps, Cases, Lifestyle | Two-column asymmetric (55/45 or 45/55), image + text |
| CollectionGridSection | Straps, Cases, Lifestyle | 3-column product card grid with parallax |
| BrandStatementSection | Straps, Cases, Lifestyle | Centered text over video background |
| InstagramCTASection | Straps, Cases, Lifestyle | Two-column (video left, text right) |
| StoryBlockSection | About | Two-column (image/text), reversible order |
| ValuesSection | About | 3-column centered value cards with icons |
| TeamSection | About | Centered text over video background |

### Reusable Components

| Component | Source | Used By |
| --- | --- | --- |
| VideoBackground | Custom | HeroSection, VideoShowcaseSection, BrandStatementSection, TeamSection |
| StaggeredHeadline | Custom (GSAP SplitText) | All hero headlines, section headings |
| ScrollReveal | Custom (GSAP ScrollTrigger) | All content sections below the fold |
| ParallaxWrapper | Custom (GSAP ScrollTrigger scrub) | VideoBackground elements, CollectionGridSection columns |
| FilledButton | Custom | All CTAs |
| OutlinedButton | Custom | All secondary CTAs |
| ProductCard | Custom | CollectionGridSection |
| VideoLoader | Custom | Fallback/poster state for video backgrounds |

## Hooks

| Hook | Purpose |
| --- | --- |
| useLenis | Initialize Lenis, sync with GSAP ScrollTrigger, cleanup on unmount |
| useScrollReveal | Reusable ScrollTrigger setup for section entrance animations |
| useParallax | Reusable scrubbed translateY/scale animation tied to scroll |
| useNavScroll | Track scroll position, toggle nav background state |

## Animation Implementation

| Animation | Library | Approach | Complexity |
| --- | --- | --- | --- |
| Page load entrance sequence | GSAP timeline | Chain caption -> headline -> subhead -> CTA with delays; StaggeredHeadline wraps SplitText word stagger | Medium |
| Staggered text reveal (headlines) | GSAP SplitText | Split by words, each word parent has overflow:hidden, stagger translateY 100% -> 0 | Medium |
| Scroll-triggered section reveals | GSAP ScrollTrigger | Batch trigger on viewport entry (top 80%), fade + translateY 60px -> 0, stagger children 100ms | Low |
| Parallax video backgrounds | GSAP ScrollTrigger (scrub) | scale 1.05 -> 1.0 + translateY 5% -> -5%, linear, tied to section scroll | Low |
| Parallax image grid | GSAP ScrollTrigger (scrub) | Outer columns 0 -> 20vh, middle column 10vh -> -10vh, scrubbed | Medium |
| Nav background transition | CSS transition | toggle class at 100px scroll, CSS handles bg + border transition | Low |
| Button hover (filled) | CSS transition | background-color shift, 0.3s ease | Low |
| Button hover (outlined) | CSS transition | background fill via pseudo-element clip-path or scale | Low |
| Hamburger menu open/close | GSAP timeline | Overlay translateX + link stagger in/out with directional motion | Medium |
| Cart sidebar open/close | GSAP timeline | Overlay fade + sidebar translateX with power3 easing | Low |

## State And Logic

Cart state: React context (open/closed, items array). CartSidebar reads from context. Navigation toggle writes to context.

Menu state: React context (open/closed). Navigation hamburger writes, overlay close button writes.

Page scroll: Lenis instance stored in a ref, accessed via hook. ScrollTrigger synced via `lenis.on('scroll')`.

Video loading: Each VideoBackground manages its own loaded state (`onCanPlay` event -> fade in).

No backend: All product data, page content hardcoded as constants in `src/data/`.

## Multi-Page Structure

| Route | Page Component | Sections |
| --- | --- | --- |
| / | StrapsPage | Hero, VideoShowcase, FeaturedProduct, CollectionGrid, BrandStatement, InstagramCTA, Footer |
| /cases | CasesPage | Hero, VideoShowcase, FeaturedComponent, ComponentGrid, BrandStatement, InstagramCTA, Footer |
| /lifestyle | LifestylePage | Hero, VideoShowcase, FeaturedProduct, CollectionGrid, BrandStatement, InstagramCTA, Footer |
| /about | AboutPage | Hero, StoryBlock1, StoryBlock2, Values, Team, Footer |

All pages share Navigation (fixed) and CartSidebar (global). PageTransition wrapper handles per-page load animation.

## Other Key Decisions

Video strategy: Videos loaded from `/public/videos/` as static assets. Each video gets a generated poster image fallback.

Font loading: DM Serif Display + Source Sans 3 via Google Fonts CDN link in `index.html`.

No shadcn/ui components used: The design is entirely custom; no standard UI patterns (forms, dialogs, tables) needed.

Image assets: Product/lifestyle images served from `/public/images/`. All assets generated per `design.md` prompts.

Responsive: Tailwind breakpoints (`md: 768px`) for mobile stacking, font scaling, grid column reduction.
