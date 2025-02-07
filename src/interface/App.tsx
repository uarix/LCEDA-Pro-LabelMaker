import { Edit, Heart, Layers, Save } from 'lucide-react';
import React, { useState } from 'react';

import EditTab from './components/EditTab';
import PresetTab from './components/PresetTab';
import type { SilkPrintPreset } from './types/SilkPrintTypes';

const App: React.FC = () => {
	const [activeTab, setActiveTab] = useState<'edit' | 'preset'>('edit');
	const [currentEditPreset, setCurrentEditPreset] = useState<SilkPrintPreset | null>(null);
	const handleEditPreset = (preset: SilkPrintPreset) => {
		setCurrentEditPreset(preset);
		setActiveTab('edit');
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 selection:bg-blue-100">
			<div className="max-w-4xl mx-auto space-y-6">
				{/* 标题区域 */}
				<header className="text-center">
					<div className="flex items-center justify-center mb-4">
						<Layers className="w-10 h-10 text-blue-500 mr-3" />
						<h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">Label Maker</h1>
					</div>
					<div className="h-1 w-24 bg-blue-500 mx-auto rounded-full mt-3 opacity-75"></div>
				</header>

				{/* 标签切换 */}
				<div className="flex justify-center space-x-4 mb-6">
					{[
						{
							key: 'edit',
							icon: Edit,
							label: '编辑丝印',
							description: '自定义您的标签设计',
						},
						{
							key: 'preset',
							icon: Save,
							label: '预设管理',
							description: '管理已保存的标签模板',
						},
					].map((tab) => (
						<button
							key={tab.key}
							onClick={() => setActiveTab(tab.key as 'edit' | 'preset')}
							className={`  
								group relative px-6 py-3 rounded-xl transition-all duration-300   
								flex items-center space-x-2  
								${activeTab === tab.key ? 'bg-blue-500 text-white shadow-lg' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:shadow-md'}  
						`}
						>
							<tab.icon className="w-5 h-5" />
							<div className="flex flex-col items-start">
								<span className="font-semibold">{tab.label}</span>
								<span
									className={`  
										text-xs 
                                		${activeTab === tab.key ? 'text-blue-100' : 'text-gray-400'}  
                            		`}
								>
									{tab.description}
								</span>
							</div>
						</button>
					))}
				</div>

				{/* 主内容区 */}
				<div
					className="  
						bg-white rounded-2xl shadow-xl overflow-hidden   
						border border-gray-100   
						transform transition-all   
						hover:shadow-2xl  
					"
				>
					{activeTab === 'edit' ? <EditTab initialPreset={currentEditPreset} /> : <PresetTab onEditPreset={handleEditPreset} />}
				</div>

				{/* 底部信息 */}
				<footer className="text-center text-gray-500 text-sm">
					<div className="flex items-center justify-center space-x-2">
						<span>LabelMaker | 版本 1.0.0</span>
						<div className="w-0.5 h-4 bg-gray-300 rounded-full"></div>
						<div className="flex items-center">
							<span className="mr-1">Crafted with</span>
							<Heart className="inline-block w-4 h-4 text-red-500 animate-pulse" />
							<span className="ml-1">by Quarix</span>
						</div>
					</div>
				</footer>
			</div>
		</div>
	);
};

export default App;
