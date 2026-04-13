# Destino Río Cuarto — Figma Design System Export

## Estructura del proyecto Figma

### Páginas
| ID    | Nombre                | Descripción |
|-------|-----------------------|-------------|
| 0:1   | Styleguide            | Canvas vacío/styleguide |
| 0:2   | Internal Only Canvas  | Todos los componentes, variables y design system |

---

## Design Tokens

### Colores principales

| Variable Figma | Valor | Uso |
|----------------|-------|-----|
| `gray/900`     | `#111928` | Texto principal |
| `gray/700`     | `#374151` | Texto secundario (dark mode bg) |
| `gray/500`     | `#6b7280` | Texto placeholder / helper |
| `gray/400`     | `#9ca3af` | Estado disabled |
| `gray/300`     | `#d1d5db` | Bordes inputs |
| `gray/200`     | `#e5e7eb` | Bordes botones alternative |
| `gray/50`      | `#f9fafb` | Fondos inputs |
| `white`        | `#ffffff` | Fondo |
| `primary/600`  | `#1c64f2` | Borde inputs activos |
| `primary/500`  | `#1a56db` | Color primario (botones filled, links) |

### Colores de Tipo de contenido

| Variable Figma      | Valor     | Categoría    |
|---------------------|-----------|--------------|
| `Type/Eventos`      | `#fa4489` | Eventos      |
| `Type/Actividades`  | `#8a38f5` | Actividades  |
| `Type/Experiencias` | `#ff5a1f` | Experiencias |
| `Type/Servicios`    | `#203f83` | Servicios    |

### Spacing

| Variable             | Valor |
|----------------------|-------|
| `spacing/0,25rem`    | 4px   |
| `spacing/0,375rem`   | 6px   |
| `spacing/0,5rem`     | 8px   |
| `spacing/0,75rem`    | 12px  |
| `spacing/1rem`       | 16px  |

### Bordes

| Variable             | Valor |
|----------------------|-------|
| `border-radius/1`    | 8px   |
| `rounded-lg`         | 8px   |
| `border-radius/0.5`  | 4px   |
| `rounded-full`       | 9999px|

---

## Componentes

### Navbar (3355:9799)
Variantes: `Default` | `Default Dark` | `Tablet` | `Tablet Dark` | `Mobile` | `Mobile Dark`

**Desktop (1440px):**
- Logo: 140x49px (Isologo 49x49 + texto)
- Nav Links: Eventos | Actividades | Turismo Ciudad | Servicios | Calendario
- CTA: "Publicá Acá" (alternative) + "Ver mas eventos" (filled)

**Mobile/Tablet:** Logo + Hamburger icon (16px mobile, 20px tablet)

### NavigationTabs (3777:8057)
Grid de 2×2 botones (166×46px cada uno):
- **Eventos** — badge rosa `#fa4489`
- **Actividades** — badge morado `#8a38f5`
- **Experiencias** — badge naranja `#ff5a1f`
- **Servicios** — badge azul oscuro `#203f83`

### Button (3356:2789)
- **Colores:** Primary | Dark | Green | Red | Alternative | Alternative Dark
- **Tamaños:** xs(26px) | sm(37px) | base(41px) | l(48px) | xl(52px)
- **Estados:** Default | Hover | Focus
- **Modos:** Filled | Outline | Icon-only

### InputField (3356:2472)
- **Tamaños:** Small | Regular | Large
- **Estados:** Normal | Disabled | Typing | Active | Value | Success | Error
- **Modos:** Light | Dark

### ViewMore (3570:3942)
- **Variantes:** Text | Button Soft | Button Ghost | Button (filled)
- Texto: "Ver más" — Inter Medium 15px

### Tooltip (3353:116)
- **Colores:** Dark | White
- **Posiciones:** Top | Right | Left | Bottom
- **Con/sin título**

### Checkbox (3356:4011)
- **Estado:** Initial | Checked | Disabled
- **Tipo:** Default | Advanced
- **Modo:** Light | Dark

### Download App Button (3356:4189)
- AppStore (light & dark)
- Google Play (light & dark)

---

## Variables del Design System

### Color Variables (CSS Custom Properties)

```css
/* Buttons */
--button-alt-font-color: #374151;
--button-alt-bg: #ffffff;
--button-alt-bg-border: #e5e7eb;
--button-filled-bg: #1a56db;
--button-filled-bg-border: #1a56db;
--button-filled-font-color: #f9fafb;

/* Cards */
--card-bg: #ffffff;
--card-bg-border: #e5e7eb;

/* Type colors */
--type-eventos: #fa4489;
--type-actividades: #8a38f5;
--type-experiencias: #ff5a1f;
--type-servicios: #203f83;
```

---

## Tipografía

**Fuente principal:** Inter (Google Fonts)
- Regular (400): textos y navegación
- Medium (500): labels, botones secundarios
- SemiBold (600): encabezados
- Bold (700): títulos
- ExtraBold (800): hero titles

**Escala tipográfica:** xs(12) | sm(14) | base(16) | lg(18) | xl(20) | 2xl(24) | 3xl(30) | 5xl(48) | 6xl(60)

---

## Estructura de archivos exportados

```
figma-export/
├── README.md                    ← Este archivo
├── design-tokens/
│   └── variables.js             ← Todos los tokens: colores, spacing, radius, typo
└── components/
    ├── Navbar.jsx               ← Navbar (6 variantes responsive)
    ├── NavigationTabs.jsx       ← Tabs de categorías (Eventos/Actividades/Exp./Servicios)
    ├── Button.jsx               ← Botones (6 colores × 5 tamaños × 3 estados)
    ├── InputField.jsx           ← Campos de formulario (3 tamaños × 7 estados)
    └── ViewMore.jsx             ← Botón "Ver más" (4 variantes)
```

---

## Notas de implementación

1. **Stack del proyecto:** Next.js (App Router) + Bootstrap 5 + SCSS
2. **NO usar Tailwind** — convertir clases Tailwind de referencia a SCSS/Bootstrap
3. Los assets de imágenes (SVG/PNG) están en el servidor local de Figma durante development: `http://localhost:3845/assets/[hash]`
4. En producción, reemplazar estas URLs por los assets del proyecto
5. Los `data-node-id` en el código son referencias a los nodos de Figma para trazabilidad
