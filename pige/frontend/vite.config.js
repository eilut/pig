import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/pige/", // تغيير هذا لاسم المستودع الخاص بك
  server: {
    host: "0.0.0.0",
  },
});
