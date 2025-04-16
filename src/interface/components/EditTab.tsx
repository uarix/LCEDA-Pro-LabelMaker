import { AlignCenter, AlignLeft, AlignRight, HelpCircle, Layers, Navigation, Save, Type } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import type { SilkPrintPreset } from '../types/SilkPrintTypes';
import { placeSilkPrint, savePreset, updatePreset } from '../utils/apiService';

// 立创eda的bug，iframe内无法使用系统的ESYS_ToastMessageType，所以手动重新定义一个
enum ESYS_ToastMessageType {
	ASK = 'question',
	ERROR = 'error',
	INFO = 'info',
	SUCCESS = 'success',
	WARNING = 'warn',
}

// 结构选项
const STRUCTURE_OPTIONS = [
	{ value: '<', label: '<' },
	{ value: '>', label: '>' },
	{ value: '/', label: '/' },
	{ value: '\\', label: '\\' },
	{ value: '|', label: '|' },
	{ value: '(', label: '(' },
	{ value: ')', label: ')' },
];

// 修改 FontData 接口定义
interface FontData {
	family: string;
	fullName: string;
	postscriptName: string;
	style: string;
	blob: () => Promise<Blob>;
}

// 修改 Window 接口定义
declare global {
	interface Window {
		queryLocalFonts: (options?: { postscriptNames?: string[] }) => Promise<FontData[]>;
	}
}

