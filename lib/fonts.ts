import localFont from 'next/font/local'

/** Font Inter (file lokal, sama persis dengan HTML asli). */
export const inter = localFont({
  src: [
    { path: '../fonts/inter-thin.ttf', weight: '100', style: 'normal' },
    { path: '../fonts/inter-extralight.ttf', weight: '200', style: 'normal' },
    { path: '../fonts/inter-light.ttf', weight: '300', style: 'normal' },
    { path: '../fonts/inter-regular.ttf', weight: '400', style: 'normal' },
    { path: '../fonts/inter-medium.ttf', weight: '500', style: 'normal' },
    { path: '../fonts/inter-semibold.ttf', weight: '600', style: 'normal' },
    { path: '../fonts/inter-bold.ttf', weight: '700', style: 'normal' },
    { path: '../fonts/inter-extrabold.ttf', weight: '800', style: 'normal' },
    { path: '../fonts/inter-black.ttf', weight: '900', style: 'normal' },
  ],
  variable: '--font-inter',
  display: 'swap',
  fallback: ['system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
})
