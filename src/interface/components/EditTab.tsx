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

const EditTab: React.FC<{ initialPreset?: SilkPrintPreset | null }> = ({ initialPreset }) => {
	const [fontOptions, setFontOptions] = useState<string[]>(['Arial']);
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
				const fonts = await eda.sys_FontManager.getFontsList();
				setFontOptions(fonts.length > 0 ? fonts : ['Arial']); // 如果获取失败，使用默认值
			} catch (error) {
				console.error('获取字体列表失败:', error);
				eda.sys_Message.showToastMessage('获取字体列表失败', ESYS_ToastMessageType.ERROR, 2);
				setFontOptions(['Arial']);
			}
		};

		fetchFonts();
	}, []);

	const handlePlace = async () => {
		try {
			await placeSilkPrint(preset);
			eda.sys_Message.showToastMessage('丝印放置成功', ESYS_ToastMessageType.INFO, 2);
		} catch (error) {
			alert('放置失败');
		}
	};

	const handleSave = () => {
		if (!preset.id) {
			// 没有id，要求用户输入名称
			const name = prompt('请输入预设名称', preset.text.content || '未命名预设');
			if (name) {
				savePreset({ ...preset, name });
				eda.sys_Message.showToastMessage(`预设 ${preset.name} 已保存`, ESYS_ToastMessageType.SUCCESS, 2);
			} else {
				eda.sys_Message.showToastMessage('预设名称不能为空', ESYS_ToastMessageType.ERROR, 2);
			}
		} else {
			eda.sys_MessageBox.showConfirmationMessage('是否另存为新预设？', '保存预设', '是', '否，覆盖原预设', async (YesButtonClicked) => {
				if (YesButtonClicked) {
					preset.id = '';
					const name = prompt('请输入预设名称', preset.text.content || '未命名预设');
					if (name) {
						preset.name = name;
						savePreset(preset);
						eda.sys_Message.showToastMessage(`预设 ${preset.name} 已保存`, ESYS_ToastMessageType.SUCCESS, 2);
					} else {
						eda.sys_Message.showToastMessage('预设名称不能为空', ESYS_ToastMessageType.ERROR, 2);
					}
				} else {
					// 有id，更新预设
					updatePreset(preset);
					eda.sys_Message.showToastMessage(`预设 ${preset.name} 已更新`, ESYS_ToastMessageType.INFO, 2);
				}
			});
		}
	};

	return (
		<div className="p-6 space-y-6">
			<div className="flex items-center space-x-4">
				{/* 左侧结构 */}
				<div className="flex-1">
					<label className="block mb-2 text-sm text-gray-600 flex items-center">
						<Layers className="mr-2 w-4 h-4 text-blue-500" />
						左侧结构
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
						丝印文本
					</label>
					<input
						value={preset.text.content}
						onChange={(e) =>
							setPreset({
								...preset,
								text: { ...preset.text, content: e.target.value },
							})
						}
						placeholder="输入丝印文本"
						className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-200 transition"
					/>
				</div>

				{/* 右侧结构 */}
				<div className="flex-1">
					<label className="block mb-2 text-sm text-gray-600 flex items-center">
						<Layers className="mr-2 w-4 h-4 text-blue-500" />
						右侧结构
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
							字体
							<HelpCircle
								className="ml-2 w-4 h-4 text-gray-400 cursor-pointer hover:text-blue-500"
								data-tooltip="由于插件环境限制，请先在 嘉立创EDA 设置 → 常用字体 内添加目标字体"
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
						<label className="block mb-2 text-sm text-gray-600">大小</label>
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
						<label className="block mb-2 text-sm text-gray-600">对齐</label>
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
					放置丝印
				</button>
				<button onClick={handleSave} className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">
					<Save className="mr-2 w-5 h-5" />
					保存预设
				</button>
			</div>
			{preset.text.content && (
				<div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
					<div className="text-sm text-gray-600 mb-2">预览</div>
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

						{/* 
						<path
							d={`  
						M 10 20   
						L ${window.innerWidth * 0.9} 20   
						L ${window.innerWidth * 0.9} 80   
						L 10 80   
						Z  
						`}
							fill="none"
							stroke="gray"
							strokeDasharray="5,5"
						/>
						*/}
					</svg>
				</div>
			)}
		</div>
	);
};

export default EditTab;
