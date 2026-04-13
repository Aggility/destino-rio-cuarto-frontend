/**
 * Destino Río Cuarto - Design Tokens
 * Extraído del proyecto Figma (Internal Only Canvas)
 * Página: Internal Only Canvas (0:2)
 */

export const colors = {
  primary: {
    50:  '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    500: '#1a56db',
    600: '#1c64f2',
    700: '#1d4ed8',
    800: '#1e3a8a',
    900: '#1e3a8a',
  },
  gray: {
    50:  '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111928',
  },
  type: {
    eventos:      '#fa4489',
    actividades:  '#8a38f5',
    experiencias: '#ff5a1f',
    servicios:    '#203f83',
  },
  green: {
    50:  '#f3faf7',
    100: '#def7ec',
    500: '#0e9f6e',
    600: '#057a55',
    700: '#046c4e',
    900: '#014737',
  },
  red: {
    50:  '#fdf2f2',
    100: '#fde8e8',
    500: '#f05252',
    600: '#e02424',
    700: '#c81e1e',
    800: '#9b1c1c',
  },
  white: '#ffffff',
};

export const spacing = {
  '0rem':    '0px',
  '0.25rem': '4px',
  '0.375rem':'6px',
  '0.5rem':  '8px',
  '0.75rem': '12px',
  '1rem':    '16px',
  '1.25rem': '20px',
  '1.5rem':  '24px',
  '2rem':    '32px',
  '2.5rem':  '40px',
};

export const borderRadius = {
  sm:   '4px',   // border-radius/0.5
  md:   '8px',   // border-radius/1 | rounded-lg
  full: '9999px',// rounded-full
};

export const typography = {
  fontFamily: "'Inter', sans-serif",
  fontSize: {
    xs:   '12px',
    sm:   '14px',
    base: '16px',
    lg:   '18px',
    xl:   '20px',
    '2xl':'24px',
  },
  fontWeight: {
    normal:    400,
    medium:    500,
    semibold:  600,
    bold:      700,
    extrabold: 800,
  },
  lineHeight: {
    none:  '1',
    tight: '1.25',
    base:  '1.5',
  },
};

// CSS Custom Properties (variables Figma → CSS)
export const cssVariables = `
  /* Button - Alternative */
  --button-alt-font-color: #374151;
  --button-alt-bg: #ffffff;
  --button-alt-bg-border: #e5e7eb;
  --button-alt-bg-hover: #ffffff;
  --button-alt-font-color-hover: #0f172a;

  /* Button - Filled (Primary) */
  --button-filled-bg: #1a56db;
  --button-filled-bg-border: #1a56db;
  --button-filled-font-color: #f9fafb;

  /* Button - Outlined */
  --button-outlined-bg: #ffffff;
  --button-outlined-bg-border: #e5e7eb;
  --button-outlined-font-color: #111928;

  /* Button - Secondary */
  --button-secondary-bg: #1a56db;
  --button-secondary-font-color: #f4f4f1;

  /* Card */
  --card-bg: #ffffff;
  --card-bg-border: #e5e7eb;

  /* Type colors */
  --type-eventos: #fa4489;
  --type-actividades: #8a38f5;
  --type-experiencias: #ff5a1f;
  --type-servicios: #203f83;

  /* Border radius */
  --border-radius-1: 8px;
  --rounded-lg: 8px;
  --rounded-full: 9999px;
`;
