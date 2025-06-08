import { v4 as uuidv4 } from 'uuid';

import type { SilkPrintPreset } from '../types/SilkPrintTypes';

// 立创EDA SDK BUG, ReferenceError: EPCB_LayerId is not defined
enum EPCB_LayerId {
	/** 顶层 */
	TOP = 1,
	/** 顶层丝印层 */
	TOP_SILKSCREEN = 3,
	/** 顶层阻焊层 */
	TOP_SOLDER_MASK = 5,
	/** 顶层锡膏（助焊）层 */
	TOP_PASTE_MASK = 7,
	/** 顶层装配层 */
	TOP_ASSEMBLY = 9,
	/** 顶层 FPC 补强层 */
	TOP_STIFFENER = 58,
	/** 底层 */
	BOTTOM = 2,
	/** 底层丝印层 */
	BOTTOM_SILKSCREEN = 4,
	/** 底层阻焊层 */
	BOTTOM_SOLDER_MASK = 6,
	/** 底层锡膏（助焊）层 */
	BOTTOM_PASTE_MASK = 8,
	/** 底层装配层 */
	BOTTOM_ASSEMBLY = 10,
	/** 底层 FPC 补强层 */
	BOTTOM_STIFFENER = 59,
	/** 板框层 */
	BOARD_OUTLINE = 11,
	/** 多层 */
	MULTI = 12,
	/** 文档层 */
	DOCUMENT = 13,
	/** 机械层 */
	MECHANICAL = 14,
	/** 飞线层 */
	RATLINE = 57,
	/** 内层 1 */
	INNER_1 = 15,
	/** 内层 2 */
	INNER_2 = 16,
	/** 内层 3 */
	INNER_3 = 17,
	/** 内层 4 */
	INNER_4 = 18,
	/** 内层 5 */
	INNER_5 = 19,
	/** 内层 6 */
	INNER_6 = 20,
	/** 内层 7 */
	INNER_7 = 21,
	/** 内层 8 */
	INNER_8 = 22,
	/** 内层 9 */
	INNER_9 = 23,
	/** 内层 10 */
	INNER_10 = 24,
	/** 内层 11 */
	INNER_11 = 25,
	/** 内层 12 */
	INNER_12 = 26,
	/** 内层 13 */
	INNER_13 = 27,
	/** 内层 14 */
	INNER_14 = 28,
	/** 内层 15 */
	INNER_15 = 29,
	/** 内层 16 */
	INNER_16 = 30,
	/** 内层 17 */
	INNER_17 = 31,
	/** 内层 18 */
	INNER_18 = 32,
	/** 内层 19 */
	INNER_19 = 33,
	/** 内层 20 */
	INNER_20 = 34,
	/** 内层 21 */
	INNER_21 = 35,
	/** 内层 22 */
	INNER_22 = 36,
	/** 内层 23 */
	INNER_23 = 37,
	/** 内层 24 */
	INNER_24 = 38,
	/** 内层 25 */
	INNER_25 = 39,
	/** 内层 26 */
	INNER_26 = 40,
	/** 内层 27 */
	INNER_27 = 41,
	/** 内层 28 */
	INNER_28 = 42,
	/** 内层 29 */
	INNER_29 = 43,
	/** 内层 30 */
	INNER_30 = 44,
	/** 内层 31 */
	INNER_31 = 45,
	/** 内层 32 */
	INNER_32 = 46,
	/** 自定义层 1 */
	CUSTOM_1 = 71,
	/** 自定义层 2 */
	CUSTOM_2 = 72,
	/** 自定义层 3 */
	CUSTOM_3 = 73,
	/** 自定义层 4 */
	CUSTOM_4 = 74,
	/** 自定义层 5 */
	CUSTOM_5 = 75,
	/** 自定义层 6 */
	CUSTOM_6 = 76,
	/** 自定义层 7 */
	CUSTOM_7 = 77,
	/** 自定义层 8 */
	CUSTOM_8 = 78,
	/** 自定义层 9 */
	CUSTOM_9 = 79,
	/** 自定义层 10 */
	CUSTOM_10 = 80,
	/** 自定义层 11 */
	CUSTOM_11 = 81,
	/** 自定义层 12 */
	CUSTOM_12 = 82,
	/** 自定义层 13 */
	CUSTOM_13 = 83,
	/** 自定义层 14 */
	CUSTOM_14 = 84,
	/** 自定义层 15 */
	CUSTOM_15 = 85,
	/** 自定义层 16 */
	CUSTOM_16 = 86,
	/** 自定义层 17 */
	CUSTOM_17 = 87,
	/** 自定义层 18 */
	CUSTOM_18 = 88,
	/** 自定义层 19 */
	CUSTOM_19 = 89,
	/** 自定义层 20 */
	CUSTOM_20 = 90,
	/** 自定义层 21 */
	CUSTOM_21 = 91,
	/** 自定义层 22 */
	CUSTOM_22 = 92,
	/** 自定义层 23 */
	CUSTOM_23 = 93,
	/** 自定义层 24 */
	CUSTOM_24 = 94,
	/** 自定义层 25 */
	CUSTOM_25 = 95,
	/** 自定义层 26 */
	CUSTOM_26 = 96,
	/** 自定义层 27 */
	CUSTOM_27 = 97,
	/** 自定义层 28 */
	CUSTOM_28 = 98,
	/** 自定义层 29 */
	CUSTOM_29 = 99,
	/** ���定义层 30 */
	CUSTOM_30 = 100,
	/** 夹层（介电基板）1 */
	SUBSTRATE_1 = 101,
	/** 孔层（焊盘、过孔的内孔） */
	HOLE = 47,
	/** 元件外形层 */
	COMPONENT_SHAPE = 48,
	/** 元件标识层 */
	COMPONENT_MARKING = 49,
	/** 引脚焊接层 */
	PIN_SOLDERING = 50,
	/** 引脚悬空层 */
	PIN_FLOATING = 51,
	/** 元件模型层 */
	COMPONENT_MODEL = 52,
	/** 3D 外壳边框层 */
	SHELL_3D_OUTLINE = 53,
	/** 3D 外壳顶层 */
	SHELL_3D_TOP = 54,
	/** 3D 外壳底层 */
	SHELL_3D_BOTTOM = 55,
	/** 钻孔图层 */
	DRILL_DRAWING = 56,
}

