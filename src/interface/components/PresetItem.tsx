import { Edit3, LayoutGrid, Trash2 } from 'lucide-react';
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
			<div className="bg-white border rounded-xl p-4 space-y-3 hover:shadow-lg transition group relative">
				<div className="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition">
					<button onClick={onDelete} className="text-red-500 hover:bg-red-50 p-1 rounded-full">
						<Trash2 className="w-4 h-4" />
					</button>
					<button onClick={onEdit} className="text-blue-500 hover:bg-blue-50 p-1 rounded-full">
						<Edit3 className="w-4 h-4" />
					</button>
				</div>
				<div className="text-center">
					<h3 className="font-bold text-gray-800 mb-2">{preset.name}</h3>
					<p className="text-sm text-gray-500 line-clamp-2">{preset.text.content}</p>
				</div>
				<button onClick={onPlace} className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition">
					放置预设
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
					放置
				</button>
			</div>
		</div>
	);
};

export default PresetItem;
