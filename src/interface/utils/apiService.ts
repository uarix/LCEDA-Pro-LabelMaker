import { v4 as uuidv4 } from 'uuid';

import type { SilkPrintPreset } from '../types/SilkPrintTypes';

interface FontData {
	family: string;
	fullName: string;
	postscriptName: string;
	style: string;
	blob: () => Promise<Blob>;
}
interface Window {
	queryLocalFonts: (options: { postscriptNames: string[] }) => Promise<FontData[]>;
}
export const placeSilkPrint = async (preset: SilkPrintPreset) => {
	if (!preset.text.content) {
		eda.sys_Message.showToastMessage('丝印内容不能为空', undefined, 2);
		return;
	}
	if (!('queryLocalFonts' in window)) {
		eda.sys_Message.showToastMessage('浏览器不支持字体查询', undefined, 2);
		return;
	}
	try {
		// 可以用 canvas 绘制文字，然后转换为 svg ，再放到 PCB 上
		const availableFonts = await (window as Window).queryLocalFonts({
			postscriptNames: ['.PingFangHK-Light'],
		});
		if (!availableFonts.length) {
			eda.sys_Message.showToastMessage('找不到指定字体', undefined, 2);
			return;
		}

		const targetFont = availableFonts[0];
		// const fontData = await targetFont.blob();
		// const buffer = await fontData.arrayBuffer();

		const canvas = document.createElement('canvas');
		const ctx = canvas.getContext('2d');
		if (!ctx) {
			eda.sys_Message.showToastMessage('无法创建Canvas上下文', undefined, 2);
			return;
		}

		canvas.width = 300;
		canvas.height = 100;

		ctx.clearRect(0, 0, canvas.width, canvas.height);

		const fontSize = preset.text.fontSize || 20;
		ctx.font = `${fontSize}px "${targetFont.fullName}"`;
		ctx.fillStyle = '#FFFFFF';
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';

		const x = canvas.width / 2;
		const y = canvas.height / 2;
		ctx.fillText(preset.text.content, x, y);

		const svg = canvasToSVG(canvas, preset);

		console.log(svg);

		// TODO return svg;
	} catch (error) {
		console.error('放置丝印失败:', error);
		eda.sys_Message.showToastMessage('放置丝印失败', undefined, 2);
		throw error;
	}
};

function canvasToSVG(canvas: HTMLCanvasElement): string {
	const width = canvas.width;
	const height = canvas.height;
	const ctx = canvas.getContext('2d');
	if (!ctx) return '';

	// Get the image data from canvas
	const imageData = ctx.getImageData(0, 0, width, height);
	const data = imageData.data;

	// Create SVG wrapper
	let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`;

	// For silk print, we typically want to create paths from the text
	// Let's create a simple path from the pixels
	const paths = [];
	const threshold = 200; // Threshold for considering a pixel as part of the text

	// Track visited pixels to avoid duplicates
	const visited = new Set<string>();

	// Simple path tracing algorithm
	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			const index = (y * width + x) * 4;
			const r = data[index];
			const g = data[index + 1];
			const b = data[index + 2];

			// If pixel is dark enough (part of the text)
			if (r < threshold && g < threshold && b < threshold && !visited.has(`${x},${y}`)) {
				const path = traceContour(imageData, x, y, threshold, visited);
				if (path) {
					paths.push(path);
				}
			}
		}
	}

	// Add paths to SVG
	for (const path of paths) {
		svg += `<path d="${path}" fill="#FFFFFF" />`;
	}

	svg += '</svg>';
	return svg;
}

// Helper function to trace contours of text
function traceContour(imageData: ImageData, startX: number, startY: number, threshold: number, visited: Set<string>): string | null {
	const width = imageData.width;
	const height = imageData.height;
	const data = imageData.data;

	const stack = [{ x: startX, y: startY }];
	const points = [];

	while (stack.length > 0) {
		const { x, y } = stack.pop()!;
		const key = `${x},${y}`;

		if (visited.has(key)) continue;

		const index = (y * width + x) * 4;
		const r = data[index];
		const g = data[index + 1];
		const b = data[index + 2];

		if (r >= threshold || g >= threshold || b >= threshold) continue;

		visited.add(key);
		points.push({ x, y });

		// Check neighboring pixels
		const directions = [
			{ x: x + 1, y },
			{ x: x - 1, y },
			{ x, y: y + 1 },
			{ x, y: y - 1 },
		];

		for (const dir of directions) {
			if (dir.x >= 0 && dir.x < width && dir.y >= 0 && dir.y < height) {
				stack.push(dir);
			}
		}
	}

	if (points.length < 3) return null;

	// Create SVG path from points
	let path = `M ${points[0].x} ${points[0].y}`;
	for (let i = 1; i < points.length; i++) {
		path += ` L ${points[i].x} ${points[i].y}`;
	}
	path += ' Z';

	return path;
}

export const savePreset = (preset: SilkPrintPreset) => {
	const presets = JSON.parse(localStorage.getItem('Plugin_LabelMaker_SilkPrintPresets') || '[]');
	// preset.id = Date.now().toString();
	preset.id = uuidv4();
	presets.push(preset);
	// eda.sys_Storage.setExtensionUserConfig('silkPrintPresets', JSON.stringify(presets));
	// 立创的api有问题，暂时使用localStorage
	localStorage.setItem('Plugin_LabelMaker_SilkPrintPresets', JSON.stringify(presets));
	return preset;
};

export const getPresets = (): SilkPrintPreset[] => {
	return JSON.parse(localStorage.getItem('Plugin_LabelMaker_SilkPrintPresets') || '[]');
};

export const deletePreset = (id: string) => {
	const presets = getPresets().filter((p) => p.id !== id);
	localStorage.setItem('Plugin_LabelMaker_SilkPrintPresets', JSON.stringify(presets));
};

export const updatePreset = (updatedPreset: SilkPrintPreset) => {
	const presets = getPresets().map((p) => (p.id === updatedPreset.id ? updatedPreset : p));
	localStorage.setItem('Plugin_LabelMaker_SilkPrintPresets', JSON.stringify(presets));
};
