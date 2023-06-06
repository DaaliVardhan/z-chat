import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    "process.env": {
      "VITE_GOOGLE_CLIENT_ID" :"400457998841-bmqqqhafsutsdue335ei4u77avpieb6a.apps.googleusercontent.com",
      "VITE_GOOGLE_CLIENT_SECRET" :"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",
      "VITE_SERVER_URL" : "http://localhost:5000"
    },
  },
})
