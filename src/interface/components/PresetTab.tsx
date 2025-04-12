import { LayoutGrid, List } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import type { SilkPrintPreset } from '../types/SilkPrintTypes';
import { deletePreset, getPresets, placeSilkPrint } from '../utils/apiService';
import PresetItem from './PresetItem';

// 立创eda的bug，iframe内无法使用系统的ESYS_ToastMessageType，所以手动重新定义一个
enum ESYS_ToastMessageType {
	ASK = 'question',
	ERROR = 'error',
	INFO = 'info',
	SUCCESS = 'success',
	WARNING = 'warn',
}

const PresetTab: React.FC<{ onEditPreset: (preset: SilkPrintPreset) => void }> = ({ onEditPreset }) => {
	const [presets, setPresets] = useState<SilkPrintPreset[]>([]);
	const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
	const [searchTerm, setSearchTerm] = useState('');

	useEffect(() => {
		setPresets(getPresets());
	}, []);

	const handleDelete = (id: string) => {
		deletePreset(id);
		setPresets(getPresets());
	};

	const handlePlace = async (preset: SilkPrintPreset) => {
		try {
			await placeSilkPrint(preset);
			eda.sys_Message.showToastMessage(eda.sys_I18n.text('Silkscreen Placed Successfully'), ESYS_ToastMessageType.INFO, 2);
		} catch (error) {
			eda.sys_Message.showToastMessage(eda.sys_I18n.text('Failed to Place'), ESYS_ToastMessageType.ERROR, 2);
		}
	};

	const filteredPresets = presets.filter((preset) => preset.name.toLowerCase().includes(searchTerm.toLowerCase()));

	return (
		<div className="p-6 space-y-6">
			<div className="flex justify-between items-center">
				<div className="flex space-x-4 items-center w-full">
					<div className="relative flex-1">
						<input
							type="text"
							placeholder={eda.sys_I18n.text('Search Presets')}
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="pl-8 pr-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-5 w-5 absolute left-2 top-3 text-gray-400"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
						</svg>
					</div>
					<div className="flex space-x-2 bg-gray-100 rounded-lg p-1">
						<button
							onClick={() => setViewMode('grid')}
							className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
						>
							<LayoutGrid className="w-5 h-5" />
						</button>
						<button
							onClick={() => setViewMode('list')}
							className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
						>
							<List className="w-5 h-5" />
						</button>
					</div>
				</div>
			</div>

			{filteredPresets.length === 0 ? (
				<div className="text-center text-gray-500 py-10">
					<p>{eda.sys_I18n.text('No Presets')}</p>
				</div>
			) : (
				<div
					className={`  
          ${viewMode === 'grid' ? 'grid md:grid-cols-3 sm:grid-cols-2 gap-4' : 'space-y-4'}`}
				>
					{filteredPresets.map((preset) => (
						<PresetItem
							key={preset.id}
							preset={preset}
							viewMode={viewMode}
							onDelete={() => handleDelete(preset.id)}
							onEdit={() => onEditPreset(preset)}
							onPlace={() => handlePlace(preset)}
						/>
					))}
				</div>
			)}
		</div>
	);
};

export default PresetTab;
