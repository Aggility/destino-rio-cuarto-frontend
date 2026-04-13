/**
 * Navbar Component
 * Figma Node IDs:
 *   Frame:  3355:9799
 *   Default (Desktop Light):  3355:9798
 *   Default Dark (Desktop):   3355:10001
 *   Tablet:                   3355:9800
 *   Tablet Dark:              3355:10108
 *   Mobile:                   3355:9928
 *   Mobile Dark:              3355:10163
 *
 * Assets (SVG/PNG hosted on Figma local server during dev):
 *   Isologo Default: http://localhost:3845/assets/6f3643fb71d943c639bfaf729e48c8a484304a94.svg
 *   Logo Group 1:    http://localhost:3845/assets/d5e502328d7c435a46918a1ce0c90d818553eecc.svg
 *   Logo Group 2:    http://localhost:3845/assets/a0739efefcadd075d9433aa37e0a10f6341619f4.svg
 *   Logo Light Gr1:  http://localhost:3845/assets/712e6cbd532f8608aad562344d6b531619115e85.svg
 *   Logo Light Gr2:  http://localhost:3845/assets/4a220f8b2d72afd1ed15aa7f9d5008b0790be934.svg
 *   BG Navbar Dark:  http://localhost:3845/assets/aaa8cb1fb57dccac9d307f78d5b9c6bb0afb7a26.png
 *   BG Navbar Tablet Dark: http://localhost:3845/assets/c6ebff5acd4c8edf8dc00572eda21728748c9e66.png
 *   BG Navbar Mobile Dark: http://localhost:3845/assets/99c89d6ce0a21b56439b8bc5a8b7b4645025d77b.png
 *   Bars icon (mobile): http://localhost:3845/assets/62f13c07fa6b79e13a93c9369cd962bf31ddacba.svg
 *   Vector bars dark:   http://localhost:3845/assets/bf97a84f0aeb6f6ddf0fd433c3e9dc6b1a3f34e8.svg
 *
 * Design tokens from component:
 *   gray/900: #111928
 *   white: #FFFFFF
 *   Shadow 3: DROP_SHADOW rgba(26,86,216,0.3) 0 4px 16px, INNER_SHADOW rgba(30,66,159,0.25) 0 -1px 0
 *   Nav Links: Eventos, Actividades, Turismo Ciudad, Servicios, Calendario
 *   CTA Button: "Publicá Acá" (Alternative style) + "Ver mas eventos" (Filled style)
 */

/**
 * Variantes disponibles:
 *   property1 = "Default"      → Desktop light (1440px)
 *   property1 = "Default Dark" → Desktop con fondo oscuro/imagen
 *   property1 = "Tablet"       → 768px, light
 *   property1 = "Tablet Dark"  → 768px, dark
 *   property1 = "Mobile"       → 375px, light
 *   property1 = "Mobile Dark"  → 375px, dark
 *
 * Nota: Este código es la referencia Figma. Adaptar al stack del proyecto
 * (Next.js + Bootstrap 5 + SCSS) según patrones existentes en el codebase.
 */

// ─── Navigation Links ────────────────────────────────────────────────────────
// Light variant links: color #111928 (gray/900)
// Dark variant links:  color #ffffff (white)
// Nav items: Eventos | Actividades | Turismo Ciudad | Servicios | Calendario

// ─── CTA Buttons ─────────────────────────────────────────────────────────────
// 1. "Publicá Acá" - Alternative style
//    bg: #ffffff | border: #e5e7eb | color: #0f172a
//    shadow: 0px 4px 16px 0px rgba(26,86,216,0.3)
//    inset shadow: 0px -1px 0px 0px rgba(30,66,159,0.25)
//    border-radius: 8px | padding: 12px 20px
//
// 2. "Ver mas eventos" - Filled/Primary style
//    bg: #1a56db | border: #1a56db | color: #f9fafb
//    border-radius: 8px | padding: 8px 8px

// ─── Mobile / Tablet ─────────────────────────────────────────────────────────
// Shows: Logo (left) + Hamburger icon (right)
// Hamburger: 16px (mobile) | 20px (tablet)

// ─── Logo ─────────────────────────────────────────────────────────────────────
// Isologo: 49x49px
// Full Logo (Isologo + text): 140x49px
// Two text groups positioned absolutely:
//   Group 1 (top text):    inset 19.75% 18.24% 53.5% 42.03%
//   Group 2 (bottom text): inset 51.5% 0.09% 20.25% 41.85%

export default function NavbarReference() {
  return null; // Ver documentación arriba
}
