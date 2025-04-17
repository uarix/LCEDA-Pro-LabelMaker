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
	const ThumbnailSvg = () => (
		<svg width="120" height="40" xmlns="http://www.w3.org/2000/svg" className="border rounded">
			<text
				x="50%"
				y="50%"
				textAnchor="middle"
				dominantBaseline="middle"
				fontFamily={preset.text.fontFamily}
				fontSize={Math.max(12, preset.text.fontSize * 0.5)} // 缩略图字体缩小
				fill="none"
				stroke="black"
				strokeWidth="0.5"
			>
				{preset.leftStructure} {preset.text.content} {preset.rightStructure}
			</text>
		</svg>
	);

	const FullSvg = () => (
		<svg width="100%" height="100" xmlns="http://www.w3.org/2000/svg" className="border rounded">
			<text
				x="50%"
				y="50%"
				textAnchor="middle"
				dominantBaseline="middle"
				fontFamily={preset.text.fontFamily}
				fontSize={preset.text.fontSize} // 使用原始字体大小
				fill="none"
				stroke="black"
				strokeWidth="1"
			>
				{preset.leftStructure} {preset.text.content} {preset.rightStructure}
			</text>
		</svg>
	);

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
				<div className="flex items-center justify-between">
					<div className="flex-grow">
						<h3 className="font-bold text-gray-800">{preset.name}</h3>
						<p className="text-sm text-gray-600 mt-1">{eda.sys_I18n.text('Preview')}</p>
					</div>
					<div className="relative mr-8">
						<div className="bg-gray-50 p-2 rounded-lg border border-gray-100">
							<ThumbnailSvg />
						</div>
						{/* 悬停时显示完整图片 */}
						<div className="absolute top-0 right-0 w-64 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
							<div className="bg-gray-50 p-2 rounded-lg border border-gray-100 shadow-lg">
								<FullSvg />
							</div>
						</div>
					</div>
				</div>
				<button onClick={onPlace} className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition">
					{eda.sys_I18n.text('Place')}
				</button>
			</div>
		);
	}

	return (
		<div className="bg-white border rounded-xl p-4 flex items-center justify-between hover:shadow-lg transition group">
			<div className="flex-grow flex items-center">
				<div>
					<h3 className="font-bold text-gray-800">{preset.name}</h3>
					<p className="text-sm text-gray-600 mt-1">{eda.sys_I18n.text('Preview')}</p>
				</div>
			</div>
			<div className="flex items-center space-x-4">
				<div className="relative mr-6">
					<div className="bg-gray-50 p-2 rounded-lg border border-gray-100">
						<ThumbnailSvg />
					</div>
					{/* 悬停时显示完整图片 */}
					<div className="absolute top-0 right-0 w-64 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
						<div className="bg-gray-50 p-2 rounded-lg border border-gray-100 shadow-lg">
							<FullSvg />
						</div>
					</div>
				</div>
				<div className="flex space-x-2">
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
		</div>
	);
};

export default PresetItem;

/* 无放大功能
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
  const PreviewSvg = () => (
    <svg width="120" height="40" xmlns="http://www.w3.org/2000/svg" className="border rounded">
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily={preset.text.fontFamily}
        fontSize={Math.max(12, preset.text.fontSize * 0.5)} // 缩小字体
        fill="none"
        stroke="black"
        strokeWidth="0.5"
      >
        {preset.leftStructure} {preset.text.content} {preset.rightStructure}
      </text>
    </svg>
  );

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
        <div className="flex items-center justify-between">
          <div className="flex-grow">
            <h3 className="font-bold text-gray-800">{preset.name}</h3>
            <p className="text-sm text-gray-600 mt-1">{eda.sys_I18n.text('Preview')}</p>
          </div>
          <div className="bg-gray-50 p-2 rounded-lg border border-gray-100 mr-8">
            <PreviewSvg />
          </div>
        </div>
        <button onClick={onPlace} className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition">
          {eda.sys_I18n.text('Place')}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border rounded-xl p-4 flex items-center justify-between hover:shadow-lg transition">
      <div className="flex-grow flex items-center">
        <div>
          <h3 className="font-bold text-gray-800">{preset.name}</h3>
          <p className="text-sm text-gray-600 mt-1">{eda.sys_I18n.text('Preview')}</p>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <div className="bg-gray-50 p-2 rounded-lg border border-gray-100 mr-6">
          <PreviewSvg />
        </div>
        <div className="flex space-x-2">
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
    </div>
  );
};

export default PresetItem;
*/
