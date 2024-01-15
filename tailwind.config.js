/** @type {import('tailwindcss').Config} */

export default {
    content: [
        './index.html',
        './src/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
            gridTemplateColumns: {
                cardAFit: 'repeat(auto-fit, minmax(18.25rem, 1fr))',
            },
            gridTemplateRows: {
                card: 'repeat(1, 18.25rem)',
            },
            gridAutoRows: {
                card: '18.25rem',
            },
            colors: {
                bgPrimary: '#171520',
                bgTwo: '#352f48',
                bgThree: '#494363',
                bgFour: '#645c89',
                bgFive: '#78709f',
                fillPrimary: '#94a3b8', // slate-400
                textPrimary: 'rgba(255, 255, 255, 0.94)',
                dividePrimary: 'rgba(255, 255, 255, 0.3)',
                errorPrimary: '#ef4444', // red-500
                lightPink: '#e697a4',
            },
            screens: {
                xxs: '400px',
                xs: '500px',
                ssm: '610px',
            },
        },

    },
    plugins: [],
};
