/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,ts,jsx,tsx}",
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./*.{js,ts,jsx,tsx,html}",
        "./index.html",
    ],
    theme: {
        extend: {},
    },
    plugins: [require("daisyui")],
   // tailwind.config.js
daisyui: {
    themes: ["cupcake", "night"], // Remove night if not needed
    darkTheme: "night", // This will be used for prefers-color-scheme: dark
    base: true,
    styled: true,
    utils: true,
    logs: true,
},
};