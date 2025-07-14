// vite.config.js (O ARQUIVO APÓS A SUA EDIÇÃO)
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    base: '/Site-Bolsa-de-Valores/', // <<< ESTA É A ÚNICA LINHA QUE VOCÊ PRECISA ADICIONAR
})