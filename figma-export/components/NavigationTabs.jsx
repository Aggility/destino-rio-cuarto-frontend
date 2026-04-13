/**
 * NavigationTabs Component
 * Figma Node IDs:
 *   Frame:           3777:8057  (Tabs, 357x116px, x:9 y:168)
 *   Navigation Tabs: 3777:8058  (341x100px)
 *   Tabs Grid:       3777:8059  (341x100px)
 *   Button Eventos:       3777:8060 (166x46px, x:0 y:0)
 *   Button Actividades:   3777:8064 (166x46px, x:174 y:0)
 *   Button Experiencias:  3777:8068 (166x46px, x:0 y:54)
 *   Button Servicios:     3777:8072 (166x46px, x:174 y:54)
 *
 * Design tokens used:
 *   --button/Alternative/bg:          #ffffff
 *   --button/Alternative/bg-border:   #e5e7eb
 *   --button/Alternative/font-color:  #374151
 *   --rounded-lg:                     8px
 *   --spacing/0,75rem:                12px (padding-left)
 *   --spacing/0,375rem:               6px  (padding-right, padding-y)
 *   --spacing/0,5rem:                 8px  (gap)
 *   --Type/Eventos:      #fa4489
 *   --Type/Actividades:  #8a38f5
 *   --Type/Experiencias: #ff5a1f
 *   --Type/Servicios:    #203f83
 *   --border-radius/1:   8px (icon badge)
 *   --spacing/0,25rem:   4px (icon badge padding)
 *
 * Tab Buttons Layout:
 *   Each button: 166x46px
 *   Layout: 2 columns x 2 rows
 *   Position: col1:row1, col2:row1, col1:row2, col2:row2
 *   Content: Text (left, 12px button/alternative/font-color) + Icon Badge (right, 34x34px)
 *
 * Icon Badges (34x34px circular, colored):
 *   Eventos:      #fa4489 bg, star/rating icon
 *   Actividades:  #8a38f5 bg, jump/activity icon
 *   Experiencias: #ff5a1f bg, sparkler icon
 *   Servicios:    #203f83 bg, shop/bag icon
 *
 * Icon Assets (Figma local server):
 *   Rating/Eventos:      http://localhost:3845/assets/9868f0463c7697f28c34fa6c1dc65d4fc85b9137.png
 *   Jump/Actividades:    http://localhost:3845/assets/dc6c5227411e80b664c1b8a2f9ce25aecd19a73a.png
 *   Sparkler/Experien.:  http://localhost:3845/assets/636622e5e8aa4b49ec75d3499430920e2799c03e.png
 *   Shop/Servicios:      http://localhost:3845/assets/0bf2792c47fa31a8cf397b4d672a42a19fbab85d.png
 *
 * Text styles:
 *   Font: Inter Regular, 16px, line-height 1.5, color #374151
 */

// ─── Reference Code (React + Tailwind from Figma) ───────────────────────────
// NOTA: Convertir al stack del proyecto (Next.js + Bootstrap + SCSS)

/*
<div className="content-stretch flex flex-col gap-0 items-start p-2 relative rounded-tl-lg rounded-tr-lg w-full">
  <div className="content-center flex flex-wrap gap-2 items-center relative w-full">
    <div className="content-start flex flex-wrap gap-2 items-start relative w-full">

      {/* Button: Eventos *\/}
      <button className="bg-white border border-gray-200 flex items-center justify-between pl-3 pr-1.5 py-1.5 rounded-lg w-[166px]">
        <span className="text-gray-700 text-base font-normal">Eventos</span>
        <div className="bg-[#fa4489] flex items-center justify-center p-1 rounded-lg w-[34px] h-[34px]">
          <img src="/icons/rating.png" alt="Eventos" className="w-full h-full object-contain" />
        </div>
      </button>

      {/* Button: Actividades *\/}
      <button className="bg-white border border-gray-200 flex items-center justify-between pl-3 pr-1.5 py-1.5 rounded-lg w-[166px]">
        <span className="text-gray-700 text-base font-normal">Actividades</span>
        <div className="bg-[#8a38f5] flex items-center justify-center p-1 rounded-lg w-[34px] h-[34px]">
          <img src="/icons/jump.png" alt="Actividades" className="w-full h-full object-contain" />
        </div>
      </button>

      {/* Button: Experiencias *\/}
      <button className="bg-white border border-gray-200 flex items-center justify-between pl-3 pr-1.5 py-1.5 rounded-lg w-[166px]">
        <span className="text-gray-700 text-base font-normal">Experiencias</span>
        <div className="bg-[#ff5a1f] flex items-center justify-center p-1.5 rounded-lg w-[34px] h-[34px]">
          <img src="/icons/sparkler.png" alt="Experiencias" className="w-full h-full object-contain" />
        </div>
      </button>

      {/* Button: Servicios *\/}
      <button className="bg-white border border-gray-200 flex items-center justify-between pl-3 pr-1.5 py-1.5 rounded-lg w-[166px]">
        <span className="text-gray-700 text-base font-normal">Servicios</span>
        <div className="bg-[#203f83] flex items-center justify-center p-1.5 rounded-lg w-[34px] h-[34px]">
          <img src="/icons/shop.png" alt="Servicios" className="w-full h-full object-contain" />
        </div>
      </button>

    </div>
  </div>
</div>
*/

export default function NavigationTabsReference() {
  return null; // Ver documentación y código de referencia arriba
}
