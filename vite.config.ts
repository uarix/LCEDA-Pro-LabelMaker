import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
	base: '/iframe/',
	plugins: [react()],
	optimizeDeps: {
		include: ['opentype.js'],
	},
	build: {
		// 指定构建输出目录为 iframe
		outDir: 'iframe',
		// 构建时清空输出目录
		emptyOutDir: true,
		// 资源文件目录
		assetsDir: 'assets',
		// 生成 source map
		sourcemap: false,
		rollupOptions: {
			output: {
				// 指定输出文件名格式
				entryFileNames: 'assets/[name].[hash].js',
				chunkFileNames: 'assets/[name].[hash].js',
				assetFileNames: 'assets/[name].[hash].[ext]',
			},
		},
	},
	server: {
		port: 3000,
	},
	resolve: {
		alias: {
			'@extensionConfig': resolve(__dirname, './extension.json'),
			'@': resolve(__dirname, './src/interface'),
		},
	},
});
