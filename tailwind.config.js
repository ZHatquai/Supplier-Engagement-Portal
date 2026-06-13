/** @type {import('tailwindcss').Config} */
// The Corporate brand tokens. Only these colours + white are permitted
// (no Tailwind gray/blue defaults). Square corners and no shadows are the
// defaults; brand primitives live in src/index.css @layer components.
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#000000',
        stone: '#B6B09F',
        linen: '#EAE4D5',
        chalk: '#F2F2F2',
        white: '#FFFFFF',
        lime: '#C8F135',
        // Brand status colours (text only, never fills)
        error: '#C0392B',
        success: '#2E7D32',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        // Square corners everywhere — override Tailwind's defaults.
        none: '0',
        DEFAULT: '0',
      },
      maxWidth: {
        page: '1120px',
        content: '720px',
      },
      letterSpacing: {
        label: '0.12em',
        subhead: '0.16em',
      },
    },
  },
  corePlugins: {
    // No shadows in the brand system — disable the utility entirely.
    boxShadow: false,
  },
  plugins: [],
}