export const placeSilkPrint = async (preset: SilkPrintPreset) => {
	// 高分辨率画布
	const canvas = document.createElement('canvas');
	const ctx = canvas.getContext('2d');
	if (!ctx) {
		console.error(eda.sys_I18n.text('Failed to Place'));
		return;
	}

	// 设置高分辨率
	const scale = 4;

	// 默认内边距
	const paddingTop = 15;
	const paddingLeft = 20;

	// 配置字体并测量文本
	ctx.font = `${preset.text.fontSize}px ${preset.text.fontFamily}`;
	const textMetrics = ctx.measureText(preset.text.content);
	const textWidth = textMetrics.width;
	const textHeight = preset.text.fontSize;

	// 计算标签尺寸
	const sideWidth = Math.max(textHeight * 0.8, 20) * 0.85; // 侧边结构的宽度
	const labelWidth = textWidth + paddingLeft * 2 + sideWidth * 2;
	const labelHeight = textHeight + paddingTop * 2;

	// 设置画布尺寸
	canvas.width = labelWidth * scale;
	canvas.height = labelHeight * scale;
	ctx.scale(scale, scale);

	// 绘制白色背景
	ctx.fillStyle = 'white';
	ctx.fillRect(0, 0, labelWidth, labelHeight);

	// 绘制标签形状
	ctx.fillStyle = 'black';
	ctx.beginPath();

	// 绘制左边结构
	switch (preset.leftStructure) {
		case '<':
			ctx.moveTo(sideWidth, 0);
			ctx.lineTo(0, labelHeight / 2);
			ctx.lineTo(sideWidth, labelHeight);
			break;
		case '>':
			ctx.moveTo(0, 0);
			ctx.lineTo(sideWidth, labelHeight / 2);
			ctx.lineTo(0, labelHeight);
			break;
		case '/':
			ctx.moveTo(sideWidth, 0);
			ctx.lineTo(0, labelHeight);
			break;
		case '\\':
			ctx.moveTo(0, 0);
			ctx.lineTo(sideWidth, labelHeight);
			break;
		case '|':
			ctx.moveTo(0, 0);
			ctx.lineTo(0, labelHeight);
			break;
		case '(':
			ctx.moveTo(sideWidth, 0);
			ctx.arcTo(0, 0, 0, labelHeight / 2, labelHeight / 2);
			ctx.arcTo(0, labelHeight, sideWidth, labelHeight, labelHeight / 2);
			break;
		case ')':
			ctx.moveTo(0, 0);
			ctx.arcTo(sideWidth, 0, sideWidth, labelHeight / 2, labelHeight / 2);
			ctx.arcTo(sideWidth, labelHeight, 0, labelHeight, labelHeight / 2);
			break;
		default:
			ctx.moveTo(0, 0);
			ctx.lineTo(0, labelHeight);
			break;
	}

	// 底部线
	ctx.lineTo(labelWidth - sideWidth, labelHeight);

	// 绘制右边结构
	switch (preset.rightStructure) {
		case '>':
			ctx.lineTo(labelWidth, labelHeight / 2);
			ctx.lineTo(labelWidth - sideWidth, 0);
			break;
		case '<':
			ctx.lineTo(labelWidth, labelHeight);
			ctx.lineTo(labelWidth - sideWidth, labelHeight / 2);
			ctx.lineTo(labelWidth, 0);
			break;
		case '\\':
			ctx.lineTo(labelWidth, 0);
			break;
		case '/':
			ctx.lineTo(labelWidth - sideWidth, 0);
			break;
		case '|':
			ctx.lineTo(labelWidth, labelHeight);
			ctx.lineTo(labelWidth, 0);
			break;
		case ')':
			ctx.arcTo(labelWidth, labelHeight, labelWidth, labelHeight / 2, labelHeight / 2);
			ctx.arcTo(labelWidth, 0, labelWidth - sideWidth, 0, labelHeight / 2);
			break;
		case '(':
			ctx.arcTo(labelWidth - sideWidth, labelHeight, labelWidth - sideWidth, labelHeight / 2, labelHeight / 2);
			ctx.arcTo(labelWidth - sideWidth, 0, labelWidth, 0, labelHeight / 2);
			break;
		default:
			ctx.lineTo(labelWidth, labelHeight);
			ctx.lineTo(labelWidth, 0);
			break;
	}

	// 顶部线
	ctx.lineTo(sideWidth, 0);

	ctx.closePath();
	ctx.fill();

	// 计算文本位置
	let textX;
	switch (preset.text.alignment) {
		case 'left':
			textX = sideWidth + paddingLeft;
			break;
		case 'center':
			textX = (labelWidth - textWidth) / 2;
			break;
		case 'right':
			textX = labelWidth - sideWidth - paddingLeft - textWidth;
			break;
		default:
			textX = sideWidth + paddingLeft;
			console.log('preset.text.alignment', preset.text.alignment);
			console.error(eda.sys_I18n.text('Failed to Place'));
	}

	// 绘制白色文字
	ctx.fillStyle = 'white';
	ctx.font = `${preset.text.fontSize}px ${preset.text.fontFamily}`;
	ctx.textBaseline = 'middle';
	ctx.fillText(preset.text.content, textX, labelHeight / 2);

	canvas.toBlob(
		async (blob) => {
			if (blob) {
				const imageBlob = blob;
				const polygon_img = await eda.pcb_MathPolygon.convertImageToComplexPolygon(
					imageBlob,
					canvas.width,
					canvas.height,
					0.5,
					0.7,
					0.7,
					0.2,
					true,
				);
				if (!polygon_img) {
					console.error(eda.sys_I18n.text('Failed to Place'));
					return;
				}
				eda.pcb_PrimitiveImage.create(0, 0, polygon_img, EPCB_LayerId.TOP_SILKSCREEN);
			} else {
				console.error(eda.sys_I18n.text('Failed to Place'));
			}
		},
		'image/png',
		1.0,
	);
};

export const getAllAvailableFonts = async (): Promise<string[]> => {
	const fonts: string[] = [];

	if ('queryLocalFonts' in window) {
		try {
			const systemFonts = await window.queryLocalFonts({
				postscriptNames: [],
			});
			fonts.push(...systemFonts.map((font) => font.fullName));
		} catch (err) {
			console.warn('Failed to get system fonts:', err);
		}
	}
	return [...new Set(fonts)];
};

export const getFontData = async (fontFamily: string): Promise<ArrayBuffer | null> => {
	try {
		if ('queryLocalFonts' in window) {
			const availableFonts = await window.queryLocalFonts({
				postscriptNames: [fontFamily],
			});

			if (availableFonts.length > 0) {
				const fontBlob = await availableFonts[0].blob();
				return await fontBlob.arrayBuffer();
			}
		}
		console.warn('getFontData method is not implemented in eda.sys_FontManager');
		return null;
	} catch (err) {
		console.warn('Failed to get font data:', err);
		return null;
	}
};

export const savePreset = (preset: SilkPrintPreset) => {
	const presets = JSON.parse(localStorage.getItem('Plugin_LabelMaker_SilkPrintPresets') || '[]');
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
