import { create } from 'fontkit';
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
	// Todo 利用canvas绘制丝印转SVG

	if (!preset.text.content) {
		eda.sys_Message.showToastMessage('丝印内容不能为空', undefined, 2);
		return;
	}
	if (!('queryLocalFonts' in window)) {
		eda.sys_Message.showToastMessage('浏览器不支持字体查询', undefined, 2);
		return;
	}
	try {
		const availableFonts = await (window as Window).queryLocalFonts({
			postscriptNames: ['.PingFangHK-Light'],
		});
		// 查找特定字体 实验失败
		const targetFont = availableFonts[0];
		const fontData = await targetFont.blob();
		alert('fontData: ');
		console.log(targetFont);
		const buffer1 = await fontData.arrayBuffer();
		const buffer = Buffer.from(buffer1);
		const font = create(buffer);
		const glyph = font.getFont('X')?.getGlyph(0);
		console.log(glyph);
		return; // await response.json();
	} catch (error) {
		eda.sys_Message.showToastMessage('放置丝印失败', undefined, 2);
		throw error;
	}
};

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
