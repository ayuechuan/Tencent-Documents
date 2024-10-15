import replace from '@rollup/plugin-replace'
import react from '@vitejs/plugin-react-swc'
import { resolve } from 'path'
import { visualizer } from 'rollup-plugin-visualizer'
import AutoImport from 'unplugin-auto-import/vite'
import type { ConfigEnv } from 'vite'
import { defineConfig, loadEnv } from 'vite'
import { comlink } from 'vite-plugin-comlink'
import viteCompression from 'vite-plugin-compression'

// https://vitejs.dev/config/
export default ({ command, mode }: ConfigEnv) => {
  const currentEnv = loadEnv(mode, process.cwd())
  console.log('Current mode:', command, mode)
  console.log('Current environment configuration:', currentEnv) //loadEnv即加载根目录下.env.[mode]环境配置文件
  return defineConfig({
    plugins: [
      react({tsDecorators : true}),
      // comlink(),
      AutoImport({
        imports: ['react', 'react-router-dom', { react: ['Fragment'] }],
        dts: './src/auto-imports.d.ts',
        dirs: ['src/store'],
        eslintrc: {
          enabled: true, // Default `false`
          filepath: './.eslintrc-auto-import.json', // Default `./.eslintrc-auto-import.json`
        },
      }),
      visualizer({
        // gzipSize: true,
        brotliSize: true,
        emitFile: false,
        filename: 'test.html', //分析图生成的文件名
        open: false, //如果存在本地服务端口，将在打包后自动展示
      }),
      viteCompression({
        algorithm: 'gzip',
        threshold: 10240,
        // verbose: true,
        // deleteOriginFile: true,
        ext: '.gz',
      }),
      // replace({
      //   'process.env.NODE_ENV': JSON.stringify('production'),
      //   preventAssignment: true,
      // })
    ],
    //项目部署的基础路径,
    base: currentEnv.VITE_PUBLIC_PATH,
    mode,
    resolve: {
      //别名
      // alias: {
      //   '@': resolve(__dirname, './src'),
      //   '@components': resolve(__dirname, './src/components'),
      //   '@store': resolve(__dirname, './src/store'),
      //   '@views': resolve(__dirname, './src/views'),
      //   '@assets': resolve(__dirname, './src/assets'),
      //   '@hooks': resolve(__dirname, './src/hooks'),
      // },
      alias: [
        {
          find: /^~/,
          replacement: '',
        },
        { find: '@', replacement: resolve(__dirname, './src') },
        { find: '@components', replacement: resolve(__dirname, './src/components') },
        { find: '@store', replacement: resolve(__dirname, './src/store') },
        { find: '@views', replacement: resolve(__dirname, './src/views') },
        { find: '@assets', replacement: resolve(__dirname, './src/assets') },
        { find: '@hooks', replacement: resolve(__dirname, './src/hooks') },
      ],
    },
    //服务
    server: {
      host: '0.0.0.0',
      //自定义代理---解决跨域
      proxy: {
        // 选项写法
        '/api': {
          target: 'http://xxxxxx.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
    css: {
      // css预处理器
      preprocessorOptions: {
        sass: {},
        less: {
          modifyVars: {
            //  前缀
            // '@prefix': currentEnv.VITE_PUBLIC_PREFIX, // 请注意需要与classPrefix保持一致
          },
          javascriptEnabled: true,
        },
      },
    },
    worker: {
      // plugins: () => [comlink()],
    },
    //构建
    build: {
      //  将项目打包成 sdk 格式
      // lib: {
      //   entry: resolve(__dirname, 'src/main.tsx'),
      //   name: 'Td',
      //   formats: ['umd'],
      //   fileName: (format) => {
      //     // if (format === 'es') {
      //     //   return 'Td.esm.js'
      //     // }
      //     // if (format === 'umd') {
      //     //   return 'Td.umd.js'
      //     // }
      //     // return 'Td.js';
      //     return `index.${format}.js`;
      //   }
      // },
      outDir: mode === 'docker' ? 'dist' : 'docs', //输出路径
      //构建后是否生成 source map 文件
      // sourcemap: mode != 'production',
      sourcemap: false,
      chunkSizeWarningLimit: 2000,
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            if (id.includes('html2canvas')) {
              return 'html2canvas'
            }
            if (id.includes('node_modules')) {
              return 'modules'
            }
          },
          assetFileNames: (assinfo) => {
            if (assinfo.name.includes('css')) {
              return 'css/[name]-[hash][extname]'
            }
            //  图片资源后缀集合
            const imgExt = ['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp', 'ico', 'avif', 'tiff', 'bmp']
            //  图片资源
            if (imgExt.includes(assinfo.name.split('.')[1])) {
              return 'images/[name]-[hash][extname]'
            }
            return 'js/[name]-[hash][extname]'
          },
          // chunkFileNames: 'js/[name]-[hash].js',
          // entryFileNames: 'js/[name]-[hash].js',
          // assetFileNames: "[ext]/[name]-[hash].[ext]"
        },
      },
      cssCodeSplit: true,
    },
  })
}
