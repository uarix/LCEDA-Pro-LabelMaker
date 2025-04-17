import { Edit3, Trash2 } from 'lucide-react';
import React from 'react';

import type { SilkPrintPreset } from '../types/SilkPrintTypes';

interface PresetItemProps {
	preset: SilkPrintPreset;
	viewMode: 'grid' | 'list';
	onDelete: () => void;
	onEdit: () => void;
	onPlace: () => void;
}

const PresetItem: React.FC<PresetItemProps> = ({ preset, viewMode, onDelete, onEdit, onPlace }) => {
	if (viewMode === 'grid') {
		return (
			<div className="bg-white border rounded-xl p-4 space-y-4 hover:shadow-lg transition group relative">
				<div className="flex items-center justify-between pb-2 border-b border-gray-100">
					<div className="flex-grow overflow-hidden">
						<h3 className="font-semibold text-gray-800 truncate">{preset.name}</h3>
						<p className="text-xs text-gray-500 mt-1 line-clamp-1">{preset.text.content}</p>
					</div>
					<div className="flex space-x-2 ml-2">
						<button onClick={onDelete} className="text-red-500 hover:bg-red-50 p-1 rounded-full">
							<Trash2 className="w-4 h-4" />
						</button>
						<button onClick={onEdit} className="text-blue-500 hover:bg-blue-50 p-1 rounded-full">
							<Edit3 className="w-4 h-4" />
						</button>
					</div>
				</div>
				<div className="bg-gray-50 rounded-lg border border-gray-100 flex flex-col overflow-hidden">
					<div className="text-xs font-medium text-gray-600 p-2 border-b border-gray-100 bg-gray-100">{eda.sys_I18n.text('Preview')}</div>
					<div className="flex-grow flex items-center justify-center p-3 relative">
						<svg
							width="100%"
							height="100%"
							viewBox="0 0 200 50"
							preserveAspectRatio="xMidYMid meet"
							xmlns="http://www.w3.org/2000/svg"
							className="rounded max-w-full max-h-full"
						>
							<rect width="100%" height="100%" fill="white" />
							<text
								x="50%"
								y="50%"
								textAnchor="middle"
								dominantBaseline="middle"
								alignmentBaseline="middle"
								fontFamily={preset.text.fontFamily}
								fontSize={`${Math.min(preset.text.fontSize, 14)}`}
								fill="none"
								stroke="black"
								strokeWidth="0.5"
							>
								{preset.leftStructure}
								{preset.text.content}
								{preset.rightStructure}
							</text>
						</svg>
					</div>
				</div>

				<button onClick={onPlace} className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition mt-1">
					{eda.sys_I18n.text('Place')}
				</button>
			</div>
		);
	}

	return (
		<div className="bg-white border rounded-xl p-4 flex items-center justify-between hover:shadow-lg transition">
			<div className="flex-grow">
				<h3 className="font-bold text-gray-800">{preset.name}</h3>
				<p className="text-sm text-gray-500 line-clamp-1">{preset.text.content}</p>
			</div>
			<div className="flex space-x-2 ml-4">
				<button onClick={onDelete} className="text-red-500 hover:bg-red-50 p-2 rounded-full">
					<Trash2 className="w-5 h-5" />
				</button>
				<button onClick={onEdit} className="text-blue-500 hover:bg-blue-50 p-2 rounded-full">
					<Edit3 className="w-5 h-5" />
				</button>
				<button onClick={onPlace} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">
					{eda.sys_I18n.text('Place')}
				</button>
			</div>
		</div>
	);
};

export default PresetItem;
