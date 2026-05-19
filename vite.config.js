import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue'; // ❶ Vue 3用の公式プラグインに変更
import legacy from '@vitejs/plugin-legacy';
import checker from 'vite-plugin-checker';
import path from 'path'; // ❺ パス結合用のモジュールを追加
import autoprefixer from 'autoprefixer'; // require の代わりに import を使用

export default defineConfig({
  root: 'src',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
  plugins: [
    vue(), // ❶ Vue 3用プラグインを適用
    legacy({
      targets: ['defaults', 'not IE 11'], // ❷ Vue 3はIE11非対応のためターゲットを変更
    }),
    // checker({
    //   eslint: {
    //     // 必要に応じて、検証対象の拡張子に .ts などを追加してください
    //     lintCommand: 'eslint "js/**/*.{js,vue}"'
    //   },
    // }),
  ],
  resolve: {
    alias: {
      // ❸ Vue 3用の本体エイリアスに変更（不要な場合もありますが、互換性のために残すならこちら）
      'vue': 'vue/dist/vue.esm-bundler.js', 
      
      // ❹ __dirname の記述エラーを防ぐため path.resolve を使用
      'TodoDir': path.resolve(__dirname, 'src/js/todo'),
      'TodoRouterDir': path.resolve(__dirname, 'src/js/todoRouter'),
      'TodoVuexDir': path.resolve(__dirname, 'src/js/todoVuex'),
      'VuexSample': path.resolve(__dirname, 'src/js/todoVuex_sample'),
    },
  },
  css: {
    postcss: {
      plugins: [
        autoprefixer(), // ESM（import）の形式に合わせて記述
      ],
    },
  },
  server: {
    open: true,
    port: 8080,
  },
});

