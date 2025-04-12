import { v4 as uuidv4 } from 'uuid';

import type { SilkPrintPreset } from '../types/SilkPrintTypes';

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

	// 导出为PNG并下载
	const dataUrl = canvas.toDataURL('image/png');
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
					false,
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
	// 下载图片预览看看
	const link = document.createElement('a');
	link.download = `${preset.name || 'label'}-${preset.id}.png`;
	link.href = dataUrl;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
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
