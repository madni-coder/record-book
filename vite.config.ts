import path from "path";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, ".", "");
    return {
        define: {
            "process.env.API_KEY": JSON.stringify(env.GEMINI_API_KEY),
            "process.env.GEMINI_API_KEY": JSON.stringify(env.GEMINI_API_KEY),
        },
        css: {
            // This section is intentionally left empty to let PostCSS config handle it
        },
        resolve: {
            alias: {
                "@": path.resolve(__dirname, "."),
            },
        },
        server: {
            port: 3002,
        },
        optimizeDeps: {
            include: ["daisyui"],
        },
    };
});