const EditTab: React.FC<{ initialPreset?: SilkPrintPreset | null }> = ({ initialPreset }) => {
	const [fontOptions, setFontOptions] = useState<string[]>(['Arial']);
	const [localFonts, setLocalFonts] = useState<FontData[]>([]);
	const [preset, setPreset] = useState<SilkPrintPreset>({
		id: initialPreset?.id || '',
		name: initialPreset?.name || '',
		leftStructure: initialPreset?.leftStructure || '<',
		rightStructure: initialPreset?.rightStructure || '>',
		text: initialPreset?.text || {
			content: '',
			fontSize: 16,
			fontFamily: 'Arial',
			alignment: 'center',
		},
	});

	useEffect(() => {
		if (initialPreset) {
			setPreset(initialPreset);
		}
	}, [initialPreset]);

	useEffect(() => {
		const fetchFonts = async () => {
			try {
				// First try to get fonts from EDA
				const edaFonts = await eda.sys_FontManager.getFontsList();

				// Then try to get local fonts if supported
				let systemFonts: FontData[] = [];
				if (window.queryLocalFonts) {
					try {
						systemFonts = await window.queryLocalFonts();
					} catch (err) {
						console.warn('Failed to query local fonts:', err);
					}
				}

				// Combine and deduplicate fonts
				const allFonts = [...new Set([...edaFonts, ...systemFonts.map((f) => f.fullName)])];
				setFontOptions(allFonts);
				setLocalFonts(systemFonts);
			} catch (err) {
				console.error('Failed to fetch fonts:', err);
			}
		};

		fetchFonts();
	}, []);

	const handlePlace = async () => {
		try {
			await placeSilkPrint(preset);
			eda.sys_Message.showToastMessage(eda.sys_I18n.text('Silkscreen Placed Successfully'), ESYS_ToastMessageType.INFO, 2);
		} catch (error) {
			eda.sys_Message.showToastMessage(eda.sys_I18n.text('Failed to Place'), ESYS_ToastMessageType.ERROR, 2);
		}
	};

	const handleSave = () => {
		const silkscreenText = preset.text.content.trim();
		if (!silkscreenText) {
			eda.sys_Message.showToastMessage(eda.sys_I18n.text('Silkscreen Text Cannot Be Empty'), ESYS_ToastMessageType.ERROR, 2);
			return;
		}

		if (!preset.id) {
			// Automatically set the preset name to the silkscreen text
			const updatedPreset = { ...preset, name: silkscreenText, text: { ...preset.text, content: silkscreenText } };
			savePreset(updatedPreset);
			eda.sys_Message.showToastMessage(eda.sys_I18n.text('Preset Saved', undefined, undefined, silkscreenText), ESYS_ToastMessageType.SUCCESS, 2);
		} else {
			eda.sys_MessageBox.showConfirmationMessage(
				eda.sys_I18n.text('Save as New Preset'),
				eda.sys_I18n.text('Save Preset'),
				eda.sys_I18n.text('Yes'),
				eda.sys_I18n.text('No, Overwrite Existing'),
				async (YesButtonClicked) => {
					if (YesButtonClicked) {
						preset.id = '';
						// Automatically set the preset name to the silkscreen text
						const updatedPreset = { ...preset, name: silkscreenText, text: { ...preset.text, content: silkscreenText } };
						savePreset(updatedPreset);
						eda.sys_Message.showToastMessage(
							eda.sys_I18n.text('Preset Saved', undefined, undefined, updatedPreset.name),
							ESYS_ToastMessageType.SUCCESS,
							2,
						);
					} else {
						// Update the silkscreen text to the preset name before updating
						const updatedPreset = { ...preset, text: { ...preset.text, content: preset.name } };
						updatePreset(updatedPreset);
						eda.sys_Message.showToastMessage(
							eda.sys_I18n.text('Preset Updated', undefined, undefined, updatedPreset.name),
							ESYS_ToastMessageType.INFO,
							2,
						);
					}
				},
			);
		}
	};

	return (
		<div className="p-6 space-y-6">
			<div className="flex items-center space-x-4">
				{/* 左侧结构 */}
				<div className="flex-1">
					<label className="block mb-2 text-sm text-gray-600 flex items-center">
						<Layers className="mr-2 w-4 h-4 text-blue-500" />
						{eda.sys_I18n.text('Left Structure')}
					</label>
					<select
						value={preset.leftStructure}
						onChange={(e) => setPreset({ ...preset, leftStructure: e.target.value })}
						className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-200 transition"
					>
						{STRUCTURE_OPTIONS.map((option) => (
							<option key={option.value} value={option.value}>
								{option.label}
							</option>
						))}
					</select>
				</div>

				{/* 文本编辑 */}
				<div className="flex-2">
					<label className="block mb-2 text-sm text-gray-600 flex items-center">
						<Type className="mr-2 w-4 h-4 text-blue-500" />
						{eda.sys_I18n.text('Silkscreen Text')}
					</label>
					<input
						value={preset.text.content}
						onChange={(e) =>
							setPreset({
								...preset,
								text: { ...preset.text, content: e.target.value },
							})
						}
						placeholder={eda.sys_I18n.text('Silkscreen Text')}
						className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-200 transition"
					/>
				</div>

				{/* 右侧结构 */}
				<div className="flex-1">
					<label className="block mb-2 text-sm text-gray-600 flex items-center">
						<Layers className="mr-2 w-4 h-4 text-blue-500" />
						{eda.sys_I18n.text('Right Structure')}
					</label>
					<select
						value={preset.rightStructure}
						onChange={(e) => setPreset({ ...preset, rightStructure: e.target.value })}
						className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-200 transition"
					>
						{STRUCTURE_OPTIONS.map((option) => (
							<option key={option.value} value={option.value}>
								{option.label}
							</option>
						))}
					</select>
				</div>
			</div>

			{/* 文本样式设置 */}
			<div className="bg-gray-50 p-4 rounded-lg border border-gray-100 space-y-4">
				<div className="grid grid-cols-3 gap-4">
					{/* 字体选择 */}
					<div>
						<label className="block mb-2 text-sm text-gray-600 flex items-center">
							{eda.sys_I18n.text('Font')}
							<HelpCircle
								className="ml-2 w-4 h-4 text-gray-400 cursor-pointer hover:text-blue-500"
								data-tooltip={eda.sys_I18n.text('Font List Notice')}
								onClick={(e) => {
									const tooltip = e.currentTarget.getAttribute('data-tooltip') || '';
									eda.sys_Message.showToastMessage(tooltip, ESYS_ToastMessageType.INFO, 3);
								}}
							/>
						</label>
						<select
							value={preset.text.fontFamily}
							onChange={(e) =>
								setPreset({
									...preset,
									text: { ...preset.text, fontFamily: e.target.value },
								})
							}
							className="w-full p-2 border rounded-lg"
						>
							{fontOptions.map((font) => (
								<option key={font} value={font}>
									{font}
								</option>
							))}
						</select>
					</div>

					{/* 字体大小 */}
					<div>
						<label className="block mb-2 text-sm text-gray-600">{eda.sys_I18n.text('Size')}</label>
						<input
							type="range"
							min="12"
							max="48"
							value={preset.text.fontSize}
							onChange={(e) =>
								setPreset({
									...preset,
									text: { ...preset.text, fontSize: Number(e.target.value) },
								})
							}
							className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
						/>
						<div className="text-center text-sm text-gray-500 mt-1">{preset.text.fontSize} px</div>
					</div>

					{/* 对齐方式 */}
					<div>
						<label className="block mb-2 text-sm text-gray-600">{eda.sys_I18n.text('Alignment')}</label>
						<div className="flex justify-between">
							{['left', 'center', 'right'].map((align) => (
								<button
									key={align}
									onClick={() =>
										setPreset({
											...preset,
											text: { ...preset.text, alignment: align as 'left' | 'center' | 'right' },
										})
									}
									className={`  
                    p-2 rounded-lg transition  
                    ${preset.text.alignment === align ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}  
                  `}
									title={align}
								>
									{align === 'left' && <AlignLeft className="w-5 h-5" />}
									{align === 'center' && <AlignCenter className="w-5 h-5" />}
									{align === 'right' && <AlignRight className="w-5 h-5" />}
								</button>
							))}
						</div>
					</div>
				</div>
			</div>

			{/* 操作按钮 */}
			<div className="flex justify-end space-x-4">
				<button
					onClick={handlePlace}
					className="flex items-center bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
				>
					<Navigation className="mr-2 w-5 h-5" />
					{eda.sys_I18n.text('Place Silkscreen')}
				</button>
				<button onClick={handleSave} className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">
					<Save className="mr-2 w-5 h-5" />
					{eda.sys_I18n.text('Save Preset')}
				</button>
			</div>
			{preset.text.content && (
				<div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
					<div className="text-sm text-gray-600 mb-2">{eda.sys_I18n.text('Preview')}</div>
					<svg width="100%" height="100" xmlns="http://www.w3.org/2000/svg" className="border rounded">
						<text
							x="50%"
							y="50%"
							textAnchor="middle"
							dominantBaseline="middle"
							fontFamily={preset.text.fontFamily}
							fontSize={preset.text.fontSize}
							fill="none"
							stroke="black"
							strokeWidth="1"
						>
							{preset.leftStructure} {preset.text.content} {preset.rightStructure}
						</text>
					</svg>
				</div>
			)}
		</div>
	);
};

export default EditTab;
