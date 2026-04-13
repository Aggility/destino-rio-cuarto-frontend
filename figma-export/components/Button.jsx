/**
 * Button Component — Catálogo completo
 * Figma Node ID: 3356:2789  (Frame "Button", 1458x2388px)
 *
 * ═══════════════════════════════════════════════════════════════
 * VARIANTES (Color × Size × State × Outline × Icon-only)
 * ═══════════════════════════════════════════════════════════════
 *
 * COLORS:  Primary | Dark | Green | Red | Alternative | Alternative Dark
 * SIZES:   xs | sm | base | l | xl
 * STATES:  Default | Hover | Focus
 * OUTLINE: true | false
 * ICON-ONLY: true | false
 *
 * ═══════════════════════════════════════════════════════════════
 * DESIGN TOKENS
 * ═══════════════════════════════════════════════════════════════
 * Primary Fill:
 *   bg:         #1a56db  (button/filled/background)
 *   border:     #1a56db  (button/filled/background-border)
 *   color:      #f9fafb  (button/filled/font-color-1)
 *
 * Primary Outline:
 *   bg:         transparent
 *   border:     #1a56db
 *   color:      #1a56db
 *
 * Alternative (outline):
 *   bg:         #ffffff  (button/Alternative/bg)
 *   border:     #e5e7eb  (button/Alternative/bg-border)
 *   color:      #374151  (button/Alternative/font-color)
 *   hover-bg:   #ffffff  (button/Alternative/bg-hover)
 *   hover-color:#0f172a  (button/Alternative/font-color-hover)
 *   shadow:     0px 4px 16px 0px rgba(26,86,216,0.3)
 *   inner-shadow: inset 0px -1px 0px 0px rgba(30,66,159,0.25)
 *
 * Dark Fill:
 *   bg:         #1f2937  (gray/800)
 *   border:     #1f2937
 *   color:      #f9fafb
 *
 * Green Fill:
 *   bg:         #046c4e  (green/700)
 *   border:     #046c4e
 *   color:      #ffffff
 *
 * Red Fill:
 *   bg:         #c81e1e  (red/700)
 *   border:     #c81e1e
 *   color:      #ffffff
 *
 * ═══════════════════════════════════════════════════════════════
 * SIZES (padding, font-size, height)
 * ═══════════════════════════════════════════════════════════════
 * xs:   120x26px  — text-xs    (font-size ~12px)
 * sm:   139x37px  — text-sm    (font-size ~14px)
 * base: 159x41px  — text-base  (font-size ~16px)
 * l:    174x48px  — text-lg    (font-size ~18px)
 * xl:   182x52px  — text-xl    (font-size ~20px)
 *
 * Icon-only sizes:
 * xs:  20x20px
 * sm:  28x28px
 * base:34x34px
 * l:   40x40px
 * xl:  44x44px
 *
 * Border-radius: --rounded-lg = 8px
 *
 * ═══════════════════════════════════════════════════════════════
 * REFERENCE CODE — Button Base (Primary, base size, filled)
 * ═══════════════════════════════════════════════════════════════
 *
 * <button
 *   className="bg-[#1a56db] border border-[#1a56db] text-[#f9fafb]
 *              flex items-center justify-center gap-2
 *              px-4 py-2 rounded-lg
 *              text-base font-medium
 *              hover:bg-[#1c64f2] focus:ring-2 focus:ring-[#1a56db]"
 * >
 *   Label
 * </button>
 *
 * ═══════════════════════════════════════════════════════════════
 * REFERENCE CODE — Button Alternative (with shadow)
 * Used in Navbar: "Publicá Acá"
 * ═══════════════════════════════════════════════════════════════
 *
 * <button
 *   className="bg-white border border-[#e5e7eb] text-[#374151]
 *              flex items-center justify-center gap-2
 *              px-5 py-3 rounded-lg text-sm font-normal
 *              shadow-[0px_4px_16px_0px_rgba(26,86,216,0.3)]
 *              relative overflow-hidden"
 *   style={{ boxShadow: 'inset 0px -1px 0px 0px rgba(30,66,159,0.25)' }}
 * >
 *   Publicá Acá
 * </button>
 */

export default function ButtonReference() {
  return null;
}
