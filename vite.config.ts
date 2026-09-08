import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    // 避开 Clash TUN 对 localhost 的劫持；浏览器请开 http://127.0.0.1:5173/
    host: "127.0.0.1",
    port: 5173,
    strictPort: true,
  },
});
