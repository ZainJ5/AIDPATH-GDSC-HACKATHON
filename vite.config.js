export default defineConfig({
  plugins: [react()],
  assetsInclude: ['**/*.png'],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  }
})