const defaultTheme = require('tailwindcss/defaultTheme');
const flowbite = require('flowbite-react/tailwind');
//  @type {import('tailwindcss').Config}
module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx}', flowbite.content()],
    darkMode: 'class',
    theme: {
        fontFamily: {
            outfit: ['Roboto', 'sans-serif'],
        },
        screens: {
            '2xsm': '375px',
            xsm: '425px',
            '3xl': '2000px',
            ...defaultTheme.screens,
        },
        extend: {
            fontSize: {
                'title-2xl': ['72px', '90px'],
                'title-xl': ['60px', '72px'],
                'title-lg': ['48px', '60px'],
                'title-md': ['36px', '44px'],
                'title-sm': ['30px', '38px'],
                'theme-xl': ['20px', '30px'],
                'theme-sm': ['14px', '20px'],
                'theme-xs': ['12px', '18px'],
            },
            colors: {
                primary: {
                    50: '#eff6ff',
                    100: '#dbeafe',
                    200: '#bfdbfe',
                    300: '#93c5fd',
                    400: '#60a5fa',
                    500: '#3b82f6',
                    600: '#2563eb',
                    700: '#1d4ed8',
                    800: '#1e40af',
                    900: '#1e3a8a',
                    950: '#172554',
                },
                current: 'currentColor',
                transparent: 'transparent',
                white: '#FFFFFF',
                whiteBlue: '#EDF2F7',
                whiteBlue2: '#C5E9FF',
                blackGreen: '#2d3748',
                blackGreenHover: '#3d4553',
                black: '#000000',
                bodydark: '#AEB7C0',
                lightPrimary: '#F4F7FE',
                blueSecondary: '#4318FF',
                brandLinear: '#868CFF',
                bodydark: '#AEB7C0',
                bodydark1: '#DEE4EE',
                bodydark2: '#8A99AF',
                graydark: '#333A48',
                whiten: '#F1F5F9',
                whiter: '#F5F7FD',
                boxdark: '#24303F',
                strokedark: '#2E3A47',
                stroke: '#E2E8F0',
                graylight: '#F1F5F9',

                silver: '#bebcbd',
                meta: {
                    1: '#DC3545',
                    2: '#EFF2F7',
                    3: '#10B981',
                    4: '#313D4A',
                    5: '#259AE6',
                    6: '#FFBA00',
                    7: '#FF6766',
                    8: '#F0950C',
                    9: '#E5E7EB',
                    10: '#0FADCF',
                },

                navy: {
                    50: '#d0dcfb',
                    100: '#aac0fe',
                    200: '#a3b9f8',
                    300: '#728fea',
                    400: '#3652ba',
                    500: '#1b3bbb',
                    600: '#24388a',
                    700: '#1B254B',
                    800: '#111c44',
                    900: '#0b1437',
                },
                red: {
                    50: '#ee5d501a',
                    100: '#fee2e2',
                    200: '#fecaca',
                    300: '#fca5a5',
                    400: '#f87171',
                    500: '#f53939',
                    600: '#ea0606',
                    700: '#b91c1c',
                    800: '#991b1b',
                    900: '#7f1d1d',
                },

                amber: {
                    50: '#fffbeb',
                    100: '#fef3c7',
                    200: '#fde68a',
                    300: '#fcd34d',
                    400: '#fbbf24',
                    500: '#f59e0b',
                    600: '#d97706',
                    700: '#b45309',
                    800: '#92400e',
                    900: '#78350f',
                },
                yellow: {
                    50: '#fefce8',
                    100: '#fef9c3',
                    200: '#fef08a',
                    300: '#fde047',
                    400: '#fbcf33',
                    500: '#eab308',
                    600: '#ca8a04',
                    700: '#a16207',
                    800: '#854d0e',
                    900: '#713f12',
                },
                lime: {
                    50: '#f7fee7',
                    100: '#ecfccb',
                    200: '#d9f99d',
                    300: '#bef264',
                    400: '#98ec2d',
                    500: '#82d616',
                    600: '#65a30d',
                    700: '#4d7c0f',
                    800: '#3f6212',
                    900: '#365314',
                },
                green: {
                    50: '#05cd991a',
                    100: '#dcfce7',
                    150: '#10b9b0',
                    200: '#bbf7d0',
                    300: '#86efac',
                    400: '#4ade80',
                    500: '#22c55e',
                    600: '#17ad37',
                    700: '#15803d',
                    800: '#166534',
                    900: '#14532d',
                },
                teal: {
                    50: '#f0fdfa',
                    100: '#ccfbf1',
                    200: '#99f6e4',
                    300: '#5eead4',
                    400: '#2dd4bf',
                    500: '#14b8a6',
                    600: '#0d9488',
                    700: '#0f766e',
                    800: '#115e59',
                    900: '#134e4a',
                },
                cyan: {
                    50: '#ecfeff',
                    100: '#cffafe',
                    200: '#a5f3fc',
                    300: '#67e8f9',
                    400: '#21d4fd',
                    500: '#17c1e8',
                    600: '#0891b2',
                    700: '#0e7490',
                    800: '#155e75',
                    900: '#164e63',
                },
                blue: {
                    50: '#eff6ff',
                    60: '#edf2f7',
                    70: '#c5e9ff',
                    80: '#2d3748',
                    100: '#dbeafe',
                    200: '#bfdbfe',
                    300: '#93c5fd',
                    400: '#60a5fa',
                    500: '#3b82f6',
                    600: '#2152ff',
                    700: '#1d4ed8',
                    800: '#344e86',
                    900: '#00007d',
                },
                indigo: {
                    50: '#eef2ff',
                    100: '#e0e7ff',
                    200: '#c7d2fe',
                    300: '#a5b4fc',
                    400: '#818cf8',
                    500: '#6366f1',
                    600: '#4f46e5',
                    700: '#4338ca',
                    800: '#3730a3',
                    900: '#312e81',
                },
                purple: {
                    50: '#faf5ff',
                    100: '#f3e8ff',
                    200: '#e9d5ff',
                    300: '#d8b4fe',
                    400: '#c084fc',
                    500: '#a855f7',
                    600: '#9333ea',
                    700: '#7928ca',
                    800: '#6b21a8',
                    900: '#581c87',
                },
                pink: {
                    50: '#fdf2f8',
                    100: '#fce7f3',
                    200: '#fbcfe8',
                    300: '#f9a8d4',
                    400: '#f472b6',
                    500: '#ff0080',
                    600: '#db2777',
                    700: '#be185d',
                    800: '#9d174d',
                    900: '#831843',
                },
                brand: {
                    25: '#F2F7FF',
                    50: '#ECF3FF',
                    100: '#DDE9FF',
                    200: '#C2D6FF',
                    300: '#9CB9FF',
                    400: '#7592FF',
                    500: '#465FFF',
                    600: '#3641F5',
                    700: '#2A31D8',
                    800: '#252DAE',
                    900: '#262E89',
                    950: '#161950',
                },
                'blue-light': {
                    15: '#d9ecf7',
                    25: '#F5FBFF',
                    50: '#F0F9FF',
                    100: '#E0F2FE',
                    200: '#B9E6FE',
                    300: '#7CD4FD',
                    400: '#36BFFA',
                    500: '#0BA5EC',
                    600: '#0086C9',
                    700: '#026AA2',
                    800: '#065986',
                    900: '#0B4A6F',
                    950: '#062C41',
                },
                gray: {
                    dark: '#1A2231',
                    25: '#FCFCFD',
                    50: '#F9FAFB',
                    100: '#F2F4F7',
                    200: '#E4E7EC',
                    300: '#D0D5DD',
                    400: '#98A2B3',
                    500: '#667085',
                    600: '#475467',
                    700: '#344054',
                    800: '#1D2939',
                    900: '#101828',
                    950: '#0C111D',
                },
                orange: {
                    25: '#FFFAF5',
                    50: '#FFF6ED',
                    100: '#FFEAD5',
                    200: '#FDDCAB',
                    300: '#FEB273',
                    400: '#FD853A',
                    500: '#FB6514',
                    600: '#EC4A0A',
                    700: '#C4320A',
                    800: '#9C2A10',
                    900: '#7E2410',
                    950: '#511C10',
                },
                success: {
                    25: '#F6FEF9',
                    50: '#ECFDF3',
                    100: '#D1FADF',
                    200: '#A6F4C5',
                    300: '#6CE9A6',
                    400: '#32D583',
                    500: '#12B76A',
                    600: '#039855',
                    700: '#027A48',
                    800: '#05603A',
                    900: '#054F31',
                    950: '#053321',
                },
                error: {
                    25: '#FFFBFA',
                    50: '#FEF3F2',
                    100: '#FEE4E2',
                    200: '#FECDCA',
                    300: '#FDA29B',
                    400: '#F97066',
                    500: '#F04438',
                    600: '#D92D20',
                    700: '#B42318',
                    800: '#912018',
                    900: '#7A271A',
                    950: '#55160C',
                },
                warning: {
                    25: '#FFFCF5',
                    50: '#FFFAEB',
                    100: '#FEF0C7',
                    200: '#FEDF89',
                    300: '#FEC84B',
                    400: '#FDB022',
                    500: '#F79009',
                    600: '#DC6803',
                    700: '#B54708',
                    800: '#93370D',
                    900: '#7A2E0E',
                    950: '#4E1D09',
                },
                'theme-pink': {
                    500: '#EE46BC',
                },
                'theme-purple': {
                    500: '#7A5AF8',
                },
            },
            boxShadow: {
                'theme-md': '0px 4px 8px -2px rgba(16, 24, 40, 0.10), 0px 2px 4px -2px rgba(16, 24, 40, 0.06)',
                'theme-lg': '0px 12px 16px -4px rgba(16, 24, 40, 0.08), 0px 4px 6px -2px rgba(16, 24, 40, 0.03)',

                'theme-sm': '0px 1px 3px 0px rgba(16, 24, 40, 0.10), 0px 1px 2px 0px rgba(16, 24, 40, 0.06)',
                'theme-xs': '0px 1px 2px 0px rgba(16, 24, 40, 0.05)',
                'theme-xl': '0px 20px 24px -4px rgba(16, 24, 40, 0.08), 0px 8px 8px -4px rgba(16, 24, 40, 0.03)',
                datepicker: '-5px 0 0 #262d3c, 5px 0 0 #262d3c',
                'focus-ring': '0px 0px 0px 4px rgba(70, 95, 255, 0.12)',
                'slider-navigation': '0px 1px 2px 0px rgba(16, 24, 40, 0.10), 0px 1px 3px 0px rgba(16, 24, 40, 0.10)',
                tooltip: '0px 4px 6px -2px rgba(16, 24, 40, 0.05), -8px 0px 20px 8px rgba(16, 24, 40, 0.05)',
            },
            dropShadow: {
                '4xl': ['0 35px 35px rgba(0, 0, 0, 0.25)', '0 45px 65px rgba(0, 0, 0, 0.15)'],
            },
            zIndex: {
                999999: '999999',
                99999: '99999',
                9999: '9999',
                999: '999',
                99: '99',
                9: '9',
                1: '1',
            },
            spacing: {
                4.5: '1.125rem',
                5.5: '1.375rem',
                6.5: '1.625rem',
                7.5: '1.875rem',
                8.5: '2.125rem',
                9.5: '2.375rem',
                10.5: '2.625rem',
                11.5: '2.875rem',
                12.5: '3.125rem',
                13: '3.25rem',
                13.5: '3.375rem',
                14.5: '3.625rem',
                15: '3.75rem',
            },
            animation: {
                rotate: 'rotate 2s linear infinite',
            },
            keyframes: {
                rotate: {
                    '0%': { transform: 'rotate(0deg) translateX(6rem)', opacity: '0.9' },
                    '100%': { transform: 'rotate(360deg) translateX(6rem)', opacity: '1' },
                },
            },
        },
    },
    plugins: [require('@tailwindcss/forms'), require('autoprefixer'), flowbite.plugin()],
};
