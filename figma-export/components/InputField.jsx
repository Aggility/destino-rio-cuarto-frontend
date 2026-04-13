/**
 * InputField Component — Catálogo completo
 * Figma Node ID: 3356:2472  (Frame "Input Field", 1233x3160px)
 *
 * ═══════════════════════════════════════════════════════════════
 * VARIANTES (Size × State × Dark Mode)
 * ═══════════════════════════════════════════════════════════════
 * SIZES:  Small | Regular | Large
 * STATES: Normal | Disabled | Typing | Active | Value | Success | Error
 * DARK:   false | true
 *
 * ═══════════════════════════════════════════════════════════════
 * DESIGN TOKENS
 * ═══════════════════════════════════════════════════════════════
 *
 * Normal (light):
 *   bg:      #f9fafb  (gray/50)
 *   border:  #d1d5db  (gray/300)
 *   label:   #111928  (gray/900)
 *   placeholder: #6b7280 (gray/500)
 *   helper:  #6b7280  (gray/500)
 *
 * Active/Typing (light):
 *   border:  #1c64f2  (primary/600)
 *   label:   #111928
 *   text:    #111928
 *
 * Disabled (light):
 *   bg:      #f9fafb  (gray/50)
 *   border:  #d1d5db  (gray/300)
 *   label:   #9ca3af  (gray/400)
 *   placeholder: #9ca3af
 *
 * Success (light):
 *   bg:     #f3faf7  (green/50)
 *   border: #0e9f6e  (green/500)
 *   text:   #046c4e  (green/700)
 *   helper: #057a55  (green/600)
 *
 * Error (light):
 *   bg:     #fdf2f2  (red/50)
 *   border: #f05252  (red/500)
 *   text:   #c81e1e  (red/700)
 *   helper: #e02424  (red/600)
 *
 * Dark Mode Success:
 *   bg:     #374151  (gray/700)
 *   border: #0e9f6e  (green/500)
 *   text:   #0e9f6e  (green/500)
 *
 * Dark Mode Error:
 *   bg:     #374151  (gray/700)
 *   border: #f05252  (red/500)
 *   text:   #f05252  (red/500)
 *
 * ═══════════════════════════════════════════════════════════════
 * SIZES (width, padding, font-size)
 * ═══════════════════════════════════════════════════════════════
 * Small:
 *   width: 364px
 *   padding input: px-4 py-2  (16px 8px)
 *   font-size: 14px (label & placeholder)
 *   icon size: 16px (user icon), 10px (x icon)
 *
 * Regular:
 *   width: 364px
 *   padding input: px-4 py-3  (16px 12px)
 *   font-size: 12px (placeholder), 14px (label)
 *   icon size: 16px (user), 12px (x)
 *
 * Large:
 *   width: 364px
 *   padding input: px-4 py-3.5  (16px 14px)
 *   font-size: 16px (placeholder), 14px (label)
 *   icon size: 16px (user), 12px (x)
 *
 * Border-radius: 8px
 *
 * ═══════════════════════════════════════════════════════════════
 * ASSETS (Figma local server)
 * ═══════════════════════════════════════════════════════════════
 * User icon:    http://localhost:3845/assets/6d4ca957b2d81d1998ff46728785ca78e65e5a3a.svg
 * X close icon: http://localhost:3845/assets/4c296542f6e4d4c6308b42c2485867ff7af4bbcb.svg
 * Vector (small regular): http://localhost:3845/assets/4362e146c3580eb2a45b4691370bdac83c523d4a.svg
 * Vector1: http://localhost:3845/assets/377e47eedac1a087c39bc58c0fe058c1b01f91df.svg
 * Vector2 (large user): http://localhost:3845/assets/c471b03ad0ea99ee86e9c92ef4fd355bb3414034.svg
 *
 * ═══════════════════════════════════════════════════════════════
 * REFERENCE CODE — Small Normal (light)
 * ═══════════════════════════════════════════════════════════════
 *
 * <div className="flex flex-col gap-2 w-[364px]">
 *   <label className="text-sm font-medium text-[#111928]">First name</label>
 *   <div className="flex items-center gap-2.5 bg-[#f9fafb] border border-[#d1d5db] rounded-lg px-4 py-2">
 *     <img src="/icons/user.svg" alt="" className="w-4 h-4" />
 *     <input
 *       type="text"
 *       placeholder="Input text"
 *       className="flex-1 text-sm text-[#6b7280] bg-transparent outline-none"
 *     />
 *     <button><img src="/icons/x.svg" alt="clear" className="w-2.5 h-2.5" /></button>
 *   </div>
 *   <p className="text-sm text-[#6b7280]">
 *     We'll never share your details. See our <span className="text-[#111928]">Privacy Policy.</span>
 *   </p>
 * </div>
 *
 * ═══════════════════════════════════════════════════════════════
 * PROPS (TypeScript interface from Figma)
 * ═══════════════════════════════════════════════════════════════
 * darkMode?: boolean
 * helperText?: string
 * labelText?: string
 * leftIconStyle?: ReactNode | null
 * placeholderText?: string
 * rightIconStyle?: ReactNode | null
 * showHelperText?: boolean
 * showLabel?: boolean
 * showLeftIcon?: boolean
 * showPlaceholder?: boolean
 * showRightIcon?: boolean
 * size?: "Regular" | "Large" | "Small"
 * state?: "Active"|"Disabled"|"Error"|"Success"|"Typing"|"Normal"|"Value"
 */

export default function InputFieldReference() {
  return null;
}
